import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Éléments de fond décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo décoratif */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-block">
            {/* Décoration supérieure */}
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
            
            {/* Logo circulaire */}
            <div className="w-40 h-40 mx-auto mb-6 relative">
              {/* Cercle externe */}
              <div className="absolute inset-0 rounded-full border-2 border-teal-900 flex items-center justify-center">
                {/* Cercle interne */}
                <div className="w-32 h-32 rounded-full border-2 border-amber-500 flex items-center justify-center bg-gradient-to-br from-teal-900 to-teal-800 relative">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-amber-500 mb-1">MC</div>
                    <div className="w-12 h-0.5 bg-amber-500 mx-auto"></div>
                  </div>
                </div>
              </div>
              
              {/* Texte autour du cercle */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                <defs>
                  <path id="circle" d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" fill="none" />
                </defs>
                <text fontSize="14" fontFamily="serif" fill="#1f2937" fontWeight="500" letterSpacing="3">
                  <textPath href="#circle" startOffset="0%" textAnchor="start">
                    SENTEZ LE VRAI GOUT
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Décoration inférieure */}
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-6"></div>
          </div>
        </div>

        {/* Titre principal */}
        <div className="mb-8 animate-fade-in-delay">
          <h1 className="text-6xl font-serif font-bold text-teal-900 mb-2 tracking-wide">
            MY COCOON
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-amber-400 mx-auto mb-6"></div>
          <p className="text-2xl font-light text-teal-800 tracking-widest mb-2">
            RESTO & CAFÉ
          </p>
        </div>

        {/* Sous-titre */}
        <p className="text-lg text-teal-700 mb-12 font-light tracking-wide">
          Sentez le vrai goût de l'excellence
        </p>

        {/* Bouton d'entrée */}
        <button
          onClick={onEnter}
          className="group relative inline-flex items-center justify-center px-12 py-4 bg-gradient-to-r from-teal-900 to-teal-800 text-amber-400 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/50 hover:scale-105"
        >
          <span className="relative z-10 flex items-center">
            Commencer
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
        </button>

        {/* Crédit */}
        <p className="mt-16 text-sm text-teal-600">
          Made with <span className="text-amber-500">♥</span> by FastServ
        </p>
      </div>

      {/* Éléments flottants */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-amber-400 rounded-full opacity-60"></div>
      <div className="absolute bottom-20 right-20 w-3 h-3 bg-teal-400 rounded-full opacity-40"></div>
      <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-30"></div>

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
            transform: translateY(20px);
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 2s ease-out forwards;
        }

        .delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
