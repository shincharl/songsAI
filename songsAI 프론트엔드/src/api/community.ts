import api from "./client";

export type CommunityEmotion =
  | "HAPPY"
  | "SAD"
  | "ANGRY"
  | "EXCITED"
  | "CALM"
  | "NEUTRAL";

export type ReactionType = "EMPATHY" | "COMFORT" | "CHEER";

export interface CommunityPostCreateRequest {
  content: string;
  emotion: CommunityEmotion;
}

export interface PostReactionRequest {
  reactionType: ReactionType;
}

export interface ReactionSummaryResponse {
  empathyCount: number;
  comfortCount: number;
  cheerCount: number;
}

export interface CommunityPostResponse {
  id: number;
  nickname: string;
  content: string;
  emotion: CommunityEmotion;
  createdAt: string;
  reactionSummary: ReactionSummaryResponse;
  myReaction: ReactionType | null;
}

export interface PostReactionResponse {
  postId: number;
  myReaction: ReactionType | null;
  reactionSummary: ReactionSummaryResponse;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const createCommunityPost = async (
  request: CommunityPostCreateRequest,
) => {
  const response = await api.post<CommunityPostResponse>(
    "/community/posts",
    request,
  );
  return response.data;
};

export const getCommunityPosts = async (params: {
  emotion?: CommunityEmotion;
  page?: number;
  size?: number;
}) => {
  const response = await api.get<PageResponse<CommunityPostResponse>>(
    "/community/posts",
    {
      params,
    },
  );
  return response.data;
};

export const reactToCommunityPost = async (
  postId: number,
  request: PostReactionRequest,
) => {
  const response = await api.post<PostReactionResponse>(
    `/community/posts/${postId}/reactions`,
    request,
  );
  return response.data;
};
