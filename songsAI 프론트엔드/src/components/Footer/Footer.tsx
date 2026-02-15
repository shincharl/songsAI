import styles from "../../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        <div className={styles.menu}>
          <a href="/">감정 일기</a>
          <a href="/">친구 추천</a>
          <a href="/">플레이리스트</a>
          <a href="/">커뮤니티</a>
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
