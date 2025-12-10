import { useState } from 'react';
import { QRScanPage } from './components/QRScanPage';
import { MenuPage } from './components/MenuPage';
import { Cart } from './components/Cart';
import { Complaints } from './components/Complaints';
import { BillRequest } from './components/BillRequest';
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

export type Page = 'scan' | 'menu' | 'cart' | 'complaints' | 'bill';

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
    setCurrentPage('menu');
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
    </div>
  );
}