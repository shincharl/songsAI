import api from "../api/client";

export interface DiaryStickerRequest {
  category: string;
  label: string;
  img: string;
  page: number;
}

export interface DiaryAnalyzeRequest {
  content: string;
  pages: string[];
  stickers: DiaryStickerRequest[];
}

export interface TodayDiaryPreviewResponse {
  diaryId: number | null;
  content: string;
  stickers: string[];
}

export interface YoutubeVideoItem {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

export interface MusicRecommendationResponse {
  moodTitle: string;
  moodDesc: string;
  videos: YoutubeVideoItem[];
}

export const analyzeDiary = async (data: DiaryAnalyzeRequest) => {
  const response = await api.post("/diary/analyze", data);
  return response.data;
};

export const getWeeklyEmotions = async () => {
  const response = await api.get("/diary/weekly-emotions");
  return response.data;
};

export const getTodayDiaryPreview =
  async (): Promise<TodayDiaryPreviewResponse> => {
    const response = await api.get("/diary/today");
    return response.data;
  };

export const getMonthlyCalendar = async (year: number, month: number) => {
  return await api.get("/diary/calendar", {
    params: { year, month },
  });
};

export const getRecommendedMusic = async (
  diaryId: number,
): Promise<MusicRecommendationResponse> => {
  const response = await api.get(`/diary/${diaryId}/music`);
  return response.data;
};
