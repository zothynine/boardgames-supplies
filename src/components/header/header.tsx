import Link from 'next/link';

type Props = {
  title: String
}

export default function Header({ title }: Props) {

  return (
    <header>
      <Link href="/" title="Back to menu">Home</Link>
      <h1>{title}</h1>
    </header>
  );
}