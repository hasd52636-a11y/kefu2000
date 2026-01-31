
import React, { useState, useEffect } from 'react';
import { LocaleProvider } from './contexts/LocaleContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import UserInterface from './pages/UserInterface';
import Settings from './pages/Settings';

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
            {activeTab === 'settings' && <Settings />}
          </div>
        </Layout>
      )}
    </LocaleProvider>
  );
};

export default App;
