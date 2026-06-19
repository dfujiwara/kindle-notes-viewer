import { NavLink } from "react-router";

import { PAGE_WIDTH } from "./layout";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Kindle Notes" }: HeaderProps) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-700 py-3 md:py-4">
      <div
        className={`${PAGE_WIDTH} flex flex-wrap justify-between items-center gap-4`}
      >
        <NavLink to="/">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-400 m-0">
            {title}
          </h1>
        </NavLink>
        <nav className="flex flex-wrap gap-2 sm:gap-4 md:gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-2 sm:px-3 md:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-zinc-300 hover:text-blue-400 hover:bg-zinc-800"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `px-2 sm:px-3 md:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-zinc-300 hover:text-blue-400 hover:bg-zinc-800"
              }`
            }
          >
            Search
          </NavLink>
          <NavLink
            to="/random"
            className={({ isActive }) =>
              `px-2 sm:px-3 md:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-zinc-300 hover:text-blue-400 hover:bg-zinc-800"
              }`
            }
          >
            Random
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `px-2 sm:px-3 md:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
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
