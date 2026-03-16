import { useEffect, useState } from "react";
import DiaryBanner from "../../components/Diary/DiaryBanner";
import styles from "../../styles/EmotionDiaryPage.module.css";
import WriteDiaryModal from "../../components/Diary/WriteDiaryModal";
import WeeklyEmotionChart from "../../components/Diary/WeeklyEmotionChart";
import { getMonthlyCalendar, getRecommendedMusic, getTodayDiaryPreview, getWeeklyEmotions, type YoutubeVideoItem } from "../../api/diary";
import DiaryPreviewCard from "../../components/Diary/DiaryPreviewCard";
import EmotionCalendar from "../../components/Diary/EmotionCalendar";
import RecommendedMusicPlayer from "../../components/Diary/RecommendedMusicPlayer";
import FloatingPlayList from "../../components/Diary/FloatingPlaylist";

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

  const [todayDiaryId, setTodayDiaryId] = useState<number | null>(null);
  const [musicVideos, setMusicVideos] = useState<YoutubeVideoItem[]>([]);
  const [musicMoodTitle, setMusicMoodTitle] = useState("");
  const [musicMoodDesc, setMusicMoodDesc] = useState("");
  const [musicLoading, setMusicLoading] = useState(true);

  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

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
  }, [selectedDate.getFullYear(), selectedDate.getMonth()]);

  useEffect(() => {
    const fetchMusicRecommendation = async () => {
      if (!todayDiaryId) {
        setMusicVideos([]);
        setMusicMoodTitle("");
        setMusicMoodDesc("");
        setSelectedVideoId(null);
        setMusicLoading(false);
        return;
      }

      try {
        setMusicLoading(true);
        console.log("todayDiaryId:", todayDiaryId);

        const data = await getRecommendedMusic(todayDiaryId);
        console.log("추천 음악 응답:", data);

        const videos = data.videos || [];

        setMusicVideos(videos);
        setMusicMoodTitle(data.moodTitle || "");
        setMusicMoodDesc(data.moodDesc || "");
        setSelectedVideoId(videos[0]?.videoId ?? null);
      } catch (error) {
        console.error("추천 음악 조회 실패:", error);
        setMusicVideos([]);
        setMusicMoodTitle("");
        setMusicMoodDesc("");
        setSelectedVideoId(null);
      }finally {
        setMusicLoading(false);
      }
    };

    fetchMusicRecommendation();
  }, [todayDiaryId]);

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

        console.log("today preview 응답:", data);

        setTodayDiaryId(data.diaryId ?? null);
        setDiaryContent(data.content || "");
        setDiaryStickers(data.stickers || []);
    } catch (error) {
        console.log("오늘 일기 미리보기 조회 실패:", error);
        setTodayDiaryId(null);
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

        <section className={styles.musicSection}>
          <div className={styles.musicHeader}>
            <h3 className={styles.sectionTitle}>오늘 감정에 어울리는 음악</h3>
            <p className={styles.sectionDesc}>
              AI가 오늘 일기 분위기를 바탕으로 추천한 유튜브 영상이에요.
            </p>
          </div>

          <div className={styles.musicCard}>
            <div className={styles.musicMoodBox}>
              <span className={styles.musicBadge}>AI 추천</span>
              <h4 className={styles.musicMoodTitle}>
                {musicMoodTitle || "추천 준비 중"}
              </h4>
              <p className={styles.musicMoodDesc}>
                {musicMoodDesc || "오늘 일기를 바탕으로 어울리는 음악을 추천하고 있어요."}
              </p>
            </div>

            {musicLoading ? (
              <p>추천 음악 불러오는 중...</p>
            ) : (
              <RecommendedMusicPlayer
              videos={musicVideos}
              selectedVideoId={selectedVideoId}
              onSelectVideo={setSelectedVideoId}
              title="추천 플레이리스트"
              subtitle="지금 감정과 잘 어울리는 영상 5개를 골라봤어요."
              />
            )}
          </div>
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

      </main>

      <FloatingPlayList
        videos={musicVideos.map((video, index) => ({
          id: video.videoId ?? String(index),
          title: video.title,
          channelTitle: video.channelTitle,
          thumbnailUrl:video.thumbnailUrl,
        }))}
        onVideoClick={(video) => {
          setSelectedVideoId(video.id);
        }}
      />

      {openModal && (
        <WriteDiaryModal onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default EmotionDiaryPage;