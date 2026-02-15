import { FaComment, FaQrcode, FaSearch } from "react-icons/fa";
import styles from "../../styles/LocalSignup.module.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const LocalSignup = () => {
  return (
    <div className={styles.wrapper}>
      <img src={logo} alt="BeatAI logo" className={styles.logo} />

      <div className={styles.box}>
        <h2 className={styles.title}>로그인</h2>

        <input className={styles.input} type="text" placeholder="아이디" />
        <input className={styles.input} type="password" placeholder="비밀번호" />

        <div className={styles.optionRow}>
          <label>
            <input type="checkbox" /> 로그인 상태 유지
          </label>
        </div>

        <button className={styles.loginBtn}>로그인</button>

        <div className={styles.bottomMenu}>
          <button>아이디 찾기</button>
          <span>|</span>
          <button>비밀번호 찾기</button>
        </div>
      </div>

      <div className={styles.footerInfo}>
        <p>문의전화 : 1111-111 (평일 09:00-18:00, 유료)</p>
        <p>© BeatAI Ssc Port.</p>
      </div>
    </div>
  );
};


export default LocalSignup;
