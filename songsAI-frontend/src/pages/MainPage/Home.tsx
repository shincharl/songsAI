import DiaryWriteCallout from "../../components/DiaryWriteCallout/DiaryWriteCallout";
import EmotionPlaylistCard from "../../components/EmotionPlaylistCard/EmotionPlaylistCard";
import Login from "../../components/Login/Login";
import MainBanner from "../../components/MainBanner/Mainbanner";
import PopularCommuniryPreview from "../../components/PopularCommunityPreview/PopularCommunityPreview";
import RecentDiaryPreview from "../../components/RecentDiaryPreview/RecentDiaryPreview";
import TodayEmotionPreview from "../../components/TodayEmotionPreview/TodayEmotionPreview";
import styles from "../../styles/Home.module.css";

const Home = () => {
    return(
        <main className={styles.page}>
            <div className={styles.homeGrid}>
                <section className={styles.leftColumn}>
                    <MainBanner/>
                    <TodayEmotionPreview />
                    <RecentDiaryPreview />
                </section>

                <aside className={styles.rightColumn}>
                    <Login />
                    <EmotionPlaylistCard/>
                    <PopularCommuniryPreview/>
                </aside>
            </div>

            <DiaryWriteCallout/>
        </main>
    );
};

export default Home;