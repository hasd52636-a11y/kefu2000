// OCR 服务 - 提供文字识别功能

interface OCRRequest {
  image: string; // Base64 encoded image
  language?: string;
  options?: {
    detectOrientation?: boolean;
    enableImageEnhancement?: boolean;
  };
}

interface OCRResponse {
  text: string;
  confidence: number;
  regions?: {
    text: string;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    confidence: number;
  }[];
  metadata?: {
    processingTime: number;
    detectedLanguage: string;
  };
}

export const ocrService = {
  /**
   * 识别图片中的文字
   */
  async recognizeText(request: OCRRequest): Promise<OCRResponse> {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟OCR结果
      const mockText = `这是一段模拟的OCR识别结果文字。

示例内容：
- 产品型号：X1 Pro
- 生产日期：2024年12月
- 保修期限：12个月
- 技术参数：详见说明书

感谢使用我们的文字识别服务！`;
      
      const mockRegions = [
        {
          text: "这是一段模拟的OCR识别结果文字。",
          boundingBox: { x: 10, y: 10, width: 400, height: 30 },
          confidence: 0.98
        },
        {
          text: "示例内容：",
          boundingBox: { x: 10, y: 50, width: 100, height: 25 },
          confidence: 0.99
        },
        {
          text: "- 产品型号：X1 Pro",
          boundingBox: { x: 10, y: 80, width: 200, height: 25 },
          confidence: 0.97
        },
        {
          text: "- 生产日期：2024年12月",
          boundingBox: { x: 10, y: 110, width: 250, height: 25 },
          confidence: 0.96
        },
        {
          text: "- 保修期限：12个月",
          boundingBox: { x: 10, y: 140, width: 220, height: 25 },
          confidence: 0.98
        },
        {
          text: "- 技术参数：详见说明书",
          boundingBox: { x: 10, y: 170, width: 250, height: 25 },
          confidence: 0.95
        },
        {
          text: "感谢使用我们的文字识别服务！",
          boundingBox: { x: 10, y: 210, width: 300, height: 25 },
          confidence: 0.99
        }
      ];
      
      return {
        text: mockText,
        confidence: 0.97,
        regions: mockRegions,
        metadata: {
          processingTime: 1500,
          detectedLanguage: request.language || 'zh-CN'
        }
      };
    } catch (error) {
      console.error('OCR识别失败:', error);
      throw new Error('文字识别失败');
    }
  },

  /**
   * 批量识别多张图片
   */
  async batchRecognizeText(images: string[]): Promise<OCRResponse[]> {
    try {
      const results = await Promise.all(
        images.map(image => this.recognizeText({ image }))
      );
      return results;
    } catch (error) {
      console.error('批量OCR识别失败:', error);
      return [];
    }
  },

  /**
   * 支持的语言列表
   */
  getSupportedLanguages(): string[] {
    return [
      'zh-CN', // 简体中文
      'zh-TW', // 繁体中文
      'en-US', // 英语
      'ja-JP', // 日语
      'ko-KR', // 韩语
      'fr-FR', // 法语
      'de-DE', // 德语
      'es-ES', // 西班牙语
      'ru-RU', // 俄语
      'ar-SA'  // 阿拉伯语
    ];
  },

  /**
   * 预处理图片以提高识别准确率
   */
  async preprocessImage(image: string): Promise<string> {
    try {
      // 模拟图片预处理
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 在实际应用中，这里会进行图片增强、降噪等处理
      // 这里简单返回原图片
      return image;
    } catch (error) {
      console.error('图片预处理失败:', error);
      return image;
    }
  },

  /**
   * 验证图片是否适合OCR处理
   */
  validateImage(image: string): boolean {
    try {
      // 简单验证：检查图片大小和格式
      const base64Length = image.length - 'data:image/png;base64,'.length;
      const fileSizeInBytes = Math.floor(base64Length * 3 / 4);
      const maxFileSizeInBytes = 10 * 1024 * 1024; // 10MB
      
      return fileSizeInBytes > 0 && fileSizeInBytes < maxFileSizeInBytes;
    } catch (error) {
      console.error('图片验证失败:', error);
      return false;
    }
  }
};