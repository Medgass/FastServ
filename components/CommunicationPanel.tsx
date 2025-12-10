import { useState, useRef, useEffect } from 'react';
import { X, Send, Bell, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

type CommunicationPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
};

type Message = {
  id: string;
  text: string;
  sender: 'client' | 'staff';
  timestamp: Date;
  type?: 'request' | 'info' | 'alert';
};

const quickMessages = [
  { text: 'Besoin d\'eau', icon: '💧' },
  { text: 'Demande serviettes', icon: '🧻' },
  { text: 'Question sur le plat', icon: '❓' },
  { text: 'Problème à signaler', icon: '⚠️' },
];

export function CommunicationPanel({ isOpen, onClose, tableNumber }: CommunicationPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Comment puis-je vous aider ?',
      sender: 'staff',
      timestamp: new Date(),
      type: 'info',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'client',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simuler une réponse du staff
    setTimeout(() => {
      const staffMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Message reçu ! Un serveur va s\'occuper de votre demande dans un instant.',
        sender: 'staff',
        timestamp: new Date(),
        type: 'info',
      };
      setMessages(prev => [...prev, staffMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center relative">
              <MessageCircle className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="text-white">Communication</h3>
              <p className="text-white/80">Table {tableNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900">Messages rapides</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickMessages.map((msg, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(msg.text)}
                className="bg-white border border-blue-200 rounded-xl p-3 hover:bg-blue-50 transition-all text-left transform active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{msg.icon}</span>
                  <span className="text-gray-700">{msg.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  message.sender === 'client'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                    : 'bg-white shadow-sm border border-gray-100'
                }`}
              >
                {message.type && message.sender === 'staff' && (
                  <div className="flex items-center gap-2 mb-2">
                    {message.type === 'info' && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {message.type === 'alert' && (
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                )}
                <p className={message.sender === 'client' ? 'text-white' : 'text-gray-900'}>
                  {message.text}
                </p>
                <p
                  className={`mt-1 ${
                    message.sender === 'client' ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Écrivez votre message..."
              className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg transform active:scale-95"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}