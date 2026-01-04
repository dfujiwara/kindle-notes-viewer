import { useId, useState } from "react";

interface UrlInputZoneProps {
  url: string;
  onUrlChange: (url: string) => void;
  error?: string | null;
}

interface UrlDisplayViewProps {
  url: string;
}

function UrlDisplayView({ url }: UrlDisplayViewProps) {
  const displayUrl = url.length > 60 ? `${url.slice(0, 57)}...` : url;

  return (
    <div className="w-full">
      <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-6 bg-gray-50">
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-xs sm:text-sm font-medium text-gray-700">URL:</h3>
          <div className="flex items-start sm:items-center gap-2 bg-white p-2.5 sm:p-3 rounded border border-gray-200">
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-xs sm:text-sm font-medium text-gray-900 break-all">
                {displayUrl}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UrlInputViewProps {
  url: string;
  onUrlChange: (url: string) => void;
  inputId: string;
}

function UrlInputView({ url, onUrlChange, inputId }: UrlInputViewProps) {
  return (
    <div className="w-full">
      <div className="border-2 border-gray-300 rounded-lg p-6 sm:p-8 bg-gray-50">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="URL link"
          >
            <title>URL link</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <div className="w-full">
            <label htmlFor={inputId} className="sr-only">
              Enter URL
            </label>
            <input
              type="url"
              id={inputId}
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            Enter a URL to extract and upload content
          </p>
        </div>
      </div>
    </div>
  );
}

export function UrlInputZone({ url, onUrlChange, error }: UrlInputZoneProps) {
  const inputId = useId();

  // Validate URL
  const validateUrl = (urlString: string): boolean => {
    if (!urlString.trim()) {
      return false;
    }

    try {
      const parsed = new URL(urlString);
      // Only allow http/https protocols
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const hasValidUrl = validateUrl(url);

  if (hasValidUrl && url.trim()) {
    return <UrlDisplayView url={url} />;
  }

  return (
    <>
      <UrlInputView url={url} onUrlChange={onUrlChange} inputId={inputId} />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </>
  );
}
