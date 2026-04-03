import { useEffect, useRef, useState } from "react";
import styles from "../../styles/DiaryHistoryPage.module.css"
import { getDiaryHistory } from "../../api/diaryHistory";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.module.css"

const DiaryHistoryPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeFilter, setActiveFilter] = useState("전체");
    const [search, setSearch] = useState("");

    const scrollRef = useRef<HTMLDivElement | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const [historyList, setHistoryList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, [selectedDate]);

    const parseMonth = () => {
        const [year, month] = selectedMonth
            .replace("년", "")
            .replace("월", "")
            .split(" ")
            .map(Number);

            return {year, month};
    }

    const fetchHistory = async () => {
        try {
            setLoading(true);

            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;

            const data = await getDiaryHistory(year, month);

            setHistoryList(data);
        } catch (error) {
            console.error("히스토리 조회 실패", error);
        } finally {
            setLoading(false);
        }
    };

    const filters = ["전체", "기쁨", "슬픔", "화남", "설렘", "편안함", "보통"];

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
                    <div className={styles.searchBox}>
                        <input 
                            type="text"
                            placeholder="기록 검색하기"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className={styles.searchIcon}>🔍</span>
                    </div>
                </div>
            </div>

        <div className={styles.historySection}>
            {loading ? (
                <p>불러오는 중...</p>
            ): historyList.length === 0 ? (
                <p>데이터 없음</p>
            ): (
                historyList.map((item) => (
                    <div key={item.diaryId} className={styles.historyItem}>
                        <div className={styles.historyTop}>
                            <span>{item.date}</span>
                            <span>{item.topEmotion ?? "보통"}</span>
                        </div>
                        <p>{item.preview}</p>
                    </div>
                ))
            )}
        </div>
            

        </div>
    )
}

export default DiaryHistoryPage;