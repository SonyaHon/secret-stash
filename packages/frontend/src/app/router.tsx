import React from "react";
import { observer } from "mobx-react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Videos } from "../pages/videos";

export const AppRouter: React.FC = observer(() => {
  return (
    <Routes>
      <Route path="/videos" element={<Videos />} />
      <Route path="/actors" element={<Videos />} />
      <Route path="/" element={<Navigate to="/videos" />} />
    </Routes>
  );
});
