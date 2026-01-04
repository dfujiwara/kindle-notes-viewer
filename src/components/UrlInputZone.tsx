import { useId } from "react";

interface UrlInputZoneProps {
  url: string;
  onUrlChange: (url: string) => void;
}

interface UrlDisplayViewProps {
  url: string;
}

// Validate URL - only allow http/https protocols
export function validateUrl(urlString: string): boolean {
  if (!urlString.trim()) {
    return false;
  }

  try {
    const parsed = new URL(urlString);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function UrlDisplayView({ url }: UrlDisplayViewProps) {
  const displayUrl = url.length > 60 ? `${url.slice(0, 57)}...` : url;

  return (
    <div className="w-full">
      <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-6 bg-gray-50">
        <div className="bg-white p-2.5 sm:p-3 rounded border border-gray-200">
          <p className="text-xs sm:text-sm font-medium text-gray-900 break-all">
            {displayUrl}
          </p>
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
        <label htmlFor={inputId} className="sr-only">
          Enter URL
        </label>
        <input
          type="url"
          id={inputId}
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Enter URL to extract and upload"
          className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

export function UrlInputZone({ url, onUrlChange }: UrlInputZoneProps) {
  const inputId = useId();
  const hasValidUrl = validateUrl(url);

  if (hasValidUrl && url.trim()) {
    return <UrlDisplayView url={url} />;
  }

  return <UrlInputView url={url} onUrlChange={onUrlChange} inputId={inputId} />;
}
