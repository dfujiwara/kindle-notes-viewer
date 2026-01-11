/**
 * Returns className for card-style interactive buttons
 * Used for book items, URL items, note items, etc.
 *
 * @param padding - Optional custom padding classes (default: "p-4 md:p-6")
 */
export function getCardButtonClassName(padding = "p-4 md:p-6"): string {
  return `bg-zinc-800 border border-zinc-700 rounded-lg ${padding} hover:bg-zinc-700 hover:border-zinc-600 transition-colors cursor-pointer text-left w-full active:bg-zinc-600`;
}
