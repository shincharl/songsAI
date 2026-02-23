/* 프로젝트에서 공통으로 사용하는 type 형태 저장소!!! */

export interface RegisterFormData {
  username: string;
  password: string;
  email?: string;
  birth?: string;
  phoneNumber?: string;
  carrier?: string;
}

// 회원가입시 에러 발생했을때 전달되는 형식 타입
export type ValidationErrors = Record<string, string>;

// 로그인 시 (처음 로그인 X) 반환 인터페이스
export interface LoginResponse {
  accessToken: string;
  firstLogin: boolean;
  nickname: string | null; // 기존 회원이면 닉네임, 첫 로그인이면 null
}
