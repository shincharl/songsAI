import { useNavigate } from "react-router-dom";
import styles from "../../styles/EmotionPlaylistCard.module.css";

const EmotionPlaylistCard = () => {
    const navigate = useNavigate();

    return(
        <section className={styles.card}>
            <div className={styles.textBox}>
                <span className={styles.label}>AI가 만들어주는</span>
                <h2>나만의 감정 플레이리스트</h2>
                <p>지금 내 감정에 딱 맞는 음악을 들어보세요.</p>

                <button
                    className={styles.button}
                    onClick={() => navigate("/PlayListPage")}
                >
                    플레이리스트 듣기 →
                </button>
            </div>

            <div className={styles.iconBox}>🎵</div>
        </section>
    );
};

export default EmotionPlaylistCard;