// 智谱AI测试脚本
import { getZhipuAI } from './services/zhipuService.ts';

async function testZhipuAI() {
  console.log('开始测试智谱AI模型...');
  
  try {
    const zhipuAI = getZhipuAI('glm-4.7');
    
    console.log('创建ZhipuAI实例成功');
    
    const messages = [
      {
        role: 'user',
        content: '你好，测试智谱AI模型是否正常工作'
      }
    ];
    
    console.log('发送测试请求...');
    const response = await zhipuAI.chat(messages);
    
    console.log('测试请求成功!');
    console.log('响应内容:', response);
    
    return { success: true, response };
  } catch (error) {
    console.error('测试失败:', error);
    return { success: false, error: error.message };
  }
}

testZhipuAI().then(result => {
  console.log('测试结果:', result);
  process.exit(result.success ? 0 : 1);
});
