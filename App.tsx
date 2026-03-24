
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import AISupport from './components/AISupport';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import { Book, BookType, CryptoWallet } from './types';
import { COMMISSIONS, MOCK_USER, SUBSCRIPTION_PLANS, ALL_CURRENCIES, WALLETS } from './constants';
import { Upload, AlertTriangle, ShieldCheck, Zap, Info, Check, Image as ImageIcon, FileText, Headphones, ChevronRight, ChevronLeft, Trash2, ShieldAlert, Globe, Coins, Wallet, Skull, Lock, Sparkles, Wand2, Gift, MapPin, Navigation, RefreshCw, X } from 'lucide-react';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { moderateListingContent } from './services/geminiService';

const AddListing = () => {
    const { t, isRtl } = useTranslation();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [rejectionReason, setRejectionReason] = useState<string | null>(null);
    const [agreedToEthicalTerms, setAgreedToEthicalTerms] = useState(false);

    // Form Data
    const [title, setTitle] = useState('');
    const [type, setType] = useState<BookType>('Paper');
    const [price, setPrice] = useState<number>(0);
    const [isFree, setIsFree] = useState(false);
    const [currency, setCurrency] = useState('USD');
    const [images, setImages] = useState<string[]>([]);
    const [digitalFile, setDigitalFile] = useState<File | null>(null);
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (upload) => {
                setImages([...images, upload.target?.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDigitalFile(file);
        }
    };

    const handlePublish = async () => {
        if (!agreedToEthicalTerms) return;
        setIsScanning(true);
        const moderation = await moderateListingContent({ title, type });

        if (!moderation.isAllowed) {
            setRejectionReason(moderation.reason || t('rejected'));
            setIsScanning(false);
            return;
        }

        setIsScanning(false);
        setIsPublishing(true);
        
        const newId = Math.random().toString(36).substr(2, 9);

        if (digitalFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                localStorage.setItem(`book_file_${newId}`, e.target?.result as string);
            };
            reader.readAsDataURL(digitalFile);
        }

        const newBook: Book = {
            id: newId,
            title,
            author: MOCK_USER.fullName,
            price: isFree ? 0 : price,
            currency,
            coverUrl: images[0] || 'https://images.unsplash.com/photo-1543004218-ee1411043384?auto=format&fit=crop&q=80',
            sellerId: MOCK_USER.id,
            type,
            category: 'General',
            description: title,
            commissionRate: COMMISSIONS[type],
            location: location || undefined
        };

        const existing = JSON.parse(localStorage.getItem('book_listings') || '[]');
        localStorage.setItem('book_listings', JSON.stringify([newBook, ...existing]));
        
        setTimeout(() => {
            setIsPublishing(false);
            navigate('/');
        }, 1500);
    };

    const isStepValid = () => {
        if (step === 1) return title.trim() !== '' && (isFree || price >= 0);
        if (step === 2) return images.length > 0;
        if (step === 3) return type === 'Paper' ? true : digitalFile !== null;
        if (step === 4) return type === 'Paper' ? location !== null : true;
        if (step === 5) return agreedToEthicalTerms;
        return true;
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-10 pb-40">
             {(isScanning || isPublishing) && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center text-white">
                    <RefreshCw className="w-16 h-16 text-accent animate-spin mb-4" />
                    <p className="font-black text-xl italic uppercase tracking-tighter">
                        {isScanning ? t('scanning') : t('publishAsset')}
                    </p>
                </div>
            )}

            {rejectionReason && (
                <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-6 text-center">
                    <div className="bg-white p-10 rounded-[3rem] space-y-6 max-w-sm border-4 border-red-500">
                        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
                        <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{isRtl ? 'تم رفض الإعلان' : 'Listing Rejected'}</h3>
                        <p className="text-sm text-gray-500 font-bold leading-relaxed">{rejectionReason}</p>
                        <button onClick={() => setRejectionReason(null)} className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-xs">
                            {isRtl ? 'فهمت' : 'I Understand'}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">
                    {t('listAsset')}
                </h2>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl font-black text-[10px] text-gray-500">
                    {t('previous') === 'Previous' ? 'STEP' : 'الخطوة'} {step}/5
                </div>
            </div>

            <div className="space-y-8">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="grid grid-cols-3 gap-4">
                            {(['Paper', 'E-book', 'Audiobook'] as BookType[]).map(t_type => (
                                <button key={t_type} onClick={() => setType(t_type)} className={`py-6 rounded-[2rem] border-4 font-black text-[10px] uppercase transition-all ${type === t_type ? 'border-accent bg-black text-white' : 'border-gray-50 text-gray-400'}`}>
                                    {t_type === 'Paper' ? (isRtl ? 'ورقي' : 'Paper') : t_type === 'E-book' ? (isRtl ? 'إلكتروني' : 'E-book') : (isRtl ? 'صوتي' : 'Audio')}
                                </button>
                            ))}
                        </div>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('assetTitle')} className="w-full p-8 bg-gray-50 rounded-[2rem] font-black text-xl outline-none border-4 border-transparent focus:border-accent" />
                        <div className="p-6 bg-gray-50 rounded-[2rem] flex items-center justify-between">
                            <span className="font-black text-[10px] uppercase text-gray-400">{t('listFree')}</span>
                            <button onClick={() => setIsFree(!isFree)} className={`w-12 h-6 rounded-full relative transition-all ${isFree ? 'bg-accent' : 'bg-gray-300'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFree ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                        {!isFree && (
                            <div className="flex gap-4">
                                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder={t('price')} className="flex-1 p-8 bg-gray-50 rounded-[2rem] font-black text-4xl" />
                                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="p-6 bg-gray-50 rounded-[2rem] font-black uppercase">
                                    {ALL_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-gray-100 group">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {images.length < 4 && (
                                <label className="aspect-[3/4] rounded-3xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    <ImageIcon className="w-10 h-10 text-gray-300" />
                                    <span className="mt-2 text-[10px] font-black text-gray-400 uppercase">{t('addCover')}</span>
                                </label>
                            )}
                        </div>
                        <p className="text-center text-[10px] font-bold text-gray-400 uppercase">{t('coverHint')}</p>
                    </div>
                )}

                {step === 3 && type !== 'Paper' && (
                    <div className="space-y-6 animate-in fade-in text-center">
                        <label className={`block p-20 border-4 border-dashed rounded-[3rem] cursor-pointer transition-all ${digitalFile ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-accent'}`}>
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                            <FileText className={`w-16 h-16 mx-auto mb-4 ${digitalFile ? 'text-accent' : 'text-gray-300'}`} />
                            <p className="font-black uppercase text-xs">{digitalFile ? digitalFile.name : t('digitalFileLabel')}</p>
                        </label>
                        <p className="text-[10px] text-gray-400 font-bold px-10">{t('encryptionHint')}</p>
                    </div>
                )}
                {step === 3 && type === 'Paper' && (
                    <div className="py-20 text-center space-y-4 opacity-50">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                           <Zap className="w-10 h-10 text-gray-300" />
                        </div>
                        <p className="font-black text-xs uppercase italic">{t('noFileNeeded')}</p>
                    </div>
                )}

                {step === 4 && type === 'Paper' && (
                    <div className="space-y-6 animate-in zoom-in text-center">
                         <button 
                            onClick={() => {
                                setIsLocating(true);
                                navigator.geolocation.getCurrentPosition(pos => {
                                    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                                    setIsLocating(false);
                                });
                            }} 
                            className="w-full py-10 bg-black text-accent rounded-[2rem] font-black uppercase flex flex-col items-center gap-2 shadow-2xl active:scale-95 transition-all"
                        >
                            {isLocating ? <RefreshCw className="animate-spin" /> : <MapPin className="w-8 h-8" />}
                            <span>{location ? t('locCaptured') : t('gpsLocate')}</span>
                        </button>
                        {location && <p className="text-[10px] font-mono opacity-50 bg-gray-50 p-2 rounded-lg">{location.lat}, {location.lng}</p>}
                    </div>
                )}
                {step === 4 && type !== 'Paper' && (
                    <div className="py-20 text-center space-y-4 opacity-50">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                           <Globe className="w-10 h-10 text-gray-300" />
                        </div>
                        <p className="font-black text-xs uppercase italic">{t('noLocNeeded')}</p>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-6 animate-in fade-in text-center">
                        <div className="bg-red-50 p-10 rounded-[2rem] border-2 border-red-100">
                             <p className="font-black text-red-900 uppercase text-xs">{t('ethicalCommit')}</p>
                             <p className="text-[10px] text-red-800 mt-2 font-bold leading-relaxed">{t('ethicalPledge')}</p>
                             <button onClick={() => setAgreedToEthicalTerms(!agreedToEthicalTerms)} className={`mt-6 p-4 rounded-xl border-2 font-black uppercase text-[10px] transition-all ${agreedToEthicalTerms ? 'bg-black text-white' : 'border-red-200 text-red-300'}`}>
                                {t('agreePledge')}
                             </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="fixed bottom-24 left-0 right-0 p-6 max-w-2xl mx-auto flex gap-4 bg-white/50 backdrop-blur-md">
                {step > 1 && <button onClick={() => setStep(step - 1)} className="flex-1 py-6 rounded-[2rem] bg-gray-100 font-black uppercase text-[10px] text-gray-500 hover:bg-gray-200 transition-colors">
                    {t('previous')}
                </button>}
                <button 
                    disabled={!isStepValid()}
                    onClick={() => step === 5 ? handlePublish() : setStep(step + 1)} 
                    className={`flex-[2] py-6 rounded-[2rem] font-black uppercase text-xs shadow-2xl transition-all ${isStepValid() ? 'bg-black text-accent' : 'bg-gray-100 text-gray-300'}`}
                >
                    {step === 5 ? t('publishAsset') : t('next')}
                </button>
            </div>
        </div>
    );
};

const AppContent: React.FC = () => {
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

    useEffect(() => {
        setIsRegistered(!!localStorage.getItem('book_user_registered'));
    }, []);

    if (isRegistered === null) return null;

    if (!isRegistered) {
        return <Signup onComplete={() => setIsRegistered(true)} />;
    }

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/add" element={<AddListing />} />
                    <Route path="/chat/:userId" element={<Chat />} />
                </Routes>
            </Layout>
            <AISupport />
        </Router>
    );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
        <AppContent />
    </LanguageProvider>
  );
};

export default App;
