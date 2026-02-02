import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { ScrollToTopOnNav, ScrollToTopButton } from './components/ScrollToTop';
import { PageSkeleton } from './components/Skeleton';

const Home = lazy(() => import('./pages/Home'));
const Results = lazy(() => import('./pages/Results'));
const Program = lazy(() => import('./pages/Program'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col font-display bg-[#e8eeea] dark:bg-[#0a192f] text-gray-900 dark:text-slate-100 transition-colors duration-300">
          <ScrollToTopOnNav />
          <Header />
          <main className="flex-grow w-full">
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/programme" element={<Program />} />
                <Route path="/resultats" element={<Results />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ScrollToTopButton />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
