import { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, AlertCircle, Utensils, Clock, Sparkles } from 'lucide-react';
import { Language, translations } from '../translations';

type ComplaintsProps = {
  tableNumber: string;
  language: Language;
  onBack: () => void;
};

export function Complaints({ tableNumber, language, onBack }: ComplaintsProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const t = translations[language].complaints;
  const isRTL = language === 'ar';

  const complaintTypes = [
    { id: 'food', label: t.foodQuality, icon: <Utensils className="w-6 h-6 text-blue-600" /> },
    { id: 'service', label: t.service, icon: <AlertCircle className="w-6 h-6 text-blue-600" /> },
    { id: 'cleanliness', label: t.cleanliness, icon: <Sparkles className="w-6 h-6 text-blue-600" /> },
    { id: 'waiting', label: t.waiting, icon: <Clock className="w-6 h-6 text-blue-600" /> },
    { id: 'other', label: t.other, icon: <AlertCircle className="w-6 h-6 text-blue-600" /> },
  ];

  const handleSubmit = () => {
    if (selectedType && message) {
      setSubmitted(true);
      setTimeout(() => {
        onBack();
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-sky-200">
          <div className="px-4 py-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sky-700 hover:text-sky-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t.back}
            </button>
          </div>
        </div>

        <div className="px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm w-full border-4 border-sky-100">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6 animate-bounce border-4 border-green-200">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-gray-900 mb-3">{t.sent}</h1>
            <p className="text-gray-600 mb-6">{t.sentDesc}</p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-8 py-3 rounded-2xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg transform active:scale-95"
            >
              {t.backToMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-sky-200">
        <div className="px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sky-700 hover:text-sky-900 transition-colors mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.back}
          </button>
          <div>
            <h1 className="text-sky-900">{t.title}</h1>
            <p className="text-sky-700">{t.table} {tableNumber}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-4 py-4">
          {/* Type Selection */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 border-2 border-sky-100">
            <h3 className="text-gray-900 mb-4">{t.selectType}</h3>
            <div className="grid grid-cols-2 gap-3">
              {complaintTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedType === type.id
                      ? 'border-sky-500 bg-sky-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="mb-2">{type.icon}</div>
                  <div className={selectedType === type.id ? 'text-sky-900' : 'text-gray-700'}>
                    {type.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border-2 border-sky-100">
            <h3 className="text-gray-900 mb-4">{t.message}</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              className="w-full border-2 border-sky-200 rounded-xl px-4 py-3 resize-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
              rows={5}
              required
            />
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-4 border-sky-200 shadow-lg">
        <button
          onClick={handleSubmit}
          disabled={!selectedType || !message}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white py-4 rounded-2xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
        >
          <Send className="w-5 h-5" />
          {t.send}
        </button>
      </div>
    </div>
  );
}