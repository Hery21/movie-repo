import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { getData } from "../utils/fetch";
import EmptyPoster from "../assets/EmptyMovie.png";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);

  const handleTypeSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchMovies = async () => {
    try {
      const resMovies = await getData(`s=${searchTerm}&page=1`);
      setMovieList(resMovies.Search);
    } catch (err) {
      console.error(err);
    }
  };

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
          placeholder="What movie/series are you looking for?"
          onChange={handleTypeSearch}
        />
        <IconButton
          onClick={fetchMovies}
          sx={{ height: "40px", width: "40px", m: 1 }}
        >
          <SearchIcon />
        </IconButton>
      </div>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          margin: "50px",
        }}
      >
        {movieList?.map((movie) => (
          <Box key={movie.imdbID}>
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

            <Typography>
              {movie.Year} - {movie.Type}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
}

export default HomePage;
