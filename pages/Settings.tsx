import React, { useState, useEffect } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { getZhipuAI } from '../services/zhipuService';

const Settings: React.FC = () => {
  const { t } = useLocale();
  
  // API密钥状态
  const [apiKeys, setApiKeys] = useState({
    google: localStorage.getItem('GOOGLE_API_KEY') || '',
    zhipu: localStorage.getItem('ZHIPU_API_KEY') || ''
  });
  
  // 显示/隐藏密码状态
  const [showPasswords, setShowPasswords] = useState({
    google: false,
    zhipu: false
  });
  
  // 测试状态
  const [testStatus, setTestStatus] = useState({
    google: { status: 'idle' as 'idle' | 'testing' | 'success' | 'error', message: '' },
    zhipu: { status: 'idle' as 'idle' | 'testing' | 'success' | 'error', message: '' }
  });
  
  // 保存状态
  const [saveStatus, setSaveStatus] = useState({ status: 'idle' as 'idle' | 'saving' | 'success' | 'error', message: '' });

  // 处理API密钥变化
  const handleApiKeyChange = (provider: 'google' | 'zhipu', value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  // 切换密码显示/隐藏
  const togglePasswordVisibility = (provider: 'google' | 'zhipu') => {
    setShowPasswords(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  // 测试Zhipu API密钥
  const testZhipuApiKey = async () => {
    if (!apiKeys.zhipu) {
      setTestStatus(prev => ({
        ...prev,
        zhipu: { status: 'error', message: '请输入API密钥' }
      }));
      return;
    }

    setTestStatus(prev => ({
      ...prev,
      zhipu: { status: 'testing', message: '测试中...' }
    }));

    try {
      // 创建ZhipuAI实例
      const zhipuAI = getZhipuAI();
      
      // 发送测试请求
      const response = await zhipuAI.chat([
        {
          role: 'user',
          content: '测试API连接'
        }
      ]);

      setTestStatus(prev => ({
        ...prev,
        zhipu: { status: 'success', message: 'API连接成功！' }
      }));
    } catch (error) {
      setTestStatus(prev => ({
        ...prev,
        zhipu: { status: 'error', message: 'API连接失败，请检查密钥是否正确' }
      }));
    }
  };

  // 保存API密钥
  const saveApiKeys = () => {
    setSaveStatus({ status: 'saving', message: '保存中...' });

    try {
      // 保存到localStorage
      localStorage.setItem('GOOGLE_API_KEY', apiKeys.google);
      localStorage.setItem('ZHIPU_API_KEY', apiKeys.zhipu);

      // 更新环境变量
      if (typeof process !== 'undefined' && process.env) {
        process.env.API_KEY = apiKeys.google;
        process.env.ZHIPU_API_KEY = apiKeys.zhipu;
      }

      setSaveStatus({ status: 'success', message: '保存成功！' });

      // 3秒后重置保存状态
      setTimeout(() => {
        setSaveStatus({ status: 'idle', message: '' });
      }, 3000);
    } catch (error) {
      setSaveStatus({ status: 'error', message: '保存失败，请重试' });
    }
  };

  return (
    <div className="space-y-12 animate-slide-in pb-10">
      <div className="flex items-end justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
             <div className="w-2 h-10 bg-[#D4AF37] rounded-full shadow-[0_0_10px_var(--gold-glow)]"></div>
             <h1 className="text-5xl font-black tracking-tighter text-[#1E293B]">
              {t.settings.title} <span className="text-[#D4AF37]">Configuration</span>
            </h1>
          </div>
          <p className="text-gray-400 font-bold text-xl ml-6">API密钥管理和系统设置</p>
        </div>
      </div>

      <div className="gold-divider opacity-30"></div>

      {/* API密钥设置 */}
      <div className="premium-card p-12 bg-white border-[#D4AF37]/30">
        <h2 className="text-2xl font-black text-[#1E293B] mb-8 uppercase tracking-tight">
          {t.settings.ai}
        </h2>

        {/* 保存状态提示 */}
        {saveStatus.status !== 'idle' && (
          <div className={`mb-6 p-4 rounded-lg ${saveStatus.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p className="font-bold">{saveStatus.message}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Google API密钥 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1E293B]">Google API密钥</h3>
            <div className="relative">
              <input
                type={showPasswords.google ? 'text' : 'password'}
                value={apiKeys.google}
                onChange={(e) => handleApiKeyChange('google', e.target.value)}
                placeholder="输入Google API密钥"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-lg font-bold"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('google')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                {showPasswords.google ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Google API密钥用于Gemini模型调用，获取地址：https://makersuite.google.com/app/apikey
            </p>
          </div>

          {/* 智谱API密钥 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1E293B]">智谱API密钥</h3>
            <div className="relative">
              <input
                type={showPasswords.zhipu ? 'text' : 'password'}
                value={apiKeys.zhipu}
                onChange={(e) => handleApiKeyChange('zhipu', e.target.value)}
                placeholder="输入智谱API密钥"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-lg font-bold"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('zhipu')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                {showPasswords.zhipu ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={testZhipuApiKey}
                disabled={testStatus.zhipu.status === 'testing'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
              >
                {testStatus.zhipu.status === 'testing' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    测试中...
                  </>
                ) : (
                  '测试API密钥'
                )}
              </button>
              {testStatus.zhipu.status !== 'idle' && (
                <span className={`font-bold ${testStatus.zhipu.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {testStatus.zhipu.message}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">
              智谱API密钥用于GLM模型调用，获取地址：https://bigmodel.cn/usercenter/proj-mgmt/apikeys
            </p>
          </div>

          {/* 保存按钮 */}
          <div className="pt-4">
            <button
              onClick={saveApiKeys}
              className="px-10 py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C09B30] transition-colors text-lg font-bold shadow-xl"
            >
              保存API密钥
            </button>
          </div>
        </div>
      </div>

      {/* 系统设置 */}
      <div className="premium-card p-12 bg-white border-[#D4AF37]/30">
        <h2 className="text-2xl font-black text-[#1E293B] mb-8 uppercase tracking-tight">
          系统设置
        </h2>

        <div className="space-y-8">
          {/* 默认AI模型 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1E293B]">{t.settings.defaultModel}</h3>
            <select className="w-full px-6 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-lg font-bold">
              <option value="gemini">Google Gemini</option>
              <option value="zhipu">智谱GLM</option>
            </select>
          </div>

          {/* 多模态分析模型 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1E293B]">{t.settings.multimodalModel}</h3>
            <select className="w-full px-6 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-lg font-bold">
              <option value="gemini-2.5-flash-image">Gemini 2.5 Flash Image</option>
              <option value="glm-4.6v">GLM-4.6V</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;