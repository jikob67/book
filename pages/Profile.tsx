
import React, { useState, useEffect } from 'react';
import { MOCK_USER, WALLETS, SUBSCRIPTION_PLANS, MOCK_BOOKS } from '../constants';
import { CheckCircle, Copy, ShieldCheck, ChevronRight, Check, Star, Globe, Zap, Headset, BarChart3, Settings, MessageSquare, ArrowLeft, MoreHorizontal, Trophy, User as UserIcon, X, Save, Trash2, Smartphone } from 'lucide-react';
import { SubscriptionTier, SubscriptionPeriod, CryptoWallet, PlanDetails, User, Book } from '../types';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

const Profile: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t, isRtl } = useTranslation();
  
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<SubscriptionPeriod>('Monthly');
  const [selectedWallet, setSelectedWallet] = useState<CryptoWallet | null>(null);
  const [userAddress, setUserAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [localListings, setLocalListings] = useState<Book[]>([]);

  // Account Parameters State
  const [showAccountParams, setShowAccountParams] = useState(false);
  const [editFullName, setEditFullName] = useState(MOCK_USER.fullName);
  const [editUsername, setEditUsername] = useState(MOCK_USER.username);
  const [editPersonalWallet, setEditPersonalWallet] = useState(localStorage.getItem('book_user_wallet') || '');

  const resetFlow = () => {
    setStep(1);
    setSelectedPlan(null);
    setSelectedPeriod('Monthly');
    setSelectedWallet(null);
    setUserAddress('');
    setTxHash('');
  };

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem('book_listings') || '[]');
    setLocalListings(savedBooks);
    
    // Sync UI with stored values
    setEditFullName(localStorage.getItem('book_user_name') || MOCK_USER.fullName);
    setEditUsername(localStorage.getItem('book_user_handle') || MOCK_USER.username);
  }, []);

  const isOwnProfile = !userId || userId === MOCK_USER.id;
  
  const targetUser: User = isOwnProfile ? { 
    ...MOCK_USER, 
    fullName: editFullName,
    username: editUsername,
    listingCount: localListings.length 
  } : {
    id: userId!,
    username: `@user_${userId}`,
    fullName: `User ${userId}`,
    avatarUrl: `https://ui-avatars.com/api/?name=${userId}&background=random`,
    points: 0,
    isVerified: false,
    role: 'seller',
    subscriptionTier: 'Newbie',
    listingCount: 0
  };

  const activePlan = SUBSCRIPTION_PLANS.find(p => p.id === targetUser.subscriptionTier) || SUBSCRIPTION_PLANS[0];
  const isPremium = targetUser.subscriptionTier === 'Pro' || targetUser.subscriptionTier === 'Enterprise';
  const hasVerificationBadge = targetUser.subscriptionTier !== 'Newbie' && targetUser.subscriptionTier !== 'Free';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(isRtl ? 'تم نسخ العنوان!' : 'Wallet Address copied!');
  };

  const handleUpgradeSuccess = () => {
      if (selectedPlan) {
          localStorage.setItem('book_user_tier', selectedPlan.id);
          MOCK_USER.subscriptionTier = selectedPlan.id;
      }
      setStep(5);
  };

  const handleSaveAccountParams = () => {
    localStorage.setItem('book_user_name', editFullName);
    localStorage.setItem('book_user_handle', editUsername);
    localStorage.setItem('book_user_wallet', editPersonalWallet);
    
    // Update global mock for immediate feedback
    MOCK_USER.fullName = editFullName;
    MOCK_USER.username = editUsername;
    
    setShowAccountParams(false);
    alert(isRtl ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!');
  };

  const handleWipeData = () => {
    if (confirm(isRtl ? 'هل أنت متأكد؟ سيتم حذف كافة بياناتك المسجلة!' : 'Are you sure? All your data will be permanently deleted!')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('List')) return <Star className="w-3 h-3" />;
    if (feature.includes('Support')) return <Headset className="w-3 h-3" />;
    if (feature.includes('Badge')) return <CheckCircle className="w-3 h-3" />;
    if (feature.includes('Featured') || feature.includes('Analytics')) return <Zap className="w-3 h-3" />;
    return <Globe className="w-3 h-3" />;
  };

  return (
    <div className="px-4 py-8 space-y-10 max-w-2xl mx-auto pb-40">
      {!isOwnProfile && (
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-gray-400 hover:text-black font-black text-xs uppercase tracking-widest transition-all mb-4">
              <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} /> {isRtl ? 'العودة' : 'BACK'}
          </button>
      )}

      {/* Profile Identity Card */}
      <div className="bg-white rounded-[3rem] border-4 border-gray-50 shadow-2xl p-10 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-accent/30 via-accent/5 to-transparent z-0"></div>
        <div className="relative z-10 group">
            <img src={targetUser.avatarUrl} alt="Avatar" className="w-28 h-28 rounded-[2.5rem] border-4 border-white shadow-2xl transition-transform" />
            {hasVerificationBadge && (
                <div className="absolute -bottom-3 -right-3 bg-blue-500 p-2 rounded-2xl border-4 border-white shadow-xl">
                    <Check className="w-4 h-4 text-white stroke-[5px]" />
                </div>
            )}
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mt-6 flex items-center gap-2 italic tracking-tighter text-center">
            {targetUser.fullName}
            {targetUser.subscriptionTier === 'Enterprise' && <ShieldCheck className="w-6 h-6 text-accent" />}
        </h2>
        <div className="flex items-center gap-2 text-accent-hover font-black text-[10px] uppercase tracking-widest bg-accent/10 px-4 py-1.5 rounded-full mt-2">
            {targetUser.username}
        </div>
        
        {isOwnProfile && (
            <div className="w-full mt-10 space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span className="flex items-center gap-1.5"><Trophy className="w-3 h-3" /> {isRtl ? 'مخزون الخطة' : 'Tier Inventory'}</span>
                    <span>{targetUser.listingCount} / {activePlan.limit === Infinity ? '∞' : activePlan.limit}</span>
                </div>
                <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <div 
                        className="h-full bg-accent transition-all duration-1000 shadow-[0_0_15px_rgba(0,255,186,0.5)]"
                        style={{ width: `${activePlan.limit === Infinity ? 100 : Math.min(100, (targetUser.listingCount / activePlan.limit) * 100)}%` }}
                    />
                </div>
            </div>
        )}

        <div className="mt-8 flex gap-4 w-full">
            <div className="flex-1 bg-gray-50 p-6 rounded-[2rem] text-center border-2 border-transparent hover:border-accent/10 transition-all">
                <span className="block text-3xl font-black text-gray-900">{targetUser.listingCount}</span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t('listings')}</span>
            </div>
            <div className="flex-1 bg-black text-white p-6 rounded-[2rem] text-center border-b-8 border-accent relative shadow-2xl">
                <span className="block text-xl font-black uppercase text-accent tracking-tighter">{targetUser.subscriptionTier}</span>
                <span className="text-[10px] opacity-40 font-black uppercase tracking-widest">{t('plan')}</span>
                {isPremium && <Zap className="absolute top-4 right-4 w-4 h-4 text-accent animate-pulse" />}
            </div>
        </div>

        {!isOwnProfile ? (
            <Link 
                to={`/chat/${targetUser.id}`}
                className="mt-8 w-full py-6 bg-accent text-black rounded-[2.5rem] flex items-center justify-center gap-4 font-black text-xs uppercase tracking-widest shadow-2xl shadow-accent/40 hover:scale-[1.03] active:scale-95 transition-all group"
            >
                <MessageSquare className="w-6 h-6 fill-black" /> {isRtl ? 'مراسلة مشفرة' : 'START SECURE CHAT'}
            </Link>
        ) : (
            <div className="w-full space-y-3 mt-8">
                {isPremium && (
                    <button 
                        onClick={() => navigate('/stats')}
                        className="w-full py-5 bg-gray-900 text-white rounded-[2.5rem] flex items-center justify-center gap-4 font-black text-[10px] uppercase tracking-widest hover:bg-accent hover:text-black transition-all group shadow-2xl border-b-4 border-accent"
                    >
                        <BarChart3 className="w-5 h-5 text-accent" /> {isRtl ? 'تحليلات السوق الذكية' : 'Smart Market Intelligence'}
                    </button>
                )}
                <button 
                  onClick={() => setShowAccountParams(true)}
                  className="w-full py-5 bg-gray-50 text-gray-400 rounded-[2.5rem] flex items-center justify-center gap-4 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all border-2 border-gray-100 shadow-sm"
                >
                    <Settings className="w-5 h-5" /> Account Parameters
                </button>
            </div>
        )}
      </div>

      {/* Account Parameters Modal */}
      {showAccountParams && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] border-4 border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black uppercase tracking-tighter italic">Protocol Settings</h3>
              <button 
                onClick={() => setShowAccountParams(false)}
                className="p-3 bg-white hover:bg-accent hover:text-black rounded-2xl transition-all shadow-sm border border-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Identify Verification</label>
                <input 
                  type="text" 
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full p-6 bg-gray-50 border-4 border-transparent focus:border-accent rounded-[2rem] outline-none font-black text-black text-sm shadow-inner"
                  placeholder="Full Name"
                />
                <input 
                  type="text" 
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full p-6 bg-gray-50 border-4 border-transparent focus:border-accent rounded-[2rem] outline-none font-black text-black text-sm shadow-inner"
                  placeholder="@handle"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Payout Wallet (Your Receive Address)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={editPersonalWallet}
                    onChange={(e) => setEditPersonalWallet(e.target.value)}
                    className="w-full p-6 bg-gray-50 border-4 border-transparent focus:border-accent rounded-[2rem] outline-none font-mono text-black text-xs shadow-inner"
                    placeholder="0x... or SOL..."
                  />
                  <Smartphone className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center px-6">DANGER ZONE • DATA DESTRUCTION</p>
                <button 
                  onClick={handleWipeData}
                  className="w-full py-4 rounded-[2rem] border-4 border-red-50 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Reset Application Data
                </button>
              </div>
            </div>

            <div className="p-8 bg-black">
              <button 
                onClick={handleSaveAccountParams}
                className="w-full bg-accent text-black py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Save className="w-5 h-5" /> Save Parameters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Core (Only for Me) */}
      {isOwnProfile && (
          <div className="bg-white rounded-[3.5rem] border-4 border-gray-100 shadow-2xl overflow-hidden relative">
            <div className="bg-black text-white p-8 flex justify-between items-center border-b-4 border-accent">
                <h3 className="font-black text-sm flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-accent" /> MEMBERSHIP UPGRADE
                </h3>
                <span className="text-[10px] font-black bg-accent text-black px-4 py-2 rounded-2xl">PHASE {step}/5</span>
            </div>

            <div className="p-10">
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex p-2 bg-gray-50 rounded-[2rem] border-2 border-gray-100">
                            {(['Daily', 'Monthly', 'Yearly'] as SubscriptionPeriod[]).map(p => (
                                <button 
                                    key={p}
                                    onClick={() => setSelectedPeriod(p)}
                                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPeriod === p ? 'bg-black shadow-2xl text-accent' : 'text-gray-400 hover:text-black'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                            {SUBSCRIPTION_PLANS.filter(p => p.id !== 'Newbie').map(plan => (
                                <div 
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`p-6 rounded-[2.5rem] border-4 transition-all cursor-pointer relative ${selectedPlan?.id === plan.id ? 'border-accent bg-accent/5 ring-8 ring-accent/10' : 'border-gray-50 hover:border-gray-200'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="font-black text-gray-900 text-xl tracking-tighter italic">{plan.name}</span>
                                            <div className="text-accent-hover font-black text-black text-2xl mt-1 tracking-tighter">${plan.prices[selectedPeriod]}</div>
                                        </div>
                                        {selectedPlan?.id === plan.id && <CheckCircle className="w-8 h-8 text-accent fill-black" />}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {plan.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-tight">
                                                <div className="p-1 bg-gray-100 rounded-lg">{getFeatureIcon(f)}</div>
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Payment Gateway (Crypto):</p>
                        <div className="grid grid-cols-1 gap-4">
                            {WALLETS.map(w => (
                                <button 
                                    key={w.symbol}
                                    onClick={() => setSelectedWallet(w)}
                                    className={`flex items-center justify-between p-6 rounded-[2.5rem] border-4 transition-all ${selectedWallet?.symbol === w.symbol ? 'border-accent bg-accent/5' : 'border-gray-50 hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-xs font-black text-accent uppercase shadow-lg">{w.symbol.slice(0,2)}</div>
                                        <div className="text-left">
                                            <p className="font-black text-black text-sm tracking-widest">{w.name.toUpperCase()}</p>
                                            <p className="text-[9px] text-gray-400 font-mono truncate max-w-[200px] mt-1">{w.address}</p>
                                        </div>
                                    </div>
                                    <div onClick={(e) => { e.stopPropagation(); copyToClipboard(w.address); }} className="p-3 bg-gray-100 hover:bg-black hover:text-accent rounded-2xl transition-all shadow-sm">
                                        <Copy className="w-5 h-5" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-in slide-in-from-right-10">
                        <div className="bg-black text-accent p-8 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest leading-relaxed shadow-2xl">
                            Validation Required: Please paste your public wallet address to link this transaction to your account.
                        </div>
                        <input 
                            type="text"
                            value={userAddress}
                            onChange={(e) => setUserAddress(e.target.value)}
                            placeholder="Wallet Public Address (0x... or SOL...)"
                            className="w-full p-8 bg-gray-50 border-4 border-transparent focus:border-accent rounded-[2.5rem] outline-none font-mono text-black text-sm shadow-inner transition-all"
                        />
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-8 animate-in slide-in-from-right-10">
                        <div className="bg-accent/10 text-black p-8 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest border-4 border-accent/20 shadow-xl">
                            Final Verification: Paste the Transaction Hash (TXID) from your wallet to finalize the upgrade.
                        </div>
                        <input 
                            type="text"
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            placeholder="TX-HASH-..."
                            className="w-full p-8 bg-gray-50 border-4 border-transparent focus:border-accent rounded-[2.5rem] outline-none font-mono text-black text-sm shadow-inner transition-all"
                        />
                    </div>
                )}

                {step === 5 && (
                    <div className="py-20 text-center space-y-6 animate-in zoom-in duration-700">
                        <div className="w-32 h-32 bg-accent rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-accent/50 animate-bounce border-8 border-white">
                            <Check className="w-16 h-16 text-black stroke-[5px]" />
                        </div>
                        <h4 className="text-5xl font-black text-gray-900 uppercase tracking-tighter italic">PROTOCOL UPDATED</h4>
                        <button onClick={() => { resetFlow(); window.location.reload(); }} className="mt-10 text-black bg-accent px-16 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-accent/30 hover:scale-110 active:scale-95 transition-all">
                            REFRESH INTERFACE
                        </button>
                    </div>
                )}

                {step < 5 && (
                    <div className="mt-12 flex gap-5">
                        {step > 1 && (
                            <button 
                                onClick={() => setStep(step - 1)}
                                className="flex-1 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-gray-400 border-4 border-gray-50 hover:bg-gray-50 transition-all"
                            >
                                {t('previous')}
                            </button>
                        )}
                        <button 
                            disabled={step === 1 ? !selectedPlan : step === 2 ? !selectedWallet : step === 3 ? !userAddress.trim() : step === 4 ? !txHash.trim() : false}
                            onClick={() => step === 4 ? handleUpgradeSuccess() : setStep(step + 1)}
                            className={`flex-[2] py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl ${
                                (step === 1 && !selectedPlan) || (step === 2 && !selectedWallet) || (step === 3 && !userAddress.trim()) || (step === 4 && !txHash.trim())
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed border-4 border-transparent' 
                                : 'bg-black text-accent border-4 border-accent/20 active:scale-95'
                            }`}
                        >
                            {step === 4 ? t('confirm') : t('next')} <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
          </div>
      )}

      {/* Seller Inventory (Actual user data only) */}
      {!isOwnProfile && (
          <div className="space-y-8 animate-in slide-in-from-bottom-10">
              <div className="flex justify-between items-center px-4">
                <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 italic">{isRtl ? 'مخزون المستخدم' : 'User Inventory'}</h4>
                <div className="h-1 flex-1 bg-gray-50 mx-6 rounded-full"></div>
              </div>
              <div className="py-16 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center opacity-40">
                  <UserIcon className="w-10 h-10 mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic">{t('noBooks')}</p>
              </div>
          </div>
      )}
    </div>
  );
};

export default Profile;
