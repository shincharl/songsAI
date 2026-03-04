import api from "../api/client";

const analyzeDiary = async (text: string) => {
  const response = await api.post("/diary/analyze", { text });
  return response.data;
};

export default analyzeDiary;
