import { useEffect, useState } from "react";
import DiaryBanner from "../../components/Diary/DiaryBanner";
import styles from "../../styles/EmotionDiaryPage.module.css";
import WriteDiaryModal from "../../components/Diary/WriteDiaryModal";
import WeeklyEmotionChart from "../../components/Diary/WeeklyEmotionChart";
import { getMonthlyCalendar, getTodayDiaryPreview, getWeeklyEmotions } from "../../api/diary";
import DiaryPreviewCard from "../../components/Diary/DiaryPreviewCard";
import EmotionCalendar from "../../components/Diary/EmotionCalendar";

// const mockData = [
//   { emotion: "HAPPY", score: 86.0 },
//   { emotion: "SAD", score: 51.1 },
//   { emotion: "EXCITED", score: 35.5 },
//   { emotion: "CALM", score: 21.5 },
//   { emotion: "ANGRY", score: 6.0 },
//   { emotion: "NEUTRAL", score: 0.0 },
// ];

// const diaryContent = "오늘은 조금 지쳤지만, 그래도 나름 괜찮은 하루였다.";

interface DiaryCalendarItem {
  diaryId: number;
  date: string;
  preview: string;
  topEmotion: string | null;
  topEmotionScore: number | null;
}

const EmotionDiaryPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [diaryContent, setDiaryContent] = useState("");
  const [diaryStickers, setDiaryStickers] = useState<string[]>([]);
  const [previewLoading, setPreviewLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [calendarData, setCalendarData] = useState<DiaryCalendarItem[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModal]);

  useEffect(() => {
    fetchWeeklyEmotionData();
    fetchTodayDiaryPreview();
  }, []);

  useEffect(() => {
    fetchMonthlyCalendar(selectedDate);
  }, [selectedDate]);

  // 주간 감정 데이터 조회 fetch
  const fetchWeeklyEmotionData = async() => {
    try {
        setLoading(true);
        const data = await getWeeklyEmotions();
        setChartData(data);
    } catch (error) {
        console.error("주간 감정 데이터 조회 실패:", error);
        setChartData([]);
    }finally {
        setLoading(false);
    }
  }

  // 오늘 일기 preview fetch
  const fetchTodayDiaryPreview = async () => {
    try {
        setPreviewLoading(true);
        const data = await getTodayDiaryPreview();

        setDiaryContent(data.content || "");
        setDiaryStickers(data.stickers || []);
    } catch (error) {
        console.log("오늘 일기 미리보기 조회 실패:", error);
        setDiaryContent("");
        setDiaryStickers([]);
    } finally {
        setPreviewLoading(false);
    }
  }

  // 월별 캘린더 각각 요일별 일기 상태 조회 fetch
  const fetchMonthlyCalendar = async (date: Date) => {
    try {
      setCalendarLoading(true);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const res = await getMonthlyCalendar(year, month);
      setCalendarData(res.data);
    } catch (error) {
      console.error("월별 캘린더 조회 실패:", error);
      setCalendarData([]);
    } finally {
      setCalendarLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.bannerWrapper}>
        <DiaryBanner />
      </div>

      <main className={styles.mainContent}>
        <section className={styles.heroCard}>
          <div className={styles.heroText}>
            <p className={styles.badge}>AI 감정 기록</p>
            <h2 className={styles.writeTitle}>오늘의 감정을 기록해볼까요?</h2>
            <p className={styles.description}>
              하루를 짧게 남기면 AI가 감정을 분석하고,
              이번 주 감정 흐름을 한눈에 보여드려요.
            </p>

            <div className={styles.buttonGroup}>
              <button
                className={styles.writeButton}
                onClick={() => setOpenModal(true)}
              >
                감정일기 쓰러가기
              </button>
            </div>
          </div>

          <DiaryPreviewCard
            content={previewLoading ? "불러오는 중..." : diaryContent}
            stickers={previewLoading ? [] : diaryStickers}
          />
        </section>

        <section className={styles.chartSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>이번 주 감정 한눈에 보기</h3>
            <p className={styles.sectionDesc}>
              최근 감정 분포를 그래프로 확인해보세요.
            </p>
          </div>

          <div className={styles.chartCard}>
            {loading ? (
                <p>불러오는 중...</p>
            ): (
                <WeeklyEmotionChart data={chartData} />
            )}
          </div>
        </section>
      </main>

      {openModal && (
        <WriteDiaryModal onClose={() => setOpenModal(false)} />
      )}

      <section className={styles.calendarSection}>
          <div className={styles.calendarHeader}>
            <h3 className={styles.calendarTitle}>감정 달력</h3>
            <p className={styles.calendarDesc}>
              날짜를 눌러 그날의 감정 기록을 확인해보세요.
            </p>
          </div>

          <div className={styles.calendarCard}>
           {calendarLoading ? (
            <p>달력 불러오는 중...</p>
           ) : (
            <EmotionCalendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              calendarData={calendarData}
            />
           )}
        </div>
      </section>

    </div>
  );
};

export default EmotionDiaryPage;