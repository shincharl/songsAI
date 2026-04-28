import api from "./client";

export const sendEmailApi = (email: string) =>
  api.post("/email/send", { email });

export const verifyEmailApi = (data: { email: string; code: string }) =>
  api.post("/email/verify", data);
