import { useEffect, useState } from "react";
import { sendEmailApi, verifyEmailApi } from "../../api/emailApi";
import styles from "../../styles/EmailVerification.module.css"

interface Props {
    email: string;
    setEmail: (email: string) => void;
    onVerified: () => void;
}

const EmailVerification: React.FC<Props> = ({email, setEmail, onVerified}) => {

    const [emailSent, setEmailSent] = useState(false); // 인증받은 전송 여부
    const [emailVerified, setEmailVerified] = useState(false); // 인증 성공 여부
    const [authCode, setAuthCode] = useState(""); // 입력받는 인증번호
    const [loading, setLoading] = useState(false);

    const [timeLeft, setTimeLeft] = useState(180);
    const [timerKey, setTimerKey] = useState(0);

    // 타이머 완료 시 버튼 막기

    const isExpired = timeLeft === 0;

    useEffect(() => {
        if(!emailSent || emailVerified) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if(prev <= 1){
                    clearInterval(timer);
                    alert("인증 시간이 만료되었습니다.");
                    return 0;
                }
                return prev - 1;
            })
        }, 1000);

        return () => clearInterval(timer);
    }, [emailSent, emailVerified, timerKey]);

    // 인증번호 전송
    const handleSendEmail = async () => {
        if (!email) return alert("이메일을 입력해주세요.");
        setLoading(true);
        try {
            await sendEmailApi(email);
            alert("인증번호가 전송되었습니다.");
            setEmailSent(true);
            setEmailVerified(false);
            setTimeLeft(180); // 타이머 리셋

            setTimerKey(prev => prev + 1);

        } catch (err) {
            console.error(err);
            alert("인증번호 전송 실패");
        } finally {
            setLoading(false);
        }
    };

    // 인증번호 확인
    const handleVerifyEmail = async () => {
        if(!authCode) return alert("인증번호를 입력해주세요.");
        setLoading(true);
        try {
            await verifyEmailApi({email, code: authCode});
            alert("이메일 인증 완료!");
            setEmailVerified(true);
            onVerified(); // 부모 컴포넌트(Register)에게 인증 완료 상태 전달
        } catch (err) {
            console.error(err);
            alert("인증번호가 올바르지 않습니다.");
        } finally {
            setLoading(false);
         }
    }

    return (
        <div>
            {/* 이메일 입력 */}
            <input 
                   className={styles.input}
                   type="email"
                   placeholder="이메일 입력"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   disabled={emailSent} // 인증번호 전송 후 변경 못하게
                />

            {/* 인증번호 전송 버튼 */}
            {!emailSent && (
                <button
                    className={`${styles.button} ${styles.sendBtn}`} 
                    onClick={handleSendEmail} disabled={loading}>
                    {loading ? "전송중..." : "인증번호 보내기"}
                </button>
            )}

            {/* 인증번호 입력 및 확인 버튼 */}
            {emailSent && !emailVerified && (
              <>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="인증번호 입력"
                    value={authCode}
                    onChange={e => setAuthCode(e.target.value)} 
                />
                <p className={`${styles.timer} ${isExpired ? styles.expired : ""}`}>
                    남은 시간:
                    <span> 
                        {Math.floor(timeLeft/60)}:
                        {(timeLeft%60).toString().padStart(2,"0")}
                    </span>
                </p>
                <button
                    className={`${styles.button} ${styles.verifyBtn} ${isExpired ? styles.disabled : ""}`} 
                    onClick={handleVerifyEmail} 
                    disabled={isExpired}
                    >
                    인증확인
                </button>

                    {isExpired && (
                        <button
                            className={styles.resend}
                            onClick={handleSendEmail}
                            >
                            인증번호 다시 보내기
                        </button>
                    )}
              </>
            )}

            {/* 인증 완료 메시지 */}
            {emailVerified && (
                <p className={styles.success}>이메일 인증 완료 ✔</p>
                )}
        </div>
    );
}

export default EmailVerification;