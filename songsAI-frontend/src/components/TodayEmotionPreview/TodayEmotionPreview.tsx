import { useEffect, useState } from "react";
import styles from "../../styles/TodayEmotionPreview.module.css"
import { useAuthStore } from "../../store/useAuthStore";
import { getWeeklyEmotions, type EmotionType } from "../../api/diary";

type EmotionItem = {
    id: number,
    emoji: string,
    label: string,
    value: number,
    color: string,
};

const initialEmotions: EmotionItem[] = [
  { id: 1, emoji: "😊", label: "행복", value: 42, color: "#ffc83d" },
  { id: 2, emoji: "🌿", label: "차분", value: 28, color: "#7bdc8a" },
  { id: 3, emoji: "🥲", label: "슬픔", value: 15, color: "#7aa7ff" },
  { id: 4, emoji: "😡", label: "분노", value: 10, color: "#ff6b6b" },
  { id: 5, emoji: "💕", label: "설렘", value: 20, color: "#ff9fbc" },
  { id: 6, emoji: "😐", label: "보통", value: 8, color: "#a5a6ff" },
];


const TodayEmotionPreview = () => {

    const [emotions, setEmotions] = useState<EmotionItem[]>(initialEmotions);

    const [showAll, setShowAll] = useState(false);
    const { accessToken } = useAuthStore();
    const isLogin = !!accessToken;

    useEffect(() => {
        if (!isLogin) return;

        const fetchEmotions = async () => {
            try {
                  console.log("isLogin:", isLogin);
                  console.log("accessToken:", accessToken);
                
                  const data = await getWeeklyEmotions();
                  console.log("weekly emotions:", data);

                  const total = data.reduce((sum, item) => sum + item.score, 0);

                  const findValue = (type: EmotionType) => {
                    const value = data.find((item) => item.emotion === type)?.score ?? 0;

                  return total > 0 ? Math.round((value / total) * 100) : 0;
            };

            const emotionList: EmotionItem[] = [
                { id: 1, emoji: "😊", label: "행복", value: findValue("HAPPY"), color: "#ffc83d" },
                { id: 2, emoji: "🌿", label: "차분", value: findValue("CALM"), color: "#7bdc8a" },
                { id: 3, emoji: "🥲", label: "슬픔", value: findValue("SAD"), color: "#7aa7ff" },
                { id: 4, emoji: "😡", label: "분노", value: findValue("ANGRY"), color: "#ff6b6b" },
                { id: 5, emoji: "💕", label: "설렘", value: findValue("EXCITED"), color: "#ff9fbc" },
                { id: 6, emoji: "😐", label: "보통", value: findValue("NEUTRAL"), color: "#a5a6ff" },
            ];

            setEmotions(
                emotionList.sort((a, b) => b.value - a.value),
            );

            } catch (error) {
                console.error("감정 데이터 불러오기 실패:", error);
            }
        };

        fetchEmotions();
    }, [isLogin, accessToken]);

    useEffect(() => {
        if(isLogin) return;

        const timer = setInterval(() => {
            setEmotions((prev) =>
                prev.map((emotion) => ({
                    ...emotion,
                    value: Math.floor(Math.random() * 45) + 8,
                })),
            );
        }, 2500);

        return () => clearInterval(timer);
    }, [isLogin]);

    const visibleEmotions = showAll ? emotions : emotions.slice(0, 4);

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div>
                    <h2>오늘의 감정 한눈에 보기</h2>
                    <p>매일 기록하는 감정의 흐름을 확인해보세요.</p>
                </div>

                <button 
                    className={styles.moreButton}
                    onClick={() => setShowAll((prev) => !prev)}
                    >
                       {showAll ? "접기 ›" : "더보기 ›"}
                </button>
            </div>

            <div className={styles.cardList}>
                {visibleEmotions.map((emotion) => (
                    <article key={emotion.id} className={styles.card}>
                        <div className={styles.top}>
                            <span className={styles.emoji}>{emotion.emoji}</span>
                            <span className={styles.label}>{emotion.label}</span>
                        </div>

                        <strong className={styles.percent}>{emotion.value}%</strong>

                        <div className={styles.barTrack}>
                            <div 
                                className={styles.bar}
                                style={{
                                    width: `${emotion.value}%`,
                                    backgroundColor: emotion.color,
                                }}
                            />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default TodayEmotionPreview;