import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/header";
import styles from "../styles/Layout.module.css"

const Layout = () => {
    return(
        <div className={styles.container}>
            <Header/> {/* 상단 헤더 */}
                <main className={styles.main}>
                    <Outlet/>
                </main>
            <Footer/>
        </div>
    );
}; 

export default Layout;