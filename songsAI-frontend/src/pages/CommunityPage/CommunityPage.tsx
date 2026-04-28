import { useEffect, useRef, useState } from "react";
import Styles from "../../styles/CommunityPage.module.css"
import { createComment, createCommunityPost, getCommentsByPost, getCommunityPosts, reactToCommunityPost, type CommunityCommentResponse, type CommunityEmotion, type CommunityPostResponse, type CommunitySocketEvent, type ReactionType } from "../../api/community";
import { useAuthStore } from "../../store/useAuthStore";
import { connectCommunitySocket, disconnectCommunitySocket } from "../../api/communitySocket";

const emotionLabels: Record<CommunityEmotion, string> = {
    HAPPY: "기쁨",
    SAD: "슬픔",
    ANGRY: "화남",
    EXCITED: "설렘",
    CALM: "편안",
    NEUTRAL: "보통",
};

const emotionOptions: CommunityEmotion[] = [
  "HAPPY",
  "SAD",
  "ANGRY",
  "EXCITED",
  "CALM",
  "NEUTRAL",
];

const CommunityPage = () => {

    const [posts, setPosts] = useState<CommunityPostResponse[]>([]);
    const [selectedEmotion, setSelectedEmotion] = useState<CommunityEmotion | undefined>(undefined);

    const [content, setContent] = useState("");
    const [emotion, setEmotion] = useState<CommunityEmotion>("NEUTRAL");

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [reactingPostId, setReactingPostId] = useState<number | null>(null);

    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // 댓글창 열린 게시글 id들
    const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);
    // 게시글별 댓글 목록
    const [commentsMap, setCommentsMap] = useState<Record<number, CommunityCommentResponse[]>>({});
    // 게시글별 댓글 입력값
    const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
    // 댓글 불러오는 중인 게시글
    const [loadingCommentPostId, setLoadingCommentPostId] = useState<number | null>(null);
    // 댓글 등록 중인 게시글
    const [submittingCommentPostId, setSubmittingCommentPostId] = useState<number | null>(null);


    const observerRef = useRef<HTMLDivElement | null>(null);

    const accessToken = useAuthStore((state) => state.accessToken);
    const isLoggedIn = !!accessToken;

    const fetchInitialPosts = async () => {
        try {
            setLoading(true);
            const data = await getCommunityPosts({
                emotion: selectedEmotion,
                page: 0,
                size: 10,
            });

            setPosts(data.content);
            setPage(0);
            setHasNext(!data.last);
        } catch (error) {
            console.error("게시글 조회 실패", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMorePosts = async () => {
        if (loadingMore || loading || !hasNext) return;

        console.log("추가 로딩 시작", {page, hasNext})

        try {
            setLoadingMore(true);

            const nextPage = page + 1;
            const data = await getCommunityPosts({
                emotion: selectedEmotion,
                page: nextPage,
                size: 10,
            });

            console.log("추가 로딩 결과", data);

            setPosts((prev) => {
                const merged = [...prev, ...data.content];

                return merged.filter(
                    (post, index, arr) =>
                        arr.findIndex((item) => item.id === post.id) === index,
                );
            });

            setPage(nextPage);
            setHasNext(!data.last);
        } catch (error) {
            console.error("추가 게시글 조회 실패", error);
        } finally {
            setLoadingMore(false);
        }

    }

    const handleCreatePost = async () => {

        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }

        if (!content.trim()) return;

        try {
            setSubmitting(true);
            await createCommunityPost({
                content,
                emotion
            });

            setContent("");
            setEmotion("NEUTRAL");
            
        } catch (error) {
            console.error("게시글 작성 실패", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReact = async (postId: number, reactionType: ReactionType) => {

        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }

        try {
            setReactingPostId(postId);
            await reactToCommunityPost(postId, {reactionType});
        } catch (error) {
            console.error("리액션 처리 실패", error);
        } finally {
            setReactingPostId(null);
        }
    };

    const handleToggleComments = async (postId: number) => {
        const isExpanded = expandedPostIds.includes(postId);

        if (isExpanded) {
            setExpandedPostIds((prev) => prev.filter((id) => id !== postId));
            return;
        }

        setExpandedPostIds((prev) => [...prev, postId]);

        if(!commentsMap[postId]){
            try {
                setLoadingCommentPostId(postId);
                const comments = await getCommentsByPost(postId);

                setCommentsMap((prev) => ({
                    ...prev,
                    [postId]: comments,
                }));

            } catch (error) {
               console.error("댓글 조회 실패", error); 
            } finally {
                setLoadingCommentPostId(null);
            }
        }
    }

    const handleCreateComment = async (postId: number) => {
         if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            return;
         }

         const input = commentInputs[postId]?.trim();
         if (!input) return;

         try {
            setSubmittingCommentPostId(postId);

            const newComment = await createComment(postId, {
                content: input,
            });

            setCommentsMap((prev) => ({
                ...prev,
                [postId]: [...(prev[postId] || []), newComment],
            }));

            setCommentInputs((prev) => ({
                ...prev,
                [postId]: "",
            }));

         } catch (error) {
            console.error("댓글 작성 실패", error);
         } finally {
            setSubmittingCommentPostId(null);
         }
    }

    useEffect(() => {
        const node = observerRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {

                if (entries[0].isIntersecting) {
                    fetchMorePosts();
                }
            },
            {
                root: null,
                rootMargin: "0px 0px 200px 0px",
                threshold: 0,
            },
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };

    } , [page, hasNext, loadingMore, loading, selectedEmotion]);

    // 실시간 변화 반영 (webSocket)
    useEffect(() => {
        connectCommunitySocket((message: CommunitySocketEvent) => {
            if (message.type === "NEW_POST"){
                const newPost = message.data;

                if (selectedEmotion && newPost.emotion !== selectedEmotion) {
                    return;
                }

                setPosts((prev) => {
                    if (prev.some((post) => post.id === newPost.id)){
                        return prev;
                    }

                    return [newPost, ...prev];
                });
            }

            if (message.type === "REACTION_UPDATED") {
                const updated = message.data;

                setPosts((prev) => 
                    prev.map((post) => 
                        post.id === updated.postId
                            ? {
                                ...post,
                                myReaction: updated.myReaction,
                                reactionSummary: updated.reactionSummary,
                              }
                            : post,
                    ),
                );
            }
        });

        return () => {
            disconnectCommunitySocket();
        };
    }, [selectedEmotion]);

    // 초기 데이터/필터 데이터 로딩 역할(REST API)
    useEffect(() => {
        fetchInitialPosts();
    }, [selectedEmotion]);

    return(
        <div className={Styles.page}>
            <h2 className={Styles.title}>감정 공유 커뮤니티</h2>

             <div className={Styles.filterBar}>
                <button
                    type="button"
                    onClick={() => setSelectedEmotion(undefined)}
                    className={`${Styles.filterButton} 
                        ${selectedEmotion === undefined ? Styles.filterButtonActive : ""}`}
                >
                    전체
                </button>

                {emotionOptions.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedEmotion(item)}
                        className={`${Styles.filterButton} ${
                            selectedEmotion === item ? Styles.filterButtonActive : ""
                        }`}
                    >
                        {emotionLabels[item]}
                    </button>
                ))}
             </div>

             <div className={Styles.composer}>
                <textarea 
                    className={Styles.textarea}
                    placeholder="지금 감정을 나눠보세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                />

                <div className={Styles.composerFooter}>
                    <select
                        className={Styles.select}
                        value={emotion}
                        onChange={(e) => setEmotion(e.target.value as CommunityEmotion)}
                    >
                        {emotionOptions.map((item) => (
                            <option key={item} value={item}>
                                {emotionLabels[item]}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className={Styles.submitButton}
                        onClick={handleCreatePost}
                        disabled={submitting}
                    >
                        등록
                    </button>
                </div>
             </div>

        {loading ? (
            <p className={Styles.statusText}>불러오는 중...</p>
        ) : (
            <>
                <div className={Styles.postList}>
                    {posts.map((post) => (
                        <div key={post.id} className={Styles.postCard}>
                            <div className={Styles.postMeta}>
                                <strong className={Styles.nickname}>{post.nickname}</strong>
                                <span className={Styles.dot}>·</span>
                                <span className={Styles.emotionLabel}>
                                    {emotionLabels[post.emotion]}
                                </span>
                            </div>

                            <div className={Styles.postContent}>{post.content}</div>

                            <div className={Styles.reactionBar}>
                                <button
                                    type="button"
                                    onClick={() => handleReact(post.id, "EMPATHY")}
                                    disabled={reactingPostId === post.id}
                                    className={`${Styles.reactionButton} ${
                                        post.myReaction === "EMPATHY" ? Styles.reactionActive : ""
                                    }`}
                                >
                                    공감 {post.reactionSummary.empathyCount}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleReact(post.id, "COMFORT")}
                                    disabled={reactingPostId === post.id}
                                    className={`${Styles.reactionButton} ${
                                        post.myReaction === "COMFORT" ? Styles.reactionActive : ""
                                    }`}
                                >
                                    위로 {post.reactionSummary.comfortCount}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleReact(post.id, "CHEER")}
                                    disabled={reactingPostId === post.id}
                                    className={`${Styles.reactionButton} ${
                                        post.myReaction === "CHEER" ? Styles.reactionActive : ""
                                    }`}
                                >
                                    응원 {post.reactionSummary.cheerCount}
                                </button>
                            </div>

                            <div className={Styles.commentActionBar}>
                                <button
                                    type="button"
                                    className={Styles.commentToggleButton}
                                    onClick={() => handleToggleComments(post.id)}
                                >
                                    댓글 보기
                                </button>
                            </div>

                            {expandedPostIds.includes(post.id) && (
                                <div className={Styles.commentSection}>
                                    {loadingCommentPostId === post.id ? (
                                        <p className={Styles.commentStatus}>댓글 불러오는 중...</p>
                                    ) : (
                                        <>
                                            <div className={Styles.commentList}>
                                                {(commentsMap[post.id] || []).length === 0 ? (
                                                    <p className={Styles.commentStatus}>아직 댓글이 없습니다.</p>
                                                ) : (
                                                    commentsMap[post.id].map((comment) => (
                                                        <div key={comment.id} className={Styles.commentItem}>
                                                            <div className={Styles.commentMeta}>
                                                                <strong>{comment.nickname}</strong>
                                                                <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                                            </div>
                                                            <div className={Styles.commentContent}>{comment.content}</div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                            <div className={Styles.commentComposer}>
                                                <input 
                                                    type="text"
                                                    className={Styles.commentInput}
                                                    placeholder="댓들을 입력하세요"
                                                    value={commentInputs[post.id] || ""}
                                                    onChange={(e) =>
                                                        setCommentInputs((prev) => ({
                                                            ...prev,
                                                            [post.id]: e.target.value,
                                                        }))
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className={Styles.commentSubmitButton}
                                                    onClick={() => handleCreateComment(post.id)}
                                                    disabled={submittingCommentPostId === post.id}
                                                >
                                                    등록
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    <div ref={observerRef} style={{ height: "1px" }} />
                </div>

                {loadingMore && (
                    <p className={Styles.statusText}>게시글 더 불러오는 중...</p>
                )}

                {!hasNext && posts.length > 0 && (
                    <p className={Styles.statusText}>마지막 게시글입니다.</p>
                )}
            </>
        )}
        </div>
    );
};
export default CommunityPage;