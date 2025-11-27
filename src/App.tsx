import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import { Footer, Header } from "src/components";
import { ErrorFallback } from "src/components/ErrorFallback";
import { LoadingIndicator } from "src/components/LoadingIndicator.tsx";
import {
  BookPage,
  HomePage,
  NotePage,
  SearchPage,
  StreamedRandomNotePage,
  UploadPage,
} from "src/pages";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <main className="flex-1 p-4 md:p-8">
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<LoadingIndicator />}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="/books/:bookId"
              element={
                <Suspense fallback={<LoadingIndicator />}>
                  <BookPage />
                </Suspense>
              }
            />
            <Route
              path="/books/:bookId/notes/:noteId"
              element={
                <Suspense fallback={<LoadingIndicator />}>
                  <NotePage />
                </Suspense>
              }
            />
            <Route path="/random" element={<StreamedRandomNotePage />} />
            <Route
              path="/search"
              element={
                <Suspense fallback={<LoadingIndicator />}>
                  <SearchPage />
                </Suspense>
              }
            />
            <Route
              path="/upload"
              element={
                <Suspense fallback={<LoadingIndicator />}>
                  <UploadPage />
                </Suspense>
              }
            />
          </Routes>
        </main>
      </ErrorBoundary>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
