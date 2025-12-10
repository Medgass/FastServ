import { useState } from 'react';
import { ShoppingCart, MessageSquare, Receipt, UtensilsCrossed, User, MessageCircle, CreditCard, Salad, Beef, Dessert, Coffee } from 'lucide-react';
import { MenuItem, CartItem } from '../App';
import { menuItems, categories } from './data/menuData';
import { ItemDetail } from './ItemDetail';
import { AIAssistant } from './AIAssistant';
import { AuthModal } from './AuthModal';
import { LoyaltyCard } from './LoyaltyCard';
import { CommunicationPanel } from './CommunicationPanel';
import logoKweekServ from 'figma:asset/8f62c92a6927b1ec34c71b76cad95963ae84599d.png';
import { Language, translations } from '../translations';

type MenuPageProps = {
  tableNumber: string;
  cart: CartItem[];
  user: { name: string; points: number; loginMethod: string } | null;
  language: Language;
  onAddToCart: (item: MenuItem, quantity: number, notes?: string) => void;
  onNavigateToCart: () => void;
  onNavigateToComplaints: () => void;
  onNavigateToBill: () => void;
  onLogin: (name: string, method: string) => void;
};

const categoryIcons: Record<string, any> = {
  'Entrées': Salad,
  'Plats': Beef,
  'Desserts': Dessert,
  'Boissons': Coffee,
};

export function MenuPage({
  tableNumber,
  cart,
  user,
  language,
  onAddToCart,
  onNavigateToCart,
  onNavigateToComplaints,
  onNavigateToBill,
  onLogin,
}: MenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLoyaltyCard, setShowLoyaltyCard] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);

  const t = translations[language].menu;
  const isRTL = language === 'ar';

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
    return matchesCategory && item.available;
  });

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (selectedItem) {
    return (
      <ItemDetail
        item={selectedItem}
        language={language}
        onBack={() => setSelectedItem(null)}
        onAddToCart={onAddToCart}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 pb-28 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header Fixed */}
      <div className="bg-white shadow-xl sticky top-0 z-20 border-b-4 border-sky-200">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg border-2 border-sky-200">
                <img src={logoKweekServ} alt="KweekServ" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-sky-900">KweekServ</h2>
                <p className="text-sky-700">{t.table} {tableNumber}</p>
              </div>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Communication Button */}
              <button
                onClick={() => setShowCommunication(true)}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-sky-100 rounded-xl flex items-center justify-center hover:bg-sky-200 transition-colors relative shadow-md border-2 border-sky-200"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </button>

              {/* User Profile / Login */}
              {user ? (
                <button
                  onClick={() => setShowLoyaltyCard(true)}
                  className="flex items-center gap-1.5 sm:gap-2 bg-sky-100 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 hover:bg-sky-200 transition-colors shadow-md border-2 border-sky-200"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                  <div className="text-left">
                    <p className="text-sky-900 leading-none text-sm sm:text-base">{user.name.split(' ')[0]}</p>
                    <p className="text-sky-600 flex items-center gap-1 text-xs">
                      <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {user.points} {t.points}
                    </p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-sky-100 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-sky-200 transition-colors flex items-center gap-1.5 sm:gap-2 shadow-md border-2 border-sky-200"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                  <span className="text-sky-900 text-sm sm:text-base">{t.login}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories - Mediterranean Design */}
      <div className="sticky top-[80px] sm:top-[88px] z-10 bg-white shadow-md border-b-2 border-sky-200">
        <div className="px-2 sm:px-4 py-2 sm:py-3">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedCategory('Tous')}
              className={`flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 rounded-2xl transition-all transform active:scale-95 ${
                selectedCategory === 'Tous'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-2 border-sky-100'
              }`}
            >
              <UtensilsCrossed className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedCategory === 'Tous' ? 'text-white' : 'text-sky-600'}`} />
              <span className={`text-[10px] sm:text-xs ${selectedCategory === 'Tous' ? 'text-white' : 'text-sky-700'}`}>
                {t.all}
              </span>
            </button>
            
            {categories.map(category => {
              const Icon = categoryIcons[category] || UtensilsCrossed;
              const categoryLabels: Record<string, string> = {
                'Entrées': language === 'ar' ? 'المقبلات' : language === 'en' ? 'Starters' : 'Entrées',
                'Plats': language === 'ar' ? 'الأطباق' : language === 'en' ? 'Mains' : 'Plats',
                'Desserts': language === 'ar' ? 'الحلويات' : language === 'en' ? 'Desserts' : 'Desserts',
                'Boissons': language === 'ar' ? 'المشروبات' : language === 'en' ? 'Drinks' : 'Boissons',
              };
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 rounded-2xl transition-all transform active:scale-95 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg scale-105'
                      : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-2 border-sky-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedCategory === category ? 'text-white' : 'text-sky-600'}`} />
                  <span className={`text-[10px] sm:text-xs ${selectedCategory === category ? 'text-white' : 'text-sky-700'}`}>
                    {categoryLabels[category]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loyalty Banner */}
      {!user && (
        <div className="mx-3 sm:mx-4 mt-3 sm:mt-4">
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-white rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all transform active:scale-98 border-2 border-sky-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-100 rounded-xl flex items-center justify-center border-2 border-sky-200">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
                </div>
                <div className="text-left">
                  <p className="text-sky-900 text-sm sm:text-base">{t.loyaltyTitle}</p>
                  <p className="text-sky-700 text-xs sm:text-sm">{t.loyaltyDesc}</p>
                </div>
              </div>
              <div className="text-sky-600 text-xl sm:text-2xl">→</div>
            </div>
          </button>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sky-600">{t.noItems}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden text-left transform active:scale-98 border-2 border-sky-100"
              >
                <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl border-2 border-sky-100"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sky-900 mb-1 sm:mb-1.5 truncate">{item.name}</h3>
                      <p className="text-gray-600 mb-1.5 sm:mb-2 line-clamp-2 text-sm sm:text-base">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sky-600">{item.price.toFixed(2)} €</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl flex items-center justify-center shadow-md text-lg sm:text-xl">
                        +
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-sky-200 shadow-2xl z-20">
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1 p-1.5 sm:p-2">
          <button
            onClick={onNavigateToComplaints}
            className="flex flex-col items-center justify-center py-2.5 sm:py-3 rounded-xl hover:bg-sky-50 transition-colors"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600 mb-0.5 sm:mb-1" />
            <span className="text-sky-700 text-xs sm:text-sm">{t.complaint}</span>
          </button>
          
          <button
            onClick={onNavigateToCart}
            className="relative flex flex-col items-center justify-center py-2.5 sm:py-3 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl shadow-lg transform active:scale-95 transition-all"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white mb-0.5 sm:mb-1" />
            <span className="text-white text-xs sm:text-sm">{t.cart}</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-700 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-white text-xs">
                {cartItemCount}
              </span>
            )}
          </button>
          
          <button
            onClick={onNavigateToBill}
            className="flex flex-col items-center justify-center py-2.5 sm:py-3 rounded-xl hover:bg-sky-50 transition-colors"
          >
            <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600 mb-0.5 sm:mb-1" />
            <span className="text-sky-700 text-xs sm:text-sm">{t.bill}</span>
          </button>
        </div>
      </div>

      {/* AI Assistant avec langue */}
      <AIAssistant onAddToCart={onAddToCart} language={language} />

      {/* Modals */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={onLogin} />}
      {showLoyaltyCard && user && <LoyaltyCard user={user} onClose={() => setShowLoyaltyCard(false)} />}
      {showCommunication && <CommunicationPanel tableNumber={tableNumber} onClose={() => setShowCommunication(false)} />}
    </div>
  );
}