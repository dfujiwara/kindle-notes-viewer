import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./ErrorFallback";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div>
        <h1 className="text-red-200">Kindle Notes Frontend</h1>
        <div className="card">
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
          <p>The mode is {import.meta.env.MODE}</p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </ErrorBoundary>
  );
}

export default App;
