
import React from 'react';
import { Lock, Eye, Database, Globe, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const Privacy: React.FC = () => {
  const { isRtl } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 pb-32 bg-white min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">سياسة الخصوصية والأمان الأقصى</h1>
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">خصوصيتك محمية بذكاء كتابي وأخلاقي</p>
      </div>

      <div className="grid gap-8">
        <section className="bg-white border-4 border-accent p-8 rounded-[3rem] shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3 text-black relative z-10">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <h2 className="font-black text-2xl uppercase tracking-tighter">خصوصية الفحص الأمني</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm font-black relative z-10">
            عند رفع أي إعلان، يقوم نظام "book Guard AI" بتحليل النصوص والعناوين لضمان خلوها من المحتوى غير الأخلاقي. هذا الفحص يتم في بيئة مشفرة ومعزولة، ولا يتم استخدام بياناتك لأي غرض آخر غير "التأكد من سلامة المجتمع".
          </p>
          <Zap className="absolute -left-10 -bottom-10 w-48 h-48 text-accent/5 rotate-12" />
        </section>

        <section className="bg-gray-50 border-2 border-transparent p-8 rounded-[2.5rem] shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-black">
            <Database className="w-6 h-6 text-accent" />
            <h2 className="font-black text-xl">1. البيانات التي نعالجها</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm font-medium">
            نحتاج لجمع بيانات أساسية تشمل اسمك المستعار وعنوان محفظتك الرقمية. نحن لا نطلع على محتويات محفظتك ولا نطلب مفاتيحك الخاصة أبداً. كافة البيانات الشخصية مشفرة بالكامل.
          </p>
        </section>

        <section className="bg-white border-2 border-gray-50 p-8 rounded-[2.5rem] shadow-sm space-y-4 hover:border-accent transition-colors">
          <div className="flex items-center gap-3 text-accent-hover">
            <Lock className="w-6 h-6" />
            <h2 className="font-black text-xl text-gray-900">2. أمن المعاملات والدردشة</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm font-medium">
            تتم جميع المحادثات بين البائع والمشتري بشكل مشفر. نحن لا نراقب المحادثات إلا في حال وجود بلاغ رسمي عن "محتوى غير أخلاقي" أو "عملية احتيال"، وذلك لحماية الضحايا والحفاظ على قيم المنصة.
          </p>
        </section>

        <section className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Globe className="w-6 h-6" />
            <h2 className="font-black text-xl">3. تخزين البيانات</h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm font-medium">
            يتم تخزين بيانات الإعلانات والكتب على خوادم محمية بأحدث تقنيات الأمن السيبراني. نلتزم بحذف أي بيانات متعلقة بالمستخدمين الذين يطلبون إغلاق حساباتهم، باستثناء ما هو مسجل بشكل دائم على البلوكشين.
          </p>
        </section>

        <div className="bg-accent/10 border-2 border-accent/20 p-8 rounded-[2.5rem] text-center">
          <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-relaxed">
            لأي استفسار بخصوص بياناتك أو الإبلاغ عن اختراق، راسل المركز الأمني: <br/>
            <span className="text-lg underline decoration-black decoration-4 underline-offset-8">jikob67@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
