import '../assets/info-page.css';
import {
  staticPages,
  supportEmail,
  supportWhatsAppHref,
  supportWhatsAppNumber,
  type StaticPageSlug,
} from '../data/site-content';

interface InfoPageProps {
  slug: StaticPageSlug;
}

const InfoPage = ({ slug }: InfoPageProps) => {
  const page = staticPages[slug];

  return (
    <section className="info-page-section">
      <div className="info-page-container">
        <div className="info-page-hero">
          <p className="info-page-eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="info-page-intro">{page.intro}</p>

          {slug === 'contact' ? (
            <div className="info-page-actions">
              <a
                href={supportWhatsAppHref}
                target="_blank"
                rel="noreferrer"
                className="info-page-button is-primary"
              >
                Chat WhatsApp
              </a>
              <a href={`mailto:${supportEmail}`} className="info-page-button is-secondary">
                Kirim Email
              </a>
            </div>
          ) : null}
        </div>

        <div className="info-page-grid">
          {page.sections.map((section) => (
            <article className="info-page-card" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>

        {slug === 'contact' ? (
          <aside className="info-page-support-card">
            <div>
              <span className="info-page-support-label">Customer Service Javes Store</span>
              <strong>{supportWhatsAppNumber}</strong>
              <p>Hubungi WhatsApp untuk bantuan pesanan, komplain transaksi, atau konfirmasi pembayaran.</p>
            </div>
            <a
              href={supportWhatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="info-page-button is-primary"
            >
              Buka WhatsApp Support
            </a>
          </aside>
        ) : null}
      </div>
    </section>
  );
};

export default InfoPage;
