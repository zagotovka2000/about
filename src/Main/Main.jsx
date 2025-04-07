import styles from "./main.module.css";
const Main = () => {
  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
        <p className={styles.header_abzac}>
          <span>
            Временная заметка гильдии
            {/* В будущем исправлю минизаметку на что-то вроде небольшого сайта,
            куда будем сваливать в кучу что-то полезное и вообще бесполезное.
            Временная заметка написана для тех,
            кто пришел сюда впервые, чтобы не распинаться в чате игры.
            Гильдия с небольшими, но строгими требованиями, ориентированными на
            бездонатного, но активного игрока. */}
          </span>
        </p>
      </header>
    </div>
  );
};

export default Main;
