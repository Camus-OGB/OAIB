import React, { useState } from 'react';
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
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0a192f]/90 backdrop-blur-md border-b border-[#f0f4f2] dark:border-white/10 transition-colors duration-300" role="banner">
      <div className="w-full px-6 md:px-8 lg:px-12 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="OAIB - Retour a l'accueil"
        >
          <div className="size-8 text-primary transition-all">
            <BrainCircuit className="w-full h-full" strokeWidth={2.5} />
          </div>
          <h2 className="text-[#111813] dark:text-white text-lg font-black tracking-tight uppercase transition-all">OAIB</h2>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Navigation principale">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 ${
                location.pathname === item.to ? 'text-primary' : 'hover:text-primary text-gray-800 dark:text-gray-300'
              }`}
              aria-current={location.pathname === item.to ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}

          <div className="h-5 w-px bg-gray-200 dark:bg-white/10 mx-2" aria-hidden="true"></div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
          </button>

          <Link
            to="/programme"
            className="cursor-pointer items-center justify-center rounded-lg h-9 px-5 bg-primary text-[#111813] text-sm font-bold transition-transform hover:scale-105 active:scale-95 shadow-md shadow-primary/20 inline-flex focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Rejoindre
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          </button>
          <button
            className="p-2 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#112240] border-b border-gray-100 dark:border-white/10 p-4 flex flex-col gap-4 shadow-xl"
          role="navigation"
          aria-label="Menu mobile"
        >
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={`text-left text-sm font-bold py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 ${
                location.pathname === item.to ? 'text-primary' : 'text-gray-800 dark:text-gray-200'
              }`}
              aria-current={location.pathname === item.to ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/programme"
            onClick={() => setIsMenuOpen(false)}
            className="w-full rounded-lg h-10 bg-primary text-[#111813] text-sm font-bold flex items-center justify-center"
          >
            Rejoindre
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
