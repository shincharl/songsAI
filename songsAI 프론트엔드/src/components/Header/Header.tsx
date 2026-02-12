import { useState } from "react";
import styles from "../../styles/Header.module.css"; // Tailwind 클래스 묶은 모듈
import logo from "../../assets/logo.png"

const Header = () => {

    const [activeTab, setActiveTab] = useState("추천");
    const tabs = ["추천", "기능소개", "마이페이지", "회원가입", "로그인"];

    return(
        <header className={styles.header}>
            <div className={styles.inner}>
                <img src={logo} alt="logo" className={styles.logo} />

                <nav className={styles.nav}>
                    {tabs.map((tab) => {

                        const isAuth = tab === "로그인" || tab === "회원가입";
                        const isSignup = tab === "회원가입";

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    ${styles.tab}
                                    ${activeTab === tab ? styles.activeTab : ""}
                                    ${isAuth ? styles.authButton : ""}
                                    ${isSignup ? styles.signup : ""}
                                `}
                            >
                                {tab}
                            </button>
                        )
                    })}
                </nav>
           </div>
        </header>
    );
};

export default Header;