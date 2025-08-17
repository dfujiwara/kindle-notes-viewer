interface HeaderProps {
  title?: string;
}

export function Header({ title = "Kindle Notes" }: HeaderProps) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-700 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8">
        <h1 className="text-2xl font-semibold text-blue-400 m-0">{title}</h1>
        <nav className="flex gap-6">
          <a
            href="/"
            className="text-white no-underline px-4 py-2 rounded transition-colors hover:bg-zinc-700"
          >
            Home
          </a>
          <a
            href="/books"
            className="text-white no-underline px-4 py-2 rounded transition-colors hover:bg-zinc-700"
          >
            Books
          </a>
          <a
            href="/notes"
            className="text-white no-underline px-4 py-2 rounded transition-colors hover:bg-zinc-700"
          >
            Notes
          </a>
        </nav>
      </div>
    </header>
  );
}
