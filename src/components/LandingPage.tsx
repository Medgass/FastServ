import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Fond Marble avec texture teal et or */}
      <div className="absolute inset-0 w-full h-full">
        {/* SVG pour l'effet marble */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            {/* Gradient principal teal */}
            <radialGradient id="marbleGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="1" />
              <stop offset="30%" stopColor="#0d9488" stopOpacity="1" />
              <stop offset="60%" stopColor="#0f766e" stopOpacity="1" />
              <stop offset="100%" stopColor="#134e4a" stopOpacity="1" />
            </radialGradient>

            {/* Filtre Perlin pour l'effet marble */}
            <filter id="turbulence">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="5" seed="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="80" />
            </filter>
          </defs>

          {/* Base teal */}
          <rect width="100%" height="100%" fill="url(#marbleGradient)" />

          {/* Veines dorées - haut gauche */}
          <path
            d="M 0,0 Q 150,80 300,120 T 600,180"
            stroke="url(#goldGradient)"
            strokeWidth="12"
            fill="none"
            opacity="0.6"
            filter="url(#turbulence)"
          />

          {/* Veines dorées - diagonale */}
          <path
            d="M -50,100 Q 200,300 500,400 T 800,600"
            stroke="url(#goldGradient)"
            strokeWidth="15"
            fill="none"
            opacity="0.5"
            filter="url(#turbulence)"
          />

          {/* Veines dorées - bas droite */}
          <path
            d="M 600,500 Q 700,600 800,700"
            stroke="url(#goldGradient)"
            strokeWidth="10"
            fill="none"
            opacity="0.4"
            filter="url(#turbulence)"
          />

          {/* Gradient doré */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Overlay noise pour plus de texture */}
        <div className="absolute inset-0 bg-black opacity-5"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Espacement du haut */}
        <div className="mb-8"></div>

        {/* Titre principal */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-7xl font-serif font-bold text-amber-50 mb-4 tracking-widest drop-shadow-2xl"
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(217, 119, 6, 0.3)'
            }}>
            MY COCOON
          </h1>
          <div className="w-40 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
        </div>

        {/* Logo circulaire */}
        <div className="mb-12 animate-fade-in-delay">
          <div className="inline-block relative">
            <svg className="w-56 h-56 drop-shadow-2xl" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="circleBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f766e" />
                  <stop offset="100%" stopColor="#134e4a" />
                </linearGradient>
              </defs>

              {/* Cercle externe - double border */}
              <circle cx="100" cy="100" r="98" fill="none" stroke="#d97706" strokeWidth="2" opacity="0.7" />
              <circle cx="100" cy="100" r="94" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />

              {/* Cercle de fond */}
              <circle cx="100" cy="100" r="90" fill="url(#circleBg)" />

              {/* Cercle intérieur doré */}
              <circle cx="100" cy="100" r="85" fill="none" stroke="#f59e0b" strokeWidth="2.5" />

              {/* Texte circulaire - haut */}
              <path id="topArc" d="M 50, 100 A 50, 50 0 0, 1 150, 100" fill="none" />
              <text fontSize="11" fontFamily="serif" fill="#f59e0b" fontWeight="500" letterSpacing="2">
                <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                  SENTEZ LE VRAI
                </textPath>
              </text>

              {/* Texte circulaire - bas */}
              <path id="bottomArc" d="M 150, 100 A 50, 50 0 0, 1 50, 100" fill="none" />
              <text fontSize="11" fontFamily="serif" fill="#f59e0b" fontWeight="500" letterSpacing="2">
                <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
                  RESTO & CAFÉ
                </textPath>
              </text>

              {/* Logo central */}
              <g>
                {/* MC entrelacé */}
                <text x="100" y="95" fontSize="32" fontFamily="serif" fontWeight="bold" fill="#f59e0b" textAnchor="middle">
                  MC
                </text>

                {/* Séparateur */}
                <line x1="75" y1="105" x2="125" y2="105" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />

                {/* Petite décoration centrale */}
                <circle cx="100" cy="120" r="3" fill="#f59e0b" opacity="0.8" />
              </g>
            </svg>

            {/* Effet de brillance animée */}
            <div className="absolute inset-0 rounded-full animate-pulse opacity-20 bg-gradient-to-br from-amber-300 to-transparent"></div>
          </div>
        </div>

        {/* Sous-titre */}
        <div className="mb-12 animate-fade-in-delay-2">
          <p className="text-xl font-light text-amber-50 mb-3 tracking-widest drop-shadow-lg"
            style={{
              textShadow: '0 1px 5px rgba(0,0,0,0.2)'
            }}>
            SENTEZ LE VRAI GOÛT
          </p>
        </div>

        {/* Bouton d'entrée */}
        <button
          onClick={onEnter}
          className="group relative inline-flex items-center justify-center px-14 py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-teal-900 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-110 drop-shadow-2xl animate-bounce-slow"
        >
          <span className="relative z-10 flex items-center">
            Commencer
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>

        {/* Crédit */}
        <p className="mt-20 text-sm text-amber-200 drop-shadow-lg">
          Made by KWEEKTECH
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in-delay-2 {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          70% {
            opacity: 0;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1.5s ease-out forwards;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in-delay-2 2s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
