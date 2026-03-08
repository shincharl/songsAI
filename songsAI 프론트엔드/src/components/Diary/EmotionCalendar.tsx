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

const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const EmotionCalendar = ({selectedDate, onDateChange, calendarData,}: Props) => {
    
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
                            <div className={styles.previewText}>{diary.preview}</div>
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default EmotionCalendar;