import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-display bg-[#e8eeea] dark:bg-[#0a192f] text-gray-900 dark:text-slate-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
