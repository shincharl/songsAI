import type { FC } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Login.module.css";
import { useAuthStore } from "../../store/useAuthStore";
import { onLogout } from "../../api/logoutApi";
import { useEffect } from "react";
import { getMyProfile } from "../../api/user";

const Login: FC = () => {
  const { isLogin, nickname, setNickname, setProfileImage } = useAuthStore();

  useEffect(() => {
    if (!isLogin) return;

    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();

        setNickname(data.nickname);
        setProfileImage(data.profileImageUrl);
      } catch (e) {
        console.error(e);
      }
    };

    fetchProfile();
  }, [isLogin, setNickname, setProfileImage]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.loginBox}>
        {isLogin ? (
          <>
            <p className={styles.title}>
              {nickname || "사용자"}님 환영합니다
            </p>
            <button className={styles.loginBtn} onClick={onLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <p className={styles.title}>
              내 마음까지 한걸음 남았습니다.
            </p>

            <Link to="/signup">
              <button className={styles.loginBtn}>로그인</button>
            </Link>

            <p className={styles.signupText}>
              아직 회원이 아니신가요?{" "}
              <Link to="/signup" className={styles.signupLink}>
                회원가입
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;