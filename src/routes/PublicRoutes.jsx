// src/routes/PublicRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";

const PublicRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default PublicRoutes;
