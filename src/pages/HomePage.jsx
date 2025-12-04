import {
  Autocomplete,
  Box,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PosterDialog from "../components/PosterDialog";
import MovieCard from "../components/MovieCard";

import { setStoredSearchTerm } from "../redux/slice";
import { useMovies } from "../hooks/useMovies";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { getData } from "../utils/fetch";

function HomePage() {
  const dispatch = useDispatch();
  const savedTerm = useSelector((state) => state.search.term);

  const [searchTerm, setSearchTerm] = useState(savedTerm || "");
  const [inputValue, setInputValue] = useState(savedTerm || "");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { movies, loading, hasMore, page, fetchMovies, setMovies } =
    useMovies();

  const lastMovieRef = useInfiniteScroll(hasMore, loading, () =>
    fetchMovies(searchTerm, page + 1)
  );

  const startSearch = (term) => {
    dispatch(setStoredSearchTerm(term));
    setMovies([]);
    fetchMovies(term, 1);
  };

  useEffect(() => {
    if (!savedTerm) return;
    fetchMovies(savedTerm);
  }, [savedTerm, fetchMovies]);

  const openPoster = (movie) => {
    setSelectedMovie(movie);
    setOpenDialog(true);
  };

  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (value) => {
    if (!value) {
      setSuggestions([]);
      return;
    }
    const res = await getData(`type=movie&s=${value}&page=1`);
    setSuggestions(res.Search || []);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", m: 4 }}>
        <Autocomplete
          freeSolo
          fullWidth
          options={suggestions.map((m) => m.Title)}
          value={searchTerm}
          inputValue={inputValue}
          onInputChange={(e, value) => {
            setInputValue(value);
            fetchSuggestions(value);
          }}
          onChange={(e, value) => {
            if (!value) return;
            setSearchTerm(value);
            setInputValue(value);
            startSearch(value); // only search once
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="What movie are you looking for?"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(inputValue);
                  startSearch(inputValue);
                }
              }}
            />
          )}
        />

        <IconButton onClick={startSearch} sx={{ ml: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          m: 4,
        }}
      >
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onClick={() => openPoster(movie)}
            refProp={index === movies.length - 1 ? lastMovieRef : null}
          />
        ))}
      </Box>

      {loading && (
        <Typography textAlign="center" sx={{ mb: 4 }}>
          Loading...
        </Typography>
      )}

      {selectedMovie && (
        <PosterDialog
          open={openDialog}
          movie={selectedMovie}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  );
}

export default HomePage;
