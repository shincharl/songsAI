//import { useAuthStore } from "../store/useAuthStore";
import api from "./client";

export const setNicknameApi = async (nickname: string) => {
  // 스토어에서 username 꺼내기
  //const username = useAuthStore.getState().username;
  return api
    .post(
      "/users/set-nickname",
      { nickname },
      {
        headers: {
          // 로그인 직후 발급받은 accessToken
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    )
    .then((res) => res.data);
};
