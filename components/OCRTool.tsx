import React, { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';

const OCRTool: React.FC = () => {
  const { t } = useLocale();
  const [image, setImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setRecognizedText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOCR = () => {
    if (!image) return;

    setIsProcessing(true);
    
    // 模拟OCR处理
    setTimeout(() => {
      const mockText = t('ocr.mockText');
      setRecognizedText(mockText);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('ocr.title')}</h3>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">{t('ocr.uploadImage')}</label>
        <div className="flex items-center space-x-4">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="border rounded px-3 py-2 text-sm"
          />
          {image && (
            <button 
              onClick={handleOCR}
              disabled={isProcessing}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isProcessing ? t('ocr.processing') : t('ocr.recognizeText')}
            </button>
          )}
        </div>
      </div>

      {image && (
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">{t('ocr.preview')}</label>
          <div className="border rounded p-2 bg-gray-50">
            <img 
              src={image} 
              alt="Preview" 
              className="max-w-full max-h-64 object-contain"
            />
          </div>
        </div>
      )}

      {recognizedText && (
        <div className="mt-6">
          <label className="block text-gray-700 mb-2">{t('ocr.recognizedText')}</label>
          <div className="border rounded p-4 bg-gray-50 min-h-32">
            <p className="text-gray-800 whitespace-pre-wrap">{recognizedText}</p>
          </div>
          <div className="mt-3 flex justify-end">
            <button 
              onClick={() => navigator.clipboard.writeText(recognizedText)}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition-colors text-sm"
            >
              {t('ocr.copyText')}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-2">{t('ocr.features')}</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>{t('ocr.feature1')}</li>
          <li>{t('ocr.feature2')}</li>
          <li>{t('ocr.feature3')}</li>
          <li>{t('ocr.feature4')}</li>
        </ul>
      </div>
    </div>
  );
};

export default OCRTool;