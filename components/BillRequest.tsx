import { useState } from 'react';
import { ArrowLeft, Receipt, CreditCard, Banknote, Users, CheckCircle } from 'lucide-react';
import { CartItem } from '../App';
import { Language, translations } from '../translations';

type BillRequestProps = {
  tableNumber: string;
  cart: CartItem[];
  language: Language;
  onBack: () => void;
};

export function BillRequest({ tableNumber, cart, language, onBack }: BillRequestProps) {
  const [requested, setRequested] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'split'>('card');

  const total = cart.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0
  );

  const t = translations[language].bill;
  const isRTL = language === 'ar';

  const handleRequestBill = () => {
    setRequested(true);
  };

  if (requested) {
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
            <h1 className="text-gray-900 mb-3">{t.requestSent}</h1>
            <p className="text-gray-600 mb-6">
              {t.waiterComing}
            </p>
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                {paymentMethod === 'card' && <CreditCard className="w-5 h-5 text-sky-600" />}
                {paymentMethod === 'cash' && <Banknote className="w-5 h-5 text-sky-600" />}
                {paymentMethod === 'split' && <Users className="w-5 h-5 text-sky-600" />}
                <p className="text-sky-900">
                  {paymentMethod === 'card' && t.card}
                  {paymentMethod === 'cash' && t.cash}
                  {paymentMethod === 'split' && t.split}
                </p>
              </div>
              <p className="text-sky-700">{t.table} {tableNumber}</p>
            </div>
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
          {/* Summary */}
          {cart.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 border-2 border-sky-100">
              <h3 className="text-gray-900 mb-4">{t.summary}</h3>
              <div className="space-y-2 mb-4">
                {cart.map(cartItem => (
                  <div key={cartItem.item.id} className="flex items-center justify-between text-gray-600">
                    <span>
                      {cartItem.quantity}x {cartItem.item.name}
                    </span>
                    <span>{(cartItem.item.price * cartItem.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-sky-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{t.total}</span>
                  <span className="text-sky-600">{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 border-2 border-sky-100">
            <h3 className="text-gray-900 mb-4">{t.paymentMethod}</h3>
            <div className="space-y-3">
              {/* Card */}
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  paymentMethod === 'card'
                    ? 'border-sky-500 bg-sky-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'card' ? 'bg-sky-100' : 'bg-gray-100'
                  }`}
                >
                  <CreditCard
                    className={`w-6 h-6 ${
                      paymentMethod === 'card' ? 'text-sky-600' : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p
                    className={
                      paymentMethod === 'card' ? 'text-sky-900' : 'text-gray-900'
                    }
                  >
                    {t.card}
                  </p>
                  <p
                    className={
                      paymentMethod === 'card' ? 'text-sky-700' : 'text-gray-600'
                    }
                  >
                    {t.cardDesc}
                  </p>
                </div>
              </button>

              {/* Cash */}
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  paymentMethod === 'cash'
                    ? 'border-sky-500 bg-sky-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'cash' ? 'bg-sky-100' : 'bg-gray-100'
                  }`}
                >
                  <Banknote
                    className={`w-6 h-6 ${
                      paymentMethod === 'cash' ? 'text-sky-600' : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p
                    className={
                      paymentMethod === 'cash' ? 'text-sky-900' : 'text-gray-900'
                    }
                  >
                    {t.cash}
                  </p>
                  <p
                    className={
                      paymentMethod === 'cash' ? 'text-sky-700' : 'text-gray-600'
                    }
                  >
                    {t.cashDesc}
                  </p>
                </div>
              </button>

              {/* Split */}
              <button
                onClick={() => setPaymentMethod('split')}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  paymentMethod === 'split'
                    ? 'border-sky-500 bg-sky-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'split' ? 'bg-sky-100' : 'bg-gray-100'
                  }`}
                >
                  <Users
                    className={`w-6 h-6 ${
                      paymentMethod === 'split' ? 'text-sky-600' : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p
                    className={
                      paymentMethod === 'split' ? 'text-sky-900' : 'text-gray-900'
                    }
                  >
                    {t.split}
                  </p>
                  <p
                    className={
                      paymentMethod === 'split' ? 'text-sky-700' : 'text-gray-600'
                    }
                  >
                    {t.splitDesc}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-4 border-sky-200 shadow-lg">
        <button
          onClick={handleRequestBill}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white py-4 rounded-2xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
        >
          <Receipt className="w-5 h-5" />
          {t.request}
        </button>
      </div>
    </div>
  );
}