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
import { useAuthStore } from "../../store/useAuthStore";

const mockFeaturedPlaylist = {
  badge: "😊 오늘의 추천",
  title: "기분 좋은 하루를 위한 플레이리스트",
  description: "밝고 경쾌한 음악으로 하루를 시작해보세요.",
  thumbnailUrl: "https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg",
  channelTitle: "Mood Music",
  videoId: "60ItHLz5WEA",
};

const mockTrendingVideos = [
  {
    id: 1,
    tag: "🔥 인기",
    title: "Alan Walker - Faded",
    channelTitle: "Alan Walker",
    thumbnailUrl: "https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg",
    videoId: "60ItHLz5WEA",
    recommendCount: 120,
  },
  {
    id: 2,
    tag: "😊 힐링",
    title: "Ed Sheeran - Perfect",
    channelTitle: "Ed Sheeran",
    thumbnailUrl: "https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg",
    videoId: "2Vv-BfVoq4g",
    recommendCount: 98,
  },
  {
    id: 3,
    tag: "💔 감성",
    title: "Billie Eilish - Happier Than Ever",
    channelTitle: "Billie Eilish",
    thumbnailUrl: "https://i.ytimg.com/vi/5GJWxDKyk3A/hqdefault.jpg",
    videoId: "5GJWxDKyk3A",
    recommendCount: 87,
  },
  {
    id: 4,
    tag: "⚡ 에너지",
    title: "Imagine Dragons - Believer",
    channelTitle: "Imagine Dragons",
    thumbnailUrl: "https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg",
    videoId: "7wtfhZwyrcc",
    recommendCount: 110,
  },
  {
    id: 5,
    tag: "🎸 락",
    title: "Queen - Don't Stop Me Now",
    channelTitle: "Queen Official",
    thumbnailUrl: "https://i.ytimg.com/vi/HgzGwKwLmgM/hqdefault.jpg",
    videoId: "HgzGwKwLmgM",
    recommendCount: 76,
  },
  {
    id: 6,
    tag: "🌙 잔잔",
    title: "IU - 밤편지",
    channelTitle: "IU Official",
    thumbnailUrl: "https://i.ytimg.com/vi/BzYnNdJhZQw/hqdefault.jpg",
    videoId: "BzYnNdJhZQw",
    recommendCount: 95,
  },
  {
    id: 7,
    tag: "💕 설렘",
    title: "Taylor Swift - Love Story",
    channelTitle: "Taylor Swift",
    thumbnailUrl: "https://i.ytimg.com/vi/8xg3vE8Ie_E/hqdefault.jpg",
    videoId: "8xg3vE8Ie_E",
    recommendCount: 102,
  },
  {
    id: 8,
    tag: "🎧 집중",
    title: "Lofi Hip Hop Radio - Beats to Relax/Study",
    channelTitle: "Lofi Girl",
    thumbnailUrl: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
    videoId: "jfKfPfyJRdk",
    recommendCount: 89,
  },
];

const mockCategories = [
  { emotion: "HAPPY", emoji: "😊", title: "행복", subtitle: "기분 좋을 때 듣는 음악" },
  { emotion: "SAD", emoji: "😢", title: "슬픔", subtitle: "감성적인 음악" },
  { emotion: "CALM", emoji: "😌", title: "편안함", subtitle: "차분한 음악" },
  { emotion: "EXCITED", emoji: "🤩", title: "신남", subtitle: "텐션 올리고 싶을 때" },
];

const mockCategoryVideos = {
  HAPPY: [
    {
      id: 1,
      title: "Uptown Funk",
      channelTitle: "Mark Ronson",
      thumbnailUrl: "https://i.ytimg.com/vi/3JZ4pnNtyxQ/hqdefault.jpg",
      videoId: "3JZ4pnNtyxQ",
    },
    {
      id: 2,
      title: "Can't Stop The Feeling!",
      channelTitle: "Justin Timberlake",
      thumbnailUrl: "https://i.ytimg.com/vi/ru0K8uYEZWw/hqdefault.jpg",
      videoId: "ru0K8uYEZWw",
    },
    {
      id: 3,
      title: "Happy - Pharrell Williams",
      channelTitle: "Pharrell Williams",
      thumbnailUrl: "https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg",
      videoId: "ZbZSe6N_BXs",
    },
  ],

  SAD: [
    {
      id: 4,
      title: "See You Again",
      channelTitle: "Wiz Khalifa",
      thumbnailUrl: "https://i.ytimg.com/vi/RgKAFK5djSk/hqdefault.jpg",
      videoId: "RgKAFK5djSk",
    },
    {
      id: 5,
      title: "Someone Like You",
      channelTitle: "Adele",
      thumbnailUrl: "https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg",
      videoId: "hLQl3WQQoQ0",
    },
    {
      id: 6,
      title: "All of Me",
      channelTitle: "John Legend",
      thumbnailUrl: "https://i.ytimg.com/vi/450p7goxZqg/hqdefault.jpg",
      videoId: "450p7goxZqg",
    },
  ],

  CALM: [
    {
      id: 7,
      title: "lofi hip hop - relax",
      channelTitle: "Lofi Girl",
      thumbnailUrl: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
      videoId: "jfKfPfyJRdk",
    },
    {
      id: 8,
      title: "Chill Jazz Music",
      channelTitle: "Jazz Cafe",
      thumbnailUrl: "https://i.ytimg.com/vi/DSGyEsJ17cI/hqdefault.jpg",
      videoId: "DSGyEsJ17cI",
    },
    {
      id: 9,
      title: "Rain Sounds for Sleep",
      channelTitle: "Nature Sound",
      thumbnailUrl: "https://i.ytimg.com/vi/mPZkdNFkNps/hqdefault.jpg",
      videoId: "mPZkdNFkNps",
    },
  ],

  EXCITED: [
    {
      id: 10,
      title: "Dynamite",
      channelTitle: "BTS",
      thumbnailUrl: "https://i.ytimg.com/vi/gdZLi9oWNZg/hqdefault.jpg",
      videoId: "gdZLi9oWNZg",
    },
    {
      id: 11,
      title: "Levitating",
      channelTitle: "Dua Lipa",
      thumbnailUrl: "https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg",
      videoId: "TUVcZfQe-Kw",
    },
    {
      id: 12,
      title: "Blinding Lights",
      channelTitle: "The Weeknd",
      thumbnailUrl: "https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg",
      videoId: "4NRXx6U8ABQ",
    },
  ],
};

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

  const { accessToken } = useAuthStore();
  const isLogin = !!accessToken;
  
  const [featuredPlaylist, setFeaturedPlaylist] =
    useState<FeaturedPlaylistResponse | null>(null);
  const [trendingVideos, setTrendingVideos] = useState<TrendingCard[]>([]);
  const [categoryPlaylists, setCategoryPlaylists] = useState<CategoryPlaylistItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryVideos, setCategoryVideos] = useState<CategoryPlaylistVideoItem[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isTrendingModalOpen, setIsTrendingModalOpen] = useState(false);

  const handleCategoryClick = async (emotion: string) => {
    if (selectedCategory === emotion) {
      setSelectedCategory(null);
      setCategoryVideos([]);
      return;
    }

    setSelectedCategory(emotion);

    if(!isLogin){
      setCategoryVideos(mockCategoryVideos[emotion] || []);
      return;
    }

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
    if (!isLogin) {
      setFeaturedPlaylist(mockFeaturedPlaylist);
      setTrendingVideos(fillTrendingPlaceholders(mockTrendingVideos, 20));
      setCategoryPlaylists(mockCategories);
      setLoading(false);
      return;
    }

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
        setTrendingVideos(fillTrendingPlaceholders(trending, 20));
        setCategoryPlaylists(categories);

      } catch (err) {
        console.error("featured 조회 실패", err);
        setError("인기 플레이리스트를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [isLogin]);

    useEffect(() => {
      if (selectedCategory) {
        document.querySelector(`.${styles.categoryPanel}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, [selectedCategory]);

    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsTrendingModalOpen(false);
        }
      };

      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    useEffect(() => {
      if (isTrendingModalOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }, [isTrendingModalOpen]);

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
            <button 
              type="button" 
              className={styles.moreButton}
              onClick={() => setIsTrendingModalOpen(true)}
            >
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
            <button 
              type="button" 
              className={styles.moreButton}
              onClick={() => setIsTrendingModalOpen(true)}
              >
              더 보기
            </button>
          </div>

        <div className={styles.cardGrid}>
          {trendingVideos.slice(0, 8).map((video) =>
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

          {isTrendingModalOpen && (
            <div
              className={styles.modalOverlay}
              onClick={() => setIsTrendingModalOpen(false)}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <div>
                    <h2>요즘 많이 보는 추천 영상</h2>
                    <p>인기 있는 음악을 한눈에 확인해보세요.</p>
                  </div>

                  <button
                    className={styles.modalCloseButton}
                    onClick={() => setIsTrendingModalOpen(false)}
                  >
                    ×
                  </button>
                </div>

                <div className={styles.modalGrid}>
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
                      >
                        <img
                          src={video.thumbnailUrl}
                          className={styles.smallThumbnail}
                        />
                        <span className={styles.smallEmotion}>{video.tag}</span>
                        <h3>{video.title}</h3>
                        <p>{video.channelTitle}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
};

export default PlayListPage;