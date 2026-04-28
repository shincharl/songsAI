import { useEffect, useState } from "react";
import styles from '../../styles/DiaryBanner.module.css'
import notebook from "../../assets/notebook.jpg"

const messages = [
    "오늘의 감정을 적어보세요.",
    "당신의 하루는 어떤 색이었나요?",
    "마음속 이야기를 들려주세요."
];

const DiaryBanner = () => {
    
    const [displayed, setDisplayed] = useState("");
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        let i = 0;
        setDisplayed("");

        const typing = setInterval(() => {
            setDisplayed(messages[msgIndex].slice(0, i+1));
            i++;
            if(i === messages[msgIndex].length) clearInterval(typing);
        }, 70);

        const nextMsg = setTimeout(() => {
            setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 5000);

        return () => {
            clearInterval(typing);
            clearTimeout(nextMsg);
        };
    }, [msgIndex]);

    return(
        <div className={styles.banner}>
            <img src={notebook} className={styles.bg} />

            <div className={styles.textArea}>
                <h1 className={styles.typing}>
                    {displayed}
                    <span className={styles.cursor}>|</span>
                </h1>
            </div>
        </div>
    );
};

export default DiaryBanner;