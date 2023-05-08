import { type NextPage } from "next";
import { Layout } from "@/components/layout";
import Link from "next/link";
import styles from './index.module.scss';

const Home: NextPage = () => {

  return (
    <Layout>
      <h2 className={styles.title}>Choose a game&hellip;</h2>
      <nav>
        <ul className={styles['app-list']}>
          <li>
            <Link className={styles['app-link']} href="/unodice">Uno Dice</Link>
          </li>
        </ul>
      </nav>
    </Layout>
  );
};

export default Home;
