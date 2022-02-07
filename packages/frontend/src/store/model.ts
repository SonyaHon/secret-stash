export const AppRoutes = {
  videos: () => "/videos",
  actors: () => "/actors",
  collections: () => "/collections",
  video: (id?: string) => `/video/${id}`,
  actor: (id?: string) => `/actor/${id}`,
  collection: (id?: string) => `/collection/${id}`,
  uploadVideoFile: () => "/upload/video-file",
};
