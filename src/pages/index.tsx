import { type NextPage } from "next";
import { Layout } from "@/components/layout";
import Link from "next/link";

const Home: NextPage = () => {

  return (
    <Layout>
      <main>
        <h2>Choose a game&hellip;</h2>
        <ul>
          <li>
            <Link href="/unodice">Uno Dice</Link>
          </li>
        </ul>
      </main>
    </Layout>
  );
};

export default Home;
