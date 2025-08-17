import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ErrorFallback } from "./ErrorFallback";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col justify-center items-center p-8">
          <div className="p-8">
            <button
              type="button"
              onClick={() => setCount((count) => count + 1)}
            >
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
            <p>The mode is {import.meta.env.MODE}</p>
            <p>The API URL is {import.meta.env.VITE_API_URL}</p>
          </div>
          <p className="text-zinc-500">
            Click on the Vite and React logos to learn more
          </p>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
