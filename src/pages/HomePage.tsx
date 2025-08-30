import { NavLink } from "react-router";

export function HomePage() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Kindle Notes
        </h1>
        <p className="text-xl text-zinc-300 mb-8">
          Organize and manage your Kindle highlights and notes in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-zinc-800 rounded-lg p-8 border border-zinc-700">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">
            Browse Books
          </h2>
          <p className="text-zinc-300 mb-6">
            Explore your Kindle library and discover books with highlights and
            notes
          </p>
          <NavLink
            to="/books"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            View Books
          </NavLink>
        </div>

        <div className="bg-zinc-800 rounded-lg p-8 border border-zinc-700">
          <h2 className="text-2xl font-semibold text-green-400 mb-4">
            Search Notes
          </h2>
          <p className="text-zinc-300 mb-6">
            Find specific highlights and notes across your entire library
          </p>
          <button
            type="button"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Search Notes
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-700">
        <h3 className="text-xl font-semibold text-white mb-4">Get Started</h3>
        <p className="text-zinc-300">
          Connect your Kindle account to start importing your highlights and
          notes, or browse the sample content to see what Kindle Notes can do.
        </p>
      </div>
    </div>
  );
}
