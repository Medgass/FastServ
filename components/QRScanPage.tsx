import { useState } from 'react';
import { QrCode, Scan } from 'lucide-react';
import logoKweekServ from 'figma:asset/8f62c92a6927b1ec34c71b76cad95963ae84599d.png';
import logoElGrotte from 'figma:asset/b41476b95d6ace35ddd26810776967656f194a20.png';
import { Language, translations } from '../translations';

type QRScanPageProps = {
  onScanComplete: (tableNumber: string, language: Language) => void;
};

export function QRScanPage({ onScanComplete }: QRScanPageProps) {
  const [scanning, setScanning] = useState(false);
  const [language, setLanguage] = useState<Language>('fr');

  const t = translations[language].scan;

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      const tableNumber = Math.floor(Math.random() * 20 + 1).toString();
      onScanComplete(tableNumber, language);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Decorative patterns inspired by Mediterranean architecture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 border-4 border-sky-400 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 sm:w-24 sm:h-24 border-4 border-sky-400 transform rotate-45"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-16 sm:h-16 border-4 border-sky-400 rounded-lg"></div>
        <div className="absolute top-1/3 right-1/3 w-14 h-14 sm:w-20 sm:h-20 border-4 border-sky-400 rounded-full"></div>
      </div>

      {/* Language Selector */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <div className="bg-white shadow-lg rounded-2xl p-1 sm:p-1.5 flex items-center gap-1 sm:gap-1.5 border-2 border-sky-200">
          <button
            onClick={() => setLanguage('fr')}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all text-xs sm:text-sm font-medium ${
              language === 'fr' 
                ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md' 
                : 'text-sky-600 hover:bg-sky-50'
            }`}
          >
            FR
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all text-xs sm:text-sm font-medium ${
              language === 'ar' 
                ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md' 
                : 'text-sky-600 hover:bg-sky-50'
            }`}
          >
            AR
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all text-xs sm:text-sm font-medium ${
              language === 'en' 
                ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md' 
                : 'text-sky-600 hover:bg-sky-50'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="max-w-sm w-full relative z-10">
        {/* Logo & Title */}
        <div className={`text-center mb-6 sm:mb-8 animate-fade-in ${language === 'ar' ? 'rtl' : 'ltr'}`}>
          {/* ElGROTTE Logo Text - Principal */}
          <div className="mb-4 sm:mb-5">
            <img src={logoElGrotte} alt="Café ElGROTTE" className="h-16 sm:h-20 mx-auto object-contain" />
          </div>
          
          <h1 className="text-sky-900 mb-2">{t.title}</h1>
          <p className="text-sky-700 px-2">
            {t.subtitle}
          </p>
        </div>

        {/* Scan Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 mb-3 sm:mb-4 border-4 border-sky-100">
          <div className={`text-center mb-4 sm:mb-6 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <h2 className="text-sky-900 mb-2">{t.scanTitle}</h2>
            <p className="text-sky-700">
              {t.scanSubtitle}
            </p>
          </div>

          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-sky-200">
            {scanning ? (
              <div className="text-center">
                <div className="relative inline-block">
                  <Scan className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-sky-500 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-0.5 sm:w-24 sm:h-0.5 bg-sky-500 animate-scan"></div>
                  </div>
                </div>
                <p className="text-sky-700 mt-3 sm:mt-4">{t.scanning}</p>
              </div>
            ) : (
              <div className="border-4 border-dashed border-sky-300 rounded-3xl p-6 sm:p-8 text-center bg-white/50">
                <QrCode className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-sky-400 mb-2 sm:mb-3" />
                <p className="text-sky-600">{t.alignText}</p>
              </div>
            )}
          </div>

          <button
            onClick={simulateScan}
            disabled={scanning}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white py-3.5 sm:py-4 rounded-2xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
          >
            {scanning ? t.scanning : t.simulate}
          </button>
        </div>

        {/* Manual Entry */}
        <div className="bg-white shadow-lg rounded-3xl p-3 sm:p-4 border-2 border-sky-100">
          <p className={`text-sky-900 text-center mb-2 sm:mb-3 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            {t.tableNumber}
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t.placeholder}
              className="flex-1 border-2 border-sky-200 bg-white rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-center text-sky-900 focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  onScanComplete(e.currentTarget.value, language);
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input.value) {
                  onScanComplete(input.value, language);
                }
              }}
              className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:from-sky-600 hover:to-blue-600 transition-colors shadow-lg transform active:scale-95"
            >
              {t.ok}
            </button>
          </div>
        </div>
      </div>

      {/* Logo KweekServ en bas */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-lg p-2 border-2 border-sky-200">
            <img src={logoKweekServ} alt="KweekServ" className="w-full h-full object-contain" />
          </div>
          <p className="text-sky-600 text-xs">Powered by KweekServ</p>
        </div>
      </div>
    </div>
  );
}