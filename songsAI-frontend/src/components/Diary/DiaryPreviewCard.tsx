import styles from "../../styles/DiaryPreviewCard.module.css"

interface Props {
    content: string;
    stickers: string[];
}

const DiaryPreviewCard = ({content, stickers = [] }: Props) => {

    const previewText = 
            content.length > 50 ? content.slice(0, 50) + "..." : content;
        
            return(
                <div className={styles.previewCard}>
                    <div className={styles.previewHeader}>오늘의 기록 미리보기</div>

                        <div className={styles.previewBody}>
                            <p>"{previewText || "아직 작성된 일기가 없습니다."}"</p>

                            <div className={styles.previewTags}>
                               {stickers.length > 0 ? (
                                 stickers.map((sticker, index) => (
                                    <span key={index}>{sticker}</span>
                                 ))
                               ) : (
                                <span className={styles.noTag}>태그 없음</span>
                               )}
                            </div>
                     </div>
                </div>
        );      
    };

export default DiaryPreviewCard;