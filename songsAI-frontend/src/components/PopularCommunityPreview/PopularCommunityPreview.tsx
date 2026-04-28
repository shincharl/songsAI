import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCommunityPosts, type CommunityPostResponse } from "../../api/community";
import styles from "../../styles/PopularCommunityPreview.module.css";

const emotionLabelMap: Record<string, string> = {
    HAPPY: "행복수다",
    SAD: "위로기록",
    ANGRY: "감정공유",
    EXCITED: "설렘기록",
    CALM: "차분한밤",
    NEUTRAL: "일상감정",
};

const PopularCommunityPreview = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<CommunityPostResponse[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getCommunityPosts({
                    page: 0,
                    size: 3,
                });

                setPosts(data.content);
            } catch (error) {
                console.error("커뮤니티 인기글 불러오기 실패:", error);
            }
        };

        fetchPosts();
    }, []);

    return(
        <section className={styles.section}>
            <div className={styles.header}>
                <h2>커뮤니티 실시간 최신글</h2>

                <button
                    className={styles.moreButton}
                    onClick={() => navigate("/CommunityPage")}
                >
                    더보기 ›
                </button>
            </div>

            <div className={styles.card}>
                {posts.map((post) => (
                    <article key={post.id} className={styles.item}>
                        <div>
                            <span className={styles.tag}>
                                #{emotionLabelMap[post.emotion] ?? "감정공유"}
                            </span>
                            <p>{post.content}</p>
                        </div>

                        <span className={styles.like}>♡ {post.reactionSummary.empathyCount}</span>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default PopularCommunityPreview;