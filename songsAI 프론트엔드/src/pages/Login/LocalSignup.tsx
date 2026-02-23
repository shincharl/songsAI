import styles from "../../styles/LocalSignup.module.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUserApi } from "../../api/loginUserApi";
import { useAuthStore } from "../../store/useAuthStore";


const LocalSignup = () => {

  const navigate = useNavigate();

  // login 호출
  const { login } = useAuthStore(); 

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // 로그인 유지 체크박스 상태 추가
  const [keepLogin, setKeepLogin] = useState(false);

  const onChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const onLogin = async () => {
    try {
      const res = await loginUserApi({
        ...form,
        keepLogin: keepLogin,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { accessToken, firstLogin } = res;

      // AccessToken 저장
      login(res.accessToken, form.username, res.nickname);

      if (firstLogin) {
        // 첫 로그인 -> 닉네임 설정 페이지로 이동
        navigate("/set-nickname");
      } else {
        // 일반 로그인 -> 메인 페이지 이동
        navigate("/");
      }

    } catch (err) {
      alert("로그인 실패");
      console.log(err);
    }
  }

  return (
    <div className={styles.wrapper}>
      <img src={logo} alt="BeatAI logo" className={styles.logo} />

      <div className={styles.box}>
        <h2 className={styles.title}>로그인</h2>

        <input 
          className={styles.input} 
          type="text" 
          placeholder="아이디"
          name="username"
          value={form.username}
          onChange={onChange}
          />

        <input 
          className={styles.input} 
          type="password" 
          placeholder="비밀번호"
          name="password"
          value={form.password}
          onChange={onChange}
          />

        <div className={styles.optionRow}>
          <label>
            <input 
              type="checkbox"
              checked={keepLogin}
              onChange={(e) => setKeepLogin(e.target.checked)} 
              /> 
              로그인 상태 유지
          </label>
        </div>

        <button className={styles.loginBtn} onClick={onLogin}>
          로그인
        </button>

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
