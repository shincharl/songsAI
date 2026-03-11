import { Calendar } from "react-calendar";
import styles from "../../styles/EmotionCalendar.module.css";

interface DiaryCalendarItem {
    diaryId: number;
    date: string;
    preview: string;
    topEmotion: string | null;
    topEmotionScore: number | null;
}

interface Props {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    calendarData: DiaryCalendarItem[];
}

const emotionStickerMap: Record<string, string> = {
  HAPPY: "😊",
  SAD: "😢",
  ANGRY: "😡",
  EXCITED: "😍",
  CALM: "😌",
  NEUTRAL: "🙂",
};

const emotionStyleMap: Record<string, string> = {
  HAPPY: styles.happyCard,
  SAD: styles.sadCard,
  ANGRY: styles.angryCard,
  EXCITED: styles.excitedCard,
  CALM: styles.calmCard,
  NEUTRAL: styles.neutralCard,
};

const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const EmotionCalendar = ({
    selectedDate, 
    onDateChange, 
    calendarData,
}: Props) => {
    
    const selectedPreview = calendarData.find(
        (item) => item.date === formatDateLocal(selectedDate)
    );

    return(
        <div className={styles.calendarWrapper}>
            <Calendar
                onChange={(value) => onDateChange(value as Date)}
                value={selectedDate}
                locale="ko-KR"
                formatDay={(_, date) => String(date.getDate())}
                tileContent={({date, view}) => {
                    if (view !== "month") return null;

                    const diary = calendarData.find(
                        (item) => item.date === formatDateLocal(date)
                    );

                    if (!diary) return null;

                    return (
                        <div className={styles.tileContent}>
                            <div className={styles.emotionSticker}>
                                {diary.topEmotion
                                    ? emotionStickerMap[diary.topEmotion] ?? ""
                                    : ""}
                            </div>
                        </div>
                    );
                }}
            />

            {selectedPreview ? (
            <div
                className={`${styles.previewBox} ${
                selectedPreview.topEmotion
                    ? emotionStyleMap[selectedPreview.topEmotion]
                    : styles.neutralCard
                }`}
            >
                <div className={styles.previewHeader}>
                <div className={styles.previewHeaderLeft}>
                    <div className={styles.previewEmoji}>
                    {selectedPreview.topEmotion
                        ? emotionStickerMap[selectedPreview.topEmotion] ?? "📝"
                        : "📝"}
                    </div>

                    <div className={styles.previewDateGroup}>
                    <span className={styles.previewLabel}>Diary Preview</span>
                    <span className={styles.previewDate}>{selectedPreview.date}</span>
                    </div>
                </div>

                <div className={styles.previewBadge}>선택한 날짜</div>
                </div>

                <div className={styles.previewText}>{selectedPreview.preview}</div>
            </div>
            ) : (
            <div className={`${styles.previewBox} ${styles.neutralCard}`}>
                <div className={styles.emptyText}>이 날짜에는 작성된 일기가 없어요.</div>
            </div>
            )}
        </div>
    );
};

export default EmotionCalendar;