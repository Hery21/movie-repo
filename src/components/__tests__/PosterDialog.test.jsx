import { render, screen, fireEvent } from "@testing-library/react";
import PosterDialog from "../PosterDialog";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import EmptyPoster from "../../assets/EmptyMovie.png";
import userEvent from "@testing-library/user-event";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual("react-router-dom");
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  };
});

describe("PosterDialog", () => {
  const movie = {
    Title: "Batman Begins",
    Year: "2005",
    Type: "movie",
    Poster: "https://example.com/batman.jpg",
    imdbID: "tt0372784",
  };

  const renderDialog = (props) =>
    render(
      <MemoryRouter>
        <PosterDialog {...props} />
      </MemoryRouter>
    );

  it("does not render when closed", () => {
    renderDialog({ open: false, movie, onClose: vi.fn() });
    expect(screen.queryByText("Batman Begins")).not.toBeInTheDocument();
  });

  it("renders when open", () => {
    renderDialog({ open: true, movie, onClose: vi.fn() });
    expect(screen.getByText("Batman Begins")).toBeInTheDocument();
    expect(screen.getByText("2005 • MOVIE")).toBeInTheDocument();
  });

  it("displays correct poster when valid", () => {
    renderDialog({ open: true, movie, onClose: vi.fn() });
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", movie.Poster);
  });

  it("falls back to EmptyPoster when poster is 'N/A'", () => {
    renderDialog({
      open: true,
      movie: { ...movie, Poster: "N/A" },
      onClose: vi.fn(),
    });
    expect(screen.getByRole("img")).toHaveAttribute("src", EmptyPoster);
  });

  it("onError switches image to fallback", () => {
    renderDialog({ open: true, movie, onClose: vi.fn() });
    const img = screen.getByRole("img");
    fireEvent.error(img);
    expect(img.src).toContain(EmptyPoster);
  });

  it("clicking 'View Info' navigates to movie page", async () => {
    const user = userEvent.setup();
    renderDialog({ open: true, movie, onClose: vi.fn() });
    const btn = screen.getByRole("button", { name: /view info/i });
    await user.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/movie/tt0372784");
  });

  it("backdrop click triggers onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderDialog({ open: true, movie, onClose });
    const backdrop = await waitForBackdrop();
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it("renders type safely when undefined", () => {
    renderDialog({
      open: true,
      movie: { ...movie, Type: undefined },
      onClose: vi.fn(),
    });
    expect(screen.getByText(/2005 •/)).toBeInTheDocument();
  });

  async function waitForBackdrop() {
    const el = document.querySelector(".MuiBackdrop-root");
    if (el) return el;
    await new Promise((r) => setTimeout(r, 50));
    return document.querySelector(".MuiBackdrop-root");
  }
});
