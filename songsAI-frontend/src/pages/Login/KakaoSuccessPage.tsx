import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { getMyProfile } from "../../api/user";

const KakaoSuccessPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const setNickname = useAuthStore((state) => state.setNickname);
  const setProfileImageUrl = useAuthStore((state) => state.setProfileImageUrl);

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const nickname = params.get("nickname");

    const handleKakaoLogin = async () => {
      if (!accessToken) {
        navigate("/Signup");
        return;
      }

      login(accessToken, "kakao_user", nickname ?? undefined);

      try {
        const profile = await getMyProfile();

        setNickname(profile.nickname);
        setProfileImageUrl(profile.profileImageUrl);
      } catch (e) {
        console.error(e);
      }

      navigate("/");
    };

    handleKakaoLogin();
  }, [params, login, setNickname, setProfileImageUrl, navigate]);

  return <div>로그인 처리 중...</div>;
};

export default KakaoSuccessPage;