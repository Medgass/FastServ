import { X, Gift, Trophy, Star, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import logoKweekServ from 'figma:asset/8f62c92a6927b1ec34c71b76cad95963ae84599d.png';

type LoyaltyCardProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userPoints: number;
};

const rewards = [
  { points: 50, reward: 'Café offert', icon: '☕', unlocked: false },
  { points: 100, reward: 'Dessert gratuit', icon: '🍰', unlocked: false },
  { points: 200, reward: '10% de réduction', icon: '🎟️', unlocked: false },
  { points: 500, reward: 'Repas offert', icon: '🍽️', unlocked: false },
];

export function LoyaltyCard({ isOpen, onClose, userName, userPoints }: LoyaltyCardProps) {
  if (!isOpen) return null;

  const progress = (userPoints % 50) / 50 * 100;
  const nextReward = rewards.find(r => r.points > userPoints);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-white">Carte Fidélité</h2>
                  <p className="text-white/90">{userName}</p>
                </div>
              </div>
              {/* Petit logo KweekServ */}
              <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-lg">
                <img src={logoKweekServ} alt="KweekServ" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Points Display */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-center mb-4">
                <div className="inline-flex items-baseline gap-2">
                  <span className="text-white/80">Vous avez</span>
                  <div className="relative">
                    <span className="text-white">{userPoints}</span>
                    <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-2 -right-6 animate-pulse" />
                  </div>
                  <span className="text-white/80">points</span>
                </div>
              </div>

              {/* Progress Bar */}
              {nextReward && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">
                      Prochain palier
                    </span>
                    <span className="text-white">
                      {nextReward.points} pts
                    </span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rewards List */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">Vos récompenses</h3>
          </div>

          <div className="space-y-3">
            {rewards.map((reward, index) => {
              const unlocked = userPoints >= reward.points;
              return (
                <motion.div
                  key={reward.points}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    unlocked
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          unlocked
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <span className="text-2xl">{reward.icon}</span>
                      </div>
                      <div>
                        <p className={unlocked ? 'text-green-900' : 'text-gray-700'}>
                          {reward.reward}
                        </p>
                        <p className={unlocked ? 'text-green-600' : 'text-gray-500'}>
                          {reward.points} points
                        </p>
                      </div>
                    </div>
                    {unlocked && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-white fill-white" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Info */}
          <div className="mt-6 bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 flex gap-3">
            <TrendingUp className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sky-900 mb-1">
                Comment gagner des points ?
              </p>
              <p className="text-sky-700">
                1€ dépensé = 1 point gagné. Cumulez vos points et débloquez des récompenses exclusives !
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}