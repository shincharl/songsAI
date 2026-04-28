import { useEffect, useState } from "react";
import DiaryBanner from "../../components/Diary/DiaryBanner";
import styles from "../../styles/EmotionDiaryPage.module.css";
import WriteDiaryModal from "../../components/Diary/WriteDiaryModal";
import WeeklyEmotionChart, { type EmotionItem } from "../../components/Diary/WeeklyEmotionChart";
import { getMonthlyCalendar, getRecommendedMusic, getTodayDiaryPreview, getWeeklyEmotions, getDayEmotionTrend, type YoutubeVideoItem, type WeeklyEmotionPoint, getWeeklyInsight } from "../../api/diary";
import DiaryPreviewCard from "../../components/Diary/DiaryPreviewCard";
import EmotionCalendar from "../../components/Diary/EmotionCalendar";
import RecommendedMusicPlayer from "../../components/Diary/RecommendedMusicPlayer";
import FloatingPlayList from "../../components/Diary/FloatingPlaylist";
import DayEmotionChart from "../../components/Diary/DayEmotionChart";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

interface DiaryCalendarItem {
  diaryId: number;
  date: string;
  preview: string;
  topEmotion: string | null;
  topEmotionScore: number | null;
}

const mockWeeklyEmotions = [
  { emotion: "HAPPY", score: 42 },
  { emotion: "CALM", score: 28 },
  { emotion: "SAD", score: 15 },
  { emotion: "ANGRY", score: 10 },
  { emotion: "EXCITED", score: 25 },
  { emotion: "NEUTRAL", score: 18 },
];

const mockDiaryContent =
  "오늘은 조금 지쳤지만 좋아하는 음악을 들으면서 마음이 한결 편해졌다.";

const mockDayEmotionData = [
  { day: "월", score: 3.2, emoji: "😌", label: "평온", date: "4월 20일" },
  { day: "화", score: 4.1, emoji: "😊", label: "좋음", date: "4월 21일" },
  { day: "수", score: 2.6, emoji: "😢", label: "조금 다운", date: "4월 22일" },
  { day: "목", score: 4.5, emoji: "🤩", label: "신남", date: "4월 23일" },
  { day: "금", score: 3.8, emoji: "🙂", label: "보통", date: "4월 24일" },
  { day: "토", score: 4.7, emoji: "😊", label: "매우 좋음", date: "4월 25일" },
  { day: "일", score: 3.5, emoji: "😌", label: "평온", date: "4월 26일" },
];

const mockCalendar = [
  { date: "2026-04-01", diaryId: 1, preview: "기분 좋음", topEmotion: "HAPPY", topEmotionScore: 0.8 },
  { date: "2026-04-02", diaryId: 2, preview: "조금 우울", topEmotion: "SAD", topEmotionScore: 0.6 },
];

const mockMusicVideos = [
  {
    videoId: "60ItHLz5WEA",
    title: "Alan Walker - Faded",
    channelTitle: "Alan Walker",
    thumbnailUrl: "https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg",
  },
  {
    videoId: "RgKAFK5djSk",
    title: "Wiz Khalifa - See You Again ft. Charlie Puth",
    channelTitle: "Wiz Khalifa",
    thumbnailUrl: "https://i.ytimg.com/vi/RgKAFK5djSk/hqdefault.jpg",
  },
  {
    videoId: "ktvTqknDobU",
    title: "Imagine Dragons - Radioactive",
    channelTitle: "ImagineDragons",
    thumbnailUrl: "https://i.ytimg.com/vi/ktvTqknDobU/hqdefault.jpg",
  },
  {
    videoId: "2Vv-BfVoq4g",
    title: "Ed Sheeran - Perfect",
    channelTitle: "Ed Sheeran",
    thumbnailUrl: "https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg",
  },
  {
    videoId: "3JZ4pnNtyxQ",
    title: "Mark Ronson - Uptown Funk ft. Bruno Mars",
    channelTitle: "Mark Ronson",
    thumbnailUrl: "https://i.ytimg.com/vi/3JZ4pnNtyxQ/hqdefault.jpg",
  },
  {
    videoId: "9bZkp7q19f0",
    title: "PSY - GANGNAM STYLE",
    channelTitle: "officialpsy",
    thumbnailUrl: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
  },
  {
    videoId: "hHW1oY26kxQ",
    title: "잔잔한 발라드 모음 - 하루 마무리 플레이리스트",
    channelTitle: "Kpop Ballad",
    thumbnailUrl: "https://i.ytimg.com/vi/hHW1oY26kxQ/hqdefault.jpg",
  },
  {
    videoId: "DWcJFNfaw9c",
    title: "감성 인디 음악 모음 (한국 인디)",
    channelTitle: "K-Indie",
    thumbnailUrl: "https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg",
  },
  {
    videoId: "jfKfPfyJRdk",
    title: "lofi hip hop radio - relax/study music",
    channelTitle: "Lofi Girl",
    thumbnailUrl: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
  },
  {
    videoId: "5qap5aO4i9A",
    title: "chill lofi beats to relax",
    channelTitle: "Lofi Girl",
    thumbnailUrl: "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg",
  },
];

const EmotionDiaryPage = () => {

  const location = useLocation();

  const { accessToken } = useAuthStore();
  const isLogin = !!accessToken;

  const [openModal, setOpenModal] = useState(false);
  const [initialContent, setInitialContent] = useState("");

  const [chartData, setChartData] = useState<EmotionItem[]>([]);
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

  const [dayEmotionData, setDayEmotionData] = useState<WeeklyEmotionPoint[]>([]);
  const [dayEmotionLoading, setDayEmotionLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);


  const [weeklyInsight, setWeeklyInsight] = useState("감정 흐름을 분석 중이에요...");

  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModal]);

  useEffect(() => {
    if (!isLogin){
      setChartData(mockWeeklyEmotions);
      setDiaryContent(mockDiaryContent);
      setDiaryStickers([]);
      setTodayDiaryId(null);

      setDayEmotionData(mockDayEmotionData);
      setWeeklyInsight("이번 주는 차분함과 설렘이 함께 흐르고 있어요.");

      setMusicVideos(mockMusicVideos);
      setMusicMoodTitle("차분한 하루를 위한 플레이리스트");
      setMusicMoodDesc("오늘의 분위기에 어울리는 편안한 음악을 준비했어요.");
      setSelectedVideoId(mockMusicVideos[0].videoId);

      setLoading(false);
      setPreviewLoading(false);
      setDayEmotionLoading(false);
      setMusicLoading(false);
      return;
    }

    fetchWeeklyEmotionData();
    fetchTodayDiaryPreview();
    fetchDayEmotionTrend();
    fetchWeeklyInsight();
  }, [isLogin]);

  useEffect(() => {

    if (!isLogin) {
      setCalendarData(mockCalendar);
      setCalendarLoading(false);
      return;
    }

    fetchMonthlyCalendar(selectedDate);
  }, [selectedDate.getFullYear(), selectedDate.getMonth(), isLogin]);

  useEffect(() => {
    if (!isLogin) return;

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
  }, [todayDiaryId, isLogin]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.openModal){
      setOpenModal(true);

      if (location.state.content){
        setInitialContent(location.state.content);
      }

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 주간 감정 데이터 조회 fetch
  const fetchWeeklyEmotionData = async() => {
    try {
        setLoading(true);
        const data = await getWeeklyEmotions();
        setChartData(
          data.map((item) => ({
            emotion: item.emotion,
            score: item.score ?? 0,
          }))
        );
    } catch (error) {
        console.error("주간 감정 데이터 조회 실패:", error);
        setChartData([]);
    }finally {
        setLoading(false);
    }
  };

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

  // 7일 감정 데이터 추출
  const fetchDayEmotionTrend = async () => {
    try {
      setDayEmotionLoading(true);
      const data = await getDayEmotionTrend();
      setDayEmotionData(data);
    } catch (error) {
      console.log("7일 감정 추이 조회 실패:", error);
      setDayEmotionData([]);
    } finally {
      setDayEmotionLoading(false);
    }
  }

  // 7일 감정 데이터 AI 분석 데이터 추가
  const fetchWeeklyInsight = async () => {
    try {
      const data = await getWeeklyInsight();
      setWeeklyInsight(data.insight);
    } catch (error) {
      console.error("주간 인사이트 조회 실패:", error);
      setWeeklyInsight("최근 감정 흐름을 차분히 살펴봤어요.");
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
            <h3 className={styles.sectionTitle}> 감정 한눈에 보기</h3>
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

          <div className={styles.calendarWrapper}>
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

        <div className={styles.dayChartCard}>
          {dayEmotionLoading ? (
            <p>7일 감정 그래프 불러오는 중...</p>
          ):(
            <DayEmotionChart
              data={dayEmotionData}
              insight={weeklyInsight}
            />
          )}
        </div>
          </div>

      </section>
      </main>

      {(isMobile || !isOpen) && (
        <button
          className={styles.floatingButton}
          onClick={() => setIsOpen(true)}
        >
          🎵
        </button>
      )}

      {isOpen && !isMobile && (
        <div className={styles.playlistWrapper}>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
          >
            ✖
          </button>

          <div className={styles.playlistScroll}>
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
          </div>
        </div>
      )}

      {openModal && (
        <WriteDiaryModal 
          onClose={() => {
            setOpenModal(false);
            
            fetchTodayDiaryPreview();
            fetchWeeklyEmotionData();
            fetchDayEmotionTrend();
            fetchWeeklyInsight();
            fetchMonthlyCalendar(selectedDate);
          }}
          initialContent = {initialContent}  
        />
      )}
    </div>
  );
};

export default EmotionDiaryPage;