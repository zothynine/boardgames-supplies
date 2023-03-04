import styles from './card.module.scss';

type Props = {
  bgColor: string
}

export default function Card({ bgColor }: Props) {

  const chain = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];

  return (
    <div className={`${styles.panel} ${styles[bgColor]}`}>
      <div>
        <section className={styles.scores}>
          <div className={styles.score}>{chain[0] || ""}</div>
          <div className={styles.score}>{chain[1] || ""}</div>
          <div className={styles.score}>{chain[2] || ""}</div>
          <div className={styles.score}>{chain[3] || ""}</div>
          <div className={styles.score}>{chain[4] || ""}</div>
          <div className={styles.score}>{chain[5] || ""}</div>
          <div className={styles.score}>{chain[6] || ""}</div>
          <div className={styles.score}>{chain[7] || ""}</div>
          <div className={styles.score}>{chain[8] || ""}</div>
          <div className={styles.score}>{chain[9] || ""}</div>
          <div className={styles.score}>{chain[10] || ""}</div>
          <div className={styles.score}>{chain[11] || ""}</div>
          <div className={`${styles.score} ${styles.extra} ${styles.disabled}`}>{chain[12] || ""}</div>
          <div className={`${styles.score} ${styles.extra} ${styles.disabled}`}>{chain[13] || ""}</div>
          <div className={`${styles.score} ${styles.extra} ${styles.disabled}`}>{chain[14] || ""}</div>
          <div className={`${styles.score} ${styles.extra} ${styles.disabled}`}>{chain[15] || ""}</div>
          <div className={`${styles.score} ${styles.extra} ${styles.disabled}`}>{chain[16] || ""}</div>
          <div className={`${styles.score} ${styles.extra} ${styles.disabled}`}>{chain[17] || ""}</div>
          <div className={`${styles.score} ${styles.extra} ${styles.disabled}`}>{chain[18] || ""}</div>
          <div className={`${styles.score} ${styles.extra} ${styles.disabled}`}>{chain[19] || ""}</div>
        </section>

        <section className={styles.actions}>
          <button className={styles.action} type="button" value="1"><span>1</span></button>
          <button className={styles.action} type="button" value="2"><span>2</span></button>
          <button className={styles.action} type="button" value="3"><span>3</span></button>
          <button className={styles.action} type="button" value="4"><span>4</span></button>
          <button className={styles.action} type="button" value="5"><span>5</span></button>
          <button className={styles.action} type="button" value="6"><span>6</span></button>

          <button className={styles.action} type="button" value="*"><span>*</span></button>
          <button className={styles.action} type="button" value="delete"><span>-1</span></button>
          <button className={styles.action} type="button" value="add"><span>+1</span></button>
          <button className={`${styles.action} ${styles.reset}`} type="button"><span>Reset</span></button>
        </section>
      </div>
    </div>
  );
}