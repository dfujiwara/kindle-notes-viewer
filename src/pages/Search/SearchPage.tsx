import { useState } from "react";
import { searchService, useApiQuery } from "src/api";
import { PageContainer, PageTitle } from "src/components";
import type { SearchResultsProps } from "./SearchResults";
import { SearchResults } from "./SearchResults";

const MINIMUM_SEARCH_QUERY_LENGTH = 3;

export function SearchPage() {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();

  const result = useApiQuery(
    ["search", trimmedQuery],
    () => searchService.search(trimmedQuery),
    { enabled: trimmedQuery.length >= MINIMUM_SEARCH_QUERY_LENGTH },
  );

  const getSearchState = (): SearchResultsProps => {
    if (trimmedQuery.length < MINIMUM_SEARCH_QUERY_LENGTH) {
      return { status: "idle" };
    }
    if (result.isLoading) {
      return { status: "loading" };
    }
    if (result.error) {
      return { status: "error", errorMessage: result.error.message };
    }
    return {
      status: "success",
      books: result.data?.books ?? [],
      urls: result.data?.urls ?? [],
      tweetThreads: result.data?.tweetThreads ?? [],
    };
  };

  const isTooShort =
    query.trim().length > 0 &&
    query.trim().length < MINIMUM_SEARCH_QUERY_LENGTH;

  return (
    <PageContainer>
      <PageTitle>Search</PageTitle>
      <div className="mb-8">
        <input
          type="text"
          role="searchbox"
          aria-label="Search notes and URLs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isTooShort && (
          <p className="text-sm text-zinc-400 mt-2">
            Please enter at least {MINIMUM_SEARCH_QUERY_LENGTH} characters
          </p>
        )}
      </div>
      <SearchResults {...getSearchState()} />
    </PageContainer>
  );
}
