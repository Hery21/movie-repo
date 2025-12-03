import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MovieDetailPage from "../pages/MovieDetailPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/movie/:imdbID" element={<MovieDetailPage />} />
    </Routes>
  );
}

export default AppRoutes;
