import React from 'react';

// Motif de réseau neuronal - points connectés
export const NeuralNetworkPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="neural-dots" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <circle cx="25" cy="25" r="2" fill="currentColor" opacity="0.3" />
      </pattern>
    </defs>
    {/* Nodes */}
    <circle cx="50" cy="100" r="8" fill="currentColor" opacity="0.15" />
    <circle cx="50" cy="200" r="8" fill="currentColor" opacity="0.15" />
    <circle cx="50" cy="300" r="8" fill="currentColor" opacity="0.15" />
    <circle cx="150" cy="80" r="6" fill="currentColor" opacity="0.2" />
    <circle cx="150" cy="160" r="6" fill="currentColor" opacity="0.2" />
    <circle cx="150" cy="240" r="6" fill="currentColor" opacity="0.2" />
    <circle cx="150" cy="320" r="6" fill="currentColor" opacity="0.2" />
    <circle cx="250" cy="120" r="6" fill="currentColor" opacity="0.2" />
    <circle cx="250" cy="200" r="6" fill="currentColor" opacity="0.2" />
    <circle cx="250" cy="280" r="6" fill="currentColor" opacity="0.2" />
    <circle cx="350" cy="150" r="8" fill="currentColor" opacity="0.15" />
    <circle cx="350" cy="250" r="8" fill="currentColor" opacity="0.15" />
    {/* Connections */}
    <line x1="50" y1="100" x2="150" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="50" y1="100" x2="150" y2="160" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="50" y1="200" x2="150" y2="160" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="50" y1="200" x2="150" y2="240" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="50" y1="300" x2="150" y2="240" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="50" y1="300" x2="150" y2="320" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="150" y1="80" x2="250" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="150" y1="160" x2="250" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="150" y1="160" x2="250" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="150" y1="240" x2="250" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="150" y1="240" x2="250" y2="280" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="150" y1="320" x2="250" y2="280" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="250" y1="120" x2="350" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="250" y1="200" x2="350" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="250" y1="200" x2="350" y2="250" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="250" y1="280" x2="350" y2="250" stroke="currentColor" strokeWidth="1" opacity="0.1" />
  </svg>
);

// Motif de circuit / données binaires
export const CircuitPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Horizontal lines */}
    <path d="M0 50 H100 V100 H150" stroke="currentColor" strokeWidth="2" opacity="0.35" fill="none" />
    <path d="M0 150 H80 V200 H200" stroke="currentColor" strokeWidth="2" opacity="0.35" fill="none" />
    <path d="M0 250 H120" stroke="currentColor" strokeWidth="2" opacity="0.35" fill="none" />
    <path d="M200 50 H300" stroke="currentColor" strokeWidth="2" opacity="0.35" fill="none" />
    <path d="M250 150 H300" stroke="currentColor" strokeWidth="2" opacity="0.35" fill="none" />
    {/* Junction dots */}
    <circle cx="100" cy="50" r="5" fill="currentColor" opacity="0.5" />
    <circle cx="150" cy="100" r="5" fill="currentColor" opacity="0.5" />
    <circle cx="80" cy="150" r="5" fill="currentColor" opacity="0.5" />
    <circle cx="200" cy="200" r="5" fill="currentColor" opacity="0.5" />
    <circle cx="120" cy="250" r="5" fill="currentColor" opacity="0.5" />
    <circle cx="200" cy="50" r="5" fill="currentColor" opacity="0.5" />
    <circle cx="250" cy="150" r="5" fill="currentColor" opacity="0.5" />
    {/* Vertical connections */}
    <path d="M100 50 V150 H150" stroke="currentColor" strokeWidth="2" opacity="0.25" fill="none" />
    <path d="M200 50 V100 H250 V200" stroke="currentColor" strokeWidth="2" opacity="0.25" fill="none" />
  </svg>
);

// Motif de données / flux
export const DataFlowPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Flowing curves */}
    <path d="M0 50 Q50 100 100 80 T200 120" stroke="currentColor" strokeWidth="2" opacity="0.08" fill="none" />
    <path d="M0 150 Q60 180 100 160 T200 200" stroke="currentColor" strokeWidth="2" opacity="0.1" fill="none" />
    <path d="M0 250 Q40 300 100 270 T200 320" stroke="currentColor" strokeWidth="2" opacity="0.08" fill="none" />
    <path d="M0 350 Q70 370 100 350 T200 380" stroke="currentColor" strokeWidth="2" opacity="0.06" fill="none" />
    {/* Data points along curves */}
    <circle cx="50" cy="75" r="3" fill="currentColor" opacity="0.15" />
    <circle cx="100" cy="80" r="3" fill="currentColor" opacity="0.15" />
    <circle cx="150" cy="100" r="3" fill="currentColor" opacity="0.15" />
    <circle cx="60" cy="170" r="3" fill="currentColor" opacity="0.2" />
    <circle cx="120" cy="165" r="3" fill="currentColor" opacity="0.2" />
    <circle cx="40" cy="285" r="3" fill="currentColor" opacity="0.15" />
    <circle cx="100" cy="270" r="3" fill="currentColor" opacity="0.15" />
  </svg>
);

// Motif hexagonal / structure moléculaire
export const HexagonPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hexagons */}
    <polygon points="75,25 125,25 150,65 125,105 75,105 50,65" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.1" />
    <polygon points="150,65 200,65 225,105 200,145 150,145 125,105" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.08" />
    <polygon points="75,105 125,105 150,145 125,185 75,185 50,145" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.12" />
    <polygon points="150,145 200,145 225,185 200,225 150,225 125,185" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.1" />
    <polygon points="75,185 125,185 150,225 125,265 75,265 50,225" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.08" />
    {/* Center dots */}
    <circle cx="100" cy="65" r="4" fill="currentColor" opacity="0.2" />
    <circle cx="175" cy="105" r="4" fill="currentColor" opacity="0.15" />
    <circle cx="100" cy="145" r="4" fill="currentColor" opacity="0.2" />
    <circle cx="175" cy="185" r="4" fill="currentColor" opacity="0.15" />
    <circle cx="100" cy="225" r="4" fill="currentColor" opacity="0.15" />
  </svg>
);

// Motif de grille perspective / matrice
export const MatrixGridPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Perspective grid lines */}
    <line x1="200" y1="0" x2="0" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.06" />
    <line x1="200" y1="0" x2="50" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.06" />
    <line x1="200" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.08" />
    <line x1="200" y1="0" x2="150" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.08" />
    <line x1="200" y1="0" x2="200" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="200" y1="0" x2="250" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.08" />
    <line x1="200" y1="0" x2="300" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.08" />
    <line x1="200" y1="0" x2="350" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.06" />
    <line x1="200" y1="0" x2="400" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.06" />
    {/* Horizontal lines */}
    <line x1="50" y1="50" x2="350" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.05" />
    <line x1="25" y1="100" x2="375" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.08" />
    <line x1="0" y1="150" x2="400" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.06" />
  </svg>
);

// Motif de constellation / étoiles connectées
export const ConstellationPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stars */}
    <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.25" />
    <circle cx="120" cy="80" r="5" fill="currentColor" opacity="0.3" />
    <circle cx="200" cy="40" r="2" fill="currentColor" opacity="0.2" />
    <circle cx="250" cy="100" r="4" fill="currentColor" opacity="0.25" />
    <circle cx="80" cy="150" r="4" fill="currentColor" opacity="0.25" />
    <circle cx="180" cy="130" r="3" fill="currentColor" opacity="0.2" />
    <circle cx="150" cy="200" r="5" fill="currentColor" opacity="0.3" />
    <circle cx="230" cy="180" r="3" fill="currentColor" opacity="0.2" />
    <circle cx="60" cy="250" r="3" fill="currentColor" opacity="0.2" />
    <circle cx="140" cy="270" r="4" fill="currentColor" opacity="0.25" />
    <circle cx="270" cy="250" r="3" fill="currentColor" opacity="0.2" />
    {/* Connections */}
    <line x1="50" y1="50" x2="120" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="120" y1="80" x2="200" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.08" />
    <line x1="120" y1="80" x2="180" y2="130" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="200" y1="40" x2="250" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.08" />
    <line x1="80" y1="150" x2="150" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="180" y1="130" x2="230" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.08" />
    <line x1="150" y1="200" x2="140" y2="270" stroke="currentColor" strokeWidth="1" opacity="0.1" />
    <line x1="230" y1="180" x2="270" y2="250" stroke="currentColor" strokeWidth="1" opacity="0.08" />
    <line x1="60" y1="250" x2="140" y2="270" stroke="currentColor" strokeWidth="1" opacity="0.1" />
  </svg>
);

// Motif de code binaire / pluie de données
export const BinaryRainPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 100 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="30" fontSize="12" fill="currentColor" opacity="0.08" fontFamily="monospace">01</text>
    <text x="50" y="50" fontSize="10" fill="currentColor" opacity="0.06" fontFamily="monospace">10</text>
    <text x="30" y="80" fontSize="14" fill="currentColor" opacity="0.1" fontFamily="monospace">1</text>
    <text x="70" y="100" fontSize="10" fill="currentColor" opacity="0.06" fontFamily="monospace">0</text>
    <text x="20" y="130" fontSize="12" fill="currentColor" opacity="0.08" fontFamily="monospace">11</text>
    <text x="60" y="160" fontSize="10" fill="currentColor" opacity="0.06" fontFamily="monospace">01</text>
    <text x="40" y="190" fontSize="14" fill="currentColor" opacity="0.1" fontFamily="monospace">0</text>
    <text x="10" y="220" fontSize="12" fill="currentColor" opacity="0.08" fontFamily="monospace">10</text>
    <text x="70" y="250" fontSize="10" fill="currentColor" opacity="0.06" fontFamily="monospace">1</text>
    <text x="30" y="280" fontSize="12" fill="currentColor" opacity="0.08" fontFamily="monospace">01</text>
    <text x="50" y="320" fontSize="14" fill="currentColor" opacity="0.1" fontFamily="monospace">11</text>
    <text x="20" y="360" fontSize="10" fill="currentColor" opacity="0.06" fontFamily="monospace">0</text>
    <text x="60" y="390" fontSize="12" fill="currentColor" opacity="0.08" fontFamily="monospace">10</text>
  </svg>
);

// Motif de brain / cerveau stylisé
export const BrainWavePattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Brain wave lines */}
    <path d="M0 75 Q25 45 50 75 T100 75 Q125 105 150 75 T200 75 Q225 35 250 75 T300 75 Q325 95 350 75 T400 75" 
          stroke="currentColor" strokeWidth="2" fill="none" opacity="0.1" />
    <path d="M0 90 Q30 60 60 90 T120 90 Q150 120 180 90 T240 90 Q270 50 300 90 T360 90 L400 90" 
          stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.08" />
    <path d="M0 60 Q20 40 40 60 T80 60 Q100 80 120 60 T160 60 Q180 30 200 60 T240 60 Q260 80 280 60 T320 60 Q340 40 360 60 T400 60" 
          stroke="currentColor" strokeWidth="1" fill="none" opacity="0.06" />
    {/* Pulse points */}
    <circle cx="50" cy="75" r="3" fill="currentColor" opacity="0.15" />
    <circle cx="150" cy="75" r="3" fill="currentColor" opacity="0.15" />
    <circle cx="250" cy="75" r="3" fill="currentColor" opacity="0.15" />
    <circle cx="350" cy="75" r="3" fill="currentColor" opacity="0.15" />
  </svg>
);
