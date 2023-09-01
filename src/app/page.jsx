import '../styles/globals.scss';
import styles from './page.module.scss';
import Link from "next/link";

export default function Home() {

  return (
    <>
      <h2 className={styles.title}>Choose a game&hellip;</h2>
      <nav>
        <ul className={styles['app-list']}>
          <li>
            <Link className={styles['app-link']} href="/unodice">Uno Dice</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
