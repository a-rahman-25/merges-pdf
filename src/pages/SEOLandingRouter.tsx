import { useParams } from 'react-router-dom';
import SEOLandingPage, { landingPages } from '@/pages/SEOLanding';
import NotFound from '@/pages/NotFound';

const SEOLandingRouter = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = landingPages.find(p => p.slug === slug);
  if (!page) return <NotFound />;
  return <SEOLandingPage page={page} />;
};

export default SEOLandingRouter;
