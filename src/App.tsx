import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router";
import { Footer, Header } from "src/components";
import { ErrorFallback } from "src/components/ErrorFallback";
import { LoadingIndicator } from "src/components/LoadingIndicator.tsx";
import {
  BookPage,
  HomePage,
  NotePage,
  RandomNotePage,
  SearchPage,
  UploadPage,
} from "src/pages";
import "./App.css";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Suspense fallback={<LoadingIndicator />}>
          <main className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books/:bookId" element={<BookPage />} />
              <Route
                path="/books/:bookId/notes/:noteId"
                element={<NotePage />}
              />
              <Route path="/random" element={<RandomNotePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/upload" element={<UploadPage />} />
            </Routes>
          </main>
        </Suspense>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
