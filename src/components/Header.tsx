import { NavLink } from "react-router";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Kindle Notes" }: HeaderProps) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-700 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8">
        <h1 className="text-2xl font-semibold text-blue-400 m-0">{title}</h1>
        <nav className="flex gap-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/books">Books</NavLink>
        </nav>
      </div>
    </header>
  );
}
