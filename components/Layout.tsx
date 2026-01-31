
import React from 'react';
import { Icons } from '../constants';
import { useLocale } from '../contexts/LocaleContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { locale, setLocale, t } = useLocale();
  
  const menuItems = [
    { id: 'dashboard', name: t.layout.sidebar.menu.dashboard, sub: 'DASHBOARD', icon: Icons.Dashboard },
    { id: 'products', name: t.layout.sidebar.menu.products, sub: 'PRODUCTS', icon: Icons.Products },
    { id: 'stats', name: t.layout.sidebar.menu.stats, sub: 'ANALYTICS', icon: Icons.Analytics },
    { id: 'settings', name: t.layout.sidebar.menu.settings, sub: 'API SETTINGS', icon: Icons.Settings },
  ];

  const contentItems = [
    { id: 'knowledge', name: t.layout.sidebar.subMenu.knowledge, sub: 'KNOWLEDGE BASE', icon: Icons.Knowledge },
    { id: 'search', name: t.layout.sidebar.subMenu.search, sub: 'SMART SEARCH', icon: Icons.Search },
  ];

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-[#1E293B]">
      {/* Sidebar with Metallic Golden Border */}
      <aside className="w-72 flex flex-col border-r-2 border-[#D4AF37]/30 bg-white">
        <div className="p-8 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl btn-primary flex items-center justify-center text-white shadow-xl">
            <Icons.Logo className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xl font-black block leading-none tracking-tight">{t.layout.sidebar.logo}</span>
            <span className="text-[10px] font-bold text-[#D4AF37] tracking-[0.2em] mt-1 uppercase">{t.layout.sidebar.subtitle}</span>
          </div>
        </div>
        
        <div className="gold-divider mx-8 mb-6 opacity-30"></div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-[#FDFDFD] border border-[#D4AF37] shadow-lg text-[#D4AF37]' 
                  : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50'
              }`}
            >
              <item.icon className={`w-6 h-6 transition-colors ${activeTab === item.id ? 'text-[#D4AF37]' : 'text-gray-300 group-hover:text-purple-400'}`} />
              <div className="text-left">
                <p className="text-sm font-black uppercase">{item.name}</p>
                <p className="text-[9px] font-bold opacity-60 tracking-wider uppercase">{item.sub}</p>
              </div>
            </button>
          ))}

          <div className="mt-10 mb-4 px-6">
            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">{t.layout.sidebar.contentEngine}</span>
          </div>

          {contentItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-[#FDFDFD] border border-[#D4AF37] shadow-lg text-[#D4AF37]' 
                  : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50'
              }`}
            >
              <item.icon className={`w-6 h-6 transition-colors ${activeTab === item.id ? 'text-[#D4AF37]' : 'text-gray-300 group-hover:text-purple-400'}`} />
              <div className="text-left">
                <p className="text-sm font-black uppercase">{item.name}</p>
                <p className="text-[9px] font-bold opacity-60 tracking-wider uppercase">{item.sub}</p>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="p-6 rounded-3xl bg-white border border-[#D4AF37]/30 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-full"></div>
            <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-3">{t.layout.sidebar.enterprise}</p>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[75%]"></div>
            </div>
            <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase">{t.layout.sidebar.projects}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md border-b-2 border-[#D4AF37]/30">
          <div className="flex-1 max-w-lg">
            <div className="relative group">
              <Icons.Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
              <input 
                type="text" 
                placeholder={t.layout.header.searchPlaceholder}
                className="w-full bg-gray-50 border border-gray-100 focus:border-[#D4AF37] rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/5 transition-all shadow-inner"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-8 ml-8">
            <button className="relative p-3 text-gray-400 hover:text-[#D4AF37] transition-all">
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            
            <div className="h-10 w-[1px] bg-[#D4AF37]/30"></div>

            <div className="flex items-center space-x-6">
              {/* Language Switcher */}
              <button 
                onClick={() => setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all"
              >
                <span className="text-xs font-black uppercase">{locale === 'zh-CN' ? '中文' : 'EN'}</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-black text-[#1E293B] leading-none uppercase">{t.layout.header.user.name}</p>
                  <p className="text-[10px] font-black text-[#D4AF37] mt-1.5 uppercase tracking-widest">{t.layout.header.user.role}</p>
                </div>
                <div className="w-12 h-12 rounded-xl btn-primary flex items-center justify-center shadow-xl border-2 border-white/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-10 py-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
