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
  content: string;
  stickers: string[];
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
