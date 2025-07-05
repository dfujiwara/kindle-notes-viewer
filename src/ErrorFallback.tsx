interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div role="alert" style={{ padding: "20px", textAlign: "center" }}>
      <h2>Something went wrong:</h2>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  );
}
