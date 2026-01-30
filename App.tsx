import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Results from './pages/Results';
import Program from './pages/Program';
import About from './pages/About';
import { Page } from './types';

const App: React.FC = () => {
  // Simple state-based routing for a single-page feel
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home onNavigate={setCurrentPage} />;
      case Page.RESULTS:
        return <Results />;
      case Page.PROGRAM:
        return <Program />;
      case Page.ABOUT:
        return <About />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  // Scroll to top on navigation
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div class="min-h-screen flex flex-col font-display bg-background-light dark:bg-[#0a192f] text-gray-900 dark:text-slate-100 transition-colors duration-300">
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
      />
      
      <main class="flex-grow w-full">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
};

export default App;