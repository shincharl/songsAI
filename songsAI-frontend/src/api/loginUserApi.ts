import type { LoginResponse } from "../types";
import api from "./client";

export const loginUserApi = async (data: {
  username: string;
  password: string;
  keepLogin: boolean;
}): Promise<LoginResponse> => {
  const res = await api.post("/users/locallogin", data, {
    withCredentials: true, // 쿠키 포함
  });
  return res.data; // {accessToken, firstLogin}
};
