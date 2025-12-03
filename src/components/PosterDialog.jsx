import React from "react";
import EmptyPoster from "../assets/EmptyMovie.png";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function PosterDialog({ open, movie, onClose }) {
  const navigate = useNavigate();

  const handleSelectMovie = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          pb: 1,
        },
      }}
    >
      <DialogContent sx={{ textAlign: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : EmptyPoster}
            alt={movie.Title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = EmptyPoster;
            }}
            style={{
              width: "70%",
              height: "auto",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            }}
          />
        </Box>

        <Typography variant="h6" mt={2} fontWeight="bold" noWrap>
          {movie.Title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {movie.Year} • {movie.Type?.toUpperCase()}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          variant="contained"
          onClick={handleSelectMovie}
          sx={{ borderRadius: 2, px: 4 }}
        >
          View Info
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PosterDialog;
