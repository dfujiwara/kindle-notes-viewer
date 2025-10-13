import { NavLink } from "react-router";
import type { KindleNoteBundle } from "src/models";

export type SearchResultsProps =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; errorMessage: string }
  | { status: "success"; notes: KindleNoteBundle[] };

export function SearchResults(props: SearchResultsProps) {
  if (props.status === "idle") {
    return (
      <div className="text-center text-zinc-400 py-12">
        Enter a search query and press Enter to find notes
      </div>
    );
  }

  if (props.status === "error") {
    return (
      <div className="text-center text-red-400 py-12">
        Error: {props.errorMessage}
      </div>
    );
  }

  if (props.status === "loading") {
    return <div className="text-center text-zinc-400 py-12">Searching...</div>;
  }

  // props.status === "success"
  if (props.notes.length === 0) {
    return (
      <div className="text-center text-zinc-400 py-12">No notes found</div>
    );
  }

  return (
    <div className="space-y-6">
      {props.notes.map((bundle) => (
        <div key={bundle.book.id} className="space-y-3">
          <div className="border-b border-zinc-700 pb-2">
            <h3 className="text-xl font-semibold text-white">
              {bundle.book.title}
            </h3>
            <p className="text-sm text-zinc-400">{bundle.book.author}</p>
          </div>
          <div className="space-y-2 pl-4">
            {bundle.notes.map((note) => (
              <NavLink
                key={note.id}
                to={`/books/${bundle.book.id}/notes/${note.id}`}
                className="block p-3 rounded-lg border border-zinc-700 bg-zinc-800 hover:border-zinc-600 transition-colors"
              >
                <p className="text-zinc-200">{note.content}</p>
                <p className="text-xs text-zinc-500 mt-2">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
