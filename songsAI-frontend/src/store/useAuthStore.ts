import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  username: string | null;
  nickname: string | null; // 닉네임 필드
  profileImageUrl: string | null; // 프로필 이미지 URL 필드
  isLogin: boolean;

  login: (
    token: string,
    username: string,
    nickname?: string,
    profileImageUrl?: string | null,
  ) => void;

  logout: () => void;
  setNickname: (nickname: string) => void; // 닉네임 업데이트 함수
  setProfileImageUrl: (url: string | null) => void; // 프로필 이미지 URL 업데이트 함수
}

// 앱 시작 시 토큰 확인
const savedToken = sessionStorage.getItem("accessToken");
const savedUsername = sessionStorage.getItem("username");
const savedNickname = sessionStorage.getItem("nickname");
const savedProfileImageUrl = sessionStorage.getItem("profileImageUrl");

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: savedToken,
  username: savedUsername,
  nickname: savedNickname,
  profileImageUrl: savedProfileImageUrl,
  isLogin: !!savedToken,

  login: (token, username, nickname) => {
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("username", username);
    if (nickname) sessionStorage.setItem("nickname", nickname);

    set({
      accessToken: token,
      username,
      nickname: nickname ?? null,
      profileImageUrl: null, // 로그인 시 프로필 이미지 URL 초기화
      isLogin: true,
    });
  },

  logout: () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("nickname");
    sessionStorage.removeItem("profileImageUrl");

    set({
      accessToken: null,
      username: null,
      nickname: null,
      profileImageUrl: null,
      isLogin: false,
    });
  },

  setNickname: (nickname) => {
    sessionStorage.setItem("nickname", nickname);
    set({ nickname });
  },

  setProfileImageUrl: (url) => {
    if (url) {
      sessionStorage.setItem("profileImageUrl", url);
    } else {
      sessionStorage.removeItem("profileImageUrl");
    }
    set({ profileImageUrl: url });
  },
}));
