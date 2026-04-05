import api from "../api/client";

export interface DiaryHistorySearchParams {
  year: number;
  month: number;
  keyword?: string | null;
  emotion?: string | null;
}

export interface DiaryDetailResponse {
  diaryId: number;
  date: string;
  topEmotion: string | null;
  content: string;
}

export const getDiaryHistory = async ({
  year,
  month,
  keyword,
  emotion,
}: DiaryHistorySearchParams) => {
  const response = await api.get("/diary/history", {
    params: {
      year,
      month,
      keyword,
      emotion,
    },
  });

  return response.data;
};

export const getDiaryDetail = async (diaryId: number) => {
  const response = await api.get(`/diary/history/${diaryId}`);
  return response.data as DiaryDetailResponse;
};
