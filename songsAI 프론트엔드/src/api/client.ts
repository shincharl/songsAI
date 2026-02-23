// axios 기본 설정
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env에서 불러오기 (로컬)
  //baseURL: import.meta.env.production.VITE_API_BASE_URL, (실서버)
  withCredentials: true, // 쿠키 포함
  headers: {
    "Content-Type": "application/json",
  },
});

// 로그인 했을때 token 합쳐서 서버에 전달
// 로그인 안했을때 token 빼고 전달
// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // AccessToken 만료 (401) && 아직 재시도 안 한 요청
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/users/reissue");

        const newAccessToken = res.data.accessToken;

        // 스토어에 새 토큰 저장
        useAuthStore.getState().login(newAccessToken);

        // Authorization 헤더 갱신
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 원래 요청 다시 실행
        return api(originalRequest);
      } catch (refreshError) {
        // RefreshToken도 만료 -> 로그인 페이지 이동
        console.log(refreshError);

        // store 로그아웃
        useAuthStore.getState().logout();
        window.location.href = "/Signup";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
