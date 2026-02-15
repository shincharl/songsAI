import { useEffect, useState } from "react"
import styles from "../../styles/MainBanner.module.css"
import { FaArrowRight } from "react-icons/fa"

const phrases = [
    "오늘 기분은 어떤가요...",
    "오늘 들리고 싶은 음악은?",
    "오늘 감정을 한 줄로 표현해보세요.",
    "오늘 하루를 음악으로 기록해요.",
]

const MainBanner = () => {

    const [placeholder, setPlaceholder] = useState(phrases[0]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % phrases.length);
            setPlaceholder(phrases[(index + 1) % phrases.length]);
        }, 3000); // 3초마다 바꿈

        return () => clearInterval(interval);
    }, [index]); 

    return(
        <div className={styles.banner}>
            <h2>내 감정과 함께하는</h2>
            <h1>사운드트랙</h1>
            <p>하루하루 기록한 감정이 나만의 음악이 되다</p>
            {/* > 클릭하면 감정 일기 열고 해당 페이지 내용에 삽입 저장은 아직 안됨
                로그인 하지 않았다면 로그인 해야한다고 로그인창으로 이동    
            */}
            <input type="text" placeholder={placeholder} />
            <button>일기 쓰고 AI 음악 추천받기
                <FaArrowRight className={styles.icon}/>
            </button>
        </div>
    )
}

export default MainBanner;