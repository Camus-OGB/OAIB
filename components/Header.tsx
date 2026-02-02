import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BrainCircuit, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Programme', to: '/programme' },
  { label: 'Resultats', to: '/resultats' },
  { label: 'A propos', to: '/a-propos' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
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
      <div className={`mx-auto max-w-6xl transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-[#0a192f]/95 shadow-xl' 
          : 'bg-white/80 dark:bg-[#0a192f]/80'
      } backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10`}>
        <div className="flex items-center justify-between px-5 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="OAIB - Retour a l'accueil"
          >
            <div className={`flex items-center justify-center rounded-xl bg-primary transition-all ${isScrolled ? 'w-9 h-9' : 'w-10 h-10'}`}>
              <BrainCircuit className="w-5 h-5 text-tech-blue" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-white text-base font-black tracking-tight leading-none">OAIB</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider hidden sm:block">OLYMPIADES IA BENIN</span>
            </div>
          </Link>

          {/* Desktop Nav - Centered */}
          <nav className="hidden lg:flex items-center" role="navigation" aria-label="Navigation principale">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                    location.pathname === item.to 
                      ? 'bg-primary text-tech-blue' 
                      : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
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
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
            </button>

            <Link
              to="/programme"
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 bg-primary text-tech-blue text-sm font-bold rounded-xl hover:shadow-[0_0_20px_rgba(19,236,91,0.4)] transition-all"
            >
              S'inscrire
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2.5 rounded-xl text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
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
        className={`lg:hidden mx-4 mt-2 bg-white dark:bg-[#0a192f] rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-300 ${
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
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
              aria-current={location.pathname === item.to ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/programme"
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 w-full rounded-xl py-3.5 bg-tech-blue dark:bg-primary text-white dark:text-tech-blue text-sm font-bold flex items-center justify-center"
          >
            S'inscrire maintenant
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
