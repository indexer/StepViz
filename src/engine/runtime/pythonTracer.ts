/**
 * Python source for the tracer that runs inside Pyodide (real CPython). It
 * executes the user's program under `sys.settrace`, capturing the local
 * variable state at every line event, plus the active call stack. The result
 * is returned as a JSON string that {@link ../runtime/pythonRuntime} converts
 * into the same `ExecSnapshot[]` shape the visualization already consumes.
 *
 * Because this is genuine CPython, every Python feature works — comprehensions,
 * slicing, `for x in collection`, generators, classes, f-strings, etc. — which
 * the legacy line-by-line interpreter could never support.
 */
export const PY_TRACER_SOURCE = `
import sys, json

_STEPVIZ_MAX_STEPS = 2000

def _stepviz_ser(v, depth=0):
    """JSON-safe display representation (bounded depth, never raises)."""
    try:
        if depth > 6:
            return repr(v)
        # float inf/nan are valid Python json but NOT valid JSON for JS's
        # JSON.parse — represent them as strings so traces stay parseable.
        if isinstance(v, float):
            if v != v:
                return "NaN"
            if v == float("inf"):
                return "Infinity"
            if v == float("-inf"):
                return "-Infinity"
            return v
        if v is None or isinstance(v, bool) or isinstance(v, (int, str)):
            return v
        if isinstance(v, (list, tuple)):
            return [_stepviz_ser(x, depth + 1) for x in v]
        if isinstance(v, set):
            return [_stepviz_ser(x, depth + 1) for x in v]
        if isinstance(v, dict):
            return {str(k): _stepviz_ser(val, depth + 1) for k, val in v.items()}
        return repr(v)
    except Exception:
        return "<unrepr>"

def _stepviz_classify(loc):
    """Split a namespace into vars / arrays / maps / sets for the UI panels."""
    vars_, arrays, maps, sets = {}, {}, {}, {}
    for k, v in list(loc.items()):
        if k.startswith("__"):
            continue
        if isinstance(v, bool) or isinstance(v, (int, float, str)) or v is None:
            vars_[k] = _stepviz_ser(v)
        elif isinstance(v, (list, tuple)):
            arrays[k] = _stepviz_ser(v)
        elif isinstance(v, dict):
            maps[k] = [[_stepviz_ser(kk), _stepviz_ser(vv)] for kk, vv in v.items()]
        elif isinstance(v, set):
            sets[k] = [_stepviz_ser(x) for x in v]
        # callables / modules / class instances are skipped from the panels
    return vars_, arrays, maps, sets

def _stepviz_callstack(frame):
    """User-defined function frames, outermost first. Excludes the module-level
    frame and the tracer's own wrapper (only <user> functions count)."""
    chain = []
    f = frame
    while f is not None:
        if f.f_code.co_filename == "<user>" and f.f_code.co_name != "<module>":
            chain.append(f)
        f = f.f_back
    chain.reverse()
    out = []
    for cf in chain:
        code = cf.f_code
        names = list(code.co_varnames[: code.co_argcount])
        args = [_stepviz_ser(cf.f_locals.get(n)) for n in names]
        out.append({"name": code.co_name, "paramNames": names, "args": args})
    return out

def __stepviz_run_traced(src):
    steps = []
    state = {"overflow": False}

    def tracer(frame, event, arg):
        # Only trace user code (the <user> filename), not library internals.
        if frame.f_code.co_filename != "<user>":
            return tracer
        if event == "line":
            if len(steps) >= _STEPVIZ_MAX_STEPS:
                state["overflow"] = True
                sys.settrace(None)
                return None
            v, a, m, s = _stepviz_classify(frame.f_locals)
            steps.append({
                "line": frame.f_lineno - 1,
                "vars": v, "arrays": a, "maps": m, "sets": s,
                "callStack": _stepviz_callstack(frame),
            })
        return tracer

    g = {}
    err = None
    code_obj = None
    try:
        code_obj = compile(src, "<user>", "exec")
    except SyntaxError as e:
        err = {"type": "SyntaxError", "msg": str(e.msg), "line": e.lineno}
    if code_obj is not None:
        sys.settrace(tracer)
        try:
            exec(code_obj, g, g)
        except Exception as e:
            tb = sys.exc_info()[2]
            ln = None
            while tb is not None:
                if tb.tb_frame.f_code.co_filename == "<user>":
                    ln = tb.tb_lineno
                tb = tb.tb_next
            err = {"type": type(e).__name__, "msg": str(e), "line": ln}
        finally:
            sys.settrace(None)

    fv, fa, fm, fs = _stepviz_classify(g)
    final = {"line": -1, "vars": fv, "arrays": fa, "maps": fm, "sets": fs, "callStack": []}
    return json.dumps({
        "steps": steps,
        "final": final,
        "error": err,
        "overflow": state["overflow"],
    })
`;
