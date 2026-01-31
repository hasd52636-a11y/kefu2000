
import React, { useState, useRef, useEffect } from 'react';
import { Icons, MOCK_PRODUCTS } from '../constants';
import { Message } from '../types';
import { useLocale } from '../contexts/LocaleContext';
import { 
  getZhipuResponse, 
  analyzeFaultImageWithZhipu 
} from '../services/zhipuService';
import { ocrService } from '../services/ocrService';

const UserInterface: React.FC<{ productId: string }> = ({ productId }) => {
  const { t } = useLocale();
  const product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];

  // 检测用户地区
  const isChineseRegion = () => {
    // 简单检测：根据浏览器语言
    try {
      const language = navigator.language;
      return language.startsWith('zh');
    } catch (error) {
      console.error('Region detection error:', error);
      return true;
    }
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `您好！我是您的智能服务助手。正在为您提供 "${product.name}" 的专业技术支持。您可以点击麦克风开启【实时语音对讲】，或选择下方快速功能进行自助服务。`,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text?: string, imageUrl?: string) => {
    const content = text || inputValue;
    if (!content && !imageUrl) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content || (imageUrl ? '请通过这张照片诊断可能的故障' : ''),
      timestamp: new Date(),
      type: imageUrl ? 'image' : 'text',
      imageUrl
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (imageUrl) {
        const base64 = imageUrl.split(',')[1];
        const resText = await analyzeFaultImageWithZhipu(base64, product.model);
        setMessages(prev => [...prev, { id: 'ai-' + Date.now(), role: 'assistant', content: resText, timestamp: new Date(), type: 'text' }]);
      } else {
        const res = await getZhipuResponse(content, `${product.name} (${product.model}) 官方说明书知识库`);
        setMessages(prev => [...prev, { id: 'ai-' + Date.now(), role: 'assistant', content: res.text, timestamp: new Date(), type: 'text' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: '抱歉，系统暂时无法解析您的请求。', timestamp: new Date(), type: 'text' }]);
    } finally {
      setIsLoading(false);
    }
  };



  const quickTools = [
    { label: t.user.quickActions.tools.diagnosis, icon: '🛠️', prompt: '请根据产品手册引导我进行常见故障的诊断。' },
    { label: t.user.quickActions.tools.installation, icon: '📦', prompt: '请一步步告诉我这款产品的安装流程和注意事项。' },
    { label: t.user.quickActions.tools.maintenance, icon: '🧹', prompt: '这款产品应该如何进行日常清洁、滤网更换等保养操作？' },
    { label: '文字识别', icon: '📝', action: 'ocr' },
  ];

  const handleOCR = async (imageUrl: string) => {
    setIsLoading(true);
    try {
      const ocrResult = await ocrService.recognizeText({ image: imageUrl });
      
      const ocrMsg: Message = {
        id: 'ocr-' + Date.now(),
        role: 'assistant',
        content: `我已从图片中识别到以下文字：\n\n${ocrResult.text}\n\n您可以基于这些信息向我询问相关问题。`,
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, ocrMsg]);
    } catch (error) {
      console.error('OCR失败:', error);
      const errorMsg: Message = {
        id: 'ocr-error-' + Date.now(),
        role: 'assistant',
        content: '文字识别失败，请重试或上传清晰的图片。',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-white shadow-2xl overflow-hidden relative border-x-4 border-[#D4AF37]/30">
      {/* High-End Header */}
      <header className="px-4 py-4 bg-white/90 backdrop-blur-xl border-b-2 border-[#D4AF37]/30 flex items-center justify-between z-40 sticky top-0 rounded-b-[2.5rem]">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl btn-primary p-0.5 shadow-xl relative">
             <div className="w-full h-full rounded-[1.1rem] bg-white flex items-center justify-center">
                <Icons.Logo className="w-6 h-6 text-purple-600" />
             </div>
          </div>
          <div>
            <h2 className="font-black text-[#1E293B] text-lg tracking-tighter leading-none">{product.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                {t.user.header.active}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-[#D4AF37] transition-colors border border-gray-100">
            <Icons.Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-white to-[#FDFDFD]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}>
            <div className={`max-w-[88%] rounded-[2.5rem] p-4 shadow-xl relative group ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border-2 border-[#D4AF37]/20 text-[#1E293B] rounded-tl-none'
            }`}>
              {msg.imageUrl && (
                <div className="rounded-2xl overflow-hidden mb-4 border-4 border-white shadow-md">
                  <img src={msg.imageUrl} className="w-full h-40 object-cover" alt="Diagnostic View" />
                </div>
              )}
              <p className="text-[1rem] font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <div className="flex items-center justify-between mt-3">
                 <span className={`text-[9px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-white/60' : 'text-gray-300'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border-2 border-[#D4AF37]/20 rounded-3xl px-6 py-4 flex space-x-3 items-center shadow-lg">
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <span className="text-xs font-black text-[#D4AF37] ml-2 tracking-widest uppercase">Processing</span>
             </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <footer className="p-4 bg-white border-t-2 border-[#D4AF37]/10 rounded-t-[3.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-50">
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-3 no-scrollbar">
          {quickTools.map((tool, idx) => (
            <button 
              key={idx}
              onClick={() => {
                if (tool.action === 'ocr') {
                  fileInputRef.current?.click();
                } else if (tool.prompt) {
                  handleSendMessage(tool.prompt);
                }
              }}
              className="btn-base btn-outline-gold px-4 py-3 whitespace-nowrap text-[10px] tracking-widest"
            >
              <span className="text-lg mr-2">{tool.icon}</span>
              <span>{tool.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="p-4 bg-white border-2 border-[#D4AF37]/30 text-[#D4AF37] rounded-3xl hover:border-[#D4AF37] hover:scale-110 active:scale-90 transition-all shadow-xl"
          >
            <Icons.Image className="w-6 h-6" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { 
              const r = new FileReader(); 
              r.onload = () => {
                const imageUrl = r.result as string;
                // 检查是否从OCR工具入口上传
                const activeTool = quickTools.find(tool => tool.action === 'ocr');
                if (activeTool) {
                  handleOCR(imageUrl);
                } else {
                  handleSendMessage(undefined, imageUrl);
                }
              };
              r.readAsDataURL(f); 
            }
          }} />

          <div className="flex-1 relative group">
            <input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t.user.chat.placeholder}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-[#D4AF37] rounded-[2rem] px-6 py-4 text-[1rem] font-bold text-[#1E293B] outline-none transition-all pr-14 shadow-inner"
            />
            <button onClick={() => handleSendMessage()} className="absolute right-3 top-3 p-2 text-purple-600 hover:scale-125 transition-all">
              <Icons.Send className="w-6 h-6" />
            </button>
          </div>


        </div>
        
        <div className="mt-4 flex items-center justify-center space-x-4">
           <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30"></div>
           <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.5em]">Powered by SmartGuide AI Engine</p>
           <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30"></div>
        </div>
      </footer>
    </div>
  );
};

export default UserInterface;
