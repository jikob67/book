
import React, { useState } from 'react';
import { UserPlus, ShieldCheck, ArrowRight, Sparkles, X, Scale, Lock, Eye, Database, Globe, BookOpen, Smartphone, AlertTriangle, ShieldAlert, FileText, Check } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import Terms from './Terms';
import Privacy from './Privacy';

interface SignupProps {
  onComplete: () => void;
}

const Signup: React.FC<SignupProps> = ({ onComplete }) => {
  const { t, isRtl } = useTranslation();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [modalContent, setModalContent] = useState<'none' | 'terms' | 'privacy'>('none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && username && agreed) {
      localStorage.setItem('book_user_registered', 'true');
      localStorage.setItem('book_user_name', name);
      localStorage.setItem('book_user_handle', username.startsWith('@') ? username : `@${username}`);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md space-y-10 relative z-10">
        <div className="text-center space-y-6">
          <div className="inline-block bg-black text-accent px-6 py-3 rounded-[1.5rem] transform -rotate-3 mb-2 shadow-2xl border-b-4 border-accent">
            <span className="text-5xl font-black tracking-tighter italic">book</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">{t('signup')}</h2>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">{isRtl ? 'بوابة المعرفة الآمنة' : 'The Secure Knowledge Portal'}</p>
          </div>
          
          <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
            <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-[10px] font-black text-red-900 leading-tight text-right">
                {isRtl ? 'يخضع محتوى هذا التطبيق لرقابة أخلاقية صارمة لضمان سلامة المجتمع.' : 'App content is strictly moderated for community safety and ethical standards.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 mt-10">
          <div className="space-y-5">
            <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">{t('fullName')}</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full p-6 bg-gray-50 border-4 border-transparent focus:border-accent rounded-[2rem] outline-none font-black text-black text-sm shadow-inner transition-all" 
              />
            </div>
            <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">{t('username')}</label>
              <input 
                type="text" 
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="@username" 
                className="w-full p-6 bg-gray-50 border-4 border-transparent focus:border-accent rounded-[2rem] outline-none font-black text-black text-sm shadow-inner transition-all" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 p-5 bg-gray-50 rounded-[1.5rem] cursor-pointer hover:bg-gray-100 transition-all border border-gray-100 group">
                <div className="relative mt-1">
                    <input 
                        type="checkbox" 
                        required
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="peer h-6 w-6 opacity-0 absolute cursor-pointer" 
                    />
                    <div className="h-6 w-6 border-4 border-gray-200 rounded-lg flex items-center justify-center transition-all peer-checked:bg-black peer-checked:border-black group-hover:border-accent">
                        <Check className="w-4 h-4 text-accent stroke-[4px] opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                </div>
                <div className={`text-[11px] font-black uppercase tracking-tight leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                    <span className="text-gray-400">{isRtl ? 'أنا أوافق على' : 'I agree to the'} </span>
                    <button type="button" onClick={() => setModalContent('terms')} className="text-black underline underline-offset-4 decoration-accent decoration-2 hover:text-accent transition-colors">{t('terms')}</button>
                    <span className="text-gray-400"> {isRtl ? 'و' : 'and'} </span>
                    <button type="button" onClick={() => setModalContent('privacy')} className="text-black underline underline-offset-4 decoration-accent decoration-2 hover:text-accent transition-colors">{t('privacy')}</button>
                    <p className="text-red-500 mt-1 font-bold italic">{isRtl ? '* الالتزام الأخلاقي إلزامي' : '* Ethical commitment is mandatory'}</p>
                </div>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={!agreed}
            className={`w-full py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all group ${
                agreed ? 'bg-black text-white hover:bg-accent hover:text-black active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {t('startNow')} <ArrowRight className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </form>

        <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-widest">Powered by book Guard AI Protocol v2.4</p>
      </div>

      {/* Policies Modals Overlay */}
      {modalContent !== 'none' && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[3.5rem] border-4 border-gray-100 shadow-2xl overflow-hidden flex flex-col relative">
                <div className="sticky top-0 p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        {modalContent === 'terms' ? <FileText className="w-6 h-6 text-accent" /> : <Lock className="w-6 h-6 text-accent" />}
                        <h3 className="text-xl font-black uppercase tracking-tighter italic">
                            {modalContent === 'terms' ? t('terms') : t('privacy')}
                        </h3>
                    </div>
                    <button 
                        onClick={() => setModalContent('none')}
                        className="p-3 bg-white hover:bg-black hover:text-white rounded-2xl transition-all shadow-xl border border-gray-100"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {modalContent === 'terms' ? <Terms /> : <Privacy />}
                </div>

                <div className="p-8 bg-black">
                    <button 
                        onClick={() => setModalContent('none')}
                        className="w-full bg-accent text-black py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {isRtl ? 'فهمت وأوافق' : 'I UNDERSTAND & AGREE'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
