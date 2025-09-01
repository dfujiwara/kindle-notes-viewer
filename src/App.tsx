import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router";
import { Footer, Header } from "src/components";
import { ErrorFallback } from "src/components/ErrorFallback";
import { LoadingIndicator } from "src/components/LoadingIndicator.tsx";
import { BookPage, HomePage } from "src/pages";
import "./App.css";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingIndicator />}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books/:bookId" element={<BookPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
