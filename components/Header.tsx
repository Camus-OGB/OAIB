import React, { useState } from 'react';
import { Page } from '../types';
import { Menu, X, BrainCircuit, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, isDark, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Accueil', page: Page.HOME },
    { label: 'Programme', page: Page.PROGRAM },
    { label: 'Résultats', page: Page.RESULTS },
    { label: 'À propos', page: Page.ABOUT },
  ];

  return (
    <header class="sticky top-0 z-50 bg-white/90 dark:bg-[#0a192f]/90 backdrop-blur-md border-b border-[#f0f4f2] dark:border-white/10 transition-colors duration-300">
      <div class="w-full px-6 md:px-8 lg:px-12 py-3 flex items-center justify-between">
        <div 
          class="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate(Page.HOME)}
        >
          <div class="size-8 text-primary transition-all">
             <BrainCircuit className="w-full h-full" strokeWidth={2.5} />
          </div>
          <h2 class="text-[#111813] dark:text-white text-lg font-black tracking-tight uppercase transition-all">OAIB</h2>
        </div>

        {/* Desktop Nav */}
        <nav class="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              class={`text-sm font-semibold transition-colors ${
                currentPage === item.page ? 'text-primary' : 'hover:text-primary text-gray-800 dark:text-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div class="h-5 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>

          <button 
            onClick={toggleTheme}
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
          </button>

          <button class="cursor-pointer items-center justify-center rounded-lg h-9 px-5 bg-primary text-[#111813] text-sm font-bold transition-transform hover:scale-105 active:scale-95 shadow-md shadow-primary/20">
            Rejoindre
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div class="md:hidden flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
          >
            {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          </button>
          <button 
            class="p-2 text-gray-800 dark:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div class="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#112240] border-b border-gray-100 dark:border-white/10 p-4 flex flex-col gap-4 shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onNavigate(item.page);
                setIsMenuOpen(false);
              }}
              class={`text-left text-sm font-bold py-2 ${
                currentPage === item.page ? 'text-primary' : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button class="w-full rounded-lg h-10 bg-primary text-[#111813] text-sm font-bold">
            Rejoindre
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;