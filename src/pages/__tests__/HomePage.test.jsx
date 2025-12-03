import { render, screen, fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { vi, describe, it, expect, beforeEach } from "vitest";
import HomePage from "../HomePage";

import searchSlice from "../../redux/slice";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useMovies } from "../../hooks/useMovies";

vi.mock("../../hooks/useMovies", () => ({
  useMovies: vi.fn(),
}));

vi.mock("../../hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: vi.fn(() => null),
}));

vi.mock("../../components/MovieCard", () => ({
  default: ({ movie, onClick, refProp }) => (
    <div
      data-testid={`movie-card-${movie.imdbID}`}
      onClick={onClick}
      ref={refProp}
    >
      {movie.Title}
    </div>
  ),
}));

vi.mock("../../components/PosterDialog", () => ({
  default: ({ open, movie, onClose }) =>
    open ? (
      <div data-testid="poster-dialog" onClick={onClose}>
        Poster: {movie.Title}
      </div>
    ) : null,
}));

describe("HomePage", () => {
  let store;
  let mockFetchMovies;
  let mockSetMovies;

  beforeEach(() => {
    mockFetchMovies = vi.fn();
    mockSetMovies = vi.fn();

    vi.mocked(useMovies).mockReturnValue({
      movies: [],
      loading: false,
      hasMore: false,
      page: 1,
      fetchMovies: mockFetchMovies,
      setMovies: mockSetMovies,
    });

    store = configureStore({
      reducer: { search: searchSlice },
    });
  });

  const renderHomePage = (preloadedState = {}) => {
    const finalStore = preloadedState.search
      ? configureStore({ reducer: { search: searchSlice }, preloadedState })
      : store;

    return render(
      <Provider store={finalStore}>
        <HomePage />
      </Provider>
    );
  };

  it("renders without crashing", () => {
    renderHomePage();
    expect(
      screen.getByPlaceholderText(/what movie are you looking for/i)
    ).toBeInTheDocument();
  });

  it("initializes search term from Redux store", () => {
    renderHomePage({ search: { term: "batman" } });
    expect(screen.getByDisplayValue("batman")).toBeInTheDocument();
  });

  it("updates search term on input change", () => {
    renderHomePage();
    const input = screen.getByPlaceholderText(
      /what movie are you looking for/i
    );
    fireEvent.change(input, { target: { value: "inception" } });
    expect(input.value).toBe("inception");
  });

  it("triggers search on Enter key press", () => {
    renderHomePage();
    const input = screen.getByPlaceholderText(
      /what movie are you looking for/i
    );
    fireEvent.change(input, { target: { value: "avatar" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(store.getState().search.term).toBe("avatar");
    expect(mockSetMovies).toHaveBeenCalledWith([]);
    expect(mockFetchMovies).toHaveBeenCalledWith("avatar", 1);
  });

  it("triggers search on search button click", () => {
    renderHomePage();

    const input = screen.getByPlaceholderText(
      /what movie are you looking for/i
    );
    fireEvent.change(input, { target: { value: "titanic" } });

    fireEvent.click(screen.getByRole("button"));

    expect(store.getState().search.term).toBe("titanic");
    expect(mockSetMovies).toHaveBeenCalledWith([]);
    expect(mockFetchMovies).toHaveBeenCalledWith("titanic", 1);
  });

  it("renders MovieCards for each movie", () => {
    vi.mocked(useMovies).mockReturnValue({
      movies: [
        { imdbID: "tt1", Title: "Iron Man" },
        { imdbID: "tt2", Title: "Thor" },
      ],
      loading: false,
      hasMore: false,
      page: 1,
      fetchMovies: mockFetchMovies,
      setMovies: mockSetMovies,
    });

    renderHomePage();
    expect(screen.getByTestId("movie-card-tt1")).toBeInTheDocument();
    expect(screen.getByTestId("movie-card-tt2")).toBeInTheDocument();
  });

  it("shows loading indicator when loading is true", () => {
    vi.mocked(useMovies).mockReturnValue({
      movies: [],
      loading: true,
      hasMore: false,
      page: 1,
      fetchMovies: vi.fn(),
      setMovies: vi.fn(),
    });
    renderHomePage();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("does not show loading indicator when loading is false", () => {
    renderHomePage();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("opens PosterDialog on movie card click", () => {
    vi.mocked(useMovies).mockReturnValue({
      movies: [{ imdbID: "tt1", Title: "Avengers" }],
      loading: false,
      hasMore: false,
      page: 1,
      fetchMovies: vi.fn(),
      setMovies: vi.fn(),
    });

    renderHomePage();
    fireEvent.click(screen.getByTestId("movie-card-tt1"));
    expect(screen.getByTestId("poster-dialog")).toBeInTheDocument();
    expect(screen.getByText("Poster: Avengers")).toBeInTheDocument();
  });

  it("closes PosterDialog when onClose is called", () => {
    vi.mocked(useMovies).mockReturnValue({
      movies: [{ imdbID: "tt1", Title: "Avengers" }],
      loading: false,
      hasMore: false,
      page: 1,
      fetchMovies: vi.fn(),
      setMovies: vi.fn(),
    });

    renderHomePage();
    fireEvent.click(screen.getByTestId("movie-card-tt1"));
    expect(screen.getByTestId("poster-dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("poster-dialog"));
    expect(screen.queryByTestId("poster-dialog")).not.toBeInTheDocument();
  });

  it("fetches movies on mount if savedTerm exists", () => {
    renderHomePage({ search: { term: "spiderman" } });
    expect(mockFetchMovies).toHaveBeenCalledWith("spiderman");
  });

  it("does not fetch on mount if no savedTerm", () => {
    renderHomePage();
    expect(mockFetchMovies).not.toHaveBeenCalled();
  });

  it("attaches ref to last MovieCard for infinite scroll", () => {
    const mockRef = vi.fn();
    vi.mocked(useInfiniteScroll).mockReturnValue(mockRef);

    vi.mocked(useMovies).mockReturnValue({
      movies: Array(5)
        .fill(null)
        .map((_, i) => ({ imdbID: `tt${i}`, Title: `Movie ${i}` })),
      loading: false,
      hasMore: true,
      page: 1,
      fetchMovies: mockFetchMovies,
      setMovies: vi.fn(),
    });

    renderHomePage({ search: { term: "test" } });

    expect(mockRef).toHaveBeenCalled();
  });

  it("handles empty movies list without errors", () => {
    renderHomePage();
    expect(screen.queryAllByTestId(/movie-card-/)).toHaveLength(0);
  });

  it("does not attach ref if no movies", () => {
    vi.mocked(useInfiniteScroll).mockReturnValue(vi.fn());
    renderHomePage();
    expect(screen.queryAllByTestId(/movie-card-/)).toHaveLength(0);
  });

  it("updates on savedTerm change", () => {
    const { rerender } = renderHomePage();

    rerender(
      <Provider
        store={configureStore({
          reducer: { search: searchSlice },
          preloadedState: { search: { term: "matrix" } },
        })}
      >
        <HomePage />
      </Provider>
    );

    expect(mockFetchMovies).toHaveBeenCalledWith("matrix");
  });
});
