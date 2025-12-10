import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, ShoppingCart, Loader2, Sun, Cloud, Moon, Heart, Zap, Coffee } from 'lucide-react';
import { MenuItem } from '../App';
import { menuItems } from './data/menuData';
import { Language } from '../translations';

type AIAssistantProps = {
  onAddToCart: (item: MenuItem, quantity: number) => void;
  language: Language;
};

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: MenuItem[];
  quickReplies?: string[];
  emotion?: 'happy' | 'thinking' | 'excited' | 'understanding';
};

type UserPreferences = {
  allergies: string[];
  dietaryRestrictions: string[];
  favoriteDishes: string[];
  dislikedIngredients: string[];
  budget?: number;
  occasion?: string;
  mood?: string;
  timeOfDay?: string;
};

type ConversationContext = {
  previousTopics: string[];
  userSentiment: 'positive' | 'neutral' | 'negative';
  interactionCount: number;
  lastOrderTime?: Date;
};

export function AIAssistant({ onAddToCart, language }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    allergies: [],
    dietaryRestrictions: [],
    favoriteDishes: [],
    dislikedIngredients: [],
  });
  const [context, setContext] = useState<ConversationContext>({
    previousTopics: [],
    userSentiment: 'neutral',
    interactionCount: 0,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const hour = new Date().getHours();
      let greeting = '';
      let timeBasedSuggestion = '';
      
      if (hour >= 5 && hour < 12) {
        greeting = 'Sabah el khir! ☀️ Bonjour !';
        timeBasedSuggestion = 'Un bon café ou un petit-déjeuner tunisien pour bien commencer la journée ?';
      } else if (hour >= 12 && hour < 15) {
        greeting = 'Bonjour! 🌞';
        timeBasedSuggestion = 'C\'est l\'heure du déjeuner ! Que diriez-vous de nos spécialités méditerranéennes ?';
      } else if (hour >= 15 && hour < 18) {
        greeting = 'Bonsoir! ☕';
        timeBasedSuggestion = 'Un moment de détente ? Je vous suggère nos pâtisseries et boissons chaudes.';
      } else {
        greeting = 'Bonsoir! 🌙';
        timeBasedSuggestion = 'Pour une soirée agréable, laissez-moi vous guider vers nos meilleurs plats.';
      }

      const initialMessage: Message = {
        id: '1',
        text: `${greeting} Je suis votre assistant KweekServ. 🏛️\n\n${timeBasedSuggestion}\n\nJe peux vous aider à :\n• 🎯 Trouver le plat parfait selon vos envies\n• 💰 Créer un menu adapté à votre budget\n• 🌿 Respecter vos préférences alimentaires\n• ⭐ Découvrir nos spécialités tunisiennes\n• 🎨 Vous conseiller selon votre humeur\n\nComment puis-je égayer votre repas aujourd\'hui ?`,
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'happy',
        quickReplies: [
          '🌟 Spécialités du chef',
          '💸 J\'ai un budget',
          '🌱 Végétarien/Vegan',
          '⚡ Quelque chose de rapide',
        ],
      };
      
      setMessages([initialMessage]);
    }
  }, [isOpen]);

  const detectSentiment = (message: string): 'positive' | 'neutral' | 'negative' => {
    const lowerMessage = message.toLowerCase();
    
    const positiveWords = ['merci', 'parfait', 'excellent', 'génial', 'super', 'top', 'délicieux', 'yahassal', 'barsha behi', 'bien'];
    const negativeWords = ['non', 'pas', 'mauvais', 'déçu', 'problème', 'jamais', 'mouch behi'];
    
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const detectTunisianExpressions = (message: string): string[] => {
    const lowerMessage = message.toLowerCase();
    const expressions: string[] = [];
    
    const tunisianPhrases = {
      'yahassal': 'de bon',
      'barsha': 'beaucoup',
      'behi': 'bon/bien',
      'mouch behi': 'pas bon',
      'sahha': 'santé/bon appétit',
      'bsahtek': 'bon appétit',
      'tayeb': 'délicieux',
    };
    
    for (const [tunisian, french] of Object.entries(tunisianPhrases)) {
      if (lowerMessage.includes(tunisian)) {
        expressions.push(tunisian);
      }
    }
    
    return expressions;
  };

  const extractPreferences = (message: string): Partial<UserPreferences> => {
    const lowerMessage = message.toLowerCase();
    const prefs: Partial<UserPreferences> = {};

    // Détection des allergies
    const allergyKeywords = ['allergie', 'allergique', 'intolérant', 'intolerance', 'sensible'];
    const commonAllergens = ['gluten', 'lactose', 'lait', 'noix', 'arachide', 'fruits de mer', 'poisson', 'oeuf', 'œuf', 'soja', 'sésame'];
    
    if (allergyKeywords.some(word => lowerMessage.includes(word))) {
      prefs.allergies = commonAllergens.filter(allergen => lowerMessage.includes(allergen));
    }

    // Détection des restrictions alimentaires
    if (lowerMessage.includes('végétarien') || lowerMessage.includes('vegetarien')) {
      prefs.dietaryRestrictions = ['végétarien'];
    }
    if (lowerMessage.includes('végétalien') || lowerMessage.includes('vegan') || lowerMessage.includes('végan')) {
      prefs.dietaryRestrictions = ['végétalien'];
    }
    if (lowerMessage.includes('halal')) {
      prefs.dietaryRestrictions = ['halal'];
    }
    if (lowerMessage.includes('sans viande') || lowerMessage.includes('pas de viande')) {
      prefs.dietaryRestrictions = ['sans viande'];
    }
    if (lowerMessage.includes('sans porc')) {
      prefs.dietaryRestrictions = ['sans porc'];
    }

    // Détection du budget avec plus de flexibilité
    const budgetPatterns = [
      /(\d+)\s*(?:euros?|€|dinars?|dt)/i,
      /budget.*?(\d+)/i,
      /environ.*?(\d+)/i,
      /maximum.*?(\d+)/i,
      /pas plus de.*?(\d+)/i,
    ];
    
    for (const pattern of budgetPatterns) {
      const match = lowerMessage.match(pattern);
      if (match) {
        prefs.budget = parseInt(match[1]);
        break;
      }
    }

    // Détection de l'humeur
    const moodKeywords = {
      'faim': 'très faim',
      'affamé': 'très faim',
      'petit creux': 'petite faim',
      'grignoter': 'petite faim',
      'découvrir': 'aventureux',
      'nouveau': 'aventureux',
      'traditionnel': 'classique',
      'habituel': 'classique',
      'santé': 'sain',
      'léger': 'sain',
      'gourmand': 'indulgent',
      'plaisir': 'indulgent',
    };

    for (const [keyword, mood] of Object.entries(moodKeywords)) {
      if (lowerMessage.includes(keyword)) {
        prefs.mood = mood;
        break;
      }
    }

    // Détection de l'occasion avec plus de contextes
    const occasions = {
      'anniversaire': 'anniversaire',
      'fête': 'célébration',
      'romantique': 'romantique',
      'amoureux': 'romantique',
      'date': 'romantique',
      'rendez-vous': 'romantique',
      'affaires': 'affaires',
      'business': 'affaires',
      'professionnel': 'affaires',
      'famille': 'famille',
      'enfants': 'famille',
      'amis': 'entre amis',
      'groupe': 'entre amis',
      'rapide': 'rapide',
      'pressé': 'rapide',
      'vite': 'rapide',
      'décontracté': 'décontracté',
      'relax': 'décontracté',
    };

    for (const [keyword, occasion] of Object.entries(occasions)) {
      if (lowerMessage.includes(keyword)) {
        prefs.occasion = occasion;
        break;
      }
    }

    return prefs;
  };

  const analyzeRequest = (userMessage: string): { text: string; suggestions?: MenuItem[]; quickReplies?: string[]; emotion?: Message['emotion'] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Mise à jour du contexte
    const sentiment = detectSentiment(userMessage);
    const tunisianExpressions = detectTunisianExpressions(userMessage);
    
    setContext(prev => ({
      ...prev,
      userSentiment: sentiment,
      interactionCount: prev.interactionCount + 1,
    }));
    
    // Extraire et sauvegarder les préférences
    const newPrefs = extractPreferences(userMessage);
    if (Object.keys(newPrefs).length > 0) {
      setUserPreferences(prev => ({ ...prev, ...newPrefs }));
      
      // Ajouter au contexte des topics
      setContext(prev => ({
        ...prev,
        previousTopics: [...new Set([...prev.previousTopics, ...Object.keys(newPrefs)])],
      }));
    }

    // Répondre aux expressions tunisiennes
    if (tunisianExpressions.length > 0) {
      if (tunisianExpressions.includes('yahassal') || tunisianExpressions.includes('barsha behi')) {
        return {
          text: 'Chokran bezzef! 🙏 Je suis ravi que ça vous plaise! Je continue à vous aider avec plaisir.',
          emotion: 'happy',
          quickReplies: ['Autre chose ?', 'Voir le panier', 'Recommandations'],
        };
      }
      if (tunisianExpressions.includes('mouch behi')) {
        return {
          text: 'Oh, je suis désolé que cela ne vous convienne pas. 😔 Dites-moi ce qui ne va pas et je vais trouver une meilleure option pour vous.',
          emotion: 'understanding',
          quickReplies: ['Autre style de plat', 'Budget différent', 'Autres préférences'],
        };
      }
    }

    // Détection du contexte de la conversation
    const contexts = {
      greeting: ['bonjour', 'salut', 'hello', 'hey', 'salam', 'sabah', 'marhba'],
      thanks: ['merci', 'chokran', 'merci beaucoup', 'thank you'],
      help: ['aide', 'aider', 'comment', 'que faire', 'besoin'],
      recommendation: ['recommande', 'suggère', 'conseil', 'quoi prendre', 'que me conseilles', 'propose'],
      budget: ['budget', 'prix', 'coûte', 'combien', 'euros', '€', 'dinar', 'dt', 'pas cher', 'économique'],
      allergy: ['allergie', 'allergique', 'intolérant', 'sensible à'],
      vegetarian: ['végétarien', 'vegetarien', 'vegan', 'végétalien', 'sans viande', 'végé'],
      spicy: ['épicé', 'piquant', 'fort', 'harissa'],
      light: ['léger', 'light', 'diététique', 'pas lourd', 'sain', 'healthy'],
      hearty: ['copieux', 'consistant', 'nourrissant', 'gros', 'rassasiant', 'beaucoup'],
      quick: ['rapide', 'vite', 'pressé', 'urgent', 'pas le temps'],
      special: ['spécialité', 'recommandé', 'populaire', 'meilleur', 'signature', 'typique', 'traditionnel'],
      seafood: ['fruits de mer', 'poisson', 'saumon', 'mer', 'crevette', 'thon', 'dorade'],
      meat: ['viande', 'steak', 'boeuf', 'poulet', 'burger', 'agneau', 'kefta'],
      pasta: ['pâtes', 'pasta', 'spaghetti', 'carbonara', 'penne'],
      dessert: ['dessert', 'sucré', 'gâteau', 'chocolat', 'doux', 'baklava', 'makroud'],
      drink: ['boisson', 'boire', 'vin', 'jus', 'eau', 'café', 'thé', 'cocktail'],
      romantic: ['romantique', 'amoureux', 'couple', 'date', 'rendez-vous'],
      birthday: ['anniversaire', 'fête', 'célébration', 'anniversaire'],
      weather: ['chaud', 'froid', 'chaleur', 'frais', 'météo'],
      mood: ['faim', 'envie', 'gourmand', 'humeur', 'feeling'],
      tunisian: ['tunisien', 'tunisienne', 'local', 'traditionnel', 'du pays'],
    };

    // Déterminer le contexte principal
    let mainContext = '';
    for (const [contextKey, keywords] of Object.entries(contexts)) {
      if (keywords.some(word => lowerMessage.includes(word))) {
        mainContext = contextKey;
        break;
      }
    }

    // Réponses intelligentes basées sur le contexte et le sentiment
    if (mainContext === 'greeting') {
      const hour = new Date().getHours();
      let timeGreeting = '';
      if (hour >= 5 && hour < 12) timeGreeting = 'Sabah el khir! ☀️';
      else if (hour >= 12 && hour < 18) timeGreeting = 'Bonjour! 🌞';
      else timeGreeting = 'Bonsoir! 🌙';
      
      return {
        text: `${timeGreeting} Bienvenue chez KweekServ ! Je suis là pour rendre votre expérience culinaire inoubliable. Avez-vous une envie particulière ou dois-je vous suggérer nos spécialités ?`,
        emotion: 'happy',
        quickReplies: [
          '🏛️ Spécialités tunisiennes',
          '🌟 Plat du jour',
          '💰 Menu avec budget',
          '❓ Je ne sais pas quoi prendre',
        ],
      };
    }

    if (mainContext === 'thanks') {
      return {
        text: 'Avec grand plaisir! 😊 B\'sahtek! Je suis là si vous avez besoin d\'autre chose.',
        emotion: 'happy',
        quickReplies: ['Ajouter une boisson', 'Voir suggestions dessert', 'Finaliser'],
      };
    }

    if (mainContext === 'tunisian') {
      const tunisianDishes = menuItems.filter(item => 
        item.description.toLowerCase().includes('tunisien') ||
        item.name.toLowerCase().includes('traditionnel')
      );
      
      if (tunisianDishes.length === 0) {
        // Fallback vers plats méditerranéens
        const mediterraneanDishes = menuItems.filter(item => 
          item.category === 'Plats'
        ).slice(0, 3);
        
        return {
          text: '🏛️ Les saveurs authentiques de Tunisie! Bien que notre menu soit inspiré de la cuisine méditerranéenne, je vous propose nos plats qui capturent l\'esprit tunisien :',
          suggestions: mediterraneanDishes,
          emotion: 'excited',
          quickReplies: ['Entrées tunisiennes', 'Thé à la menthe', 'Pâtisseries orientales'],
        };
      }
      
      return {
        text: '🇹🇳 Ah, vous voulez goûter à l\'authenticité tunisienne! Excellentchoix. Voici nos spécialités qui vous transporteront :',
        suggestions: tunisianDishes,
        emotion: 'excited',
        quickReplies: ['Accompagnements', 'Boisson traditionnelle', 'Menu complet'],
      };
    }

    if (mainContext === 'mood') {
      const mood = newPrefs.mood;
      if (mood === 'très faim') {
        const heartyDishes = menuItems.filter(item => 
          item.category === 'Plats' && item.price > 15
        );
        return {
          text: '🍖 Vous avez une faim de loup! Je comprends. Voici nos plats les plus copieux et rassasiants :',
          suggestions: heartyDishes.slice(0, 3),
          emotion: 'understanding',
          quickReplies: ['Avec entrée aussi', 'Double portion ?', 'Menu complet'],
        };
      } else if (mood === 'petite faim') {
        const lightDishes = menuItems.filter(item => 
          item.category === 'Entrées' || item.price < 15
        );
        return {
          text: '🥗 Pour une petite faim, voici des options légères et savoureuses :',
          suggestions: lightDishes.slice(0, 3),
          emotion: 'thinking',
          quickReplies: ['Ajouter dessert', 'Quelque chose de sucré'],
        };
      } else if (mood === 'aventureux') {
        const uniqueDishes = menuItems.filter(item => item.category === 'Plats').slice(0, 3);
        return {
          text: '🎭 Ooh, un esprit aventurier! Laissez-moi vous faire découvrir des saveurs uniques :',
          suggestions: uniqueDishes,
          emotion: 'excited',
          quickReplies: ['Le plus original', 'Surprise du chef'],
        };
      }
    }

    if (mainContext === 'weather') {
      const hour = new Date().getHours();
      const month = new Date().getMonth();
      const isSummer = month >= 5 && month <= 8;
      
      if (lowerMessage.includes('chaud') || isSummer) {
        const refreshingItems = menuItems.filter(item => 
          item.category === 'Entrées' ||
          item.description.toLowerCase().includes('salade') ||
          item.category === 'Boissons'
        );
        return {
          text: '☀️ Avec cette chaleur méditerranéenne, je vous suggère des plats frais et rafraîchissants :',
          suggestions: refreshingItems.slice(0, 3),
          emotion: 'understanding',
          quickReplies: ['Boissons fraîches', 'Salades', 'Glaces'],
        };
      } else {
        const comfortFood = menuItems.filter(item => item.category === 'Plats');
        return {
          text: '🍲 Pour se réchauffer, rien de mieux qu\'un bon plat réconfortant :',
          suggestions: comfortFood.slice(0, 3),
          emotion: 'understanding',
          quickReplies: ['Thé chaud', 'Soupes'],
        };
      }
    }

    if (mainContext === 'allergy') {
      const detectedAllergies = newPrefs.allergies || [];
      if (detectedAllergies.length > 0) {
        const safeItems = menuItems.filter(item => 
          !detectedAllergies.some(allergen => 
            item.description.toLowerCase().includes(allergen) ||
            item.name.toLowerCase().includes(allergen)
          )
        );
        return {
          text: `🛡️ Votre sécurité est ma priorité. Je note que vous êtes sensible à : ${detectedAllergies.join(', ')}. Voici des plats totalement sûrs pour vous :`,
          suggestions: safeItems.slice(0, 3),
          emotion: 'understanding',
          quickReplies: ['Autres options', 'Ingrédients détaillés', 'Parler au chef'],
        };
      } else {
        return {
          text: '🛡️ Je prends vos allergies très au sérieux. Pouvez-vous me préciser vos allergies ou intolérances ? (gluten, lactose, fruits de mer, noix, œuf, soja...)',
          emotion: 'understanding',
          quickReplies: ['Gluten', 'Lactose', 'Fruits de mer', 'Noix', 'Œuf'],
        };
      }
    }

    if (mainContext === 'vegetarian') {
      const vegItems = menuItems.filter(item => 
        item.category === 'Entrées' || 
        item.description.toLowerCase().includes('légumes') ||
        !item.description.toLowerCase().includes('viande') &&
        !item.description.toLowerCase().includes('poulet') &&
        !item.description.toLowerCase().includes('boeuf') &&
        !item.description.toLowerCase().includes('poisson')
      );
      return {
        text: '🌱 Excellent choix pour la santé et la planète! Notre sélection végétarienne met en valeur les produits frais du marché :',
        suggestions: vegItems.slice(0, 3),
        emotion: 'happy',
        quickReplies: ['Options vegan', 'Protéines végétales', 'Menu complet végé'],
      };
    }

    if (mainContext === 'budget') {
      const budget = newPrefs.budget;
      if (budget) {
        return createIntelligentBudgetMenu(budget, userPreferences);
      } else {
        return {
          text: '💰 Parfait! Donnez-moi une idée de votre budget et je vous créerai le meilleur menu possible dans cette gamme. Nous avons des options pour tous les budgets!',
          emotion: 'thinking',
          quickReplies: ['15-25€', '25-40€', '40-60€', '60€+', 'Le moins cher', 'Le meilleur rapport qualité/prix'],
        };
      }
    }

    if (mainContext === 'romantic') {
      const romanticDishes = menuItems.filter(item => 
        item.category === 'Plats' || item.category === 'Desserts'
      );
      const selectedDishes = [
        romanticDishes.find(item => item.category === 'Plats'),
        romanticDishes.find(item => item.category === 'Desserts'),
      ].filter(Boolean) as MenuItem[];
      
      return {
        text: '💕 Une soirée romantique... Quel cadre parfait! Laissez-moi créer une ambiance magique avec un menu raffiné pour deux :',
        suggestions: selectedDishes,
        emotion: 'excited',
        quickReplies: ['Ajouter du vin rosé', 'Dessert à partager', 'Menu surprise romantique'],
      };
    }

    if (mainContext === 'birthday') {
      const desserts = menuItems.filter(item => item.category === 'Desserts');
      return {
        text: '🎉 Joyeux anniversaire! Quelle belle occasion! Nous allons faire de cette journée un moment inoubliable. Voulez-vous un menu complet ou plutôt nos desserts spectaculaires ?',
        suggestions: desserts,
        emotion: 'excited',
        quickReplies: ['Menu anniversaire complet', 'Gâteau d\'anniversaire', 'Menu groupe'],
      };
    }

    if (mainContext === 'quick') {
      const quickItems = menuItems.filter(item => 
        item.name.includes('Burger') || 
        item.name.includes('Salade') ||
        item.category === 'Entrées'
      );
      return {
        text: '⚡ Pas de problème! Service rapide garanti. Voici nos options express, délicieuses et servies en moins de 15 minutes :',
        suggestions: quickItems.slice(0, 3),
        emotion: 'understanding',
        quickReplies: ['Le plus rapide', 'À emporter', 'Prêt en 10 min'],
      };
    }

    if (mainContext === 'light') {
      const lightItems = menuItems.filter(item => 
        item.category === 'Entrées' ||
        item.description.toLowerCase().includes('salade') ||
        item.description.toLowerCase().includes('légumes')
      );
      return {
        text: '🥗 Manger léger sans sacrifier le goût! Voici nos options fraîches, équilibrées et pleines de saveurs :',
        suggestions: lightItems.slice(0, 3),
        emotion: 'happy',
        quickReplies: ['Informations caloriques', 'Options riches en protéines', 'Végétarien léger'],
      };
    }

    if (mainContext === 'hearty') {
      const heartyItems = menuItems.filter(item => 
        item.category === 'Plats' &&
        (item.name.includes('Steak') || item.name.includes('Burger'))
      );
      return {
        text: '🍖 Pour les grands appétits! Voici nos plats les plus généreux et savoureux. Vous ne resterez pas sur votre faim!',
        suggestions: heartyItems,
        emotion: 'excited',
        quickReplies: ['Avec accompagnements XXL', 'Cuisson de la viande', 'Menu géant'],
      };
    }

    if (mainContext === 'special') {
      const specialties = menuItems
        .filter(item => item.category === 'Plats')
        .slice(0, 3);
      return {
        text: '⭐ Nos spécialités signature! Ces plats sont la fierté de notre chef et les coups de cœur de nos clients. Chaque bouchée raconte une histoire :',
        suggestions: specialties,
        emotion: 'excited',
        quickReplies: ['Histoire de ce plat', 'Ingrédients secrets', 'Conseil du chef'],
      };
    }

    // Détection de catégories spécifiques
    if (mainContext === 'seafood') {
      const seafoodItems = menuItems.filter(item => 
        item.description.toLowerCase().includes('saumon') ||
        item.description.toLowerCase().includes('poisson') ||
        item.description.toLowerCase().includes('mer')
      );
      if (seafoodItems.length > 0) {
        return {
          text: '🐟 Les fruits de la mer Méditerranée! Pêche du jour, fraîcheur garantie. Voici ce que je vous recommande :',
          suggestions: seafoodItems.slice(0, 3),
          emotion: 'excited',
          quickReplies: ['Pêche du jour ?', 'Accord vin blanc', 'Préparation ?'],
        };
      }
    }

    if (mainContext === 'meat') {
      const meatItems = menuItems.filter(item => 
        item.name.includes('Steak') || 
        item.name.includes('Burger') ||
        item.description.toLowerCase().includes('viande')
      );
      return {
        text: '🥩 Pour les vrais carnivores! Viandes sélectionnées, cuisson à la perfection. Préparez-vous à une explosion de saveurs :',
        suggestions: meatItems,
        emotion: 'excited',
        quickReplies: ['Quelle cuisson ?', 'Origine viande', 'Sauce maison'],
      };
    }

    if (mainContext === 'pasta') {
      const pastaItems = menuItems.filter(item => 
        item.name.toLowerCase().includes('pâtes') ||
        item.name.toLowerCase().includes('carbonara')
      );
      return {
        text: '🍝 Les pâtes, l\'essence de la Méditerranée! Nos pâtes fraîches faites maison chaque jour :',
        suggestions: pastaItems,
        emotion: 'happy',
        quickReplies: ['Pâtes fraîches ?', 'Sans gluten disponible ?', 'Sauce signature'],
      };
    }

    if (mainContext === 'dessert') {
      const desserts = menuItems.filter(item => item.category === 'Desserts');
      return {
        text: '🍰 La touche finale parfaite! Nos desserts sont des œuvres d\'art créées par notre pâtissier. Préparez-vous à fondre :',
        suggestions: desserts,
        emotion: 'excited',
        quickReplies: ['Le plus chocolaté', 'Option légère', 'Dessert signature', 'Pâtisserie orientale'],
      };
    }

    if (mainContext === 'drink') {
      const drinks = menuItems.filter(item => item.category === 'Boissons');
      return {
        text: '🍷 Notre cave et notre bar vous réservent de belles surprises. Que souhaitez-vous boire ?',
        suggestions: drinks,
        emotion: 'happy',
        quickReplies: ['Accord mets-vins', 'Cocktails maison', 'Sans alcool', 'Thé à la menthe'],
      };
    }

    // Recommandation générale ultra-intelligente
    if (mainContext === 'recommendation' || lowerMessage.includes('recommande') || lowerMessage.includes('ne sais pas')) {
      return getUltraSmartRecommendation();
    }

    // Réponse par défaut intelligente avec analyse
    const hasNumber = /\d/.test(lowerMessage);
    const isQuestion = lowerMessage.includes('?') || lowerMessage.includes('quel') || lowerMessage.includes('comment');
    
    if (hasNumber && !newPrefs.budget) {
      return {
        text: 'Je vois un chiffre dans votre message. Parlez-vous de votre budget ou du nombre de personnes ? Précisez-moi pour que je vous aide mieux! 🤔',
        emotion: 'thinking',
        quickReplies: ['C\'est mon budget', 'Nombre de personnes', 'Autre chose'],
      };
    }
    
    if (isQuestion) {
      return {
        text: 'Excellente question! 💭 Pour vous répondre au mieux, pouvez-vous me donner un peu plus de détails ? Par exemple :\n\n• Sur quel plat avez-vous des questions ?\n• Cherchez-vous des informations sur les ingrédients ?\n• Voulez-vous connaître nos spécialités ?',
        emotion: 'thinking',
        quickReplies: [
          'Ingrédients et allergènes',
          'Portions et quantités',
          'Temps de préparation',
          'Spécialités ElGROTTE',
        ],
      };
    }

    return {
      text: 'Je veux vraiment vous aider au mieux! 🎯 Mais j\'ai besoin de comprendre ce que vous recherchez. Pouvez-vous me donner plus de détails ?\n\n• Type de plat (viande, poisson, végétarien...)\n• Votre budget approximatif\n• Des allergies ou restrictions\n• L\'occasion (rapide, romantique, famille...)',
      emotion: 'thinking',
      quickReplies: [
        '✨ Surprends-moi !',
        '🍽️ Menu du jour',
        '💰 Budget 40€',
        '🌟 Plat signature',
      ],
    };
  };

  const createIntelligentBudgetMenu = (budget: number, prefs: UserPreferences): { text: string; suggestions: MenuItem[]; quickReplies?: string[]; emotion?: Message['emotion'] } => {
    let filteredItems = [...menuItems];
    
    // Appliquer les filtres de préférences
    if (prefs.dietaryRestrictions.includes('végétarien')) {
      filteredItems = filteredItems.filter(item => 
        !item.description.toLowerCase().includes('viande') &&
        !item.description.toLowerCase().includes('poulet')
      );
    }
    
    if (prefs.allergies.length > 0) {
      filteredItems = filteredItems.filter(item =>
        !prefs.allergies.some(allergen =>
          item.description.toLowerCase().includes(allergen)
        )
      );
    }

    const suggestions: MenuItem[] = [];
    let currentTotal = 0;

    if (budget >= 60) {
      // Menu gastronomique
      const entree = filteredItems.find(item => item.category === 'Entrées');
      const plat = filteredItems.find(item => item.category === 'Plats' && item.price > 20);
      const dessert = filteredItems.find(item => item.category === 'Desserts');
      const boisson = filteredItems.find(item => item.category === 'Boissons' && item.price > 10);
      
      [entree, plat, dessert, boisson].forEach(item => {
        if (item && currentTotal + item.price <= budget) {
          suggestions.push(item);
          currentTotal += item.price;
        }
      });

      return {
        text: `🌟 Pour ${budget}€, je vous compose une expérience gastronomique exceptionnelle (${currentTotal.toFixed(2)}€) :\\n\\n✨ Menu en 4 temps\\n🍷 Entrée raffinée\\n🍽️ Plat signature du chef\\n🍰 Dessert d\'exception\\n🥂 Boisson premium\\n\\nUn vrai voyage culinaire!`,
        suggestions,
        emotion: 'excited',
        quickReplies: ['Parfait !', 'Modifier légèrement', 'Ajouter vin premium'],
      };
    } else if (budget >= 40) {
      // Menu classique élégant
      const plat = filteredItems.find(item => item.category === 'Plats');
      const entreeOuDessert = filteredItems.find(item => 
        item.category === 'Entrées' || item.category === 'Desserts'
      );
      const boisson = filteredItems.find(item => item.category === 'Boissons');

      [plat, entreeOuDessert, boisson].forEach(item => {
        if (item && currentTotal + item.price <= budget) {
          suggestions.push(item);
          currentTotal += item.price;
        }
      });

      return {
        text: `👌 Pour ${budget}€, un excellent menu équilibré (${currentTotal.toFixed(2)}€) :\n\n🍽️ Plat principal de qualité\n🥗 Entrée OU dessert\n🍷 Boisson\n\nLe rapport qualité-prix parfait!`,
        suggestions,
        emotion: 'happy',
        quickReplies: ['Plutôt dessert', 'Plutôt entrée', 'Les deux !', 'Je valide'],
      };
    } else if (budget >= 25) {
      // Menu efficace
      const plat = filteredItems.find(item => item.category === 'Plats' && item.price <= 22);
      const boisson = filteredItems.find(item => item.category === 'Boissons' && item.price <= 8);

      if (plat) {
        suggestions.push(plat);
        currentTotal += plat.price;
      }
      if (boisson && currentTotal + boisson.price <= budget) {
        suggestions.push(boisson);
        currentTotal += boisson.price;
      }

      // Essayer d'ajouter entrée ou dessert
      const extra = filteredItems.find(item => 
        (item.category === 'Entrées' || item.category === 'Desserts') &&
        currentTotal + item.price <= budget
      );
      if (extra) {
        suggestions.push(extra);
        currentTotal += extra.price;
      }

      return {
        text: `💰 Pour ${budget}€, un menu savoureux et complet (${currentTotal.toFixed(2)}€) :\n\n🍽️ Bon plat\n🥤 Boisson\n${extra ? '➕ Bonus surprise!' : ''}\n\nExcellent choix budget!`,
        suggestions,
        emotion: 'happy',
        quickReplies: ['Ajouter dessert', 'Upgrade boisson', 'C\'est parfait'],
      };
    } else {
      // Options économiques mais qualité
      const affordable = filteredItems
        .filter(item => item.price <= budget && item.available)
        .sort((a, b) => b.price - a.price)
        .slice(0, 2);

      return {
        text: `🎯 Pour ${budget}€, voici nos meilleures options qualité :\n\nDes plats délicieux sans compromis sur la qualité!`,
        suggestions: affordable,
        emotion: 'understanding',
        quickReplies: ['Menu midi ?', 'Formule du jour', 'Options à partager'],
      };
    }
  };

  const getUltraSmartRecommendation = (): { text: string; suggestions: MenuItem[]; quickReplies?: string[]; emotion?: Message['emotion'] } => {
    // Recommandation ultra-personnalisée basée sur tout le contexte
    let filteredItems = [...menuItems];

    // Appliquer tous les filtres
    if (userPreferences.dietaryRestrictions.includes('végétarien')) {
      filteredItems = filteredItems.filter(item => 
        !item.description.toLowerCase().includes('viande') &&
        !item.description.toLowerCase().includes('poulet')
      );
    }

    if (userPreferences.allergies.length > 0) {
      filteredItems = filteredItems.filter(item =>
        !userPreferences.allergies.some(allergen =>
          item.description.toLowerCase().includes(allergen)
        )
      );
    }

    // Recommandation basée sur l'heure
    const hour = new Date().getHours();
    let timeBasedText = '';
    
    if (hour >= 12 && hour < 15) {
      timeBasedText = 'Pour ce déjeuner méditerranéen,';
      filteredItems = filteredItems.filter(item => item.category === 'Plats' || item.category === 'Entrées');
    } else if (hour >= 15 && hour < 18) {
      timeBasedText = 'Pour cette pause gourmande,';
      filteredItems = filteredItems.filter(item => item.category === 'Desserts' || item.category === 'Boissons');
    } else {
      timeBasedText = 'Pour cette belle soirée,';
    }

    // Sélectionner un menu équilibré
    const entree = filteredItems.find(item => item.category === 'Entrées');
    const plat = filteredItems.find(item => item.category === 'Plats');
    const dessert = filteredItems.find(item => item.category === 'Desserts');

    const suggestions = [entree, plat, dessert].filter(Boolean) as MenuItem[];

    let personalNote = '';
    if (userPreferences.allergies.length > 0) {
      personalNote = `\n\n✅ 100% sûr pour vous (sans ${userPreferences.allergies.join(', ')})`;
    }
    if (userPreferences.dietaryRestrictions.length > 0) {
      personalNote += `\n🌱 Respecte votre régime ${userPreferences.dietaryRestrictions.join(', ')}`;
    }

    return {
      text: `✨ ${timeBasedText} voici MA recommandation personnalisée juste pour vous!\n\nUn menu équilibré qui marie tradition et modernité, saveurs et fraîcheur.${personalNote}`,
      suggestions,
      emotion: 'excited',
      quickReplies: ['Pourquoi ces choix ?', 'Autre suggestion', 'C\'est parfait !', 'Modifier un élément'],
    };
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simuler un délai de réflexion intelligent (varie selon la complexité)
    const complexity = messageText.length > 50 ? 1500 : 1000;
    setTimeout(() => {
      const response = analyzeRequest(messageText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: response.suggestions,
        quickReplies: response.quickReplies,
        emotion: response.emotion || 'thinking',
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, complexity);
  };

  const handleAddItemToCart = (item: MenuItem) => {
    onAddToCart(item, 1);
    const confirmMessage: Message = {
      id: Date.now().toString(),
      text: `✅ Excellent choix! ${item.name} ajouté à votre panier.\n\n💡 Puis-je vous suggérer un accompagnement ou une boisson pour compléter ?`,
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'happy',
      quickReplies: ['Voir le panier', 'Accompagnement', 'Boisson', 'C\'est tout'],
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const getEmotionIcon = (emotion?: Message['emotion']) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'thinking': return '🤔';
      case 'excited': return '🤩';
      case 'understanding': return '💙';
      default: return '🤖';
    }
  };

  return (
    <>
      {/* Robot Mascotte - Style Tunisien */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-30 group"
        aria-label="Ouvrir l'assistant IA"
      >
        <div className="relative">
          {/* Pulse animation */}
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
          
          {/* Robot avec style méditerranéen */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 animate-bounce-slow border-4 border-white">
            <svg
              viewBox="0 0 64 64"
              className="w-10 h-10"
              fill="none"
            >
              <rect x="16" y="16" width="32" height="28" rx="6" fill="white" />
              <circle cx="26" cy="28" r="3" fill="#2563eb" className="animate-blink" />
              <circle cx="38" cy="28" r="3" fill="#2563eb" className="animate-blink" />
              <line x1="32" y1="16" x2="32" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="32" cy="8" r="2" fill="#60a5fa" className="animate-pulse" />
              <path d="M 24 36 Q 32 40 40 36" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" fill="none" />
              <rect x="20" y="44" width="24" height="12" rx="2" fill="#60a5fa" />
              <line x1="32" y1="44" x2="32" y2="56" stroke="white" strokeWidth="1" />
            </svg>

            {/* Badge notification */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </button>

      {/* Chat Modal - Design Tunisien */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden transform transition-all animate-scale-in border-4 border-blue-100">
            {/* Header avec logo KweekServ */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-4 flex items-center justify-between relative overflow-hidden">
              {/* Motif décoratif */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 border-4 border-white transform rotate-45"></div>
              </div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="text-white">Assistant KweekServ</h3>
                  <p className="text-white/90">IA Culinaire Intelligente</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors relative z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-sky-50 to-blue-50">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white shadow-md border-2 border-sky-100'
                    }`}
                  >
                    {message.sender === 'ai' && message.emotion && (
                      <div className="mb-1 text-xl">{getEmotionIcon(message.emotion)}</div>
                    )}
                    
                    <p className={`whitespace-pre-line ${message.sender === 'user' ? 'text-white' : 'text-sky-900'}`}>
                      {message.text}
                    </p>

                    {/* Suggestions de plats */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map(item => (
                          <div
                            key={item.id}
                            className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-200 rounded-xl p-3 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border-2 border-sky-100"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sky-900 truncate">{item.name}</p>
                                <p className="text-sky-600">{item.price.toFixed(2)} €</p>
                                <p className="text-gray-600 line-clamp-1">{item.category}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddItemToCart(item)}
                              className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white py-2 rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Ajouter
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Replies */}
                    {message.quickReplies && message.quickReplies.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {message.quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(reply)}
                            className="w-full bg-gradient-to-r from-sky-400 to-blue-400 text-white py-2 px-3 rounded-lg hover:from-sky-500 hover:to-blue-500 transition-all text-left shadow-sm border-2 border-sky-300"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-md border-2 border-sky-100 rounded-2xl p-3 flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
                    <span className="text-sky-600">Réflexion en cours...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t-4 border-sky-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Écrivez votre demande..."
                  className="flex-1 border-2 border-sky-200 rounded-2xl px-4 py-3 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all text-sky-900 placeholder-sky-400"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isTyping}
                  className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg transform active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}