// src/pages/__tests__/MovieDetailPage.test.jsx
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import MovieDetailPage from "../MovieDetailPage";
import { getData } from "../../utils/fetch";

// CORRECT WAY TO MOCK IMAGES IN VITEST
vi.mock("../../assets/EmptyMovie.png", () => ({
  default: "test-empty-poster.png", // <-- must have "default"
}));

vi.mock("../../utils/fetch", () => ({
  getData: vi.fn(),
}));

const mockMovie = {
  Title: "Inception",
  Year: "2010",
  Runtime: "148 min",
  Genre: "Action, Sci-Fi, Thriller",
  Plot: "A thief who steals corporate secrets through dream-sharing technology...",
  Director: "Christopher Nolan",
  Writer: "Christopher Nolan",
  Actors: "Leonardo DiCaprio, Marion Cotillard",
  Language: "English, Japanese",
  Country: "USA, UK",
  Awards: "Won 4 Oscars",
  BoxOffice: "$836,848,363",
  imdbRating: "8.8",
  imdbVotes: "2,400,000",
  Poster: "https://example.com/poster.jpg",
  Ratings: [
    { Source: "Internet Movie Database", Value: "8.8/10" },
    { Source: "Rotten Tomatoes", Value: "87%" },
    { Source: "Metacritic", Value: "74/100" },
  ],
};

const renderMovieDetail = (imdbID = "tt1375666") => {
  return render(
    <MemoryRouter initialEntries={[`/movie/${imdbID}`]}>
      <Routes>
        <Route path="/movie/:imdbID" element={<MovieDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("MovieDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    vi.mocked(getData).mockImplementation(() => new Promise(() => {}));
    renderMovieDetail();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches and displays movie details successfully", async () => {
    vi.mocked(getData).mockResolvedValue(mockMovie);
    renderMovieDetail();

    await waitFor(() => {
      expect(screen.getByText("Inception (2010)")).toBeInTheDocument();
    });

    expect(
      screen.getByText("148 min • Action, Sci-Fi, Thriller")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A thief who steals corporate secrets/)
    ).toBeInTheDocument();
    expect(
      screen.getByText("Internet Movie Database: 8.8/10")
    ).toBeInTheDocument();
    expect(screen.getByText("Rotten Tomatoes: 87%")).toBeInTheDocument();
    expect(screen.getByText("8.8 ⭐")).toBeInTheDocument();
  });

  it('uses empty poster when Poster is "N/A"', async () => {
    vi.mocked(getData).mockResolvedValue({ ...mockMovie, Poster: "N/A" });
    renderMovieDetail();

    await waitFor(() => screen.getByAltText("Inception"));

    const img = screen.getByAltText("Inception");
    expect(img).toHaveAttribute("src", "test-empty-poster.png");
  });

  it("falls back to empty poster on image load error", async () => {
    vi.mocked(getData).mockResolvedValue(mockMovie);
    renderMovieDetail();

    await waitFor(() => screen.getByAltText("Inception"));

    const img = screen.getByAltText("Inception");
    expect(img.src).toContain("example.com");

    fireEvent.error(img);

    expect(img).toHaveAttribute("src", "test-empty-poster.png");
  });

  it("uses correct imdbID from URL", async () => {
    const id = "tt9999999";
    vi.mocked(getData).mockResolvedValue(mockMovie);
    renderMovieDetail(id);

    await waitFor(() => {
      expect(getData).toHaveBeenCalledWith(`i=${id}`);
    });
  });
});
