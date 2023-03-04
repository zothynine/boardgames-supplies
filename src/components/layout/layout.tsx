import { Header } from '@/components/header';
import Head from 'next/head';

type Props = {
  children: React.ReactNode,
  title?: String
}

export default function Layout({ children, title }: Props) {

  const defaultTitle = 'Boardgames Supplies';
  const renderedTitle = !title ? defaultTitle : `BGS: ${title}`

  return (
    <>
      <Head>
        <title>{renderedTitle}</title>
        <meta name="description" content="A collection of digital supplies for physical boardgames" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header title={renderedTitle} />
        {children}
      </main>
    </>
  );
}