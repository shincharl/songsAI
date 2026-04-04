import styles from "../../styles/DiarySearchBox.module.css"

interface DiarySearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    placeholder?: string;
}

const DiarySearchBox = ({
    value,
    onChange,
    onSearch,
    placeholder = "기록 검색하기",
}: DiarySearchBoxProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter"){
            onSearch();
        }
    };


    return (
        <div className={styles.searchBox}>
            <input 
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.searchInput}    
            />
            <button
                type="button"
                className={styles.searchBtn}
                onClick={onSearch}
                aria-label="검색"
            >
                🔍
            </button>
        </div>
    );
};

export default DiarySearchBox;