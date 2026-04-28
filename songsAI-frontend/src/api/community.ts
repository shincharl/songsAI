import api from "./client";

export type CommunityEmotion =
  | "HAPPY"
  | "SAD"
  | "ANGRY"
  | "EXCITED"
  | "CALM"
  | "NEUTRAL";

export type ReactionType = "EMPATHY" | "COMFORT" | "CHEER";

export type CommunitySocketEvent =
  | {
      type: "NEW_POST";
      data: CommunityPostResponse;
    }
  | {
      type: "REACTION_UPDATED";
      data: PostReactionResponse;
    }
  | {
      type: "NEW_COMMENT";
      data: CommunityCommentResponse;
    };

export interface CommunityPostCreateRequest {
  content: string;
  emotion: CommunityEmotion;
}

export interface PostReactionRequest {
  reactionType: ReactionType;
}

export interface CommunityCommentCreateRequest {
  content: string;
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
  commentCount?: number;
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

export interface CommunityCommentResponse {
  id: number;
  postId: number;
  nickname: string;
  content: string;
  createdAt: string;
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

export const getCommentsByPost = async (postId: number) => {
  const response = await api.get<CommunityCommentResponse[]>(
    `/community/posts/${postId}/comments`,
  );
  return response.data;
};

export const createComment = async (
  postId: number,
  request: CommunityCommentCreateRequest,
) => {
  const response = await api.post<CommunityCommentResponse>(
    `/community/posts/${postId}/comments`,
    request,
  );
  return response.data;
};
