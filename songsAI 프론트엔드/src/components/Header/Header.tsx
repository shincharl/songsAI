import { useState } from "react";
import styles from "../../styles/Header.module.css"; // Tailwind 클래스 묶은 모듈
import logo from "../../assets/logo.png"
import {FiSearch} from "react-icons/fi"

const Header = () => {

    const [activeTab, setActiveTab] = useState("추천");
    const [searchQuery, setSearchQuery] = useState("");

    const tabs = ["감정 일기", "친구 추천", "플레이리스트", "커뮤니티"]

    return(
        <header className={styles.header}>
            <div className={styles.inner}>
                {/* 로고 */}
                <img src={logo} alt="logo" className={styles.logo} />

                {/* 네비게이션 */}
                <nav className={styles.nav}>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
                        >
                            {tab}
                        </button>
                    ))}

                    {/* 검색창 */}
                    <div className={styles.searchWrapper}>
                        <input 
                            type="text" 
                            placeholder="곡, 아티스트 검색"
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FiSearch className={styles.searchIcon}/>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;