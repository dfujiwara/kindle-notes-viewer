interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = "Loading..." }: LoadingIndicatorProps) {
  return (
    <div className="loading-indicator">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}