interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          Something went wrong
        </h2>
        <pre className="text-sm text-red-600 bg-white p-4 rounded border border-red-100 mb-6 overflow-x-auto">
          {error.message}
        </pre>
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
