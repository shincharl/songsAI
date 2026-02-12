import styles from "../../styles/Home.module.css";

const Home = () => {
    return(
        <div className={styles.container}>
            <h1 className={styles.title}>홈페이지</h1>
            <p className={styles.description}>
                당신의 기분에 맞는 노래를 추천해드립니다.   
            </p>
            <button className={styles.button}>추천 받기</button>
        </div>
    );
};

export default Home;