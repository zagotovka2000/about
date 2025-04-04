import styles from "./asgard.module.css";
const Asgard = () => {
  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
        <p className={styles.abzac}>
          Асгард-без напоминаний ВСЕ бьют босса независимо от вида босса и его
          уровня.Не ударить асгард до понедельника означает отсутствие у игрока желания учавствовать в
          общегильдейском событии. Следует выполнить наказание №1. 
        </p>
      </header>
    </div>
  );
};

export default Asgard;
