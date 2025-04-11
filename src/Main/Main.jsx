import styles from "./main.module.css";
const Main = () => {
  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
        <p className={styles.header_abzac}>
          <img 
            src='../logo.png' 
            className={styles.logo} 
          />
          <span className={styles.text}>
            Временная заметка гильдии
          </span>
          <img 
            src='../logo.png' 
            className={styles.logo} 
          />
        </p>
      </header>
    </div>
  );
};

export default Main;