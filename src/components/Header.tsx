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
        <nav className="flex gap-6">
          <NavLink
            to="/random"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-zinc-300 hover:text-blue-400 hover:bg-zinc-800"
              }`
            }
          >
            Random Note
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-zinc-300 hover:text-blue-400 hover:bg-zinc-800"
              }`
            }
          >
            Upload
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
