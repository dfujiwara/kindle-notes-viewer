import { useState } from "react";
import { searchService, useApiQuery } from "src/api";
import type { SearchResultsProps } from "./SearchResults";
import { SearchResults } from "./SearchResults";

const MINIMUM_SEARCH_QUERY_LENGTH = 3;

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const result = useApiQuery(
    ["search", searchQuery],
    () => searchService.search(searchQuery),
    { enabled: searchQuery.length >= MINIMUM_SEARCH_QUERY_LENGTH },
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }
    if (query.trim().length < MINIMUM_SEARCH_QUERY_LENGTH) {
      return;
    }
    setSearchQuery(query);
  };

  const getSearchState = (): SearchResultsProps => {
    if (searchQuery.length === 0) {
      return { status: "idle" };
    }
    if (result.isLoading) {
      return { status: "loading" };
    }
    if (result.error) {
      return { status: "error", errorMessage: result.error.message };
    }
    return { status: "success", notes: result.data?.results ?? [] };
  };

  const isTooShort =
    query.trim().length > 0 &&
    query.trim().length < MINIMUM_SEARCH_QUERY_LENGTH;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Notes</h1>
      <div className="mb-8">
        <input
          type="text"
          role="searchbox"
          aria-label="Search for notes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for notes..."
          className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isTooShort && (
          <p className="text-sm text-zinc-400 mt-2">
            Please enter at least {MINIMUM_SEARCH_QUERY_LENGTH} characters
          </p>
        )}
      </div>
      <SearchResults {...getSearchState()} />
    </div>
  );
}
