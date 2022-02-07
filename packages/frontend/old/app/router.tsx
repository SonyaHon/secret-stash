import React from "react";
import { observer } from "mobx-react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Videos } from "../pages/videos";
import { Actors } from "../pages/actors";
import { Collections } from "../pages/collections";
import { Video } from "../pages/video";
import { Actor } from "../pages/actor";
import { Collection } from "../pages/collection";
import { UploadVideoFile } from "../pages/upload/video-file";

export const AppRouter: React.FC = observer(() => {
  return (
    <Routes>
      <Route path="/video/:id" element={<Video />} />
      <Route path="/actor/:id" element={<Actor />} />
      <Route path="/collection/:id" element={<Collection />} />

      <Route path="/upload/video-file" element={<UploadVideoFile />} />

      <Route path="/videos" element={<Videos />} />
      <Route path="/actors" element={<Actors />} />
      <Route path="/collections" element={<Collections />} />

      <Route path="/" element={<Navigate to="/videos" />} />
    </Routes>
  );
});
