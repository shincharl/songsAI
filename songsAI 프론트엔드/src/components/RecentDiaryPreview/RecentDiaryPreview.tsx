import { useEffect, useState } from "react";
import styles from "../../styles/RecentDiaryPreview.module.css";
import { useAuthStore } from "../../store/useAuthStore";
import { getRecentDiaries, type RecentDiaryResponse } from "../../api/diaryHistory";
import { useNavigate } from "react-router-dom";

type DisplayDiary = {
  id: number;
  emoji: string;
  title: string;
  content: string;
  date: string;
  emotion: string;
};

const mockDiaries: DisplayDiary[] = [
  {
    id: 1,
    emoji: "😊",
    title: "기분이 정말 좋았던 하루!",
    content: "오늘은 오랜만에 친구를 만나서 정말 즐거웠다. 이런 날씨처럼 내 마음도 맑음 ☀️",
    date: "2026.05.20",
    emotion: "행복",
  },
  {
    id: 2,
    emoji: "🌿",
    title: "조용히 나를 돌아본 시간",
    content: "혼자 카페에 앉아 생각을 정리했다. 복잡했던 마음이 조금은 차분해졌다.",
    date: "2026.05.19",
    emotion: "차분",
  },
  {
    id: 3,
    emoji: "🥲",
    title: "괜히 울적했던 하루",
    content: "별일은 없었지만 기분이 조금 가라앉았다. 이런 날도 있지 하고 넘겨본다.",
    date: "2026.05.18",
    emotion: "슬픔",
  },
];

const emotionMap: Record<string, { emoji: string; label: string }> = {
  HAPPY: { emoji: "😊", label: "행복" },
  CALM: { emoji: "🌿", label: "차분" },
  SAD: { emoji: "🥲", label: "슬픔" },
  ANGRY: { emoji: "😡", label: "분노" },
  EXCITED: { emoji: "💕", label: "설렘" },
  NEUTRAL: { emoji: "😐", label: "보통" },
};

const RecentDiaryPreview = () => {

    const [diaries, setDiaries] = useState<DisplayDiary[]>([]);
    const [loading, setLoading] = useState(false);

    const { accessToken } = useAuthStore();
    const isLogin = !!accessToken;

    const displayDiaries = isLogin ? diaries : mockDiaries;

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const data = await getRecentDiaries();

                const convertedDiaries: DisplayDiary[] = data.map(
                    (diary: RecentDiaryResponse) => {
                        const emotion = 
                            emotionMap[diary.topEmotion ?? "NEUTRAL"] ?? emotionMap.NEUTRAL;

                        return {
                            id: diary.diaryId,
                            emoji: emotion.emoji,
                            title:
                                diary.content.length > 24
                                ? `${diary.content.slice(0,24)}...`
                                : diary.content,
                            content: diary.content,
                            date: diary.createdAt?.slice(0, 10),
                            emotion: emotion.label,
                        };
                    },
                );

                setDiaries(convertedDiaries);
            } catch (error) {
                console.error("최근 일기 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isLogin, accessToken]);

    return(
        <section className={styles.section}>
            <div className={styles.header}>
                <h2>최근 감정 일기</h2>

                <button 
                    className={styles.moreButton}
                    onClick={() => navigate("/DiaryHistoryPage")}
                >
                    더보기 ›
                </button>
            </div>

        <div className={styles.list}>
            {loading && <p className={styles.empty}>최근 일기를 불러오는 중이에요...</p>}

            {!loading && isLogin && diaries.length === 0 && (
                <p className={styles.empty}>아직 작성한 감정 일기가 없어요 ✍️</p>
            )}

            {!loading &&
                displayDiaries.map((diary) => (
                <article key={`${diary.id}-${diary.date}`} className={styles.item}>
                    <div className={styles.emoji}>{diary.emoji}</div>

                    <div className={styles.contentBox}>
                    <strong className={styles.title}>{diary.title}</strong>
                    <p className={styles.content}>{diary.content}</p>
                    </div>

                    <div className={styles.right}>
                    <span className={styles.date}>{diary.date}</span>
                    <span className={styles.badge}>{diary.emotion}</span>
        </div>
      </article>
    ))}
</div>
        </section>
    );
};

export default RecentDiaryPreview;