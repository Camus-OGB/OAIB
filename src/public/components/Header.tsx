import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BrainCircuit } from 'lucide-react';

const navItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Programme', to: '/programme' },
  { label: 'Resultats', to: '/resultats' },
  { label: 'A propos', to: '/a-propos' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 lg:px-8 pt-4"
      role="banner"
    >
      <div className={`mx-auto max-w-[1400px] transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 shadow-lg shadow-primary/10' 
          : 'bg-white/80'
      } backdrop-blur-xl rounded-2xl border border-border`}>
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="OAIB - Retour a l'accueil"
          >
            <div className={`flex items-center justify-center rounded-xl bg-primary transition-all ${isScrolled ? 'w-10 h-10' : 'w-11 h-11'}`}>
              <BrainCircuit className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-text text-lg font-black tracking-tight leading-none">OAIB</span>
              <span className="text-[10px] text-text-secondary font-medium tracking-wider hidden sm:block">OLYMPIADES IA BENIN</span>
            </div>
          </Link>

          {/* Desktop Nav - Centered */}
          <nav className="hidden lg:flex items-center" role="navigation" aria-label="Navigation principale">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    location.pathname === item.to 
                      ? 'bg-primary text-white' 
                      : 'text-text-secondary hover:text-text hover:bg-background-alt'
                  }`}
                  aria-current={location.pathname === item.to ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/connexion"
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-primary text-sm font-bold rounded-full hover:bg-primary/5 transition-all"
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="hidden md:inline-flex items-center justify-center px-6 py-3 bg-accent text-primary text-sm font-bold rounded-full hover:bg-accent-light hover:shadow-lg transition-all"
            >
              S'inscrire
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2.5 rounded-xl text-text hover:bg-background-alt transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        id="mobile-menu"
        className={`lg:hidden mx-4 mt-2 bg-white rounded-2xl border border-border shadow-xl overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        role="navigation"
        aria-label="Menu mobile"
      >
        <div className="px-6 py-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={`text-left text-sm font-semibold py-3 px-4 rounded-xl transition-all ${
                location.pathname === item.to 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-text-secondary hover:bg-background-alt hover:text-text'
              }`}
              aria-current={location.pathname === item.to ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 pt-2 border-t border-border flex flex-col gap-2">
            <Link
              to="/connexion"
              onClick={() => setIsMenuOpen(false)}
              className="w-full rounded-full py-3 border-2 border-primary text-primary text-sm font-bold flex items-center justify-center hover:bg-primary/5 transition-all"
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              onClick={() => setIsMenuOpen(false)}
              className="w-full rounded-full py-3.5 bg-gradient-to-r from-primary to-accent text-white text-sm font-bold flex items-center justify-center"
            >
              S'inscrire maintenant
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
