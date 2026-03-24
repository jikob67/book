
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, MessageCircle, PlusCircle, Bell, Search, Shield, FileText, Share2, Languages, X, Check, Info, Zap } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { useTranslation } from '../context/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'alert';
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t, language, setLanguage, isRtl } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Real User Data from Storage
  const [realUser, setRealUser] = useState({
    name: localStorage.getItem('book_user_name') || MOCK_USER.fullName,
    handle: localStorage.getItem('book_user_handle') || MOCK_USER.username,
    avatar: `https://ui-avatars.com/api/?name=${localStorage.getItem('book_user_name') || 'U'}&background=00FFBA&color=000`
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: isRtl ? 'مرحباً بك في book' : 'Welcome to book',
      body: isRtl ? 'استمتع بتجربة فريدة لتداول الكتب بالعملات الرقمية.' : 'Enjoy a unique experience trading books with crypto.',
      time: '1m ago',
      isRead: false,
      type: 'info'
    }
  ]);

  useEffect(() => {
    const handleStorage = () => {
      setRealUser({
        name: localStorage.getItem('book_user_name') || MOCK_USER.fullName,
        handle: localStorage.getItem('book_user_handle') || MOCK_USER.username,
        avatar: `https://ui-avatars.com/api/?name=${localStorage.getItem('book_user_name') || 'U'}&background=00FFBA&color=000`
      });
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const hasUnread = notifications.some(n => !n.isRead);
  const isActive = (path: string) => location.pathname === path ? 'text-accent' : 'text-gray-400';

  const handleShare = async () => {
    const shareData = {
      title: 'book - Marketplace',
      text: t('welcome'),
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        navigator.clipboard.writeText(shareData.url);
        alert(isRtl ? 'تم نسخ الرابط!' : 'Link copied!');
      }
    } catch (err) {}
  };

  const toggleLanguage = () => setLanguage(language === 'ar' ? 'en' : 'ar');
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, isRead: true })));

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
           <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900 flex items-center gap-1">
             <span className="bg-black text-accent px-3 py-1 rounded-xl transform -rotate-2">book</span>
           </Link>
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
            <input 
              type="text" 
              placeholder={t('search')}
              className={`w-full bg-gray-50 border border-gray-200 rounded-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-accent hover:text-black rounded-xl text-[10px] font-black transition-all border border-gray-100 uppercase">
            <Languages className="w-4 h-4" />
            <span className="tracking-widest">{t('langName')}</span>
          </button>
          
          <div className="relative">
            <button 
                onClick={() => { setShowNotifications(!showNotifications); if(!showNotifications) markAllAsRead(); }}
                className={`p-2 rounded-full transition-all ${showNotifications ? 'bg-black text-accent' : 'hover:bg-gray-50 text-gray-600'}`}
            >
                <Bell className="w-5 h-5" />
                {hasUnread && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
            </button>

            {showNotifications && (
                <div className={`absolute top-12 ${isRtl ? 'left-0' : 'right-0'} w-80 bg-white rounded-[2rem] border-4 border-gray-100 shadow-2xl z-[100] animate-in fade-in zoom-in duration-200 overflow-hidden`}>
                    <div className="bg-black p-5 flex justify-between items-center">
                        <span className="text-[10px] font-black text-accent uppercase tracking-widest italic">{isRtl ? 'المركز العصبي' : 'Neural Center'}</span>
                        <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.map(n => (
                            <div key={n.id} className="p-5 hover:bg-gray-50 transition-colors flex gap-4 border-b border-gray-50 last:border-0">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${n.type === 'alert' ? 'bg-red-50 text-red-500' : 'bg-accent/10 text-accent-hover'}`}>
                                    {n.type === 'alert' ? <Zap className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-xs text-gray-900 tracking-tighter">{n.title}</p>
                                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed">{n.body}</p>
                                    <p className="text-[8px] font-black text-gray-300 uppercase">{n.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
          
           <Link to="/profile" className="flex items-center gap-2">
            <img src={realUser.avatar} alt="Profile" className="w-8 h-8 rounded-full border-2 border-accent" />
            <div className="hidden lg:block text-right">
                <p className="text-[10px] font-black tracking-tighter leading-none">{realUser.name}</p>
                <p className="text-[8px] text-accent font-black">{realUser.handle}</p>
            </div>
           </Link>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-8">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-3 z-50 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/')}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">{t('home')}</span>
        </Link>
        <Link to="/chat" className={`flex flex-col items-center gap-1 ${isActive('/chat')}`}>
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">{t('chat')}</span>
        </Link>
        <Link to="/add" className="flex flex-col items-center gap-1 -mt-8">
          <div className="bg-black p-3 rounded-full shadow-lg shadow-accent/20 text-accent border-4 border-white">
            <PlusCircle className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter text-black mt-1">{t('sell')}</span>
        </Link>
        <button onClick={handleShare} className="flex flex-col items-center gap-1 text-gray-400">
          <Share2 className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Share</span>
        </button>
        <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile')}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">{t('profile')}</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
