import styles from "./war.module.css";
const War = () => {
  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
      <p className={styles.abzac}>
        ВГ-атаки только по назначенным целям, иначе Сибиряк внезапно выдаст
        артефакт за шиворот. Список чемпионов формируется, исходя из аморальных
        соображений генерала. Атака по цели без цели-освобождение от чемпионства навсегда. Идете исполнять наказание, которое выбирает вам Сибиряк.
      </p>
      </header>
    </div>
  );
};

export default War;