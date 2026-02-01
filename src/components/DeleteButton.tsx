interface DeleteButtonProps {
  confirmMessage: string;
  onDelete: () => void;
  isDeleting: boolean;
  ariaLabel: string;
}

export function DeleteButton({
  confirmMessage,
  onDelete,
  isDeleting,
  ariaLabel,
}: DeleteButtonProps) {
  const handleClick = () => {
    if (window.confirm(confirmMessage)) {
      onDelete();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDeleting}
      className="shrink-0 px-3 py-1.5 text-sm rounded-md bg-red-900/50 text-red-300 hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={ariaLabel}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
