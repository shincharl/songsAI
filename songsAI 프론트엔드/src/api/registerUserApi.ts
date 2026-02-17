import axios from "axios";
import api from "../api/client";
import type { RegisterFormData } from "../types";

const registerUserApi = async (data: RegisterFormData) => {
  try {
    const response = await api.post("/users/signup", data);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data; // 컨트롤러에서 보낸 errors
    }
    throw err;
  }
};

export default registerUserApi;
