import styles from "./sm.module.css";

const Sm = () => {
  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
        <p className={styles.abzac}>
          <p> - атаки только по назначенным целям.</p>
          <p>
            - cвободная атака на любые укрепления, ЕСЛИ об этом напишет
            командующий.
          </p>
          <p>
            - cвободная атака на КОНКРЕТНЫЕ укрепления, ЕСЛИ об этом напишет
            командующий.
          </p>
          <p>
            - иные атаки, после чего лучше просто убегайте от командующего
            куда-нибудь в космос. Командующий выбирает для вас наказание сам.
          </p>
        </p>
      </header>
    </div>
  );
};

export default Sm;
