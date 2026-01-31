// 直接测试智谱AI API调用

class ZhipuAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async testAPI() {
    console.log('开始测试智谱AI API...');
    
    try {
      const messages = [
        {
          role: 'user',
          content: '你好，测试智谱AI模型是否正常工作'
        }
      ];

      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'glm-4.7',
          messages,
          temperature: 0.8,
          max_tokens: 200
        })
      });

      console.log('API响应状态:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API错误:', errorData);
        return { success: false, error: errorData };
      }

      const data = await response.json();
      console.log('API响应成功:', data);
      
      return { 
        success: true, 
        response: data,
        content: data.choices[0]?.message?.content 
      };
    } catch (error) {
      console.error('测试失败:', error);
      return { success: false, error: error.message };
    }
  }
}

// 测试智谱AI API
async function testZhipuAPI() {
  const apiKey = 'a75d46768b0f45dc90a5969077ffc8d9.dT0t2tku3hZGfYkk';
  const zhipuAI = new ZhipuAI(apiKey);
  
  const result = await zhipuAI.testAPI();
  
  console.log('\n=== 测试结果 ===');
  console.log('成功:', result.success);
  if (result.success) {
    console.log('响应内容:', result.content);
    console.log('\nAPI调用成功！智谱AI模型工作正常。');
  } else {
    console.log('错误:', result.error);
    console.log('\nAPI调用失败，请检查API密钥是否正确。');
  }
  
  return result;
}

testZhipuAPI();
