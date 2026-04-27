import { useState } from "react";
import styles from "../../styles/Header.module.css"; // Tailwind 클래스 묶은 모듈
import logo from "../../assets/logo.png"
import { useNavigate } from "react-router-dom";

const Header = () => {

    const [activeTab, setActiveTab] = useState("추천");

    const navigate = useNavigate();

    const tabs = ["감정 일기", "일기 히스토리", "플레이리스트", "커뮤니티"]

    return(
        <header className={styles.header}>
            <div className={styles.inner}>
                {/* 로고 */}
                <img 
                    src={logo}
                    alt="logo"
                    className={styles.logo}
                    onClick={() => {
                        setActiveTab("");
                        navigate("/")
                    }}
                />

                {/* 네비게이션 */}
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
                            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
                        >
                            {tab}
                        </button>
                    ))}

                    {/* 검색창 */}
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
                </nav>
            </div>
        </header>
    );
};

export default Header;