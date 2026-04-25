import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuthStore } from "../../store/useAuthStore";

const KakaoSuccessPage = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        const accessToken = params.get("accessToken");
        const nickname = params.get("nickname");

        if (accessToken){
          login(accessToken, "kakao_user", nickname ?? undefined);
          navigate("/");
          return;
        }

        // 로그인 상태 반영
        navigate("/Signup");
    }, [params, login, navigate]);

    return <div>로그인 처리 중...</div>
};

export default KakaoSuccessPage;