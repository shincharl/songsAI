// axios 기본 설정
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env에서 불러오기 (로컬)
  //baseURL: import.meta.env.production.VITE_API_BASE_URL, (실서버)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
