import { useState } from "react";
import styles from "../../styles/Header.module.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const Header = () => {
  const [activeTab, setActiveTab] = useState("추천");

  const navigate = useNavigate();
  const { accessToken, nickname, profileImageUrl } = useAuthStore();

  const isLogin = !!accessToken;

  const tabs = ["감정 일기", "일기 히스토리", "플레이리스트", "커뮤니티"];

  const getImageUrl = (url: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;

  return `${import.meta.env.VITE_FILE_BASE_URL || ""}${url}`;
};

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img
          src={logo}
          alt="logo"
          className={styles.logo}
          onClick={() => {
            setActiveTab("");
            navigate("/");
          }}
        />

        <nav className={styles.nav}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "감정 일기") navigate("/EmotionDiaryPage");
                if (tab === "일기 히스토리") navigate("/DiaryHistoryPage");
                if (tab === "플레이리스트") navigate("/PlayListPage");
                if (tab === "커뮤니티") navigate("/CommunityPage");
              }}
              className={`${styles.tab} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
            >
              {tab}
            </button>
          ))}

          {isLogin && (
            <button
              className={`${styles.archiveButton} ${
                activeTab === "보관함" ? styles.archiveButtonActive : ""
              }`}
              onClick={() => {
                setActiveTab("보관함");
                navigate("/saved-videos");
              }}
            >
              ⭐ 보관함
            </button>
          )}

            {isLogin ? (
            <div
                className={styles.profile}
                onClick={() => {
                setActiveTab("내 정보");
                navigate("/my-profile");
                }}
            >
                {profileImageUrl ? (
                <img
                    src={getImageUrl(profileImageUrl)}
                    alt="프로필"
                    className={styles.avatar}
                />
                ) : (
                <div className={styles.avatar}>😊</div>
                )}

                <span className={styles.nickname}>
                {nickname || "사용자"}
                </span>
            </div>
            ) : (
            <button
              className={styles.loginButton}
              onClick={() => navigate("/Signup")}
            >
              로그인
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;