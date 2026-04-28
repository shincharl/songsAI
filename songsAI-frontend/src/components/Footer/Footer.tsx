import { Link } from "react-router-dom";
import styles from "../../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        <div className={styles.menu}>
          <Link to="/EmotionDiaryPage">감정 일기</Link>
          <Link to="/DiaryHistoryPage">일기 히스토리</Link>
          <Link to="/PlayListPage">플레이리스트</Link>
          <Link to="/CommunityPage">커뮤니티</Link>
                    <a href="https://github.com/shincharl" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://chamchicoder.tistory.com/" target="_blank" rel="noreferrer">Blog</a>
        </div>

        <div className={styles.bottom}>
          © 2026 SongsAI
        </div>

      </div>
    </footer>
  );
};

export default Footer;
