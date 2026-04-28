import { useAuthStore } from "../store/useAuthStore";
import api from "./client";

export const onLogout = async () => {
  try {
    await api.post("/users/logout");
  } catch (err) {
    console.log(err);
  }

  // zustand logout 호출
  useAuthStore.getState().logout();
};
