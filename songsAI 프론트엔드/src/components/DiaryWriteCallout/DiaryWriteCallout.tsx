import { useNavigate } from "react-router-dom";
import styles from "../../styles/DiaryWriteCallout.module.css";


const DiaryWriteCallout = () => {
    const navigate = useNavigate();

    return(
        <section className={styles.callout}>
            <div className={styles.iconBox}>✦</div>

            <div className={styles.textBox}>
                <h2>매일 기록하고, 내 마음의 변화를 살펴보세요.</h2>
                <p>꾸준한 기록이 더 나은 나를 만들어줍니다.</p>
            </div>

            <button
                className={styles.button}
                onClick={() => navigate("/EmotionDiaryPage")}
            >
                감정 일기 쓰러 가기 →
            </button>
        </section>
    );
}

export default DiaryWriteCallout;