import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router";
import { Footer, Header } from "src/components";
import { ErrorFallback } from "src/components/ErrorFallback";
import { HomePage } from "src/pages/HomePage";
import "./App.css";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<h1>books</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
