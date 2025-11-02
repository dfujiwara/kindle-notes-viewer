interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({
  message = "Loading...",
}: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="relative w-20 h-20 mb-6">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-gray-700 text-lg font-medium animate-pulse">
        {message}
      </p>
    </div>
  );
}
