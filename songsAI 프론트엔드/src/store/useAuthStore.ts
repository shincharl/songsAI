import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  username: string | null;
  nickname: string | null; // 닉네임 필드
  isLogin: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
  setNickname: (nickname: string) => void; // 닉네임 업데이트 함수
}

// 앱 시작 시 토큰 확인
const savedToken = sessionStorage.getItem("accessToken");
const savedUsername = sessionStorage.getItem("username");
const savedNickname = sessionStorage.getItem("nickname");

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: savedToken,
  username: savedUsername,
  nickname: savedNickname,
  isLogin: !!savedToken,

  login: (token, username, nickname) => {
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("username", username);
    if (nickname) sessionStorage.setItem("nickname", nickname);

    set({
      accessToken: token,
      username,
      nickname: nickname || savedNickname,
      isLogin: true,
    });
  },

  logout: () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("nickname");

    set({
      accessToken: null,
      username: null,
      nickname: null,
      isLogin: false,
    });
  },

  setNickname: (nickname) => {
    sessionStorage.setItem("nickname", nickname);
    set({ nickname });
  },
}));
