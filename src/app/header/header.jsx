'use client';
import Link from 'next/link';
import styles from './header.module.scss';
import { useSelectedLayoutSegment } from 'next/navigation';

export default function Header() {

  const VERSION = '2.0.0';
  const segment = useSelectedLayoutSegment();
  const title = segment
    ? `BGS: ${segment}`
    : 'Boardgames Supplies';

  return (
    <header className={styles.header}>
      <Link className={styles['home-link']} href="/" title="Back to menu">Home</Link>
      <h1 className={styles.title}>{title}</h1>
      <em className={styles.version}>v{VERSION}</em>
    </header>
  );
}
