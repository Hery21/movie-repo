import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMovies } from "../useMovies";
import { getData } from "../../utils/fetch";

vi.mock("../../utils/fetch", () => ({
  getData: vi.fn(),
}));

describe("useMovies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useMovies());

    expect(result.current.movies).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.page).toBe(1);
  });

  it("does nothing when term is empty", async () => {
    const { result } = renderHook(() => useMovies());

    await act(async () => {
      await result.current.fetchMovies("");
    });

    expect(getData).not.toHaveBeenCalled();
    expect(result.current.movies).toEqual([]);
  });

  it("fetches movies and sets movies on page 1", async () => {
    getData.mockResolvedValue({
      Search: [
        { imdbID: "tt1", Title: "Movie 1" },
        { imdbID: "tt2", Title: "Movie 2" },
      ],
    });

    const { result } = renderHook(() => useMovies());

    await act(async () => {
      await result.current.fetchMovies("batman", 1);
    });

    expect(getData).toHaveBeenCalledWith("type=movie&s=batman&page=1");
    expect(result.current.movies).toEqual([
      { imdbID: "tt1", Title: "Movie 1" },
      { imdbID: "tt2", Title: "Movie 2" },
    ]);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.page).toBe(1);
  });

  it("removes duplicate movies on page 1", async () => {
    getData.mockResolvedValue({
      Search: [
        { imdbID: "tt1", Title: "A" },
        { imdbID: "tt1", Title: "A Duplicate" },
      ],
    });

    const { result } = renderHook(() => useMovies());

    await act(async () => {
      await result.current.fetchMovies("batman", 1);
    });

    expect(result.current.movies).toEqual([{ imdbID: "tt1", Title: "A" }]);
  });

  it("appends movies on later pages and filters duplicates across pages", async () => {
    getData.mockResolvedValueOnce({
      Search: [
        { imdbID: "tt1", Title: "A" },
        { imdbID: "tt2", Title: "B" },
      ],
    });

    const { result } = renderHook(() => useMovies());

    await act(async () => {
      await result.current.fetchMovies("batman", 1);
    });

    getData.mockResolvedValueOnce({
      Search: [
        { imdbID: "tt2", Title: "B Duplicate" },
        { imdbID: "tt3", Title: "C" },
      ],
    });

    await act(async () => {
      await result.current.fetchMovies("batman", 2);
    });

    expect(result.current.movies).toEqual([
      { imdbID: "tt1", Title: "A" },
      { imdbID: "tt2", Title: "B" },
      { imdbID: "tt3", Title: "C" },
    ]);

    expect(result.current.page).toBe(2);
    expect(result.current.hasMore).toBe(true);
  });

  it("sets hasMore to false when no new movies returned", async () => {
    getData.mockResolvedValue({ Search: [] });

    const { result } = renderHook(() => useMovies());

    await act(async () => {
      await result.current.fetchMovies("batman", 1);
    });

    expect(result.current.hasMore).toBe(false);
  });

  it("handles fetch errors without crashing", async () => {
    console.error = vi.fn();
    getData.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useMovies());

    await act(async () => {
      await result.current.fetchMovies("batman", 1);
    });

    expect(console.error).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.movies).toEqual([]);
  });

  it("setMovies manually updates movies", () => {
    const { result } = renderHook(() => useMovies());

    act(() => {
      result.current.setMovies([{ imdbID: "x", Title: "Test" }]);
    });

    expect(result.current.movies).toEqual([{ imdbID: "x", Title: "Test" }]);
  });
});
