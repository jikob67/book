
import React from 'react';
import { ShieldAlert, Scale, CreditCard, BookOpen, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const Terms: React.FC = () => {
  const { isRtl } = useTranslation();
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 pb-32 bg-white min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">سياسة الاستخدام والمعايير الأخلاقية</h1>
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">آخر تحديث: أغسطس 2024</p>
      </div>

      <div className="bg-red-50 border-4 border-red-100 p-8 rounded-[3rem] space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3 text-red-600 relative z-10">
          <AlertTriangle className="w-8 h-8" />
          <h2 className="font-black text-2xl uppercase tracking-tighter">تحذير صارم</h2>
        </div>
        <p className="text-red-900 leading-relaxed text-sm font-black relative z-10">
          يمنع منعاً باتاً نشر أي محتوى يروج للأعمال غير الأخلاقية، الإباحية، التحريض على الكراهية، الأفكار الهدامة، أو أي مادة تضر بالنسيج المجتمعي. مخالفة هذا البند تؤدي للحظر الفوري والنهائي للمحفظة والحساب.
        </p>
        <ShieldAlert className="absolute -right-10 -bottom-10 w-48 h-48 text-red-200/30 rotate-12" />
      </div>

      <div className="grid gap-8">
        <section className="bg-white border-2 border-gray-50 p-8 rounded-[2.5rem] shadow-sm space-y-4 hover:border-accent transition-colors">
          <div className="flex items-center gap-3 text-accent-hover">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="font-black text-xl text-gray-900">1. نظام book Guard AI</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm font-medium">
            تخضع كافة الإدراجات لفحص آلي فوري بواسطة الذكاء الاصطناعي قبل النشر. يمتلك النظام الحق الكامل في رفض أي محتوى يراه مشبوهاً أو غير متوافق مع معاييرنا الأخلاقية دون الرجوع للمستخدم.
          </p>
        </section>

        <section className="bg-gray-50 border-2 border-transparent p-8 rounded-[2.5rem] shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-black">
            <Scale className="w-6 h-6 text-accent" />
            <h2 className="font-black text-xl">2. إقرار المسؤولية</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm font-medium">
            عند النشر، يقر المستخدم بأن المحتوى ملكية خاصة له ولا ينتهك حقوق الآخرين، والأهم من ذلك أنه يلتزم بالآداب العامة والقيم المجتمعية. أي محاولة للالتفاف على نظام الفحص ستعامل كخرق أمني للمنصة.
          </p>
        </section>

        <section className="bg-white border-2 border-gray-50 p-8 rounded-[2.5rem] shadow-sm space-y-4 hover:border-accent transition-colors">
          <div className="flex items-center gap-3 text-accent-hover">
            <BookOpen className="w-6 h-6" />
            <h2 className="font-black text-xl text-gray-900">3. الرقابة المجتمعية</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm font-medium">
            تمنح المنصة الحق للمستخدمين في "الإبلاغ" عن أي محتوى ضار. بمجرد استلام البلاغ، قد يتم إخفاء المحتوى فوراً لحين مراجعته بشرياً من قبل فريق الدعم الفني.
          </p>
        </section>

        <section className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <CreditCard className="w-6 h-6" />
            <h2 className="font-black text-xl">4. المعاملات المالية</h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm font-medium">
            تتم العمولات بشكل آلي لضمان استمرارية المنصة وتطوير أنظمة الحماية. لا يمكن استرداد الرسوم بمجرد إتمام المعاملة على البلوكشين.
          </p>
        </section>
      </div>

      <div className="bg-accent/10 border-2 border-accent/20 p-8 rounded-[3rem] text-center">
        <p className="text-xs font-black text-gray-900 uppercase tracking-widest">
          باستخدامك للتطبيق، أنت تؤكد التزامك ببناء مجتمع معرفي آمن وأخلاقي.
        </p>
      </div>
    </div>
  );
};

export default Terms;
