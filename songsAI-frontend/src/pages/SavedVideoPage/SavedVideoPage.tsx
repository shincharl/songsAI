import { useEffect, useState } from "react";
import styles from "../../styles/SavedVideoPage.module.css"
import { getSavedVideos, deleteSavedVideo, type SavedVideoResponse } from "../../api/savedVideo";

const SavedVideoPage = () => {
    const [videos, setVideos] = useState<SavedVideoResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const openYoutube = (videoId: string) => {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
    };

    const handleDelete = async (videoId: string) => {
        try {
            await deleteSavedVideo(videoId);
            setVideos((prev) => prev.filter((video) => video.videoId !== videoId))
        } catch (error) {
            console.error("보관 영상 삭제 실패", error);
            alert("삭제 중 문제가 발생했어요.");
        }

    };

    useEffect(() => {
        const fetchSavedVideos = async () => {
            try {
                const data = await getSavedVideos();
                setVideos(data);
            } catch (error) {
                console.error("보관환 조회 실패", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedVideos();
    }, []);


    if (loading) {
        return (
            <div className={styles.page}>
                <p>보관함을 불러오는 중이에요...</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <span className={styles.badge}>⭐ My Archive</span>
                <h1>내 보관함</h1>
                <p>마음에 들었던 추천 음악을 다시 꺼내볼 수 있어요.</p>
            </section>

            {videos.length === 0 ? (
                <div className={styles.emptyBox}>
                    <h2>아직 보관한 음악이 없어요</h2>
                    <p>마음에 드는 플레이리스트를 보관해보세요.</p>
                </div>
            ): (
                <div className={styles.grid}>
                    {videos.map((video) => (
                        <div key={video.id} className={styles.card}>
                            <img 
                                src={video.thumbnailUrl} 
                                alt={video.title}
                                className={styles.thumbnail}
                                onClick={() => openYoutube(video.videoId)}
                            />

                            <div className={styles.cardBody}>
                                <h3 onClick={() => openYoutube(video.videoId)}>
                                    {video.title}
                                </h3>
                                <p>{video.channelTitle}</p>

                                <div className={styles.actions}>
                                    <button
                                        type="button"
                                        className={styles.playButton}
                                        onClick={() => openYoutube(video.videoId)}
                                    >
                                        ▶ 재생
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(video.videoId)}
                                    >
                                        보관 취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}

export default SavedVideoPage;