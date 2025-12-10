import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Check } from 'lucide-react';
import { CartItem } from '../App';
import { Language, translations } from '../translations';

type CartProps = {
  cart: CartItem[];
  tableNumber: string;
  language: Language;
  onUpdateCart: (itemId: string, quantity: number) => void;
  onClearCart: () => void;
  onBack: () => void;
  onConfirmOrder: () => void;
};

export function Cart({
  cart,
  tableNumber,
  language,
  onUpdateCart,
  onClearCart,
  onBack,
  onConfirmOrder,
}: CartProps) {
  const total = cart.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0
  );

  const t = translations[language].cart;
  const isRTL = language === 'ar';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-sky-200">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sky-700 mb-2"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">{t.back}</span>
          </button>
          <h1 className="text-sky-900">{t.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 sm:px-4 py-3 sm:py-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-sky-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 border-4 border-sky-200">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-sky-600" />
            </div>
            <h2 className="text-gray-900 mb-2">{t.empty}</h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              {t.emptyDesc}
            </p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg transform active:scale-95"
            >
              {t.seeMenu}
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-3 sm:space-y-4">
              {cart.map(cartItem => (
                <div
                  key={cartItem.item.id}
                  className="bg-white rounded-2xl shadow-sm p-4 border-2 border-sky-100"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl border-2 border-blue-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 mb-1 truncate text-sm sm:text-base">{cartItem.item.name}</h3>
                          <p className="text-sky-600 mb-1 text-sm sm:text-base">
                            {cartItem.item.price.toFixed(2)} €
                          </p>
                          {cartItem.notes && (
                            <p className="text-gray-600 mb-2 line-clamp-2 text-xs sm:text-sm">
                              {t.note}: {cartItem.notes}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onUpdateCart(cartItem.item.id, 0)}
                          className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            onUpdateCart(
                              cartItem.item.id,
                              Math.max(1, cartItem.quantity - 1)
                            )
                          }
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all"
                        >
                          <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                        </button>
                        <span className="text-gray-900 w-8 sm:w-10 text-center">{cartItem.quantity}</span>
                        <button
                          onClick={() =>
                            onUpdateCart(cartItem.item.id, cartItem.quantity + 1)
                          }
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">
                        {(cartItem.item.price * cartItem.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 sticky bottom-20 border-4 border-sky-100">
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center justify-between text-gray-600 text-sm sm:text-base">
                  <span>{t.subtotal} ({cart.length} {cart.length > 1 ? t.articles : t.article})</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <div className="border-t-2 border-sky-100 pt-2 sm:pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 text-base sm:text-lg">{t.total}</span>
                    <span className="text-sky-600 text-lg sm:text-xl">{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onConfirmOrder}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white py-3 sm:py-4 rounded-2xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {t.order}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}