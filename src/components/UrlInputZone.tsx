import { useId } from "react";
import { validateUrl } from "src/utils/validation";

interface UrlInputZoneProps {
  url: string;
  onUrlChange: (url: string) => void;
}

export function UrlInputZone({ url, onUrlChange }: UrlInputZoneProps) {
  const inputId = useId();
  const isValid = validateUrl(url);

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
          className={`w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-white border-2 rounded-md focus:outline-none focus:ring-2 placeholder:text-gray-400 transition-colors ${
            isValid
              ? "border-green-500 focus:ring-green-500 focus:border-green-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
      </div>
    </div>
  );
}
