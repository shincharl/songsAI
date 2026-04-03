import api from "../api/client";

export const getDiaryHistory = async (year: number, month: number) => {
  const response = await api.get("/history/month-all", {
    params: { year, month },
  });
  return response.data;
};
