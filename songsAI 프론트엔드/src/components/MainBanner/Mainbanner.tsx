import { useEffect, useState } from "react"
import styles from "../../styles/MainBanner.module.css"
import { FaArrowRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/useAuthStore"

const phrases = [
    "오늘 기분은 어떤가요...",
    "오늘 들리고 싶은 음악은?",
    "오늘 감정을 한 줄로 표현해보세요.",
    "오늘 하루를 음악으로 기록해요.",
]

const MainBanner = () => {

    const [placeholder, setPlaceholder] = useState(phrases[0]);
    const [index, setIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");

    const navigate = useNavigate();
    const {accessToken} = useAuthStore();

    const isLogin = !!accessToken;

    const handleClick = () => {

        if(!isLogin){
            alert("로그인이 필요한 서비스입니다.");
            navigate("/signup");
            return;
        }

        navigate("/EmotionDiaryPage",{
            state: {
                openModal: true,
                content: inputValue
            }
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % phrases.length);
            setPlaceholder(phrases[(index + 1) % phrases.length]);
        }, 3000); // 3초마다 바꿈

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setPlaceholder(phrases[index]);
    }, [index]);

    return(
        <div className={styles.banner}>
            <h2>내 감정과 함께하는</h2>
            <h1>사운드트랙</h1>
            <p>하루하루 기록한 감정이 나만의 음악이 되다</p>

            <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
            />

            <button onClick={handleClick}>일기 쓰고 AI 음악 추천받기
                <FaArrowRight className={styles.icon}/>
            </button>
        </div>
    )
}

export default MainBanner;