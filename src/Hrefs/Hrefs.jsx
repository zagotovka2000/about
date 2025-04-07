import styles from "./hrefs.module.css";
const Hrefs = () => {
  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
        <p className={styles.abzac}>
          <span>Телеграмм группа: </span>{" "}
          <a href="#">Недоступна до вступления в гильдию</a>{" "}
          {/* "https://t.me/+Yt1yDpHxFxo2Njcy" */}
        </p>
        <p className={styles.abzac}>
          <span>Приключения: </span>{" "}
          <a href="https://www.solfors.com/adventure/1">Solfors</a>{" "}
        </p>
        <p className={styles.abzac}>
          <span>Калькулятор героев: </span>{" "}
          <a href="https://morevokne.ru/?p=3399">Неинтересный хлам</a>{" "}
        </p>
        <p>
          Командующим генералам и не только можно поставить дополнительное
          расширение "Хроники Хаоса Аналитика", если интересна сухая статистика
          аккаунта. Открывать можно буквой "Ё" во время запущенной игры.
        </p>
      </header>
    </div>
  );
};

export default Hrefs;
