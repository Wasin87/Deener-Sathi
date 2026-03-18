import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, X, Bot, User, Volume2, VolumeX, Sparkles, MessageSquare } from 'lucide-react';
import { getIslamicAssistantResponse } from '../services/geminiService';
import { useLanguage } from '../hooks/useLanguage';

export const VoiceAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const stopAll = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if (isMuted) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voiceLang = localStorage.getItem('voiceLanguage') || language;
    // Correct language codes
    utterance.lang = voiceLang === 'bn' ? 'bn-BD' : 'en-US';
    
    const voices = window.speechSynthesis.getVoices();
    let preferredVoice;
    
    if (voiceLang === 'bn') {
      // Find a Bangla voice
      preferredVoice = voices.find(v => v.lang.startsWith('bn'));
    } else {
      // Find a natural English voice
      preferredVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural')) && v.lang.startsWith('en'));
    }
    
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.rate = voiceLang === 'bn' ? 0.9 : 1.0; // Slightly slower for Bangla for clarity
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user' as const, content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsListening(false);

    try {
      const response = await getIslamicAssistantResponse(text);
      const assistantMessage = { role: 'assistant' as const, content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Assistant Error:", error);
      const errorMessage = { role: 'assistant' as const, content: t('assistantError') };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      alert(t('voiceNotSupported'));
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    const voiceLang = localStorage.getItem('voiceLanguage') || language;
    recognition.lang = voiceLang === 'bn' ? 'bn-BD' : 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            stopAll();
          } else {
            setIsOpen(true);
          }
        }}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-white rounded-full shadow-[0_10px_40px_rgba(200,169,81,0.4)] flex items-center justify-center z-40 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 group-hover:hidden" />
        <Mic size={20} className="relative z-10" />
      </motion.button>

      {/* Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="fixed bottom-20 right-6 w-[420px] max-w-[90vw] h-[650px] glass rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-50 flex flex-col overflow-hidden border border-primary/20"
          >
            {/* Header */}
            <div className="p-8 border-b border-primary/10 flex justify-between items-center bg-primary/5 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Bot className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-secondary dark:text-white font-bold text-lg">{t('islamicAssistant')}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">{t('online')}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary/50 dark:text-white/50 hover:text-primary hover:bg-primary/10 transition-all"
                >
                  {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    stopAll();
                  }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary/50 dark:text-white/50 hover:text-primary hover:bg-primary/10 transition-all"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-islamic-pattern opacity-5">
              {/* This is a trick to have the pattern as background but not affect text opacity */}
            </div>
            <div className="absolute inset-0 top-[100px] bottom-[100px] overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 animate-bounce">
                    <Sparkles size={40} />
                  </div>
                  <h4 className="text-xl font-bold text-secondary dark:text-white mb-2">{t('assalamuAlaikum')}</h4>
                  <p className="text-secondary/60 dark:text-white/60 max-w-[200px]">{t('howCanIHelp')}</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                      msg.role === 'user' ? 'bg-secondary text-white' : 'bg-primary text-white'
                    }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-5 rounded-3xl shadow-sm relative group ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'glass text-secondary dark:text-white border border-primary/10 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      
                      {msg.role === 'assistant' && (
                        <button 
                          onClick={() => speak(msg.content)}
                          className={`absolute -right-12 top-0 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                            isSpeaking ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'
                          }`}
                          title={t('listen')}
                        >
                          {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-8 bg-primary/5 border-t border-primary/10 relative">
              <div className="flex items-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleListening}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  <Mic size={24} />
                </motion.button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder={t('askPlaceholder')}
                    className="w-full bg-white dark:bg-dark-card border border-primary/10 dark:border-white/10 rounded-2xl pl-6 pr-14 py-4 text-secondary dark:text-white text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                  />
                  <button 
                    onClick={() => handleSend(input)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>

              {/* Wave Animation */}
              {isSpeaking && (
                <div className="absolute top-0 left-0 right-0 h-1 flex items-end gap-1 px-8 -translate-y-full">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, Math.random() * 24 + 8, 4] }}
                      transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.03 }}
                      className="flex-1 bg-primary rounded-t-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
