
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_STATS, MOCK_PRODUCTS, Icons } from '../constants';
import { useLocale } from '../contexts/LocaleContext';

const Dashboard: React.FC = () => {
  const { t } = useLocale();
  
  const stats = [
    { label: t.dashboard.stats.totalScans, sub: 'TOTAL SCANS', value: '2,842', trend: '+12%', isPositive: true },
    { label: t.dashboard.stats.aiQueries, sub: 'AI QUERIES', value: '1,420', trend: '+18%', isPositive: true },
    { label: t.dashboard.stats.resolution, sub: 'RESOLUTION', value: '94.2%', trend: '+2%', isPositive: true },
    { label: t.dashboard.stats.avgSession, sub: 'AVG. SESSION', value: '3m 42s', trend: '-5%', isPositive: false },
  ];

  return (
    <div className="space-y-12 animate-slide-in pb-10">
      {/* Welcome Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
             <div className="w-2 h-10 bg-[#D4AF37] rounded-full shadow-[0_0_10px_var(--gold-glow)]"></div>
             <h1 className="text-5xl font-black tracking-tighter text-[#1E293B]">
              {t.dashboard.welcome} <span className="text-[#D4AF37]">Admin Panel</span>
            </h1>
          </div>
          <p className="text-gray-400 font-bold text-xl ml-6">{t.dashboard.subtitle}</p>
        </div>
        
        <div className="flex items-center space-x-6">
           <div className="bg-white px-8 py-4 rounded-2xl border-2 border-[#D4AF37]/20 flex items-center space-x-4 shadow-lg">
              <div className="w-3 h-3 bg-[#D4AF37] rounded-full pulse-live"></div>
              <span className="text-xs font-black text-[#1E293B] uppercase tracking-[0.2em]">{t.dashboard.liveMonitoring}</span>
           </div>
           <button className="btn-base btn-primary px-8 py-4 text-xs">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              <span>{t.dashboard.quickCreate}</span>
           </button>
        </div>
      </div>

      <div className="gold-divider opacity-30"></div>

      {/* Stats Cards with Gold Borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="premium-card p-10 group cursor-pointer border-[#D4AF37]/30">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-[#D4AF37]/20 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all">
                <svg className="w-7 h-7 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />}
                  {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
                  {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  {i === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                </svg>
              </div>
              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border-2 ${stat.isPositive ? 'text-emerald-500 border-emerald-50 bg-emerald-50' : 'text-pink-500 border-pink-50 bg-pink-50'}`}>
                {stat.trend}
              </span>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.3em] mb-2">{stat.sub}</p>
               <h3 className="text-4xl font-black text-[#1E293B] tracking-tighter">{stat.value}</h3>
               <p className="text-gray-400 font-bold text-sm mt-2">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 premium-card p-12 bg-white relative overflow-hidden border-[#D4AF37]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 -mr-32 -mt-32 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="text-3xl font-black text-[#1E293B] tracking-tight">{t.dashboard.analytics.title} <span className="text-[#D4AF37] ml-3 text-lg font-bold">{t.dashboard.analytics.liveMetrics}</span></h3>
              <p className="text-[10px] font-black text-gray-300 uppercase mt-2 tracking-[0.4em]">{t.dashboard.analytics.subtitle}</p>
            </div>
            <div className="flex space-x-2 bg-gray-50 p-2 rounded-2xl border-2 border-gray-100">
               {[t.dashboard.analytics.period.day, t.dashboard.analytics.period.week, t.dashboard.analytics.period.month].map((period, index) => (
                 <button key={index} className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${index === 1 ? 'bg-[#D4AF37] text-white shadow-lg' : 'text-gray-400 hover:text-[#D4AF37]'}`}>{period}</button>
               ))}
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_STATS}>
                <defs>
                  <linearGradient id="colorQuery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 900 }} dy={15}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 900 }} dx={-10}/>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: '2px solid #D4AF37', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px' }}
                  labelStyle={{ fontWeight: 900, color: '#1E293B', marginBottom: '8px' }}
                />
                <Area type="monotone" dataKey="queries" stroke="#D4AF37" strokeWidth={5} fillOpacity={1} fill="url(#colorQuery)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Nodes */}
        <div className="premium-card p-12 bg-[#FDFDFD] border-[#D4AF37]/30">
          <h3 className="text-2xl font-black text-[#1E293B] mb-2 uppercase tracking-tight">{t.dashboard.nodes.title} <span className="text-[#D4AF37] ml-2">节点</span></h3>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-10">{t.dashboard.nodes.subtitle}</p>
          
          <div className="space-y-6">
            {MOCK_PRODUCTS.map(p => (
              <div key={p.id} className="group flex items-center space-x-6 p-4 rounded-2xl border-2 border-transparent hover:border-[#D4AF37]/20 hover:bg-white transition-all cursor-pointer shadow-sm">
                  <div className="w-14 h-14 rounded-2xl btn-primary flex items-center justify-center text-white shadow-xl">
                     <Icons.Products className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-lg font-black text-[#1E293B] truncate leading-tight group-hover:text-[#D4AF37] transition-colors">{p.name}</h4>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{p.model}</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`}></div>
              </div>
            ))}
          </div>

          <button className="btn-base btn-outline-gold w-full mt-10 py-5 text-xs">
            {t.dashboard.nodes.manage}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
