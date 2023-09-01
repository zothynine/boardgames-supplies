'use client';
import styles from './card.module.scss';
import { useState } from "react";

export default function Card({ bgColor }) {

  const initialChain = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
  const initialExtraFields = [false, false, false, false, false, false, false, false];
  const [chain, setChain] = useState(initialChain);
  const [extraFields, setExtraFields] = useState(initialExtraFields);

  /**
  /* Handle button clicks
  /* @param {MouseEvent} event
  */
  function onButtonClick(event) {

    const target = event.target;
    const button = target.closest('button');
    if (!button) return;
    const value = button?.value || "";
    const currentChain = [...chain];
    const currentExtras = [...extraFields];

    switch (value) {
      case 'delete':
        if (chain[0] === '0') return;
        currentChain[currentChain.indexOf('0') - 1] = '0';
        if (currentChain[currentChain.length - 1] !== '0') currentChain[currentChain.length - 1] = '0';
        setChain(currentChain);
        break;

      case 'add':
        console.log(extraFields)
        currentExtras[currentExtras.indexOf(false)] = true;
        setExtraFields(currentExtras);
        break;

      case 'reset':
        const reset = confirm("Really reset?");

        if (reset) {
          setChain(initialChain);
          setExtraFields(initialExtraFields);
        }

        break;

      default:
        const index = currentChain.indexOf('0');
        if (index > 11 && extraFields[Math.abs(12 - index)] === false) return;
        currentChain[index] = value;
        setChain(currentChain);
        break;
    }
  }

  return (
    <div className={`${styles.panel} ${styles[bgColor]}`}>
      <div>
        <section className={styles.scores}>
          <div className={styles.score}>{chain[0] === '0' ? "" : chain[0]}</div>
          <div className={styles.score}>{chain[1] === '0' ? "" : chain[1]}</div>
          <div className={styles.score}>{chain[2] === '0' ? "" : chain[2]}</div>
          <div className={styles.score}>{chain[3] === '0' ? "" : chain[3]}</div>
          <div className={styles.score}>{chain[4] === '0' ? "" : chain[4]}</div>
          <div className={styles.score}>{chain[5] === '0' ? "" : chain[5]}</div>
          <div className={styles.score}>{chain[6] === '0' ? "" : chain[6]}</div>
          <div className={styles.score}>{chain[7] === '0' ? "" : chain[7]}</div>
          <div className={styles.score}>{chain[8] === '0' ? "" : chain[8]}</div>
          <div className={styles.score}>{chain[9] === '0' ? "" : chain[9]}</div>
          <div className={styles.score}>{chain[10] === '0' ? "" : chain[10]}</div>
          <div className={styles.score}>{chain[11] === '0' ? "" : chain[11]}</div>

          <div className={`${styles.score} ${styles.extra} ${extraFields[0] ? null : styles.disabled}`}>{chain[12] === '0' ? "" : chain[12]}</div>
          <div className={`${styles.score} ${styles.extra} ${extraFields[1] ? null : styles.disabled}`}>{chain[13] === '0' ? "" : chain[13]}</div>
          <div className={`${styles.score} ${styles.extra} ${extraFields[2] ? null : styles.disabled}`}>{chain[14] === '0' ? "" : chain[14]}</div>
          <div className={`${styles.score} ${styles.extra} ${extraFields[3] ? null : styles.disabled}`}>{chain[15] === '0' ? "" : chain[15]}</div>
          <div className={`${styles.score} ${styles.extra} ${extraFields[4] ? null : styles.disabled}`}>{chain[16] === '0' ? "" : chain[16]}</div>
          <div className={`${styles.score} ${styles.extra} ${extraFields[5] ? null : styles.disabled}`}>{chain[17] === '0' ? "" : chain[17]}</div>
          <div className={`${styles.score} ${styles.extra} ${extraFields[6] ? null : styles.disabled}`}>{chain[18] === '0' ? "" : chain[18]}</div>
          <div className={`${styles.score} ${styles.extra} ${extraFields[7] ? null : styles.disabled}`}>{chain[19] === '0' ? "" : chain[19]}</div>
        </section>

        <section className={styles.actions} onClick={onButtonClick}>
          <button className={styles.action} type="button" value="1"><span>1</span></button>
          <button className={styles.action} type="button" value="2"><span>2</span></button>
          <button className={styles.action} type="button" value="3"><span>3</span></button>
          <button className={styles.action} type="button" value="4"><span>4</span></button>
          <button className={styles.action} type="button" value="5"><span>5</span></button>
          <button className={styles.action} type="button" value="6"><span>6</span></button>

          <button className={styles.action} type="button" value="*"><span>*</span></button>
          <button className={styles.action} type="button" value="delete"><span>-1</span></button>
          <button className={styles.action} type="button" value="add"><span>+1</span></button>
          <button className={`${styles.action} ${styles.reset}`} type="button" value="reset"><span>Reset</span></button>
        </section>
      </div>
    </div>
  );
}
