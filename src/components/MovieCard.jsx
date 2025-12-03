import { Box, Tooltip, Typography } from "@mui/material";
import EmptyPoster from "../assets/EmptyMovie.png";

function MovieCard({ movie, onClick, refProp }) {
  return (
    <Box ref={refProp} sx={{ cursor: "pointer" }}>
      <div className="poster-wrapper" onClick={onClick}>
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : EmptyPoster}
          alt={movie.Title}
          onError={(e) => (e.target.src = EmptyPoster)}
        />
      </div>

      <Tooltip title={movie.Title}>
        <Typography noWrap sx={{ maxWidth: 200 }}>
          {movie.Title}
        </Typography>
      </Tooltip>

      <Typography>{movie.Year}</Typography>
    </Box>
  );
}

export default MovieCard;
