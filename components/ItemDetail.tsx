import { useState } from 'react';
import { ChevronLeft, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { MenuItem } from '../App';
import { Language, translations } from '../translations';

type ItemDetailProps = {
  item: MenuItem;
  language: Language;
  onBack: () => void;
  onAddToCart: (item: MenuItem, quantity: number, notes?: string) => void;
};

export function ItemDetail({ item, language, onBack, onAddToCart }: ItemDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const t = translations[language].item;
  const isRTL = language === 'ar';

  const handleAddToCart = () => {
    onAddToCart(item, quantity, notes);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      onBack();
    }, 1000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-sky-200">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sky-700 hover:text-sky-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">{t.back}</span>
          </button>
        </div>
      </div>

      <div className="px-3 sm:px-4 py-3 sm:py-4">
        {/* Image */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-3 sm:mb-4 border-4 border-sky-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 mb-3 sm:mb-4 border-4 border-sky-100">
          <h1 className="text-sky-900 mb-2 sm:mb-3">{item.name}</h1>
          <p className="text-gray-600 mb-3 sm:mb-4">{item.description}</p>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <span className="text-sky-600">{item.price.toFixed(2)} €</span>
            <span className="text-gray-500 px-3 py-1 bg-sky-50 rounded-lg border border-sky-200">
              {item.category}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-900 mb-3">{t.quantity}</label>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-100 rounded-2xl flex items-center justify-center hover:bg-sky-200 transition-all shadow-md border-2 border-sky-200"
              >
                <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-sky-700" />
              </button>
              <span className="text-sky-900 w-16 sm:w-20 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-900 mb-3">
              {t.specialNotes}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full border-2 border-sky-200 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 resize-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all text-sm sm:text-base"
              rows={3}
            />
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={showConfirmation}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white py-3.5 sm:py-4 rounded-2xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
        >
          {showConfirmation ? (
            <>
              <Check className="w-5 h-5 sm:w-6 sm:h-6" />
              {t.added}
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {t.addToCart}
            </>
          )}
        </button>
      </div>
    </div>
  );
}