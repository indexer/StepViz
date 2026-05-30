import '@testing-library/jest-dom/vitest';

// Guard for `node`-environment test files (e.g. the Pyodide runtime tests),
// which run without a DOM.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
