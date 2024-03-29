'use client';
import Link from 'next/link';
import styles from './header.module.scss';

export default function Header({ title }) {

  const VERSION = '2.0.0';

  return (
    <header className={styles.header}>
      <Link className={styles['home-link']} href="/" title="Back to menu">Home</Link>
      <h1 className={styles.title}>{title}</h1>
      <em className={styles.version}>v{VERSION}</em>
    </header>
  );
}
