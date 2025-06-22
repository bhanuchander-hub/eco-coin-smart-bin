
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Recycle, Leaf, Zap } from 'lucide-react';
import { GeminiApiService } from '@/services/geminiApi';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'general' | 'analysis' | 'order' | 'tip';
}

const EnhancedChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🌱 Hello! I\'m EcoBot, your AI-powered waste management assistant. I can help you with:\n\n🔍 Waste classification\n♻️ Recycling tips\n📦 Order tracking\n🌍 Environmental advice\n\nHow can I help you create a greener future today?',
      isBot: true,
      timestamp: new Date(),
      type: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { text: "What can I recycle?", icon: Recycle, color: "emerald" },
    { text: "Track my order", icon: Zap, color: "blue" },
    { text: "Plastic types", icon: Leaf, color: "green" },
    { text: "Eco tips", icon: Sparkles, color: "purple" }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
      type: 'general'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Generate response using Gemini API
      const response = await GeminiApiService.generateChatResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
        type: getMessageType(inputMessage)
      };

      setMessages(prev => [...prev, botMessage]);

      // Save conversation to database
      await saveChatToDatabase(userMessage.text, botMessage.text, botMessage.type);

    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Here are some quick tips:\n\n• Clean containers before recycling\n• Check recycling codes on plastics\n• Separate different materials\n• Contact support for order updates",
        isBot: true,
        timestamp: new Date(),
        type: 'general'
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      toast.error('Connection issue - using offline mode');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (actionText: string) => {
    setInputMessage(actionText);
    handleSendMessage();
  };

  const getMessageType = (message: string): 'general' | 'analysis' | 'order' | 'tip' => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('order') || lowerMessage.includes('pickup') || lowerMessage.includes('track')) {
      return 'order';
    } else if (lowerMessage.includes('analyze') || lowerMessage.includes('identify') || lowerMessage.includes('classify')) {
      return 'analysis';
    } else if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('help')) {
      return 'tip';
    }
    return 'general';
  };

  const saveChatToDatabase = async (userMessage: string, botResponse: string, messageType: string) => {
    try {
      await supabase
        .from('chatbot_conversations')
        .insert({
          message: userMessage,
          response: botResponse,
          message_type: messageType
        });
    } catch (error) {
      console.error('Error saving chat to database:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'analysis': return <Sparkles className="w-4 h-4" />;
      case 'order': return <Zap className="w-4 h-4" />;
      case 'tip': return <Leaf className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getMessageGradient = (type?: string) => {
    switch (type) {
      case 'analysis': return 'from-purple-500 to-pink-500';
      case 'order': return 'from-blue-500 to-cyan-500';
      case 'tip': return 'from-green-500 to-emerald-500';
      default: return 'from-emerald-500 to-teal-500';
    }
  };

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 transform ${
            isOpen 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rotate-90' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 animate-pulse'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-300" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
          )}
        </Button>
      </div>

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] z-50 animate-in slide-in-from-bottom-5 duration-300">
          <Card className="h-full flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-xl overflow-hidden">
            {/* Enhanced Header */}
            <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <CardTitle className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">EcoBot AI</h3>
                    <p className="text-xs text-emerald-100">Powered by Gemini AI</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs">Online</span>
                </div>
              </CardTitle>
              
              {/* Quick Action Buttons */}
              <div className="flex gap-2 mt-3 relative z-10">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuickAction(action.text)}
                    size="sm"
                    variant="secondary"
                    className="text-xs bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all hover:scale-105"
                  >
                    <action.icon className="w-3 h-3 mr-1" />
                    {action.text.split(' ')[0]}
                  </Button>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 bg-gradient-to-b from-gray-50 to-white">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-emerald-200">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl shadow-lg ${
                        message.isBot
                          ? `bg-gradient-to-r ${getMessageGradient(message.type)} text-white`
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.isBot && (
                          <div className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-80">
                            {getMessageIcon(message.type)}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          <p className={`text-xs mt-2 ${message.isBot ? 'text-white/70' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!message.isBot && (
                          <User className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-2xl shadow-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-sm">EcoBot is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input */}
              <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
                <div className="flex space-x-3 items-end">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about recycling, orders, or get eco tips..."
                      disabled={isTyping}
                      className="pr-12 py-3 rounded-2xl border-2 border-emerald-200 focus:border-emerald-400 bg-white/90 text-sm"
                    />
                    {inputMessage && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        {inputMessage.length}/500
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {isTyping ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                
                {/* Status indicator */}
                <div className="flex items-center justify-center mt-2 space-x-2 text-xs text-gray-500">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Powered by Gemini AI • Real-time responses</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default EnhancedChatbot;
