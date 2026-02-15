import {FC} from "react";
import {Link} from "react-router-dom";
import styles from "../../styles/Login.module.css"
const Login: FC = () => {
    return(
        <div className={styles.wrapper}>
            <div className={styles.loginBox}>
                <p className={styles.title}>내 마음까지 한걸음 남았습니다.</p>

                <Link to="/signup">
                    <button className={styles.loginBtn}>
                        로그인
                    </button>
                </Link>

                <p className={styles.signupText}>
                    아직 회원이 아니신가요?{" "}
                    <Link to="/signup" className={styles.signupLink}>
                        회원가입
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;