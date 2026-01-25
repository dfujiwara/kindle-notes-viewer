interface ClickableUrlProps {
  url: string;
  className?: string;
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
      className={`hover:text-blue-400 hover:underline transition-colors truncate ${className}`}
    >
      {url}
    </a>
  );
}
