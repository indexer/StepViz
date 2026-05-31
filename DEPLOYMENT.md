# Deployment notes

The app is a static Vite build (`npm run build` → `dist/`). One thing needs
attention in production: the **playground runtimes**.

## Playground execution backends

The playground (`/playground`) runs user code on real engines and visualises it
step-by-step:

| Language | Engine | Loaded from |
|----------|--------|-------------|
| Python | Pyodide (real CPython, WASM) | `cdn.jsdelivr.net/pyodide/...` on first Python run |
| TypeScript / JS | the browser's own JS engine, code Babel-instrumented for tracing | `@babel/standalone` from `cdn.jsdelivr.net` on first TS run |
| Kotlin | built-in line interpreter (bundled, no download) | — |

These are loaded **lazily from a CDN on first use** and are **not bundled**
(the app bundle stays small). The rest of the app works with no network.

## 1. Content-Security-Policy (required if you set a CSP)

If you serve the app with a CSP (many hosts add a strict one by default), it
**must allow** the runtimes or the playground will silently fail. Recommended
policy (set as a response header on the HTML document):

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' https://cdn.jsdelivr.net;
  connect-src 'self' https://cdn.jsdelivr.net;
  style-src  'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src   'self' https://fonts.gstatic.com;
  img-src    'self' data:;
  worker-src 'self' blob:;
```

Why each runtime-related directive is needed:
- `script-src … https://cdn.jsdelivr.net` — loads `pyodide.js` and
  `babel.min.js`.
- `'wasm-unsafe-eval'` — Pyodide compiles WebAssembly.
- `'unsafe-eval'` — the TypeScript runtime executes instrumented code via
  `new Function`. (If you cannot allow `unsafe-eval`, move the JS runtime into a
  Worker and use a Worker-scoped CSP, or disable the TS playground.)
- `connect-src … https://cdn.jsdelivr.net` — Pyodide `fetch`es its stdlib /
  package files.

> Don't put this in `index.html` as a `<meta>` tag — it breaks the Vite dev
> server (HMR needs inline scripts). Set it as a header on the production host.

## 2. Self-hosting the runtimes (optional, more robust)

Loading from jsdelivr is simplest but adds an external dependency (uptime,
corporate proxies/firewalls, air-gapped installs). To self-host:

1. Vendor the assets into `public/`:
   - Pyodide `v0.29.4` full distribution → `public/pyodide/`
   - `@babel/standalone@7.29.2/babel.min.js` → `public/vendor/babel.min.js`
2. Point the loaders at the local paths:
   - `PYODIDE_CDN` in `src/engine/runtime/pythonRuntime.ts`
   - `BABEL_CDN` in `src/engine/runtime/jsRuntime.ts`
3. Drop `cdn.jsdelivr.net` from the CSP and add [SRI] if you keep any CDN.

Trade-off: ~10 MB of hosted assets and manual version bumps, in exchange for no
third-party dependency at runtime.

## 3. First-load UX

The first Python run downloads ~6 MB of WASM (subsequent runs are instant — the
runtime is cached for the session). The UI shows "Loading runtime…", and
`index.html` `preconnect`s to the CDN to shorten it. Ensure your host sends
long-lived cache headers for the vendored/CDN assets.

## 4. Runtime safety

- **Runaway loops** are bounded: the visual trace caps at 5 000 steps and a
  loop tick-guard caps total iterations, so even `while (true) {}` returns
  quickly with an "infinite loop" notice instead of freezing the tab.
- **Python** runs inside Pyodide's WASM sandbox. **TypeScript** runs via
  `new Function` in the page context; for stricter isolation, run it in a Web
  Worker (a worthwhile future hardening — see #1 above re: CSP).

## 5. Library step values (maintainers)

The algorithm-detail walkthroughs show execution-grounded variable values from
`src/data/generatedStepValues.ts`. **If you edit a TS/Python code example,
regenerate it:**

```
npm run gen:step-values
```

`src/test/libraryExecution.test.ts` (run in CI) fails if any library snippet
stops executing, but it does not detect stale generated values — so regenerate
after snippet edits and commit the result.
