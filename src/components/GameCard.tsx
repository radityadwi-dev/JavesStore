import "../assets/GameCard.css";

interface GameCardProps {
  title: string;
  accent: string;
  imageSrc?: string;
  imageFit?: 'cover' | 'contain';
  imagePosition?: string;
  imageScale?: string;
  imageLoading?: 'eager' | 'lazy';
  imageFetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
}

const GameCard = ({
  title,
  accent,
  imageSrc,
  imageFit = 'cover',
  imagePosition = 'center',
  imageScale = '100%',
  imageLoading = 'lazy',
  imageFetchPriority = 'auto',
  onClick,
}: GameCardProps) => {
  const content = (
    <div className={`card-image-wrapper ${accent}`}>
      {imageSrc ? (
        <div className="card-artwork">
          <img
            src={imageSrc}
            alt={title}
            className={`card-artwork-image ${imageFit === 'contain' ? 'is-contain' : 'is-cover'}`}
            loading={imageLoading}
            decoding="async"
            fetchPriority={imageFetchPriority}
            style={{
              objectPosition: imagePosition,
              transform: `scale(${Number.parseFloat(imageScale) / 100})`,
            }}
          />
        </div>
      ) : null}
      <div className="card-pattern"></div>
      <div className="card-overlay">
        <h3 className="card-title">{title}</h3>
      </div>
    </div>
  );

  return (
    <article className="card-item">
      {onClick ? (
        <button type="button" className="card-button" onClick={onClick}>
          {content}
        </button>
      ) : (
        <div className="card-surface">{content}</div>
      )}
    </article>
  );
};

export default GameCard;
