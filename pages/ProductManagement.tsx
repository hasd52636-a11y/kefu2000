
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_PRODUCTS, Icons } from '../constants';
import { Product, KBDocument } from '../types';
import QRCode from 'qrcode';
import { useLocale } from '../contexts/LocaleContext';

const ProductManagement: React.FC = () => {
  const { t } = useLocale();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProduct) {
      const previewUrl = `${window.location.origin}${window.location.pathname}#/preview/${editingProduct.id}`;
      QRCode.toDataURL(previewUrl, {
        width: 600,
        margin: 1,
        color: { dark: '#1E293B', light: '#FFFFFF' },
        errorCorrectionLevel: 'H'
      }).then(setQrDataUrl).catch(console.error);
    } else {
      setQrDataUrl('');
    }
  }, [editingProduct]);

  const handleEditClick = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
  };

  const handleSave = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl || !editingProduct) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `SmartGuide_QR_${editingProduct.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      setUploadProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const newDoc: KBDocument = {
            id: 'doc_' + Date.now(),
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(1) + 'MB',
            type: 'pdf',
            uploadDate: new Date().toISOString().split('T')[0]
          };
          setEditingProduct({ ...editingProduct, documents: [...editingProduct.documents, newDoc] });
          setUploadProgress(null);
        }
      }, 300);
    }
  };

  return (
    <div className="space-y-12 animate-slide-in">
      <div className="flex items-end justify-between">
        <div className="space-y-3">
          <h1 className="text-5xl font-black tracking-tighter text-[#1E293B]">
            {t.products.title} <span className="text-[#D4AF37] uppercase">Assets</span>
          </h1>
          <p className="text-gray-400 font-bold text-xl">{t.products.subtitle}</p>
        </div>
        <button className="btn-base btn-primary px-10 py-5 text-xs">
          + {t.products.quickCreate}
        </button>
      </div>

      <div className="premium-card overflow-hidden border-[#D4AF37]/30">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-[#D4AF37]/20 bg-gray-50/50">
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.products.table.name}</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.products.table.model}</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.products.table.category}</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.products.table.status}</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">{t.products.table.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-purple-50/30 transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#D4AF37]/20 flex items-center justify-center text-[#8B5CF6] shadow-md group-hover:scale-110 transition-transform">
                      <Icons.Products className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-lg font-black text-[#1E293B] block leading-tight">{p.name}</span>
                      <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mt-1">{p.category}</span>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 text-sm font-black text-gray-400 font-mono">{p.model}</td>
                <td className="px-10 py-8">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-black text-purple-600">{p.documents.length}</span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase">Documents</span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`}></div>
                    <span className="text-xs font-black text-[#1E293B] uppercase">{p.status === 'active' ? t.products.status.active : t.products.status.inactive}</span>
                  </div>
                </td>
                <td className="px-10 py-8 text-right">
                  <button onClick={() => handleEditClick(p)} className="btn-base btn-outline-gold px-6 py-3 text-[10px]">
                    Configure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={() => setEditingProduct(null)}></div>
          <div className="relative w-full max-w-5xl h-full bg-white shadow-2xl flex flex-col transform animate-slide-in border-l-4 border-[#D4AF37]">
            <div className="p-10 border-b-2 border-[#D4AF37]/20 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black flex items-center tracking-tighter">
                  {t.products.modal.title} <span className="text-[#D4AF37] ml-3 uppercase">Configuration</span>
                </h2>
                <p className="text-[10px] font-bold text-gray-300 uppercase mt-2 tracking-widest">{t.products.modal.subtitle}</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-4 hover:bg-gray-100 rounded-2xl transition-all">
                <Icons.Close className="w-8 h-8 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex">
              <div className="flex-1 p-12 space-y-12 bg-gray-50/30">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Project Label</label>
                    <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-white border-2 border-gray-100 focus:border-[#D4AF37] rounded-2xl px-6 py-4 font-black text-[#1E293B] outline-none transition-all shadow-inner" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Model Reference</label>
                    <input type="text" value={editingProduct.model} onChange={e => setEditingProduct({...editingProduct, model: e.target.value})} className="w-full bg-white border-2 border-gray-100 focus:border-[#D4AF37] rounded-2xl px-6 py-4 font-black text-[#1E293B] font-mono outline-none transition-all shadow-inner" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Service Description</label>
                  <textarea rows={4} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-white border-2 border-gray-100 focus:border-[#D4AF37] rounded-2xl px-6 py-4 font-bold text-gray-600 outline-none transition-all resize-none shadow-inner" />
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="text-xl font-black text-[#1E293B] uppercase">{t.products.modal.knowledge}</h3>
                    <button onClick={() => fileInputRef.current?.click()} className="btn-base btn-primary px-6 py-3 text-[10px] tracking-widest">+ {t.products.modal.basic}</button>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleUploadDocument} />
                  </div>

                  {uploadProgress !== null && (
                    <div className="p-8 rounded-2xl bg-purple-50 border-2 border-purple-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Syncing with AI Engine...</span>
                        <span className="text-sm font-black text-purple-600">{uploadProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {editingProduct.documents.map(doc => (
                      <div key={doc.id} className="p-6 rounded-2xl border-2 border-gray-100 bg-white flex items-center hover:border-[#D4AF37]/50 transition-all group">
                        <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all">
                          <Icons.Knowledge className="w-7 h-7" />
                        </div>
                        <div className="flex-1 ml-6 min-w-0">
                          <h4 className="text-lg font-black text-[#1E293B] truncate">{doc.name}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{doc.size} • Uploaded {doc.uploadDate}</p>
                        </div>
                        <button className="btn-base btn-danger p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Icons.Close className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* QR Sidebar Panel */}
              <div className="w-96 bg-white p-12 flex flex-col items-center border-l-2 border-gray-50">
                <div className="space-y-8 text-center w-full sticky top-10">
                  <h3 className="text-xl font-black uppercase text-[#1E293B]">{t.products.modal.qr}</h3>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t.products.modal.qr}</p>
                  
                  <div className="relative group mt-8">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500 to-[#D4AF37] rounded-3xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700"></div>
                    <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#D4AF37]/20">
                      {qrDataUrl ? (
                        <div className="relative z-10 p-2 border-2 border-gray-50 rounded-2xl">
                          <img src={qrDataUrl} alt="Product QR" className="w-full h-auto rounded-xl" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-gray-50">
                            <Icons.Logo className="w-7 h-7 text-purple-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full aspect-square bg-gray-50 rounded-2xl animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  <div className="pt-10 space-y-4">
                    <button onClick={handleDownloadQR} className="btn-base btn-outline-gold w-full py-4 text-[10px] tracking-widest">
                      Export QR High-Res
                    </button>
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-left">
                      <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2">Secure Link</p>
                      <p className="text-[10px] font-bold text-gray-400 leading-relaxed">Generated QR links directly to the AI service interface for this specific hardware ID.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 border-t-2 border-[#D4AF37]/20 flex justify-end space-x-6 bg-white">
              <button onClick={() => setEditingProduct(null)} className="btn-base bg-gray-100 text-gray-500 px-10 py-5 text-[10px] tracking-widest hover:bg-gray-200">{t.products.modal.discard}</button>
              <button onClick={handleSave} className="btn-base btn-primary px-14 py-5 text-[10px] tracking-widest shadow-2xl">{t.products.modal.save}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
