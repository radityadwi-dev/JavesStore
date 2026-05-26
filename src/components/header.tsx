import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import '../assets/header.css';
import Sidebar from './Sidebar';
import javesLogo from '../assets/pict/javes-logo-clean.png';
import { supportWhatsAppHref } from '../data/site-content';

const navLinks = [
  { label: 'Tentang', href: '#/about' },
  { label: 'Kontak', href: '#/contact' },
  { label: 'Privasi', href: '#/privacy-policy' },
  { label: 'Ketentuan', href: '#/terms' },
];

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    document.body.style.paddingRight = isSidebarOpen && scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isSidebarOpen]);

  return (
    <>
      <header className="site-header">
        <div className="site-header-left">
          <button
            type="button"
            className="site-menu-button"
            aria-label="Buka menu"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <a
            href="#/"
            className="site-brand"
            onClick={() => {
              setIsSidebarOpen(false);
            }}
          >
            <img src={javesLogo} alt="Logo Javes Store" className="site-brand-logo" />
            <span>Javes Topup</span>
          </a>
        </div>

        <nav className="site-header-nav" aria-label="Navigasi halaman informasi">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="site-header-link">
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={supportWhatsAppHref}
          target="_blank"
          rel="noreferrer"
          className="site-header-support"
        >
          CS WhatsApp
        </a>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Header;
