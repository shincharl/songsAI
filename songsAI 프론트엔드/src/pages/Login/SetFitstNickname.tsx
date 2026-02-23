import { useState } from "react";
import styles from "../../styles/SetFirstNickname.module.css"
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { setNicknameApi } from "../../api/nickNameSendApi";

const SetFirstNickname = () => {

    const [nicknameInput, setNicknameInput] = useState("");
    const navigate = useNavigate();
    const { setNickname } = useAuthStore();

    const handleSubmit = async () => {
        if (!nicknameInput.trim()) return alert("닉네임을 입력해주세요");

        try {
            // 닉네임 입력 api 함수 호출
           const res = await setNicknameApi(nicknameInput); // 서버에서 새 닉네임 반환

           // Zustand 스토어 업데이트
           setNickname(res.nickname);

           navigate("/");
        } catch (error) {
            console.log(error);
            alert("닉네임 설정 실패");
        }
    }

    return(
        <>
            <div className={styles.wrapper}>
                <div className={styles.box}>
                    <h2 className={styles.title}>
                        닉네임을 설정해주세요
                    </h2>
                    <input 
                        type="text"
                        placeholder="닉네임 입력"
                        value={nicknameInput}
                        onChange={(e) => setNicknameInput(e.target.value)}
                        className={styles.input}
                    />
                    <button className={styles.loginBtn} onClick={handleSubmit}>
                        설정 완료
                    </button>
                </div>
            </div>
        </>
    )
}

export default SetFirstNickname;