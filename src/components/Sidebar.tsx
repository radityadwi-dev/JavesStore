import { FileText, Headphones, Home, Info, ShieldCheck, X } from 'lucide-react';
import '../assets/sidebar.css';
import sidebarLogo from '../assets/pict/sidebar-logo.jpeg';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'Beranda', icon: Home, href: '#/' },
  { label: 'Tentang Kami', icon: Info, href: '#/about' },
  { label: 'Kontak Support', icon: Headphones, href: '#/contact' },
  { label: 'Kebijakan Privasi', icon: ShieldCheck, href: '#/privacy-policy' },
  { label: 'Ketentuan Layanan', icon: FileText, href: '#/terms' },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside className={`site-sidebar ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <div className="site-sidebar-top">
          <div className="site-sidebar-brand">
            <img src={sidebarLogo} alt="Logo Javes Store" className="site-sidebar-logo" />
            <div>
              <strong>Javes Store</strong>
              <span>Top up game cepat dan aman</span>
            </div>
          </div>

          <button
            type="button"
            className="site-sidebar-close"
            aria-label="Tutup menu"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="site-sidebar-nav" aria-label="Menu utama">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                className="site-sidebar-link"
                href={item.href}
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
