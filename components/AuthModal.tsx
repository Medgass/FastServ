import { useState } from 'react';
import { X, Mail, Phone, Facebook, Chrome, LogIn, UserPlus, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import logoKweekServ from 'figma:asset/8f62c92a6927b1ec34c71b76cad95963ae84599d.png';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, method: string) => void;
};

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onLogin(name, 'email');
      onClose();
    }
  };

  const handleSocialLogin = (method: 'facebook' | 'google') => {
    const defaultName = method === 'facebook' ? 'Utilisateur Facebook' : 'Utilisateur Google';
    onLogin(name || defaultName, method);
    onClose();
  };

  const handlePhoneLogin = () => {
    if (phone && name) {
      onLogin(name, 'phone');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <UserPlus className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-white">Rejoignez-nous</h2>
                  <p className="text-white/90">Gagnez des points</p>
                </div>
              </div>
              {/* Petit logo KweekServ */}
              <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-lg">
                <img src={logoKweekServ} alt="KweekServ" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Benefits Banner */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sky-900 mb-1">
                  Gagnez des points à chaque visite
                </p>
                <p className="text-sky-700">
                  1€ = 1 point • Récompenses exclusives
                </p>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full bg-[#1877f2] text-white py-3 rounded-2xl hover:bg-[#1664d8] transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Facebook className="w-5 h-5" />
              Continuer avec Facebook
            </button>

            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full bg-white text-gray-700 py-3 rounded-2xl hover:bg-gray-50 transition-all shadow-lg border border-gray-200 flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Chrome className="w-5 h-5 text-red-500" />
              Continuer avec Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full border-2 border-sky-200 rounded-2xl px-4 py-3 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Numéro de téléphone
                </div>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full border-2 border-sky-200 rounded-2xl px-4 py-3 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email (optionnel)
                </div>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean.dupont@email.com"
                className="w-full border-2 border-sky-200 rounded-2xl px-4 py-3 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white py-4 rounded-2xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg transform active:scale-95"
            >
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sky-600 hover:text-sky-700 transition-colors"
            >
              {isLogin ? "Pas encore inscrit ? S'inscrire" : 'Déjà inscrit ? Se connecter'}
            </button>
          </div>

          {/* Phone Login Alternative */}
          {phone && name && (
            <button
              onClick={handlePhoneLogin}
              className="w-full mt-4 bg-green-500 text-white py-3 rounded-2xl hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Phone className="w-5 h-5" />
              Continuer avec le téléphone
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}