import { useState } from 'react';
import { QRScanPage } from './components/QRScanPage';
import { MenuPage } from './components/MenuPage';
import { Cart } from './components/Cart';
import { Complaints } from './components/Complaints';
import { BillRequest } from './components/BillRequest';
import AdminPanel from './components/AdminPanel';
import { Language } from './translations';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  options?: { name: string; price: number }[];
};

export type CartItem = {
  item: MenuItem;
  quantity: number;
  notes?: string;
};

export type Page = 'scan' | 'menu' | 'cart' | 'complaints' | 'bill' | 'admin';

export type User = {
  name: string;
  points: number;
  loginMethod: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('scan');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('fr');

  const handleQRScanned = (table: string, lang: Language) => {
    setTableNumber(table);
    setLanguage(lang);
    // Vérifier si on veut accéder à l'admin via l'URL
    if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('menu');
    }
  };

  const handleLogin = (name: string, method: string) => {
    setUser({
      name,
      points: Math.floor(Math.random() * 300),
      loginMethod: method,
    });
  };

  const addToCart = (item: MenuItem, quantity: number, notes?: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity, notes }
            : cartItem
        );
      }
      return [...prevCart, { item, quantity, notes }];
    });
  };

  const updateCartItem = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
    } else {
      setCart(prevCart =>
        prevCart.map(cartItem =>
          cartItem.item.id === itemId ? { ...cartItem, quantity } : cartItem
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleConfirmOrder = () => {
    const total = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    const pointsEarned = Math.floor(total);
    
    if (user) {
      setUser(prev => prev ? { ...prev, points: prev.points + pointsEarned } : null);
      alert(`Commande confirmée ! Vous avez gagné ${pointsEarned} points 🎉`);
    } else {
      alert('Votre commande a été envoyée à la cuisine !');
    }
    
    clearCart();
    setCurrentPage('menu');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {currentPage === 'scan' && <QRScanPage onScanComplete={handleQRScanned} />}
      
      {currentPage === 'admin' && <AdminPanel />}
      
      {currentPage === 'menu' && (
        <MenuPage
          tableNumber={tableNumber}
          cart={cart}
          user={user}
          language={language}
          onAddToCart={addToCart}
          onNavigateToCart={() => setCurrentPage('cart')}
          onNavigateToComplaints={() => setCurrentPage('complaints')}
          onNavigateToBill={() => setCurrentPage('bill')}
          onLogin={handleLogin}
        />
      )}
      
      {currentPage === 'cart' && (
        <Cart
          cart={cart}
          tableNumber={tableNumber}
          language={language}
          onUpdateCart={updateCartItem}
          onClearCart={clearCart}
          onBack={() => setCurrentPage('menu')}
          onConfirmOrder={handleConfirmOrder}
        />
      )}
      
      {currentPage === 'complaints' && (
        <Complaints
          tableNumber={tableNumber}
          language={language}
          onBack={() => setCurrentPage('menu')}
        />
      )}
      
      {currentPage === 'bill' && (
        <BillRequest
          tableNumber={tableNumber}
          cart={cart}
          language={language}
          onBack={() => setCurrentPage('menu')}
        />
      )}
      
      {/* Bouton caché pour accéder à l'admin depuis n'importe quelle page */}
      {currentPage !== 'admin' && (
        <button
          onClick={() => setCurrentPage('admin')}
          className="fixed bottom-4 right-4 w-12 h-12 bg-gray-800 text-white rounded-full opacity-10 hover:opacity-100 transition-opacity shadow-lg z-50"
          title="Mode Admin"
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}