import { useEffect, useState } from "react";
import DiaryBanner from "../../components/Diary/DiaryBanner";
import styles from "../../styles/EmotionDiaryPage.module.css"
import WriteDiaryModel from "../../components/Diary/WriteDiaryModal";

const EmotionDiaryPage = () => {

    const [openModal, setOpenModal] = useState(false);

    // 모달 열릴 때 body 스크롤 잠금
    useEffect(() => {
        if(openModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        // cleanup
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [openModal]);

    return (
            <div className={styles.pageContainer}>
                <div className={styles.bannerWrapper}>
                    <DiaryBanner/>
                </div>
            
            <div className={styles.writeBox}>
                <h2 className={styles.writeTitle}>
                    오늘의 감정을 기록해볼까요?
                </h2>
                <button 
                    className={styles.writeButton}
                    onClick={() => setOpenModal(true)}
                >
                     감정일기 쓰러가기
                </button>
            </div>

            {openModal && (
                <WriteDiaryModel onClose={() => setOpenModal(false)} />
            )}

            </div>
    );
}

export default EmotionDiaryPage;