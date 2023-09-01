import styles from './layout.module.scss';
import Header from './header/header';

export const metadata = {
  title: 'Boardgames Supplies',
  description: 'Digital substitutes for broken parts of your boardgames.',
  favicon: '/favicon.ico',
}

export default function RootLayout({ children, title }) {

  const defaultTitle = 'Boardgames Supplies';
  const renderedTitle = !title ? defaultTitle : `BGS: ${title}`;

  return (
    <html lang="en">
      <body>
        <Header title={renderedTitle} />
        <main className={styles.layout}>
          {children}
        </main>
      </body>
    </html>
  )
}
