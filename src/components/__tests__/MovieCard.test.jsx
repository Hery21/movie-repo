import { render, screen, fireEvent } from "@testing-library/react";
import MovieCard from "../MovieCard";
import EmptyPoster from "../../assets/EmptyMovie.png";
import { describe, it, expect, vi } from "vitest";

vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Tooltip: ({ children }) => <div>{children}</div>,
  };
});

const omdbMovie = {
  Title: "The Matrix",
  Year: "1999",
  Poster: "https://m.media-amazon.com/images/M/MV5BM.jpg",
  imdbID: "tt0133093",
  Type: "movie",
};

describe("MovieCard Component (OMDb)", () => {
  it("renders movie title", () => {
    render(<MovieCard movie={omdbMovie} />);
    expect(screen.getByText("The Matrix")).toBeInTheDocument();
  });

  it("renders movie year", () => {
    render(<MovieCard movie={omdbMovie} />);
    expect(screen.getByText("1999")).toBeInTheDocument();
  });

  it("renders the poster from OMDb API", () => {
    render(<MovieCard movie={omdbMovie} />);
    const img = screen.getByRole("img");

    expect(img).toHaveAttribute("src", omdbMovie.Poster);
  });

  it("falls back to EmptyPoster when Poster === 'N/A'", () => {
    const movieNoPoster = { ...omdbMovie, Poster: "N/A" };
    render(<MovieCard movie={movieNoPoster} />);

    expect(screen.getByRole("img")).toHaveAttribute("src", EmptyPoster);
  });

  it("falls back to EmptyPoster when image triggers onError", () => {
    render(<MovieCard movie={omdbMovie} />);
    const img = screen.getByRole("img");

    fireEvent.error(img);
    expect(img.src).toContain(EmptyPoster);
  });

  it("fires onClick handler", () => {
    const onClick = vi.fn();

    render(<MovieCard movie={omdbMovie} onClick={onClick} />);

    const wrapper = screen.getByRole("img").closest("div");
    fireEvent.click(wrapper);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("assigns the refProp correctly", () => {
    const ref = { current: null };
    render(<MovieCard movie={omdbMovie} refProp={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current.tagName).toBe("DIV");
  });

  it("matches snapshot", () => {
    const { container } = render(<MovieCard movie={omdbMovie} />);
    expect(container).toMatchSnapshot();
  });
});
