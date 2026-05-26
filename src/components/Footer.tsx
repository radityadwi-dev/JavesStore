import '../assets/footer.css';
import {
  supportEmail,
  supportWhatsAppHref,
  supportWhatsAppNumber,
} from '../data/site-content';

const footerLinks = [
  { label: 'Tentang Kami', href: '#/about' },
  { label: 'Kontak Support', href: '#/contact' },
  { label: 'Kebijakan Privasi', href: '#/privacy-policy' },
  { label: 'Ketentuan Layanan', href: '#/terms' },
];

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="site-footer-brand">
          <span className="site-footer-kicker">Javes Store</span>
          <h2>Top up game digital cepat, aman, dan siap bantu customer setiap hari.</h2>
          <p>
            Merchant digital untuk kebutuhan top up game populer dengan alur checkout yang simple
            dan dukungan customer service via WhatsApp.
          </p>
        </div>

        <div className="site-footer-links">
          <div className="site-footer-column">
            <span className="site-footer-heading">Halaman</span>
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="site-footer-link">
                {link.label}
              </a>
            ))}
          </div>

          <div className="site-footer-column">
            <span className="site-footer-heading">Support</span>
            <a
              href={supportWhatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="site-footer-link"
            >
              WhatsApp: {supportWhatsAppNumber}
            </a>
            <a href={`mailto:${supportEmail}`} className="site-footer-link">
              Email: {supportEmail}
            </a>
            <span className="site-footer-meta">Jam operasional 24 jam</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
