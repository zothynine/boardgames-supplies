import { Layout } from "@/components/layout";
import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Boardgames Supplies</title>
        <meta name="description" content="A collection of digital supplies for physical boardgames" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        Boardgames Supplies
      </main>
    </Layout>
  );
};

export default Home;
