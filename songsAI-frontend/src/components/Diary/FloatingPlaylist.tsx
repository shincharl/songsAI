import styles from "../../styles/FloatingPlaylist.module.css"

export interface VideoItem {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
}

interface Props {
    videos: VideoItem[];
    onVideoClick?: (video: VideoItem) => void;
}
const FloatingPlayList = ({videos, onVideoClick}: Props) => {
    return(
        <aside className={styles.sidebar}>
            <div className={styles.playlistBox}>
                <div className={styles.header}>
                    <span className={styles.badge}>AI 추천</span>
                    <h3 className={styles.title}>추천 영상 TOP 5</h3>
                </div>

                <div className={styles.list}>
                    {videos.length === 0 ? (
                        <div className={styles.empty}>추천 영상이 아직 없어요.</div>
                    ) : (
                        videos.map((video, index)=>(
                            <button
                                key={video.id}
                                type="button"
                                className={styles.item}
                                onClick={() => onVideoClick?.(video)}
                            >
                                <div className={styles.rank}>{index + 1}</div>

                                <img 
                                    src={video.thumbnailUrl} 
                                    alt={video.title}
                                    className={styles.thumbnail}
                                />

                                <div className={styles.meta}>
                                    <p className={styles.videoTitle}>{video.title}</p>
                                    <p className={styles.channel}>{video.channelTitle}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
};

export default FloatingPlayList;