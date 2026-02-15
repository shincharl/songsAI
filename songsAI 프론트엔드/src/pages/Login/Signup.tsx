import { FaComment, FaQrcode, FaSearch } from "react-icons/fa";
import styles from "../../styles/Signup.module.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Signup = () => {
    return (
        <div className={styles.wrapper}>

            {/* 로고 */}
            <img src={logo} alt="BeatAI logo" className={styles.logo} />

                {/* 카드 */}
                <div className={styles.box}>

                    <div className={styles.buttonArea}>

                    {/* 카드 오른쪽 위 */}
                    <div className={styles.topRight}>
                        <span className={styles.qr}>
                            <FaQrcode className={styles.qrIcon}/>
                                카카오 QR코드 로그인
                            </span>
                        <div className={styles.helpWrapper}>        
                            <FaSearch className={styles.helpIcon} />
                            <span className={styles.tooltip}>
                                QR 로그인은 카카오 앱에서 빠르게 로그인할 수 있어요
                            </span>
                        </div>

                    </div>

                    <Link to="/kakaologin">
                        <button className={styles.kakaoBtn}>
                            <FaComment className={styles.icon} />
                            카카오계정 로그인
                        </button>
                    </Link>

                    <Link to="/LocalSignup">
                        <button className={styles.defaultBtn}>
                            BeatAI 로그인
                        </button>
                    </Link>

                    <div className={styles.signupArea}>
                        계정이 없나요?
                            <Link to="/signin" className={styles.signupLink}>
                                회원가입
                            </Link>
                    </div>

                </div>


            </div>  
                <div className={styles.footerInfo}>
                    <p>문의전화 : 1111-111 (평일 09:00-18:00, 유료)</p>
                    <p>© BeatAI Ssc Port.</p>
                </div>
        </div>
    );
};

export default Signup;
