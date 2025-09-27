import { NavLink } from "react-router";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Kindle Notes" }: HeaderProps) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-700 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8">
        <NavLink to="/">
          <h1 className="text-2xl font-semibold text-blue-400 m-0">{title}</h1>
        </NavLink>
        <NavLink
          to="/random"
          className="text-lg font-medium text-zinc-300 hover:text-blue-400 transition-colors"
        >
          Random Note
        </NavLink>
      </div>
    </header>
  );
}
