import { useEffect, useState } from "react";
import styles from "../../styles/PlayListPage.module.css";
import {
  getCategoryPlaylists,
  getCategoryPlaylistVideos,
  getFeaturedPlaylist,
  getTrendingPlaylists,
  type CategoryPlaylistItem,
  type CategoryPlaylistVideoItem,
  type FeaturedPlaylistResponse,
  type TrendingPlaylistItem,
} from "../../api/playlist";

type TrendingCard = TrendingPlaylistItem & {
  isPlaceholder?: boolean;
};

const openYoutube = (videoId: string) => {
  window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
};

const fillTrendingPlaceholders = (
  items: TrendingPlaylistItem[],
  targetCount: number = 8
):TrendingCard[] => {
  const placeholders: TrendingCard[] = Array.from(
    {length: Math.max(0, targetCount - items.length)},
    (_, index) => ({
      id: 100000 + index,
      tag: "🎵 준비 중",
      title: "추천 플레이리스트 준비 중입니다",
      channelTitle: "데이터가 더 쌓이면 자동으로 채워져요",
      thumbnailUrl: "",
      videoId: "",
      recommendCount: 0,
      isPlaceholder: true,
    })
  );

  return [...items, ...placeholders];
};

const PlayListPage = () => {
  
  const [featuredPlaylist, setFeaturedPlaylist] =
    useState<FeaturedPlaylistResponse | null>(null);
  const [trendingVideos, setTrendingVideos] = useState<TrendingCard[]>([]);
  const [categoryPlaylists, setCategoryPlaylists] = useState<CategoryPlaylistItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryVideos, setCategoryVideos] = useState<CategoryPlaylistVideoItem[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryClick = async (emotion: string) => {
    if (selectedCategory === emotion) {
      setSelectedCategory(null);
      setCategoryVideos([]);
      return;
    }

    setSelectedCategory(emotion);
    setCategoryLoading(true);

    try {
      const videos = await getCategoryPlaylistVideos(emotion);
      setCategoryVideos(videos);
    } catch (err) {
      console.error("카테고리 영상 조회 실패", err);
      setCategoryVideos([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError(null);

        const [featured, trending, categories] = await Promise.all([
          getFeaturedPlaylist(),
          getTrendingPlaylists(),
          getCategoryPlaylists(),
        ]);

        setFeaturedPlaylist(featured);
        setTrendingVideos(fillTrendingPlaceholders(trending, 8));
        setCategoryPlaylists(categories);

      } catch (err) {
        console.error("featured 조회 실패", err);
        setError("인기 플레이리스트를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

    useEffect(() => {
      if (selectedCategory) {
        document.querySelector(`.${styles.categoryPanel}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, [selectedCategory]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <section className={styles.heroSection}>
            <div className={styles.heroText}>
              <span className={styles.badge}>🎧 전체 인기 플레이리스트</span>
              <h1 className={styles.title}>지금 많이 듣는 플레이리스트</h1>
              <p className={styles.subtitle}>플레이리스트를 불러오는 중이에요.</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <section className={styles.heroSection}>
            <div className={styles.heroText}>
              <span className={styles.badge}>안내</span>
              <h1 className={styles.title}>데이터를 불러오지 못했어요</h1>
              <p className={styles.subtitle}>{error}</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.heroSection}>
          <div className={styles.heroText}>
            <span className={styles.badge}>🎧 전체 인기 플레이리스트</span>
            <h1 className={styles.title}>지금 많이 듣는 플레이리스트</h1>
            <p className={styles.subtitle}>
              사용자들이 자주 찾는 인기 음악과 분위기별 추천 영상을 한눈에 둘러보세요.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>이번 주 인기 TOP 1</h2>
            <button type="button" className={styles.moreButton}>
              전체 보기
            </button>
          </div>

          {featuredPlaylist && (
            <div className={styles.todayCard}>
              <div className={styles.todayContent}>
                <span className={styles.emotionTag}>{featuredPlaylist.badge}</span>
                <h3>{featuredPlaylist.title}</h3>
                <p>{featuredPlaylist.description}</p>

                <div className={styles.metaRow}>
                  <span className={styles.channelName}>
                    {featuredPlaylist.channelTitle}
                  </span>
                </div>

                <div className={styles.todayActions}>
                  <button
                    type="button"
                    className={styles.playButton}
                    onClick={() => openYoutube(featuredPlaylist.videoId)}
                    disabled={!featuredPlaylist.videoId}
                  >
                    ▶ 바로 재생
                  </button>
                  <button type="button" className={styles.saveButton}>
                    ☆ 보관하기
                  </button>
                </div>
              </div>

              {featuredPlaylist.thumbnailUrl && (
                <div className={styles.todayThumbnail}>
                  <img
                    src={featuredPlaylist.thumbnailUrl}
                    alt={featuredPlaylist.title}
                    className={styles.thumbnailImage}
                  />
                </div>
              )}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>요즘 많이 보는 추천 영상</h2>
            <button type="button" className={styles.moreButton}>
              더 보기
            </button>
          </div>

        <div className={styles.cardGrid}>
          {trendingVideos.map((video) =>
            video.isPlaceholder ? (
              <div
                key={video.id}
                className={`${styles.smallCard} ${styles.placeholderCard}`}
              >
                <div className={styles.placeholderThumb}>🎧 준비 중</div>
                <span className={styles.placeholderTag}>{video.tag}</span>
                <h3>{video.title}</h3>
                <p>{video.channelTitle}</p>
              </div>
            ) : (
              <div
                key={video.id}
                className={styles.smallCard}
                onClick={() => openYoutube(video.videoId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openYoutube(video.videoId);
                  }
                }}
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className={styles.smallThumbnail}
                />
                <span className={styles.smallEmotion}>{video.tag}</span>
                <h3>{video.title}</h3>
                <p>{video.channelTitle}</p>
              </div>
            )
          )}
        </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>분위기별 둘러보기</h2>
          </div>

          <div className={styles.emotionGrid}>
            {categoryPlaylists.map((item) => (
              <div
                key={item.emotion}
                className={`${styles.emotionCard} ${
                  selectedCategory === item.emotion ? styles.emotionCardActive : ""
                }`}
                onClick={() => handleCategoryClick(item.emotion)}
              >
                <span>{item.emoji}</span>
                <strong>{item.title}</strong>
                <p className={styles.emotionDesc}>{item.subtitle}</p>
              </div>
            ))}
        </div>
      </section>

      {selectedCategory && (
  <div className={styles.categoryPanel}>
    <div className={styles.categoryPanelHeader}>
      <h3>
        {
          categoryPlaylists.find((c) => c.emotion === selectedCategory)?.emoji
        }{" "}
        {
          categoryPlaylists.find((c) => c.emotion === selectedCategory)?.title
        } PLAYLIST
      </h3>
      <p>선택한 분위기에 어울리는 추천 음악이에요.</p>
    </div>

            {categoryLoading ? (
              <div className={styles.categoryLoading}>플레이리스트를 불러오는 중이에요...</div>
            ) : (
              <div className={styles.categoryVideoGrid}>
                {categoryVideos.length > 0 ? (
                  categoryVideos.map((video) => (
                    <div
                      key={video.id}
                      className={styles.categoryVideoCard}
                      onClick={() => openYoutube(video.videoId)}
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className={styles.categoryVideoThumb}
                      />
                      <div className={styles.categoryVideoText}>
                        <strong>{video.title}</strong>
                        <span>{video.channelTitle}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>추천 데이터가 아직 부족해요 🥲</p>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default PlayListPage;