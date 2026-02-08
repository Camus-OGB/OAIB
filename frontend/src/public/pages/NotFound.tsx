import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { usePageTitle } from '../../shared/hooks/usePageTitle';

const NotFound: React.FC = () => {
  usePageTitle('Page introuvable');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-8xl font-black text-primary mb-4">404</p>
      <h1 className="text-3xl font-bold text-[#111813] dark:text-white mb-4">Page introuvable</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        La page que vous recherchez n'existe pas ou a ete deplacee.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:scale-105 transition-transform"
        >
          <Home size={18} />
          Accueil
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={18} />
          Retour
        </button>
      </div>
    </div>
  );
};

export default NotFound;
