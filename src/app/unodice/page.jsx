import styles from './unodice.module.scss';
import Card from './card';

export const metadata = {
  title: 'BGS: UNODICE'
}

export default function UnoDice() {

  return (
    <div className={styles.game}>
      <Card bgColor='blue' />
      <Card bgColor='red' />
      <Card bgColor='orange' />
      <Card bgColor='green' />
    </div>
  );
}
