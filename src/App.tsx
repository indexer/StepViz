import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout";

const LibraryPage = lazy(async () => ({
  default: (await import("./pages/LibraryPage")).LibraryPage,
}));

const AlgorithmDetailPage = lazy(async () => ({
  default: (await import("./pages/AlgorithmDetailPage")).AlgorithmDetailPage,
}));

const CodeRunnerPage = lazy(async () => ({
  default: (await import("./pages/CodeRunnerPage")).CodeRunnerPage,
}));

function RouteFallback() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-10 w-72 bg-surface-low rounded animate-pulse mb-8" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-surface-low rounded-2xl animate-pulse" />
            <div className="h-96 bg-surface-low rounded-2xl animate-pulse" />
          </div>
          <div className="h-64 bg-surface-low rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route
            path="/"
            element={(
              <Suspense fallback={<RouteFallback />}>
                <LibraryPage />
              </Suspense>
            )}
          />
          <Route
            path="/library"
            element={(
              <Suspense fallback={<RouteFallback />}>
                <LibraryPage />
              </Suspense>
            )}
          />
          <Route
            path="/algorithm/:id"
            element={(
              <Suspense fallback={<RouteFallback />}>
                <AlgorithmDetailPage />
              </Suspense>
            )}
          />
          <Route
            path="/playground"
            element={(
              <Suspense fallback={<RouteFallback />}>
                <CodeRunnerPage />
              </Suspense>
            )}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
