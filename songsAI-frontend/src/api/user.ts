import api from "./client";

export type MyProfileResponse = {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
};

export type UpdateProfileRequest = {
  nickname: string;
};

// 내 정보 조회
export const getMyProfile = async () => {
  const response = await api.get<MyProfileResponse>("/users/me");
  return response.data;
};

// 닉네임 수정
export const updateMyProfile = async (data: UpdateProfileRequest) => {
  const response = await api.patch<MyProfileResponse>("/users/me", data);
  return response.data;
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<MyProfileResponse>(
    "/users/me/profile-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// 프로필 이미지 삭제
export const deleteProfileImage = async () => {
  const response = await api.delete<MyProfileResponse>(
    "/users/me/profile-image",
  );

  return response.data;
};

export const deleteMyAccount = async () => {
  await api.delete("/users/me");
};
