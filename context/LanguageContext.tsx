
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    appName: 'book',
    home: 'الرئيسية',
    chat: 'المحادثة',
    sell: 'بيع',
    share: 'مشاركة',
    profile: 'الملف الشخصي',
    signup: 'إنشاء حساب جديد',
    fullName: 'الاسم الكامل',
    username: 'اسم المستخدم',
    startNow: 'ابدأ الآن',
    terms: 'سياسة الاستخدام',
    privacy: 'سياسة الخصوصية',
    featured: 'مميز',
    buyNow: 'اشتري الآن',
    all: 'الكل',
    search: 'بحث عن كتب، مؤلفين...',
    welcome: 'مرحباً بك في مستقبل تجارة الكتب',
    noBooks: 'لا توجد كتب مدرجة بعد',
    startSelling: 'ابدأ البيع',
    upgrade: 'ترقية الحساب',
    listings: 'الإدراجات',
    plan: 'الخطة',
    next: 'التالي',
    previous: 'السابق',
    confirm: 'تأكيد',
    success: 'تم بنجاح!',
    langName: 'English',
    message: 'مراسلة',
    sendLocation: 'إرسال الموقع',
    recordAudio: 'تسجيل صوتي',
    videoCall: 'مكالمة فيديو',
    voiceCall: 'مكالمة صوتية',
    attach: 'إرفاق ملفات',
    typeMessage: 'اكتب رسالة...',
    noChats: 'لا توجد محادثات بعد',
    online: 'متصل الآن',
    uploadCover: 'رفع الغلاف',
    uploadPhotos: 'صور الكتاب',
    uploadFile: 'رفع الملف الرقمي',
    uploadSample: 'رفع عينة صوتية',
    stepInfo: 'المعلومات',
    stepMedia: 'الوسائط',
    stepFiles: 'الملفات',
    stepReview: 'المراجعة',
    ethicalWarning: '❗ يمنع منعاً تاما نشر محتويات غير أخلاقية والمضرة بالمجتمع',
    scanning: 'جاري فحص المحتوى أمنياً...',
    rejected: 'تم رفض الإعلان لمخالفته المعايير الأخلاقية',
    guardTitle: 'نظام حماية book',
    listAsset: 'إضافة إعلان',
    assetTitle: 'عنوان الكتاب...',
    listFree: 'عرضه مجاناً',
    price: 'السعر',
    addCover: 'أضف غلاف',
    coverHint: 'صورة الغلاف هي أول ما يراه المشتري',
    digitalFileLabel: 'ارفع ملف الكتاب الفعلي',
    encryptionHint: 'سيتم تشفير الملف ولن يظهر إلا لمن يقوم بالشراء',
    noFileNeeded: 'لا توجد ملفات مطلوبة للكتب الورقية',
    gpsLocate: 'تحديد موقع الاستلام عبر GPS',
    locCaptured: 'تم تحديد الموقع',
    noLocNeeded: 'لا يشترط موقع للكتب الرقمية',
    ethicalCommit: 'الالتزام الأخلاقي',
    ethicalPledge: 'أؤكد أن هذا الكتاب لا يحتوي على أي محتوى ضار، غير قانوني، أو غير أخلاقي، وأتحمل المسؤولية الكاملة عن ذلك.',
    agreePledge: 'أوافق وألتزم',
    publishAsset: 'نشر الإعلان',
    downloadActual: 'تحميل الملف الفعلي',
    shareOutside: 'مشاركة الإعلان خارج التطبيق',
    paymentGateway: 'بوابة الدفع',
    freeGift: 'هدية مجانية',
    selectMethod: 'اختر وسيلة الدفع',
    digitalAssets: 'الأصول الرقمية',
    bankCard: 'بطاقة بنكية',
    sendToAddress: 'أرسل إلى هذا العنوان:',
    txHashPlaceholder: 'أدخل رمز عملية الدفع (TXID)',
    confirmTx: 'تأكيد عملية الدفع',
    secureCheckout: 'إتمام الدفع الآمن',
    purchaseSuccess: 'تم الشراء بنجاح',
    getForFree: 'استلمت الكتاب!',
    chatForPickup: 'تواصل مع البائع للتسليم'
  },
  en: {
    appName: 'book',
    home: 'Home',
    chat: 'Chat',
    sell: 'Sell',
    share: 'Share',
    profile: 'Profile',
    signup: 'Create New Account',
    fullName: 'Full Name',
    username: 'Username',
    startNow: 'Start Now',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    featured: 'Featured',
    buyNow: 'Buy Now',
    all: 'All',
    search: 'Search books, authors...',
    welcome: 'Welcome to the future of book trading',
    noBooks: 'No books listed yet',
    startSelling: 'Start Selling',
    upgrade: 'Upgrade Account',
    listings: 'Listings',
    plan: 'Plan',
    next: 'Next',
    previous: 'Previous',
    confirm: 'Confirm',
    success: 'Success!',
    langName: 'العربية',
    message: 'Message',
    sendLocation: 'Send Location',
    recordAudio: 'Record Voice',
    videoCall: 'Video Call',
    voiceCall: 'Voice Call',
    attach: 'Attach Files',
    typeMessage: 'Type a message...',
    noChats: 'No chats yet',
    online: 'Online',
    uploadCover: 'Upload Cover',
    uploadPhotos: 'Book Photos',
    uploadFile: 'Upload Digital File',
    uploadSample: 'Upload Audio Sample',
    stepInfo: 'Info',
    stepMedia: 'Media',
    stepFiles: 'Files',
    stepReview: 'Review',
    ethicalWarning: '❗ Unethical or harmful content is strictly prohibited',
    scanning: 'AI Security Scan in progress...',
    rejected: 'Listing rejected due to ethical violations',
    guardTitle: 'book Guard AI',
    listAsset: 'List Asset',
    assetTitle: 'Asset Title...',
    listFree: 'List for Free',
    price: 'Price',
    addCover: 'Add Cover',
    coverHint: 'Cover image is the first thing buyers see',
    digitalFileLabel: 'Choose File to Upload',
    encryptionHint: 'The file will be encrypted and only shown to purchasers',
    noFileNeeded: 'No files needed for paper books',
    gpsLocate: 'Detect My GPS Location',
    locCaptured: 'Location Captured',
    noLocNeeded: 'No location needed for digital books',
    ethicalCommit: 'Ethical Commitment',
    ethicalPledge: 'I confirm this book contains no harmful, illegal, or unethical content.',
    agreePledge: 'I AGREE',
    publishAsset: 'Publish Asset',
    downloadActual: 'Download Actual File',
    shareOutside: 'Share Outside App',
    paymentGateway: 'Payment Gateway',
    freeGift: 'Free Gift',
    selectMethod: 'Select Payment Method',
    digitalAssets: 'Digital Assets',
    bankCard: 'Bank Card',
    sendToAddress: 'Send to address:',
    txHashPlaceholder: 'Enter Transaction Hash (TXID)',
    confirmTx: 'Confirm Transaction',
    secureCheckout: 'Secure Checkout',
    purchaseSuccess: 'Purchase Success',
    getForFree: 'Get for Free!',
    chatForPickup: 'Chat for Pickup'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('book_lang') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    } else {
      const deviceLang = navigator.language.split('-')[0];
      const initialLang = (deviceLang === 'ar' || deviceLang === 'en') ? deviceLang : 'en';
      setLanguageState(initialLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('book_lang', lang);
    // Reload to apply direction changes globally if needed
    window.location.reload();
  };

  const t = (key: string) => translations[language][key] || key;
  const isRtl = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-arabic' : 'font-sans'}>
        <style>{`
          ${isRtl ? 'body { direction: rtl; }' : 'body { direction: ltr; }'}
        `}</style>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};
