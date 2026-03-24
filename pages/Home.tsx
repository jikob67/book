
import React, { useState, useEffect } from 'react';
import { MOCK_BOOKS, WALLETS } from '../constants';
import { BookOpen, Headphones, FileText, Gift, Zap, Plus, Inbox, Check, Sparkles, Flag, AlertCircle, X, Copy, CreditCard, ShieldCheck, Download, ExternalLink, ShieldAlert, RefreshCw, Share2, Wallet, Landmark, ChevronRight, MapPin } from 'lucide-react';
import { Book, BookType, CryptoWallet } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

const PaymentModal = ({ book, onClose }: { book: Book, onClose: () => void }) => {
    const { t, isRtl } = useTranslation();
    const navigate = useNavigate();
    const isFree = book.price === 0;
    
    const [step, setStep] = useState(isFree ? 4 : 1); 
    const [method, setMethod] = useState<'crypto' | 'traditional' | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<CryptoWallet | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [cardData, setCardData] = useState({ number: '', exp: '', cvc: '' });
    const [txHash, setTxHash] = useState('');

    const handleShare = async () => {
        const shareData = {
            title: `book | ${book.title}`,
            text: isRtl ? `شاهد هذا الكتاب المذهل على منصة book: ${book.title}` : `Check out this amazing book on book: ${book.title}`,
            url: `${window.location.origin}/#/book/${book.id}`
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert(isRtl ? 'تم نسخ الرابط لمشاركته عبر تطبيقات التواصل!' : 'Link copied for external sharing!');
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const validateAndPay = () => {
        if (method === 'crypto' && txHash.length < 10) {
            alert(isRtl ? "يرجى إدخال رمز عملية (Hash) صحيح" : "Please enter a valid Transaction Hash");
            return;
        }
        if (method === 'traditional' && cardData.number.length < 16) {
            alert(isRtl ? "رقم بطاقة غير مكتمل" : "Incomplete card number");
            return;
        }

        setIsVerifying(true);
        setTimeout(() => { 
            setIsVerifying(false); 
            setStep(4); 
            const purchases = JSON.parse(localStorage.getItem('book_purchases') || '[]');
            localStorage.setItem('book_purchases', JSON.stringify([...purchases, book.id]));
        }, 2000);
    };

    const handleDownload = () => {
        const fileData = localStorage.getItem(`book_file_${book.id}`);
        if (fileData) {
            const link = document.createElement('a');
            link.href = fileData;
            link.download = `${book.title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert(isRtl ? "الملف الرقمي غير متوفر حالياً (ربما تم حذفه من الذاكرة المؤقتة)" : "Digital file not found in local storage cache");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[3.5rem] border-4 border-gray-100 shadow-2xl overflow-hidden relative">
                <div className="p-8 bg-black text-white flex justify-between items-center border-b-4 border-accent">
                    <div className="flex items-center gap-3">
                        {isFree ? <Gift className="w-6 h-6 text-accent" /> : <CreditCard className="w-6 h-6 text-accent" />}
                        <h3 className="text-xl font-black uppercase tracking-tighter italic">
                            {isFree ? (isRtl ? 'هدية مجانية' : 'FREE GIFT') : (isRtl ? 'بوابة الدفع' : 'PAYMENT GATEWAY')}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">{isRtl ? 'اختر وسيلة الدفع' : 'SELECT PAYMENT METHOD'}</p>
                            <div className="grid grid-cols-1 gap-4">
                                <button onClick={() => { setMethod('crypto'); setStep(2); }} className="p-6 bg-gray-50 rounded-[2rem] border-4 border-transparent hover:border-accent flex items-center justify-between group transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-accent"><Wallet className="w-6 h-6" /></div>
                                        <div className="text-left text-black">
                                            <p className="font-black text-sm uppercase tracking-tighter">{isRtl ? 'الأصول الرقمية' : 'Digital Assets'}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-accent" />
                                </button>
                                <button onClick={() => { setMethod('traditional'); setStep(3); }} className="p-6 bg-gray-50 rounded-[2rem] border-4 border-transparent hover:border-black flex items-center justify-between group transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white"><Landmark className="w-6 h-6" /></div>
                                        <div className="text-left text-black">
                                            <p className="font-black text-sm uppercase tracking-tighter">{isRtl ? 'بطاقة بنكية' : 'Bank Card'}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-black" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                         <div className="space-y-6 animate-in slide-in-from-right-4">
                            <div className="grid grid-cols-2 gap-3">
                                {WALLETS.map(w => (
                                    <button key={w.symbol} onClick={() => setSelectedWallet(w)} className={`p-4 rounded-2xl border-4 transition-all text-center space-y-2 ${selectedWallet?.symbol === w.symbol ? 'border-accent bg-accent/5' : 'border-gray-50 hover:border-accent/30'}`}>
                                        <span className="text-[10px] font-black block uppercase text-black">{w.name}</span>
                                        <span className="text-[8px] font-bold text-gray-400 block">{w.symbol}</span>
                                    </button>
                                ))}
                            </div>
                            {selectedWallet && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200 relative group">
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Send to address:</p>
                                        <p className="text-[9px] font-mono break-all font-bold pr-10">{selectedWallet.address}</p>
                                        <button onClick={() => { navigator.clipboard.writeText(selectedWallet.address); alert('Copied!'); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm hover:bg-black hover:text-white transition-all">
                                            <Copy className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={txHash}
                                        onChange={(e) => setTxHash(e.target.value)}
                                        placeholder="Enter Transaction Hash (TXID)" 
                                        className="w-full p-4 bg-gray-50 rounded-xl font-mono text-xs border-2 border-transparent focus:border-accent outline-none" 
                                    />
                                </div>
                            )}
                            <button disabled={!selectedWallet || !txHash} onClick={validateAndPay} className={`w-full py-6 rounded-[2rem] font-black uppercase text-xs transition-all ${(!selectedWallet || !txHash) ? 'bg-gray-100 text-gray-300' : 'bg-black text-accent shadow-2xl shadow-accent/20 active:scale-95'}`}>
                                {isVerifying ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : (isRtl ? 'تأكيد عملية الدفع' : 'CONFIRM TRANSACTION')}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <div className="bg-gray-900 p-8 rounded-[2.5rem] space-y-4">
                                <input 
                                    type="text" 
                                    maxLength={16}
                                    value={cardData.number}
                                    onChange={(e) => setCardData({...cardData, number: e.target.value})}
                                    placeholder="Card Number (16 digits)" 
                                    className="w-full bg-black/50 border-b border-accent p-2 font-mono text-white outline-none text-xs" 
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="MM/YY" className="w-full bg-transparent border-b border-gray-700 p-2 font-mono text-white outline-none text-xs" />
                                    <input type="text" maxLength={3} placeholder="CVC" className="w-full bg-transparent border-b border-gray-700 p-2 font-mono text-white outline-none text-xs" />
                                </div>
                            </div>
                            <button onClick={validateAndPay} className="w-full py-6 bg-black text-white rounded-[2rem] font-black uppercase text-xs flex items-center justify-center gap-3">
                                {isVerifying ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> {isRtl ? 'إتمام الدفع الآمن' : 'SECURE CHECKOUT'}</>}
                            </button>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="py-10 text-center space-y-8 animate-in zoom-in">
                            <div className="w-24 h-24 bg-accent rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-accent/40 border-8 border-white"><Check className="w-12 h-12 text-black stroke-[5px]" /></div>
                            <div className="space-y-2">
                                <h4 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">{isFree ? (isRtl ? 'استلمت الكتاب!' : 'GET FOR FREE!') : (isRtl ? 'تم الشراء بنجاح' : 'PURCHASE SUCCESS')}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{isRtl ? 'شكراً لثقتك بمنصة book' : 'Thank you for using book platform'}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {book.type !== 'Paper' ? (
                                    <button onClick={handleDownload} className="w-full py-6 bg-accent text-black rounded-[2rem] font-black text-xs uppercase shadow-2xl flex items-center justify-center gap-3 hover:bg-black hover:text-accent transition-all"><Download className="w-5 h-5" /> {isRtl ? 'تحميل الملف الفعلي' : 'DOWNLOAD ACTUAL FILE'}</button>
                                ) : (
                                    <button onClick={() => navigate(`/chat/${book.sellerId}`)} className="w-full py-6 bg-accent text-black rounded-[2rem] font-black text-xs uppercase shadow-2xl flex items-center justify-center gap-3"><ExternalLink className="w-5 h-5" /> {isRtl ? 'تواصل مع البائع للتسليم' : 'CHAT FOR PICKUP'}</button>
                                )}
                                <button onClick={handleShare} className="w-full py-6 bg-black text-white rounded-[2rem] font-black text-xs uppercase flex items-center justify-center gap-3 hover:bg-accent hover:text-black transition-all">
                                    <Share2 className="w-5 h-5" /> {isRtl ? 'مشاركة الإعلان خارج التطبيق' : 'SHARE OUTSIDE APP'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BookCard: React.FC<{ book: Book, onReport: (id: string) => void, onBuy: (book: Book) => void }> = ({ book, onReport, onBuy }) => {
  const { t, isRtl } = useTranslation();
  const navigate = useNavigate();
  const isFree = book.price === 0;
  
  const getTypeIcon = (type: BookType) => {
    switch(type) {
      case 'Audiobook': return <Headphones className="w-4 h-4" />;
      case 'E-book': return <FileText className="w-4 h-4" />;
      case 'Paper': return <BookOpen className="w-4 h-4" />;
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `book: ${book.title}`,
      text: isRtl ? `شاهد هذا الكتاب على منصة book: ${book.title}` : `Check out this book on book: ${book.title}`,
      url: `${window.location.origin}/#/book/${book.id}`,
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareData.url);
            alert(isRtl ? 'تم نسخ رابط الإعلان لمشاركته!' : 'Ad link copied to clipboard!');
        }
    } catch (err) {}
  };

  const openInMaps = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (book.location) {
          window.open(`https://www.google.com/maps?q=${book.location.lat},${book.location.lng}`, '_blank');
      }
  };

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border transition-all group flex flex-col h-full border-gray-100 hover:shadow-2xl hover:border-accent/30">
      <div className="relative aspect-[3/4] overflow-hidden cursor-pointer" onClick={() => navigate(`/book/${book.id}`)}>
        <img src={book.coverUrl || 'https://images.unsplash.com/photo-1543004218-ee1411043384?auto=format&fit=crop&q=80'} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        
        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-black/90 text-white px-3 py-2 rounded-2xl text-[10px] font-black shadow-lg backdrop-blur-md">
                {isFree ? (isRtl ? "مجاني" : "FREE") : `${book.price} ${book.currency}`}
            </div>
            <button 
                onClick={handleShare}
                className="bg-white/90 text-black p-3 rounded-2xl shadow-xl backdrop-blur-md hover:bg-accent hover:text-black transition-all active:scale-90"
                title={isRtl ? "مشاركة خارج التطبيق" : "Share outside app"}
            >
                <Share2 className="w-4 h-4" />
            </button>
        </div>
        
        {book.location && (
            <button onClick={openInMaps} className="absolute bottom-12 right-4 bg-black/80 text-white px-3 py-1.5 rounded-xl text-[8px] font-black flex items-center gap-1 hover:bg-accent hover:text-black backdrop-blur-sm">
                <MapPin className="w-3 h-3 text-accent" /> {isRtl ? 'موقع الاستلام' : 'LOCATION'}
            </button>
        )}

        <div className="absolute bottom-4 left-4 bg-white/95 text-black px-3 py-1.5 rounded-xl text-[9px] font-black flex items-center gap-2 shadow-xl border border-gray-100 backdrop-blur-sm">{getTypeIcon(book.type)} {book.type.toUpperCase()}</div>
      </div>
      <div className={`p-6 flex-1 flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
        <h4 className="font-black text-gray-900 line-clamp-2 text-sm leading-tight mb-4">{book.title}</h4>
        <div className="mt-auto flex items-center gap-2">
          <button onClick={() => onBuy(book)} className={`flex-1 text-[10px] font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 ${isFree ? 'bg-accent text-black hover:bg-black hover:text-accent' : 'bg-black text-white hover:bg-accent hover:text-black'}`}>
            {isFree ? <Gift className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            {isFree ? (isRtl ? 'احصل عليه الآن' : 'Get it Now') : t('buyNow')}
          </button>
          <button onClick={handleShare} className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-accent/10 hover:text-accent transition-all">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [reportedIds, setReportedIds] = useState<string[]>([]);
  const [payingForBook, setPayingForBook] = useState<Book | null>(null);

  useEffect(() => {
    setLocalBooks(JSON.parse(localStorage.getItem('book_listings') || '[]'));
    setReportedIds(JSON.parse(localStorage.getItem('book_reported_items') || '[]'));
  }, []);

  const allBooks = [...localBooks].filter(b => !reportedIds.includes(b.id));
  const filteredBooks = activeFilter === 'All' ? allBooks : allBooks.filter(b => b.type === activeFilter);

  return (
    <div className="space-y-10 px-4 py-8 max-w-7xl mx-auto">
      {payingForBook && <PaymentModal book={payingForBook} onClose={() => setPayingForBook(null)} />}
      <section className="relative h-64 md:h-80 rounded-[3.5rem] overflow-hidden bg-black flex items-center px-12 shadow-2xl border-4 border-gray-50">
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-xl text-left space-y-4">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-2xl border border-accent/30 backdrop-blur-sm animate-pulse">
             <Sparkles className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Knowledge Chain</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter italic"><span className="text-accent">book</span> HUB</h1>
          <p className="text-gray-300 text-xs font-bold uppercase tracking-widest max-w-xs">{isRtl ? 'سوق الكتب العالمي المشفر' : 'The Global Crypto Book Market'}</p>
        </div>
      </section>

      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
        {['All', 'Paper', 'E-book', 'Audiobook'].map((f) => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-8 py-4 rounded-3xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${activeFilter === f ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'bg-white border-2 border-gray-50 text-gray-400 hover:border-accent/30'}`}
          >
            {f === 'All' ? t('all') : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 animate-in fade-in">
        {filteredBooks.map(book => <BookCard key={book.id} book={book} onReport={(id) => {}} onBuy={(b) => setPayingForBook(b)} />)}
      </div>

      {filteredBooks.length === 0 && (
          <div className="py-24 text-center space-y-4 opacity-50 flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center border-4 border-gray-100">
                <Inbox className="w-10 h-10 text-gray-300" />
              </div>
              <p className="font-black text-xs uppercase tracking-widest text-gray-400">{isRtl ? 'لا توجد كتب متاحة حالياً' : 'No books available yet'}</p>
              <button onClick={() => navigate('/add')} className="mt-4 px-6 py-3 bg-black text-accent rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Plus className="w-4 h-4" /> {isRtl ? 'كن أول من يضيف كتاباً' : 'Be the first to list'}
              </button>
          </div>
      )}
    </div>
  );
};
export default Home;
