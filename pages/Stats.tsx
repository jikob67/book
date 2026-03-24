
import React from 'react';
import { MOCK_USER } from '../constants';
import { useTranslation } from '../context/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Lock, AlertCircle, BarChart2 } from 'lucide-react';

// Empty data array for a fresh start
const data: any[] = [];

const Stats: React.FC = () => {
    const { t, isRtl } = useTranslation();
    const isPremium = MOCK_USER.subscriptionTier === 'Pro' || MOCK_USER.subscriptionTier === 'Enterprise';

    if (!isPremium) {
        return (
            <div className="p-12 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                    <Lock className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase italic">Premium Feature</h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest max-w-xs">
                    Upgrade to Pro or Enterprise to unlock advanced market DNA and sales analytics.
                </p>
                <button className="bg-accent text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-accent/20">
                    Upgrade Now
                </button>
            </div>
        );
    }

    const hasData = data.length > 0;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 pb-32">
            <div className={isRtl ? 'text-right' : 'text-left'}>
                <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">Market DNA</h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Real-time performance metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Revenue', value: '$0.00', icon: DollarSign, color: 'text-green-500' },
                    { label: 'Views', value: '0', icon: Users, color: 'text-blue-500' },
                    { label: 'Listings', value: MOCK_USER.listingCount.toString(), icon: Package, color: 'text-accent' },
                    { label: 'Growth', value: '0%', icon: TrendingUp, color: 'text-purple-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-gray-50 flex items-center gap-4">
                        <div className={`p-3 bg-gray-50 rounded-2xl ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-50 space-y-6 flex flex-col min-h-[400px]">
                    <h4 className="font-black text-xs uppercase tracking-widest">Sales Performance (USD)</h4>
                    {hasData ? (
                        <div className="h-[300px] w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00FFBA" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#00FFBA" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '15px', padding: '10px'}}
                                        itemStyle={{color: '#00FFBA', fontWeight: 'bold', fontSize: '12px'}}
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="#00FFBA" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 opacity-20 grayscale">
                            <BarChart2 className="w-12 h-12 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No activity data yet</p>
                        </div>
                    )}
                </div>

                <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-100 space-y-6 relative overflow-hidden flex flex-col min-h-[400px]">
                    <div className="absolute top-0 right-0 p-8">
                         <AlertCircle className="w-12 h-12 text-gray-50" />
                    </div>
                    <h4 className="font-black text-xs uppercase tracking-widest">Audience Retention</h4>
                    {hasData ? (
                        <div className="h-[300px] w-full mt-auto">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                                    <Tooltip />
                                    <Line type="stepAfter" dataKey="views" stroke="#000" strokeWidth={4} dot={{r: 6, fill: '#000', stroke: '#00FFBA', strokeWidth: 2}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 opacity-20 grayscale">
                            <Users className="w-12 h-12 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No audience data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Stats;
