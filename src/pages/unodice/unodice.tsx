import { type NextPage } from "next";
import { Layout } from "@/components/layout";
import styles from './unodice.module.scss';
import { Card } from "@/components/unodice/card";

const UnoDice: NextPage = () => {

  return (
    <Layout title="Uno Dice">
      <div className={styles.game}>
        <Card bgColor='blue' />
        <Card bgColor='red' />
        <Card bgColor='orange' />
        <Card bgColor='green' />
      </div>
    </Layout>
  );
}

export default UnoDice;