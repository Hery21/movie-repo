import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getData } from "../utils/fetch";
import { Box, Typography, Chip, Divider, Stack } from "@mui/material";
import EmptyPoster from "../assets/EmptyMovie.png";

function MovieDetailPage() {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      const res = await getData(`i=${imdbID}`);
      setMovie(res);
    }
    fetchMovie();
  }, [imdbID]);

  if (!movie) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 2, display: "flex", gap: 4 }}>
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : EmptyPoster}
        alt={movie.Title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = EmptyPoster;
        }}
        style={{
          width: "20vw",
          height: "30vw",
          objectFit: "cover",
          borderRadius: 8,
        }}
      />

      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" fontWeight={700}>
          {movie.Title} ({movie.Year})
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          {movie.Runtime} • {movie.Genre}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={2} alignItems="center">
          {movie.Ratings.map((r, i) => (
            <Chip
              key={i}
              label={`${r.Source}: ${r.Value}`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Stack>

        <Typography sx={{ mt: 3, fontSize: 16 }}>{movie.Plot}</Typography>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{ display: "grid", gridTemplateColumns: "150px 1fr", rowGap: 1 }}
        >
          <Typography fontWeight={600}>Director:</Typography>
          <Typography>{movie.Director}</Typography>

          <Typography fontWeight={600}>Writer:</Typography>
          <Typography>{movie.Writer}</Typography>

          <Typography fontWeight={600}>Actors:</Typography>
          <Typography>{movie.Actors}</Typography>

          <Typography fontWeight={600}>Language:</Typography>
          <Typography>{movie.Language}</Typography>

          <Typography fontWeight={600}>Country:</Typography>
          <Typography>{movie.Country}</Typography>

          <Typography fontWeight={600}>Awards:</Typography>
          <Typography>{movie.Awards}</Typography>

          <Typography fontWeight={600}>Box Office:</Typography>
          <Typography>{movie.BoxOffice}</Typography>

          <Typography fontWeight={600}>IMDb Rating:</Typography>
          <Typography>{movie.imdbRating} ⭐</Typography>

          <Typography fontWeight={600}>Votes:</Typography>
          <Typography>{movie.imdbVotes}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default MovieDetailPage;
