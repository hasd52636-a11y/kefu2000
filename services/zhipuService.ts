// 智谱AI服务 - 提供智谱AI模型的调用功能

interface ZhipuMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | Array<{
    type: 'text' | 'image_url' | 'file_url' | 'video_url' | 'input_audio';
    text?: string;
    image_url?: {
      url: string;
    };
    file_url?: {
      url: string;
    };
    video_url?: {
      url: string;
    };
    input_audio?: {
      data: string;
      format: string;
    };
  }>;
  tool_call_id?: string;
  tool_calls?: Array<{
    id: string;
    type: 'function' | 'web_search' | 'retrieval';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

interface ZhipuResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      tool_calls?: Array<any>;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ZhipuConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  do_sample?: boolean;
  stop?: string[];
  response_format?: {
    type: 'text' | 'json_object';
  };
}

export class ZhipuAI {
  private config: ZhipuConfig;

  constructor(config: ZhipuConfig) {
    this.config = {
      temperature: 0.8,
      top_p: 0.95,
      max_tokens: 1024,
      stream: false,
      do_sample: true,
      ...config
    };
  }

  async chat(messages: ZhipuMessage[]): Promise<string> {
    try {
      const response = await this.createChatCompletion({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        top_p: this.config.top_p,
        max_tokens: this.config.max_tokens,
        stream: this.config.stream,
        do_sample: this.config.do_sample,
        stop: this.config.stop,
        response_format: this.config.response_format
      });

      return response.choices[0]?.message?.content || 'No response from Zhipu AI';
    } catch (error) {
      console.error('Zhipu AI chat error:', error);
      throw error;
    }
  }

  async createChatCompletion(body: any): Promise<ZhipuResponse> {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Zhipu AI API error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  }

  async analyzeImage(imageUrl: string, prompt: string): Promise<string> {
    try {
      const messages: ZhipuMessage[] = [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ];

      const response = await this.createChatCompletion({
        model: 'glm-4.6v',
        messages,
        temperature: this.config.temperature,
        top_p: this.config.top_p,
        max_tokens: this.config.max_tokens
      });

      return response.choices[0]?.message?.content || 'No response from Zhipu AI';
    } catch (error) {
      console.error('Zhipu AI image analysis error:', error);
      throw error;
    }
  }
}

// 预设模型配置
export const ZHIPU_MODELS = {
  // 文本模型
  'glm-4.7': {
    name: 'GLM-4.7',
    description: '智谱AI最新旗舰模型，支持复杂推理、超长上下文',
    type: 'text'
  },
  'glm-4.7-flash': {
    name: 'GLM-4.7 Flash',
    description: 'GLM-4.7的高速版本，适合实时对话场景',
    type: 'text'
  },
  'glm-4.6': {
    name: 'GLM-4.6',
    description: '高性能通用模型，平衡了速度和能力',
    type: 'text'
  },
  // 视觉模型
  'glm-4.6v': {
    name: 'GLM-4.6V',
    description: '支持多模态理解的视觉模型',
    type: 'vision'
  },
  // 语音模型
  'glm-4-voice': {
    name: 'GLM-4 Voice',
    description: '支持语音理解和生成的模型',
    type: 'audio'
  }
};

// 默认配置
export const getZhipuAI = (model: string = 'glm-4.7') => {
  // 优先使用localStorage中保存的API密钥
  const apiKey = localStorage.getItem('ZHIPU_API_KEY') || 'a75d46768b0f45dc90a5969077ffc8d9.dT0t2tku3hZGfYkk';
  return new ZhipuAI({
    apiKey,
    model
  });
};

// 便捷方法
export async function getZhipuResponse(
  prompt: string, 
  productContext?: string,
  model: string = 'glm-4.7'
): Promise<{ text: string }> {
  try {
    const zhipuAI = getZhipuAI(model);
    const systemInstruction = `你是"SmartGuide AI"，一名专业的产品支持工程师。正在为以下产品提供支持：${productContext || '通用产品支持'}。请提供专业、准确的技术支持。`;

    const messages: ZhipuMessage[] = [
      {
        role: 'system',
        content: systemInstruction
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await zhipuAI.chat(messages);
    return { text: response };
  } catch (error) {
    console.error('Zhipu response error:', error);
    return { text: '获取智谱AI响应时发生错误' };
  }
}

export async function analyzeFaultImageWithZhipu(
  base64Image: string, 
  productModel: string
): Promise<string> {
  try {
    const zhipuAI = getZhipuAI('glm-4.6v');
    const prompt = `分析这张${productModel}产品的图片，识别是否存在故障，如有故障请详细描述故障情况并提供可能的解决方案。`;

    const response = await zhipuAI.analyzeImage(`data:image/jpeg;base64,${base64Image}`, prompt);
    return response;
  } catch (error) {
    console.error('Zhipu image analysis error:', error);
    return '分析图片时发生错误';
  }
}
