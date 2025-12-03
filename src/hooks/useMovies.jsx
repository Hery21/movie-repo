import { useState, useCallback } from "react";
import { getData } from "../utils/fetch";

export function useMovies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMovies = useCallback(async (term, pageNum = 1) => {
    if (!term) return;

    setLoading(true);

    try {
      const resMovies = await getData(`type=movie&s=${term}&page=${pageNum}`);

      const unique = [];
      const seen = new Set();

      for (const m of resMovies.Search || []) {
        if (!seen.has(m.imdbID)) {
          seen.add(m.imdbID);
          unique.push(m);
        }
      }

      setMovies((prev) =>
        pageNum === 1
          ? unique
          : [
              ...prev,
              ...unique.filter((m) => !prev.some((p) => p.imdbID === m.imdbID)),
            ]
      );

      setHasMore(unique.length > 0);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }, []);

  return { movies, loading, hasMore, page, fetchMovies, setMovies };
}
