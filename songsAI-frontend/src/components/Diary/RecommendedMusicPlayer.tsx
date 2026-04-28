import { useMemo } from "react";
import styles from "../../styles/RecommendedMusicPlayer.module.css";

export interface YoutubeVideoItem {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt?: string;
  description?: string;
}

interface Props {
  videos: YoutubeVideoItem[];
  selectedVideoId?: string | null;
  onSelectVideo?: (videoId: string) => void;
  title?: string;
  subtitle?: string;
}

const RecommendedMusicPlayer = ({
  videos,
  selectedVideoId,
  onSelectVideo,
  title = "오늘의 추천 음악",
  subtitle = "감정 분석 결과를 바탕으로 추천된 영상이에요.",
}: Props) => {

  const selectedVideo = useMemo(() => {
    if (videos.length === 0) return null;

    return (
      videos.find((video) => video.videoId === selectedVideoId) ?? videos[0]
    );
  }, [videos, selectedVideoId]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <p className={styles.sectionSubtitle}>{subtitle}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.playerCard}>
          {selectedVideo ? (
            <>
              <div className={styles.playerBox}>
                <iframe
                  className={styles.iframe}
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className={styles.videoInfo}>
                <h4 className={styles.videoTitle}>{selectedVideo.title}</h4>
                <p className={styles.channelTitle}>{selectedVideo.channelTitle}</p>
              </div>
            </>
          ) : (
            <div className={styles.emptyMessage}>추천 영상이 아직 없어요.</div>
          )}
        </div>

        <div className={styles.listCard}>
          <div className={styles.listHeader}>추천 영상 TOP 5</div>

          <ul className={styles.videoList}>
            {videos.slice(0, 5).map((video, index) => {
              const isActive = selectedVideo?.videoId === video.videoId;

              return (
                <li key={video.videoId}>
                  <button
                    type="button"
                    className={`${styles.videoItem} ${
                      isActive ? styles.activeItem : ""
                    }`}
                    onClick={() => onSelectVideo?.(video.videoId)}
                  >
                    <div className={styles.rank}>{index + 1}</div>

                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className={styles.thumbnail}
                    />

                    <div className={styles.meta}>
                      <div className={styles.itemTitle}>{video.title}</div>
                      <div className={styles.itemChannel}>{video.channelTitle}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RecommendedMusicPlayer;