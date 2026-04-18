import api from "./client";

export interface FeaturedPlaylistResponse {
  badge: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  videoId: string;
  recommendCount: number;
}

export interface TrendingPlaylistItem {
  id: number;
  tag: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  videoId: string;
  recommendCount: number;
}

export interface CategoryPlaylistItem {
  emotion: string;
  emoji: string;
  title: string;
  subtitle: string;
}

export interface CategoryPlaylistVideoItem {
  id: number;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  videoId: string;
  recommendCount: number;
}

export const getFeaturedPlaylist = async () => {
  const response = await api.get<FeaturedPlaylistResponse>(
    "/playlists/featured",
  );
  return response.data;
};

export const getTrendingPlaylists = async () => {
  const response = await api.get<TrendingPlaylistItem[]>("/playlists/trending");
  return response.data;
};

export const getCategoryPlaylists = async () => {
  const response = await api.get<CategoryPlaylistItem[]>(
    "/playlists/categories",
  );
  return response.data;
};

export const getCategoryPlaylistVideos = async (emotion: string) => {
  const response = await api.get<CategoryPlaylistVideoItem[]>(
    `/playlists/categories/${emotion}`,
  );
  return response.data;
};
