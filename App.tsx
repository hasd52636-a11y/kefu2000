
import React, { useState, useEffect } from 'react';
import { LocaleProvider } from './contexts/LocaleContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import UserInterface from './pages/UserInterface';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [view, setView] = useState<'admin' | 'user'>('admin');
  const [selectedProductId, setSelectedProductId] = useState('p1');

  // Check for hash-based routing for user preview
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/preview/')) {
        const id = hash.replace('#/preview/', '');
        setSelectedProductId(id);
        setView('user');
      } else {
        setView('admin');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <LocaleProvider>
      {view === 'user' ? (
        <UserInterface productId={selectedProductId} />
      ) : (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          <div className="min-h-full">
            <div className="sticky top-0 z-20 glass border-b border-white/10 px-8 py-3 flex items-center justify-end space-x-4">
               <button 
                onClick={() => window.location.hash = `#/preview/${selectedProductId}`}
                className="text-xs px-4 py-1.5 rounded-lg border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-all"
              >
                预览用户端
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">管理员</span>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">A</div>
              </div>
            </div>

            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'stats' && (
              <div className="p-8 text-center text-gray-500">
                <h2 className="text-2xl font-bold text-white mb-2">使用统计详情</h2>
                <p>正在生成深度分析报告...</p>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="p-8">
                 <h2 className="text-2xl font-bold mb-6">系统设置</h2>
                 <div className="space-y-6 max-w-2xl">
                    <div className="p-6 rounded-2xl glass border border-white/5 space-y-4">
                       <h3 className="font-semibold">AI 模型配置</h3>
                       <div className="flex flex-col space-y-2">
                          <label className="text-xs text-gray-400">默认回答模型</label>
                          <select className="bg-[#12141a] border border-white/10 rounded-lg px-4 py-2 outline-none">
                            <option>Gemini 3 Flash (推荐)</option>
                            <option>Gemini 3 Pro</option>
                          </select>
                       </div>
                       <div className="flex flex-col space-y-2">
                          <label className="text-xs text-gray-400">多模态分析模型</label>
                          <select className="bg-[#12141a] border border-white/10 rounded-lg px-4 py-2 outline-none">
                            <option>Gemini 2.5 Flash Image</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </Layout>
      )}
    </LocaleProvider>
  );
};

export default App;
