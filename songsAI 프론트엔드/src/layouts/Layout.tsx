import Footer from "../components/Footer/Footer";
import Header from "../components/Header/header";
import styles from "../styles/Layout.module.css"

const Layout = ({children}) => {
    return(
        <div className={styles.container}>
            <Header/> {/* 상단 헤더 */}
            <main className={styles.main}>{children}</main>
            <Footer/>
        </div>
    );
};

export default Layout;