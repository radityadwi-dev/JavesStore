import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard';
import '../assets/homepage.css';
import { games } from '../data/games';
import homeBannerOne from '../assets/pict/home-banner-1.png';
import homeBannerTwo from '../assets/pict/home-banner-2.png';
import homeBannerThree from '../assets/pict/home-banner-3.png';

interface HomePageProps {
  onSelectGame: (slug: string) => void;
}

const heroBanners = [
  { id: 'home-banner-1', src: homeBannerOne, alt: 'Banner promo utama Javes Store 1' },
  { id: 'home-banner-2', src: homeBannerTwo, alt: 'Banner promo utama Javes Store 2' },
  { id: 'home-banner-3', src: homeBannerThree, alt: 'Banner promo utama Javes Store 3' },
];

const loopingHeroBanners = [...heroBanners, heroBanners[0]];
const INITIAL_EAGER_CARD_COUNT = 6;

const HomePage = ({ onSelectGame }: HomePageProps) => {
  const [activeBanner, setActiveBanner] = useState(0);
  const [isBannerAnimating, setIsBannerAnimating] = useState(true);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsBannerAnimating(true);
      setActiveBanner((currentBanner) => currentBanner + 1);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    heroBanners.forEach((banner) => {
      const image = new Image();
      image.src = banner.src;
    });
  }, []);

  useEffect(() => {
    if (!isBannerAnimating) {
      const timeoutId = window.setTimeout(() => {
        setIsBannerAnimating(true);
      }, 40);

      return () => window.clearTimeout(timeoutId);
    }
  }, [isBannerAnimating]);

  const showPreviousBanner = () => {
    setIsBannerAnimating(true);
    setActiveBanner((currentBanner) => {
      if (currentBanner === 0) {
        return heroBanners.length - 1;
      }

      return currentBanner - 1;
    });
  };

  const showNextBanner = () => {
    setIsBannerAnimating(true);
    setActiveBanner((currentBanner) => currentBanner + 1);
  };

  const handleBannerTransitionEnd = () => {
    if (activeBanner !== heroBanners.length) {
      return;
    }

    setIsBannerAnimating(false);
    setActiveBanner(0);
  };

  return (
    <section className="home-section">
      <div className="home-banner-shell">
        <div className="home-banner">
          <div
            className={`home-banner-track ${isBannerAnimating ? '' : 'is-resetting'}`.trim()}
            style={{ transform: `translateX(-${activeBanner * 100}%)` }}
            onTransitionEnd={handleBannerTransitionEnd}
          >
            {loopingHeroBanners.map((banner, index) => (
              <div className="home-banner-slide" key={`${banner.id}-${index}`}>
                <img
                  src={banner.src}
                  alt={index === heroBanners.length ? '' : banner.alt}
                  className="home-banner-image"
                  aria-hidden={index === heroBanners.length}
                  loading="eager"
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="home-banner-nav is-prev"
            onClick={showPreviousBanner}
            aria-label="Banner sebelumnya"
          >
            &#8249;
          </button>
          <button
            type="button"
            className="home-banner-nav is-next"
            onClick={showNextBanner}
            aria-label="Banner berikutnya"
          >
            &#8250;
          </button>

          <div className="home-banner-dots" aria-label="Pilih banner utama">
            {heroBanners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                className={`home-banner-dot ${index === activeBanner % heroBanners.length ? 'is-active' : ''}`}
                onClick={() => {
                  setIsBannerAnimating(true);
                  setActiveBanner(index);
                }}
                aria-label={`Tampilkan banner ${index + 1}`}
                aria-pressed={index === activeBanner % heroBanners.length}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="home-container">
        <div className="section-header">
          <div>
            <p className="section-kicker">Pilihan Utama</p>
            <div className="section-title-row">
              <div className="section-inline-tabs" role="tablist" aria-label="Pilih kategori">
                <button
                  type="button"
                  role="tab"
                  aria-selected="true"
                  className="section-inline-tab is-active"
                >
                  Game Populer
                </button>
                <span className="section-inline-indicator is-popular" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        <div className="section-divider"></div>

        <div className="game-grid">
          {games.map((item, index) => (
            <GameCard
              key={item.id}
              title={item.title}
              accent={item.accent}
              imageSrc={'image' in item ? item.image : undefined}
              imageFit={'cardImageFit' in item ? item.cardImageFit ?? item.imageFit : undefined}
              imagePosition={'cardImagePosition' in item ? item.cardImagePosition ?? item.imagePosition : undefined}
              imageScale={'cardImageScale' in item ? item.cardImageScale ?? item.imageScale : undefined}
              imageLoading={'image' in item ? (index < INITIAL_EAGER_CARD_COUNT ? 'eager' : 'lazy') : undefined}
              imageFetchPriority={'image' in item ? (index < INITIAL_EAGER_CARD_COUNT ? 'auto' : 'low') : undefined}
              onClick={'slug' in item ? () => onSelectGame(item.slug) : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
