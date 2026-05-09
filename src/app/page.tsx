import Home from '@/components/home/home';
import { HomeJsonLd } from '@/components/seo/home-jsonld';

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Home />
    </>
  );
}
