import { useState } from "react";
import styles from "../../styles/WriteDiaryModal.module.css"
import Sticker from "./Sticker";

interface Props {
    onClose: () => void;
}

const STICKERS = {
  emotion: [
    "https://cdn-icons-png.flaticon.com/512/742/742751.png", // 😊
    "https://cdn-icons-png.flaticon.com/512/742/742752.png", // 😢
    "https://cdn-icons-png.flaticon.com/512/742/742753.png", // 😡
    "https://cdn-icons-png.flaticon.com/512/742/742790.png", // 😍
    "https://cdn-icons-png.flaticon.com/512/742/742774.png", // 😴
    "https://cdn-icons-png.flaticon.com/512/742/742802.png", // 🤯
  ],

  weather: [
    "https://cdn-icons-png.flaticon.com/512/869/869869.png", // ☀️
    "https://cdn-icons-png.flaticon.com/512/414/414927.png", // ☁️
    "https://cdn-icons-png.flaticon.com/512/414/414974.png", // 🌧️
    "https://cdn-icons-png.flaticon.com/512/642/642102.png", // 🌈
    "https://cdn-icons-png.flaticon.com/512/1779/1779940.png", // ❄️
  ],

  deco: [
    "https://cdn-icons-png.flaticon.com/512/616/616490.png", // ⭐
    "https://cdn-icons-png.flaticon.com/512/833/833472.png", // ❤️
    "https://cdn-icons-png.flaticon.com/512/616/616494.png", // ✨
    "https://cdn-icons-png.flaticon.com/512/2921/2921222.png", // 🎀
    "https://cdn-icons-png.flaticon.com/512/3468/3468371.png", // 🌸
  ],

  study: [
    "https://cdn-icons-png.flaticon.com/512/3135/3135755.png", // 📚
    "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", // ✏️
    "https://cdn-icons-png.flaticon.com/512/3050/3050525.png", // 📅
    "https://cdn-icons-png.flaticon.com/512/2913/2913465.png", // ⏰
  ],

  food: [
    "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", // 🍔
    "https://cdn-icons-png.flaticon.com/512/1046/1046786.png", // 🍕
    "https://cdn-icons-png.flaticon.com/512/1046/1046790.png", // 🍰
    "https://cdn-icons-png.flaticon.com/512/1046/1046793.png", // 🍜
  ]
};

const CATEGORY_NAME = {
  emotion: "감정",
  weather: "날씨",
  deco: "데코",
  study: "공부",
  food: "음식"
};

const WriteDiaryModel = ({ onClose }: Props) => {

    const [stickers, setStickers] = useState<string[]>([]);
    const [text, setText] = useState("");

    const [pages, setPages] = useState<string[]>([""]); // 최소 한 페이지
    const [currentPage, setCurrentPage] = useState(0);
    const [stickersPerPage, setStickersPerPage] = useState<string[][]>([[]]); // 페이지별 스티커
    
    // 스티커 추가 메서드
    const addSticker = (img: string) => {
        const newStickers = [...stickersPerPage];
        newStickers[currentPage] = [...newStickers[currentPage], img];
        setStickersPerPage(newStickers);
    };

    // TextArea 넘침 감지 & 페이지 자동 추가
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const newPages = [...pages];
        newPages[currentPage] = value;
        setPages(newPages);

        const target = e.target;
        if (target.scrollHeight > target.clientHeight){
            if (pages.length >= 6){
                alert("최대 6장까지 작성할 수 있어요!");
                return;
            }
            // 새 페이지 생성
            const remainingText = "";
            setPages([...newPages, remainingText]);
            setCurrentPage(currentPage + 1);
            setStickersPerPage([...stickersPerPage, []]);
        }
    }

return (
  <div className={styles.overlay}>
    <div className={styles.modal}>

      {/* 페이지 썸네일 */}
      <div className={styles.pageBar}>
        {pages.map((page, index) => (
            <div
                key={index}
                className={`${styles.pageThumb} ${index === currentPage ? styles.activeThumb: ""}`}
                onClick={() => setCurrentPage(index)}
            >
                <div className={styles.thumbPreview}>
                    {page.slice(0, 10)} {/* 페이지 일부 텍스트 미리보기 */}
                </div>
            </div>
        ))}
      </div>

      {/* 오른쪽 전체 영역 */}
      <div className={styles.body}>

        {/* 스티커 패널 */}
        <div className={styles.stickerPanel}>
          {Object.entries(STICKERS).map(([category, list]) => (
            <div key={category} className={styles.stickerGroup}>
              <h4>{CATEGORY_NAME[category as keyof typeof CATEGORY_NAME]}</h4>

              <div className={styles.stickerRow}>
                {list.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => addSticker(img)}
                    className={styles.stickerBtn}
                  >
                    <img 
                        src={img} 
                        alt="sticker"
                        draggable={false} 
                        onDragStart={(e) => e.preventDefault()}
                        />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 노트 영역 */}
        <div className={styles.noteWrapper}>
          <div className={styles.noteArea}>


            <textarea
                className={styles.textarea}
                value={pages[currentPage]}
                onChange={handleTextChange}
                onKeyDown={(e) => {
                    // 현재 페이지가 비어 있고, Backspace 누른 경우
                    if(
                        e.key === "Backspace" &&
                        pages[currentPage] === "" &&
                        pages.length > 1 // 최소 한 페이지는 남기기
                    ){
                        e.preventDefault(); // 기본 동작 막기
                        const newPages = [...pages];
                        const newStickers = [...stickersPerPage];

                        // 현재 페이지 삭제
                        newPages.splice(currentPage, 1);
                        newStickers.splice(currentPage, 1);

                        setPages(newPages);
                        setStickersPerPage(newStickers);

                        // 이전 페이지로 이동
                        setCurrentPage(Math.max(currentPage - 1, 0));
                    }
                }}
                onDrop={(e) => e.preventDefault()}
                placeholder="오늘 어떤 일이 있었나요?"
            />

            {stickersPerPage[currentPage].map((img, i) => (
              <Sticker
                key={i}
                img={img}
                onDoubleClick={() => {
                    // i번째 스티커 삭제
                    const newStickers = [...stickersPerPage];
                    newStickers[currentPage] = newStickers[currentPage].filter((_, index) => index !== i);
                    setStickersPerPage(newStickers);
                }}
                />
            ))}
          </div>

            <div className={styles.noteActions}>
                <button className={styles.saveAnalyzeBtn}>
                    일기 저장 & AI 분석
                </button>
            </div>

        </div>
      </div>

      <button className={styles.closeBtn} onClick={onClose}>✖</button>

    </div>
  </div>
);
};

export default WriteDiaryModel