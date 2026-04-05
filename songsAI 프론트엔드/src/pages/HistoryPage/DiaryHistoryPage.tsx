import { useEffect, useRef, useState } from "react";
import styles from "../../styles/DiaryHistoryPage.module.css"
import { getDiaryDetail, getDiaryHistory } from "../../api/diaryHistory";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.module.css"
import DiarySearchBox from "../../components/DiaryHistory/DiarySearchBox";

type DiaryHistoryItem = {
    diaryId: number;
    date: string;
    topEmotion: string | null;
    preview: string;
};

type DiaryDetail = {
    diaryId: number;
    date: string;
    topEmotion: string | null;
    content: string;
};

const DiaryHistoryPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeFilter, setActiveFilter] = useState("전체");

    // input에 바로 바인딩되는 값
    const [searchInput, setSearchInput] = useState("");

    // 실제 서버 조회에 사용하는 검색어
    const [searchKeyword, setSearchKeyword] = useState("");

    const scrollRef = useRef<HTMLDivElement | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const [historyList, setHistoryList] = useState<DiaryHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedDiaryId, setSelectedDiaryId] = useState<number | null>(null);
    const [selectedDetail, setSelectedDiaryDetail] = useState<DiaryDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, [selectedDate, activeFilter, searchKeyword]);

    useEffect(() => {
        if (historyList.length > 0) {
            setSelectedDiaryId(historyList[0].diaryId);
        } else {
            setSelectedDiaryId(null);
            setSelectedDiaryDetail(null);
        }
    }, [historyList]);

    useEffect(() => {
        if (selectedDiaryId != null) {
            fetchDiaryDetail(selectedDiaryId);
        }
    }, [selectedDiaryId]);

    const fetchHistory = async () => {
        try {
            setLoading(true);

            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;

            const data = await getDiaryHistory({
                year,
                month,
                keyword: searchKeyword || null,
                emotion: emotionMap[activeFilter],
            });

            setHistoryList(data);

        } catch (error) {
            console.error("히스토리 조회 실패", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDiaryDetail = async (diaryId: number) => {
        try {
            setDetailLoading(true);
            const data = await getDiaryDetail(diaryId);
            setSelectedDiaryDetail(data);
        } catch (error) {
            console.error("상세 조회 실패", error);
            setSelectedDiaryDetail(null);
        } finally {
            setDetailLoading(false);
        }
    }

        const getEmotionLabel = (emotion: string | null) => {
            switch (emotion) {
                case "HAPPY":
                return "기쁨";
                case "SAD":
                return "슬픔";
                case "ANGRY":
                return "화남";
                case "EXCITED":
                return "설렘";
                case "CALM":
                return "편안함";
                case "NEUTRAL":
                default:
                return "보통";
            }
    };

        const getEmotionEmoji = (emotion: string | null) => {
            switch (emotion) {
                case "HAPPY":
                return "😊";
                case "SAD":
                return "😢";
                case "ANGRY":
                return "😡";
                case "EXCITED":
                return "😍";
                case "CALM":
                return "😌";
                case "NEUTRAL":
                default:
                return "🙂";
            }
    };

    const filters = ["전체", "기쁨", "슬픔", "화남", "설렘", "편안함", "보통"];

    const emotionMap: Record<string, string | null> = {
    전체: null,
    기쁨: "HAPPY",
    슬픔: "SAD",
    화남: "ANGRY",
    설렘: "EXCITED",
    편안함: "CALM",
    보통: "NEUTRAL",
    };

    const handleSearchSubmit = () => {
        setSearchKeyword(searchInput);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;

        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;

        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // 속도
        scrollRef.current.scrollLeft = scrollLeft - walk;
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return(
        <div className={styles.page}>
            {/* 상단 필터 바 */}
            <div className={styles.topBar}>
                
                {/* 왼쪽: 월 선택 */}
                <div className={styles.leftSection}>
                    
                    <div className={styles.datePickerWrapper}>
                        <span className={styles.calendarIcon}>📅</span>

                        <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date) => setSelectedDate(date)}
                        dateFormat="yyyy년 MM월"
                        showMonthYearPicker
                        className={styles.monthSelect}
                    />
                    </div>

                    {/* 감정 필터 */}
                    <div className={styles.filterGroup}
                         ref={scrollRef}
                         onMouseDown={handleMouseDown}
                         onMouseMove={handleMouseMove}
                         onMouseUp={handleMouseUp}
                         onMouseLeave={handleMouseUp}
                    >
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                className={`${styles.filterBtn} ${
                                    activeFilter === filter ? styles.active : ""
                                }`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter === "기쁨" && "😊 "}
                                {filter === "슬픔" && "😢 "}
                                {filter === "화남" && "😡 "}
                                {filter === "설렘" && "😍 "}
                                {filter === "편안함" && "😌 "}
                                {filter === "보통" && "🙂 "}
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 오른쪽: 검색 */}
                <div className={styles.rightSection}>
                    <DiarySearchBox 
                        value={searchInput} 
                        onChange={setSearchInput}
                        onSearch={handleSearchSubmit}
                        />
                </div>
            </div>

        <div className={styles.historySection}>
            <div className={styles.historyLayout}>
                {/* 왼쪽: 목록 */}
                <div className={styles.historyList}>
                    {loading ? (
                        <p>불러오는 중...</p>
                    ): historyList.length === 0 ? (
                        <p>데이터 없음</p>
                    ) : (
                        historyList.map((item) => (
                            <button
                                key={item.diaryId}
                                type="button"
                                className={`${styles.historyItem} ${
                                    selectedDiaryId === item.diaryId ? styles.selected : ""
                                }`}
                                onClick={() => setSelectedDiaryId(item.diaryId)}
                            >
                                <div className={styles.historyTop}>
                                    <span>{item.date}</span>
                                    <span>{item.topEmotion ?? "보통"}</span>
                                </div>
                                <p>{item.preview}</p>
                            </button>
                        ))
                    )}
                </div>

                {/* 오른쪽: 상세 */}
                <div className={styles.detailPanel}>
                    {detailLoading ? (
                        <p>불러오는 중...</p>
                    ) : selectedDetail ? (
                        <>
                            <div className={styles.detailHero}>
                                <div className={styles.detailHeroLeft}>
                                    <p className={styles.detailDate}>{selectedDetail.date}</p>
                                    <h2 className={styles.detailTitle}>오늘의 감정 기록</h2>
                                    <p className={styles.detailSubtitle}>
                                        하루의 감정과 생각을 천천히 돌아볼 수 있는 기록이에요.
                                    </p>
                                </div>

                                <div className={styles.detailHeroRight}>
                                    <span className={styles.detailEmotionBadge}>
                                        {getEmotionEmoji(selectedDetail.topEmotion)}{" "}
                                        {getEmotionLabel(selectedDetail.topEmotion)}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.detailContentCard}>
                                <div className={styles.detailContentHeader}>
                                    <span className={styles.detailContentLabel}>기록 내용</span>
                                </div>

                                <div className={styles.detailBody}>
                                    <p>{selectedDetail.content}</p>
                                </div>
                            </div>

                            <div className={styles.detailBottomGrid}>
                                <div className={styles.infoCard}>
                                    <span className={styles.infoCardLabel}>대표 감정</span>
                                    <strong>
                                        {getEmotionEmoji(selectedDetail.topEmotion)}{" "}
                                        {getEmotionLabel(selectedDetail.topEmotion)}
                                    </strong>
                                </div>

                                <div className={styles.infoCard}>
                                    <span className={styles.infoCardLabel}>기록 날짜</span>
                                    <strong>{selectedDetail.date}</strong>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.detailEmpty}>
                            <p>왼쪽에서 기록을 선택해 주세요.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
        </div>
    )
}

export default DiaryHistoryPage;