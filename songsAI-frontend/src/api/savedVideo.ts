import api from "./client";

export interface SavedVideoRequest {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

export interface SavedVideoResponse {
  id: number;
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

export const saveVideo = async (data: SavedVideoRequest) => {
  await api.post("/saved-videos", data);
};

export const deleteSavedVideo = async (videoId: string) => {
  await api.delete(`/saved-videos/${videoId}`);
};

export const getSavedVideos = async () => {
  const response = await api.get<SavedVideoResponse[]>("/saved-videos");
  return response.data;
};
