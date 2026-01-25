interface ClickableUrlProps {
  url: string;
  className?: string;
}

function ExternalLinkIcon() {
  return (
    <svg
      className="inline-block w-3 h-3 ml-1 flex-shrink-0"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        d="M3.5 3H9V8.5M9 3L3 9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClickableUrl({ url, className = "" }: ClickableUrlProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      title={url}
      className={`hover:text-blue-400 hover:underline transition-colors ${className}`}
    >
      <span className="truncate">{url}</span>
      <ExternalLinkIcon />
    </a>
  );
}
