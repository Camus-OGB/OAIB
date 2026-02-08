import React from 'react';
import { Settings } from 'lucide-react';
import CountdownConfig from '../components/CountdownConfig';
import CalendarEventsManager from '../components/CalendarEventsManager';

const SiteConfig: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-accent" />
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Configuration du Site</h1>
        </div>
        <p className="text-slate-400">
          Gérez le contenu dynamique affiché sur le site public (accueil et page programme)
        </p>
      </div>

      {/* Countdown Configuration */}
      <CountdownConfig />

      {/* Calendar Events Manager */}
      <CalendarEventsManager />
    </div>
  );
};

export default SiteConfig;
