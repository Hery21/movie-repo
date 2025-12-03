import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function HomePage() {
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <TextField fullWidth />
        <IconButton sx={{ height: "40px", width: "40px", m: 1 }}>
          <SearchIcon />
        </IconButton>
      </div>
    </>
  );
}

export default HomePage;
