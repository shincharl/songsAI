import Login from "../../components/Login/Login";
import MainBanner from "../../components/MainBanner/Mainbanner";
import styles from "../../styles/Home.module.css";

const Home = () => {
    return(
        <div className={styles.container}>
                <MainBanner/>
                <Login/>
        </div>
    );
};

export default Home;