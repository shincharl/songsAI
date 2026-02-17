import styles from "../../styles/Register.module.css"
import logo from "../../assets/logo.png"
import { User, Lock, Mail, Calendar, Phone, Eye, EyeOff, Smartphone } from "lucide-react"
import { useState } from "react"
import type { RegisterFormData, ValidationErrors } from "../../types"
import registerUserApi from "../../api/registerUserApi"

const Register: React.FC = () => {
    const [showPw, setShowPw] = useState<boolean>(false)
    const carriers = ["SKT", "KT", "LG U+", "알뜰폰"]

    // 로딩 useState
    const [loading, setLoading] = useState(false);

    // 에러처리 useState
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async() => {
        setLoading(true);
        try {
            // 백엔드에 맞게 이름을 매핑
            const data: RegisterFormData = {
                username: form.username,
                password: form.password,
                email: form.email,
                birth: form.birth,
                phoneNumber: form.phoneNumber,
                carrier: form.carrier,
            };

            await registerUserApi(data);
            alert("회원가입 성공!");

        } catch (err: unknown) {
            
            if (typeof err === "object" && err !== null){
                setErrors(err as ValidationErrors);
            }
        } finally {
            setLoading(false);
        }
    }

    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        name: "",
        birth: "",
        carrier: "",
        phoneNumber: "",
    })

  return (
    <div className={styles.container}>
      <img src={logo} alt="logo" className={styles.logo} />

      {/* 아이디 / 비번 */}
        <div className={styles.box}>
        <div className={styles.field}>
            <div className={`${styles.inputBox} ${errors.username ? styles.errorInput : ""}`}>
            <User size={18} />
            <input 
                type="text"
                placeholder="아이디 @beatai.com" 
                value={form.username}
                onChange={e =>{ 
                    setForm({...form, username: e.target.value});
                }}
                className={errors.username ? styles.errorInput : ""}
            />
            </div>

            {/* username 없을 때 생기는 오류 태그 */}
            {errors.username && (
                <p className={styles.errorText}>{errors.username}</p>
            )}
        </div>

        <div className={styles.row}>
                <div className={styles.field}>
                <div className={`${styles.inputBox} ${errors.password ? styles.errorInput : ""}`}>
                    <Lock size={18} />
                    <input 
                        type={showPw ? "text" : "password"}
                        placeholder="비밀번호"
                        value={form.password}
                        onChange={e => setForm({...form, password: e.target.value})}
                        className={errors.password ? styles.errorInput : ""}
                    />

                    <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPw(prev => !prev)}
                    >
                        {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                </div>

                    {/* password 없을 때 생기는 오류 태그 */}
                    {errors.password && (
                        <p className={styles.errorText}>{errors.password}</p>
                    )}
            </div>

        <div className={styles.field}>
          <div className={`${styles.inputBox} ${errors.email ? styles.errorInput : ""}`}>
            <Mail size={18} />
            <input 
                type="text" 
                placeholder="[선택] 이메일주소"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className={errors.email ? styles.errorInput : ""}
                />
          </div>

            {/* email 없을 때 생기는 오류 태그 */}
            {errors.email && (
                <p className={styles.errorText}>{errors.email}</p>
            )}

            </div>
        </div>
      </div>

      {/* 개인정보 */}
      <div className={styles.box}>
        <div className={styles.row}>
            <div className={styles.field}>
                <div className={styles.inputBox}>
                <User size={18} />
                <input
                    type="text"
                    placeholder="이름"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                />
                </div>
                <div className={styles.errorText}></div>
            </div>
            
        <div className={styles.field}>
          <div className={`${styles.inputBox} ${errors.birth ? styles.errorInput : ""}`}>
            <Calendar size={18} />
            <input 
                type="text" 
                placeholder="생년월일 8자리"
                value={form.birth}
                onChange={e => setForm({...form, birth: e.target.value})} 
                className={errors.birth ? styles.errorInput: ""}
                />
          </div>

          {errors.birth && (
            <p className={styles.errorText}>{errors.birth}</p>
          )}
          </div>

        </div>
      </div>

      {/* 전화번호 */}
        <div className={styles.box}>
        <div className={styles.field}>
            <div className={`${styles.inputBox} ${errors.phoneNumber ? styles.errorInput : ""}`}>
            <Smartphone size={18} />
            <input
                type="text"
                placeholder="휴대전화번호"
                value={form.phoneNumber}
                onChange={e => setForm({...form, phoneNumber: e.target.value})}
            />
            </div>
            <div className={styles.errorText}>
            {errors.phoneNumber || ""}
            </div>
        </div>

            <div className={styles.field}>
            <div className={`${styles.inputBox} ${errors.carrier ? styles.errorInput : ""}`}>
            <Phone size={18}/>
            <select
                className={styles.select}
                value={form.carrier}
                onChange={e => setForm({...form, carrier: e.target.value})}
            >
                <option value="">통신사 선택</option>
                {carriers.map(c => (
                <option key={c} value={c}>{c}</option>
                ))}
            </select>
            </div>
            <div className={styles.errorText}>{errors.carrier || ""}</div>
        </div>
        </div>

      <button 
        className={styles.verifyBtn}
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        >
            {loading ? "가입중..." : "인증요청"}
      </button>

    </div>
  )
}

export default Register
