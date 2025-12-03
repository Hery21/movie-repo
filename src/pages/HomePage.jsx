import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useRef, useCallback } from "react";
import { getData } from "../utils/fetch";
import EmptyPoster from "../assets/EmptyMovie.png";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const observer = useRef();

  const handleTypeSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchMovies = useCallback(
    async (pageNum = 1) => {
      if (!searchTerm) return;

      setLoading(true);

      try {
        const resMovies = await getData(
          `type=movie&s=${searchTerm}&page=${pageNum}`
        );

        if (pageNum === 1) {
          setMovieList(resMovies.Search || []);
        } else {
          setMovieList((prev) => [...prev, ...(resMovies.Search || [])]);
        }

        setHasMore(resMovies.Search?.length > 0);
        setPage(pageNum);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    },
    [searchTerm]
  );

  const startSearch = () => {
    setMovieList([]);
    setPage(1);
    fetchMovies(1);
  };

  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMovies(page + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, fetchMovies]
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "50px",
        }}
      >
        <TextField
          fullWidth
          placeholder="What movie are you looking for?"
          onChange={handleTypeSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              startSearch();
            }
          }}
          sx={{ borderRadius: 8 }}
        />

        <IconButton
          onClick={startSearch}
          sx={{ height: "40px", width: "40px", m: 1 }}
        >
          <SearchIcon />
        </IconButton>
      </div>

      <Box
        sx={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          margin: "50px",
        }}
      >
        {movieList.map((movie, index) => {
          const isLast = index === movieList.length - 1;

          return (
            <Box key={movie.imdbID} ref={isLast ? lastMovieRef : null}>
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : EmptyPoster}
                alt={movie.Title}
                style={{ width: "200px", height: "300px", borderRadius: 8 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = EmptyPoster;
                }}
              />
              <Tooltip title={movie.Title}>
                <Typography
                  noWrap
                  sx={{
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {movie.Title}
                </Typography>
              </Tooltip>

              <Typography>{movie.Year}</Typography>
            </Box>
          );
        })}
      </Box>

      {loading && (
        <Typography textAlign="center" sx={{ mb: 5 }}>
          Loading...
        </Typography>
      )}
    </>
  );
}

export default HomePage;
