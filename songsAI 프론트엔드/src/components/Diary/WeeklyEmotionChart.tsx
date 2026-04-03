import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/WeeklyEmotionChart.module.css"

export interface EmotionItem {
    emotion: string;
    score: number;
}

interface Props {
    data: EmotionItem[];
    title?: string;
}

const emotionLabelMap: Record<string, string> = {
    HAPPY: "행복",
    SAD: "슬픔",
    ANGRY: "화남",
    CALM: "평온",
    EXCITED: "신남",
    NEUTRAL: "보통",
};

const emotionEmojiMap: Record<string, string> = {
    HAPPY: "😊",
    SAD: "😢",
    ANGRY: "😠",
    CALM: "😌",
    EXCITED: "🤩",
    NEUTRAL: "🙂",
};

const WeeklyEmotionChart = ({
    data, 
    title = "AI가 분석한 7일치 감정 비율 (한눈에 보기)",
}: Props) => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimated(true);
        }, 150);

        return () => clearTimeout(timer);
    }, []);

    const chartData = useMemo(() => {
        const total = data.reduce((sum, item) => sum + item.score, 0);

        return data.map((item)=> ({
            ...item,
            percent: total === 0 ? 0 : Number(((item.score / total) * 100).toFixed(1)),
            label: emotionLabelMap[item.emotion] || item.emotion,
            emoji: emotionEmojiMap[item.emotion] || "✨",
        }));

    }, [data]);

    // 내림차순 정렬 후 가장 높은 감정 출력
    const dominatEmotion = chartData
        .slice()
        .sort((a,b) => b.score - a.score)[0] || null;

    return(
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                {dominatEmotion && (
                    <div className={styles.badge}>
                        대표 감정 {dominatEmotion.emoji} {dominatEmotion.label}
                    </div>
                )}
            </div>

            <div className={styles.chatCard}>
                {chartData.map((item) => (
                    <div key={item.emotion} className={styles.row}>
                        <div className={styles.labelBox}>
                            <span className={styles.emoji}>{item.emoji}</span>
                            <span className={styles.label}>{item.label}</span>
                        </div>

                        <div className={styles.barTrack}>
                            <div
                                className={styles.barFill}
                                style={{
                                    width: animated ? `${item.percent}%` : "0%",
                                }}
                            />
                        </div>

                        <div className={styles.valueBox}>
                            <span className={styles.percent}>{item.percent}%</span>
                            <span className={styles.score}>{item.score.toFixed(1)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default WeeklyEmotionChart;