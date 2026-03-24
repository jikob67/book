
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    Send, Paperclip, X, ChevronLeft, MoreVertical, MessageSquare, Bot, Check,
    PhoneOff, MicOff, Mic, Camera, CameraOff, RefreshCw, Volume2, Search, Plus, User as UserIcon, Clock, Phone, Video,
    Trash2, AlertTriangle
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { ChatMessage, MessageType, User, Book } from '../types';
import { MOCK_USER } from '../constants';

type CallStatus = 'none' | 'calling' | 'connected' | 'ended';
type CallType = 'voice' | 'video';

interface ChatThread {
    userId: string;
    fullName: string;
    username: string;
    avatarUrl: string;
    lastMessage: string;
    lastTimestamp: string;
    isVerified: boolean;
}

const Chat: React.FC = () => {
    const { t, isRtl } = useTranslation();
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const isInboxMode = !userId;
    const [threads, setThreads] = useState<ChatThread[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [peerUser, setPeerUser] = useState<User | null>(null);
    const [isAI, setIsAI] = useState(false);

    const [callStatus, setCallStatus] = useState<CallStatus>('none');
    const [callType, setCallType] = useState<CallType>('voice');
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const savedThreads = JSON.parse(localStorage.getItem('book_chat_threads') || '[]');
        setThreads(savedThreads);
    }, [isInboxMode]);

    useEffect(() => {
        if (isInboxMode) return;

        if (userId === 'support') {
            setIsAI(true);
            setPeerUser({
                id: 'support',
                username: '@support',
                fullName: isRtl ? 'دعم book الذكي' : 'book Support AI',
                avatarUrl: '',
                points: 0,
                isVerified: true,
                role: 'admin',
                subscriptionTier: 'Enterprise',
                listingCount: 0
            });
        } else {
            const savedListings: Book[] = JSON.parse(localStorage.getItem('book_listings') || '[]');
            const sellerMatch = savedListings.find(b => b.sellerId === userId);
            
            if (sellerMatch) {
                setPeerUser({
                    id: userId!,
                    username: `@${sellerMatch.author.toLowerCase().replace(/\s+/g, '')}`,
                    fullName: sellerMatch.author,
                    avatarUrl: `https://ui-avatars.com/api/?name=${sellerMatch.author}&background=00FFBA&color=000`,
                    points: 0,
                    isVerified: true,
                    role: 'seller',
                    subscriptionTier: 'Basic',
                    listingCount: 0
                });
            } else {
                setPeerUser(null);
            }
        }

        const savedMsgs = JSON.parse(localStorage.getItem(`book_msgs_${userId}`) || '[]');
        const formattedMsgs = savedMsgs.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessages(formattedMsgs);
    }, [userId, isRtl, isInboxMode]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = (type: MessageType = 'text', content: string = inputValue) => {
        if (!content.trim() && type === 'text') return;
        if (!peerUser) return;

        const timestamp = new Date();
        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            senderId: MOCK_USER.id,
            type,
            content,
            timestamp
        };

        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);
        setInputValue('');
        localStorage.setItem(`book_msgs_${peerUser.id}`, JSON.stringify(updatedMessages));

        const currentThreads: ChatThread[] = JSON.parse(localStorage.getItem('book_chat_threads') || '[]');
        const existingThreadIndex = currentThreads.findIndex(t => t.userId === peerUser.id);
        
        const threadData: ChatThread = {
            userId: peerUser.id,
            fullName: peerUser.fullName,
            username: peerUser.username,
            avatarUrl: peerUser.avatarUrl,
            lastMessage: type === 'text' ? content : `[${type}]`,
            lastTimestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isVerified: peerUser.isVerified
        };

        if (existingThreadIndex > -1) currentThreads.splice(existingThreadIndex, 1);
        const newThreads = [threadData, ...currentThreads];
        localStorage.setItem('book_chat_threads', JSON.stringify(newThreads));
    };

    const deleteThread = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(isRtl ? 'هل تريد حذف هذه الدردشة نهائياً؟' : 'Delete this chat permanently?')) {
            const currentThreads: ChatThread[] = JSON.parse(localStorage.getItem('book_chat_threads') || '[]');
            const newThreads = currentThreads.filter(t => t.userId !== id);
            localStorage.setItem('book_chat_threads', JSON.stringify(newThreads));
            localStorage.removeItem(`book_msgs_${id}`);
            setThreads(newThreads);
        }
    };

    const deleteMessage = (msgId: string) => {
        if (confirm(isRtl ? 'حذف الرسالة؟' : 'Delete message?')) {
            const updatedMessages = messages.filter(m => m.id !== msgId);
            setMessages(updatedMessages);
            if (peerUser) {
                localStorage.setItem(`book_msgs_${peerUser.id}`, JSON.stringify(updatedMessages));
            }
        }
    };

    const startCall = async (type: CallType) => {
        setCallType(type);
        setCallStatus('calling');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === 'video' });
            streamRef.current = stream;
            if (videoRef.current && type === 'video') videoRef.current.srcObject = stream;
            setTimeout(() => setCallStatus('connected'), 2500);
        } catch (err) {
            setCallStatus('none');
            alert(isRtl ? "يرجى تفعيل الكاميرا والميكروفون" : "Please enable camera and mic");
        }
    };

    const endCall = () => {
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        setCallStatus('ended');
        setTimeout(() => { setCallStatus('none'); setCallDuration(0); }, 1500);
    };

    useEffect(() => {
        let interval: any;
        if (callStatus === 'connected') interval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [callStatus]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isInboxMode) {
        return (
            <div className="min-h-[calc(100vh-140px)] bg-white flex flex-col p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className={`flex justify-between items-end ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                     <div className="bg-black text-accent p-4 rounded-[1.5rem] shadow-xl transform rotate-2">
                        <MessageSquare className="w-8 h-8" />
                     </div>
                     <div className={isRtl ? 'text-right' : 'text-left'}>
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">{t('chat')}</h2>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">{isRtl ? 'قائمة المحادثات المشفرة' : 'Encrypted Message List'}</p>
                     </div>
                </div>

                <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-[10px] font-black text-red-900 leading-tight">{t('ethicalWarning')}</p>
                </div>

                <div className="relative group">
                    <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-accent transition-colors`} />
                    <input type="text" placeholder={isRtl ? 'البحث عن محادثة...' : 'Search threads...'} className="w-full p-6 bg-gray-50 border-4 border-transparent focus:border-accent rounded-[2rem] outline-none font-black text-black text-sm shadow-inner transition-all pl-12 pr-12" />
                </div>

                <div className="flex-1 space-y-3">
                    {threads.length > 0 ? (
                        threads.map(thread => (
                            <Link key={thread.userId} to={`/chat/${thread.userId}`} className="flex items-center gap-4 p-5 bg-white border-2 border-gray-50 rounded-[2.5rem] hover:border-accent hover:shadow-2xl hover:shadow-accent/5 transition-all group active:scale-95">
                                <div className="relative">
                                    <img src={thread.avatarUrl} className="w-16 h-16 rounded-[1.5rem] border-2 border-accent shadow-lg" />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent border-4 border-white rounded-full"></div>
                                </div>
                                <div className={`flex-1 overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-black text-sm text-gray-900 truncate flex items-center gap-1.5">{thread.fullName}</h4>
                                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{thread.lastTimestamp}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 truncate tracking-tight">{thread.lastMessage}</p>
                                </div>
                                <button onClick={(e) => deleteThread(e, thread.userId)} className="p-3 hover:bg-red-50 text-gray-200 hover:text-red-500 rounded-2xl transition-all">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <ChevronLeft className={`w-5 h-5 text-gray-200 group-hover:text-accent transition-colors ${isRtl ? '' : 'rotate-180'}`} />
                            </Link>
                        ))
                    ) : (
                        <div className="py-24 flex flex-col items-center text-center space-y-6 opacity-40">
                            <div className="w-24 h-24 bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-200 border-2 border-gray-100 shadow-inner">
                                <MessageSquare className="w-12 h-12" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">{t('noChats')}</h3>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto">
                                    {isRtl ? 'ابدأ الدردشة مع البائعين من خلال زيارة بروفايلاتهم' : 'Start chatting with sellers by visiting their profiles'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!peerUser) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:relative md:h-[calc(100vh-140px)] md:inset-auto animate-in slide-in-from-right duration-300">
            <header className="bg-black text-white p-4 flex items-center justify-between border-b border-accent/20">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/chat')} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <ChevronLeft className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="flex items-center gap-3">
                        <img src={peerUser.avatarUrl} className="w-10 h-10 rounded-full border-2 border-accent" />
                        <div className={isRtl ? 'text-right' : 'text-left'}>
                            <p className="font-black text-sm tracking-tighter flex items-center gap-1.5">{peerUser.fullName}</p>
                            <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">{peerUser.username}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {!isAI && <button onClick={() => startCall('voice')} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-accent transition-colors"><Phone className="w-5 h-5" /></button>}
                    {!isAI && <button onClick={() => startCall('video')} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-accent transition-colors"><Video className="w-5 h-5" /></button>}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-white/10 rounded-full"><MoreVertical className="w-5 h-5" /></button>
                </div>
            </header>

            <div className="bg-black/90 p-2 text-center">
                <p className="text-[8px] font-black text-accent uppercase tracking-[0.2em]">{t('ethicalWarning')}</p>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-4 grayscale">
                        <MessageSquare className="w-16 h-16 text-black" />
                        <p className="font-black uppercase tracking-widest text-[10px]">{isRtl ? 'بداية مشفرة وآمنة' : 'Secure Encrypted Start'}</p>
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.senderId === MOCK_USER.id;
                    return (
                        <div key={msg.id} className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 group`}>
                            <div className={`max-w-[80%] space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                <div className={`p-4 rounded-3xl text-sm font-bold shadow-sm relative ${
                                    isMe ? 'bg-black text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none border border-gray-100'
                                }`}>
                                    {msg.content}
                                </div>
                                <p className="text-[7px] text-gray-300 font-black uppercase px-2">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                            <button onClick={() => deleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all mt-2">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 bg-white border-t border-gray-100 pb-safe">
                <div className="flex items-center gap-3 max-w-7xl mx-auto">
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-gray-50 hover:bg-accent rounded-2xl transition-all text-gray-400 hover:text-black">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }} placeholder={t('typeMessage')} className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-accent outline-none font-bold text-black text-xs" />
                    </div>
                    <button onClick={() => handleSend()} className={`p-4 rounded-2xl shadow-xl transition-all ${inputValue.trim() ? 'bg-black text-accent' : 'bg-gray-100 text-gray-300'}`}>
                        <Send className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {callStatus !== 'none' && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-8 w-full">
                        <div className="text-center space-y-4">
                            <img src={peerUser.avatarUrl} className={`w-32 h-32 rounded-[3rem] border-4 border-accent shadow-2xl transition-all ${callStatus === 'calling' ? 'animate-pulse scale-110' : ''}`} />
                            <h3 className="text-3xl font-black text-white italic tracking-tighter">{peerUser.fullName}</h3>
                            <p className="text-accent font-black text-[10px] uppercase tracking-widest mt-1">
                                {callStatus === 'calling' ? (isRtl ? 'جاري الاتصال...' : 'Calling...') : 
                                 callStatus === 'connected' ? formatDuration(callDuration) : (isRtl ? 'انتهت المكالمة' : 'Call Ended')}
                            </p>
                        </div>
                        {callType === 'video' && callStatus !== 'ended' && (
                            <div className="w-full max-w-sm aspect-[3/4] bg-gray-900 rounded-[3rem] overflow-hidden border-2 border-white/10 relative shadow-2xl">
                                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transition-opacity ${isCameraOff ? 'opacity-0' : 'opacity-100'}`} />
                                {isCameraOff && <div className="absolute inset-0 flex items-center justify-center bg-gray-900"><CameraOff className="w-12 h-12 text-gray-700" /></div>}
                            </div>
                        )}
                    </div>
                    <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] flex items-center justify-between mb-8 shadow-2xl">
                        <button onClick={() => setIsMuted(!isMuted)} className={`p-6 rounded-[2rem] transition-all ${isMuted ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}><Mic className="w-6 h-6" /></button>
                        <button onClick={endCall} className="p-8 bg-red-500 text-white rounded-[2.5rem] shadow-2xl shadow-red-500/40 hover:scale-110 active:scale-95 transition-all"><PhoneOff className="w-8 h-8" /></button>
                        {callType === 'video' ? <button onClick={() => setIsCameraOff(!isCameraOff)} className={`p-6 rounded-[2rem] transition-all ${isCameraOff ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}><Camera className="w-6 h-6" /></button> : <button className="p-6 bg-white/10 text-white rounded-[2rem] opacity-20 cursor-not-allowed"><RefreshCw className="w-6 h-6" /></button>}
                    </div>
                </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" />
        </div>
    );
};

export default Chat;
