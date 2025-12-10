import { useState, useEffect } from 'react';
import { ShoppingCart, MessageSquare, Receipt, User, MessageCircle, CreditCard } from 'lucide-react';
import { MenuItem, CartItem } from '../App';
import { menuItems, categoryGroups } from './data/menuData';
import { ItemDetail } from './ItemDetail';
import { AIAssistant } from './AIAssistant';
import { AuthModal } from './AuthModal';
import { LoyaltyCard } from './LoyaltyCard';
import { CommunicationPanel } from './CommunicationPanel';
import { Language, translations } from '../translations';

type NavigationLevel = 'categories' | 'items' | 'detail';

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
  const [navigationLevel, setNavigationLevel] = useState<NavigationLevel>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('PETIT DEJEUNER');
  const [selectedGroup, setSelectedGroup] = useState<string>('TOUS');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLoyaltyCard, setShowLoyaltyCard] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto-rotate banner every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const t = translations[language].menu;
  const isRTL = language === 'ar';

  // Get categories based on selected group
  let categoriesToShow: string[] = [];
  if (selectedGroup === 'TOUS') {
    categoriesToShow = Array.from(new Set(menuItems.map(item => item.category))).sort();
  } else {
    categoriesToShow = categoryGroups[selectedGroup as keyof typeof categoryGroups] || [];
  }

  // Get items for selected category
  const filteredItems = menuItems.filter(item => {
    return item.category === selectedCategory && item.available;
  });

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Level 3: Show ItemDetail Modal
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

  // Level 2: Show Items in Selected Category with back button
  if (navigationLevel === 'items') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 pb-28 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header with Back Button */}
        <div className="bg-white shadow-xl sticky top-0 z-20 border-b-4 border-sky-200">
          <div className="px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setNavigationLevel('categories');
                    setSelectedCategory('PETIT DEJEUNER');
                  }}
                  className="w-10 h-10 sm:w-11 sm:h-11 bg-sky-100 rounded-xl flex items-center justify-center hover:bg-sky-200 transition-colors shadow-md border-2 border-sky-200"
                >
                  ←
                </button>
                <div>
                  <h2 className="text-sky-900 font-bold text-lg">{selectedCategory}</h2>
                  <p className="text-xs sm:text-sm text-sky-600">{filteredItems.length} {t.table}</p>
                </div>
              </div>
              
              {/* User Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setShowCommunication(true)}
                  className="w-10 h-10 sm:w-11 sm:h-11 bg-sky-100 rounded-xl flex items-center justify-center hover:bg-sky-200 transition-colors relative shadow-md border-2 border-sky-200"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </button>

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

        {/* Menu Items Grid - Large Photo Cards for Items */}
        <div className="px-3 sm:px-4 py-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sky-600">{t.noItems}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden transform active:scale-95 border-2 border-sky-100"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-square overflow-hidden bg-sky-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="transform translate-y-full group-hover:translate-y-0 transition-transform">
                      <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-2">{item.name}</h3>
                      <p className="text-sky-100 font-bold text-xs sm:text-sm">{item.price.toFixed(3)} TND</p>
                    </div>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-sky-500 text-white px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold shadow-lg">
                    {item.price.toFixed(2)} TND
                  </div>

                  {/* Category Tag */}
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-sky-600 text-white px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold">
                    {item.category}
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

        {/* AI Assistant */}
        <AIAssistant onAddToCart={onAddToCart} language={language} />

        {/* Modals */}
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={onLogin} />}
        {showLoyaltyCard && user && <LoyaltyCard user={user} onClose={() => setShowLoyaltyCard(false)} />}
        {showCommunication && <CommunicationPanel tableNumber={tableNumber} onClose={() => setShowCommunication(false)} />}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 pb-28 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header Fixed */}
      <div className="bg-white shadow-xl sticky top-0 z-20 border-b-4 border-sky-200">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-100 rounded-2xl flex items-center justify-center p-2 shadow-lg border-2 border-sky-200">
                <span className="text-lg sm:text-xl">🍽️</span>
              </div>
              <div>
                <h2 className="text-sky-900 font-bold">Versailles Café</h2>
                <p className="text-xs sm:text-sm text-sky-600">{t.table}: {tableNumber}</p>
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

      {/* Level 1: Large Category Cards Grid */}
      <div className="sticky top-[80px] sm:top-[88px] z-10 bg-white shadow-md border-b-2 border-sky-200">
        <div className="px-3 sm:px-4 py-2 sm:py-3">
          {/* Group Headers - TOUS, ENTRÉES, PLATS, DESSERTS, BOISSONS */}
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              onClick={() => {
                setSelectedGroup('TOUS');
                setSelectedCategory('PETIT DEJEUNER');
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                selectedGroup === 'TOUS'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
              }`}
            >
              TOUS
            </button>
            {Object.keys(categoryGroups).map(group => (
              <button
                key={group}
                onClick={() => {
                  setSelectedGroup(group);
                  setSelectedCategory(categoryGroups[group as keyof typeof categoryGroups][0]);
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedGroup === group
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Single Banner with Auto-Rotate (Announcements, Promotions, Loyalty) */}
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          {/* Announcements Banner */}
          <div 
            className={`transition-all duration-500 ${currentBannerIndex === 0 ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
          >
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-3xl sm:text-4xl">📢</div>
                <div className="flex-1">
                  <h3 className="font-bold text-orange-900 text-base sm:text-lg">Annonces</h3>
                  <p className="text-sm sm:text-base text-orange-700 mt-1">
                    🎉 Bienvenue chez Versailles Café! Découvrez nos nouvelles créations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Promotions/Discounts Banner */}
          <div 
            className={`transition-all duration-500 ${currentBannerIndex === 1 ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
          >
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-pink-200 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-3xl sm:text-4xl">🏷️</div>
                <div className="flex-1">
                  <h3 className="font-bold text-pink-900 text-base sm:text-lg">Remises</h3>
                  <p className="text-sm sm:text-base text-pink-700 mt-1">
                    🎁 -20% sur les pizzas avec le code PIZZA20
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Loyalty Program Banner */}
          <div 
            className={`transition-all duration-500 ${currentBannerIndex === 2 ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
          >
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-3xl sm:text-4xl">⭐</div>
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-900 text-base sm:text-lg">Fidélité</h3>
                  <p className="text-sm sm:text-base text-emerald-700 mt-1">
                    {user ? `💎 Vous avez ${user.points} points! 🌟` : '💎 Connectez-vous pour gagner des points'}
                  </p>
                </div>
                {!user && (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
                  >
                    Se connecter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex gap-1.5">
            {[0, 1, 2].map(index => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentBannerIndex === index 
                    ? 'bg-sky-600 w-6' 
                    : 'bg-sky-300 hover:bg-sky-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-900 mb-4 sm:mb-6">Choisir une catégorie</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categoriesToShow.map(category => {
            // Find one item from this category for preview image
            const previewItem = menuItems.find(item => item.category === category);
            const itemCount = menuItems.filter(item => item.category === category).length;
            
            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setNavigationLevel('items');
                }}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden transform active:scale-95 border-2 border-sky-100"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square overflow-hidden bg-sky-50">
                  {previewItem && (
                    <img
                      src={previewItem.image}
                      alt={category}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </div>

                {/* Category Name & Count */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 sm:p-3">
                  <h3 className="text-white font-bold text-lg sm:text-xl text-shadow drop-shadow-lg line-clamp-2">{category}</h3>
                  <p className="text-sky-100 text-xs sm:text-sm font-semibold mt-1 sm:mt-2">{itemCount} plat{itemCount > 1 ? 's' : ''}</p>
                </div>

                {/* Count Badge */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-sky-500 text-white px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-lg">
                  {itemCount}
                </div>
              </button>
            );
          })}
        </div>
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