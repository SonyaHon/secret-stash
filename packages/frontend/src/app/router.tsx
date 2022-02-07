import React from "react";
import { observer } from "mobx-react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppRoutes } from "../store/model";
import { VideosPage } from "../pages/videos";
import { VideoPage } from "../pages/video";
import { ActorsPage } from "../pages/actors";
import { ActorPage } from "../pages/actor";
import { CollectionsPage } from "../pages/collections";
import { CollectionPage } from "../pages/collection";
import { UploadVideoFilePage } from "../pages/upload-video-file";

export const Router: React.FC = observer(() => {
  return (
    <Routes>
      <Route path={AppRoutes.videos()} element={<VideosPage />} />
      <Route path={AppRoutes.video(":id")} element={<VideoPage />} />
      <Route path={AppRoutes.actors()} element={<ActorsPage />} />
      <Route path={AppRoutes.actor(":id")} element={<ActorPage />} />
      <Route path={AppRoutes.collections()} element={<CollectionsPage />} />
      <Route path={AppRoutes.collection(":id")} element={<CollectionPage />} />
      <Route
        path={AppRoutes.uploadVideoFile()}
        element={<UploadVideoFilePage />}
      />
      <Route path="/" element={<Navigate to={AppRoutes.videos()} />} />
    </Routes>
  );
});
