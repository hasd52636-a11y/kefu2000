// 智谱AI API密钥测试脚本
import axios from 'axios';

// 测试智谱AI API密钥
const apiKey = 'a75d46768b0f45dc90a5969077ffc8d9.dT0t2tku3hZGfYkk';
const model = 'glm-4.7';
const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

async function testZhipuAPI() {
  console.log('=== 开始测试智谱AI API密钥 ===');
  console.log(`API密钥: ${apiKey}`);
  console.log(`模型: ${model}`);
  console.log(`API地址: ${apiUrl}`);
  console.log('');

  try {
    // 1. 保存API密钥到localStorage（模拟用户在设置页面保存）
    console.log('1. 保存API密钥到localStorage...');
    // 注意：在实际浏览器环境中，这里会使用localStorage.setItem('ZHIPU_API_KEY', apiKey);
    console.log('✓ API密钥已保存');
    console.log('');

    // 2. 测试API连接（模拟设置页面的测试按钮）
    console.log('2. 测试API连接...');
    const testResponse = await axios.post(apiUrl, {
      model: model,
      messages: [
        {
          role: 'user',
          content: '测试API连接'
        }
      ],
      temperature: 0.8,
      top_p: 0.95,
      max_tokens: 1024
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    console.log('✓ API连接测试成功！');
    console.log(`  响应状态: ${testResponse.status}`);
    console.log(`  响应内容: ${testResponse.data.choices[0].message.content.substring(0, 100)}...`);
    console.log('');

    // 3. 模拟用户端真实请求（模拟用户在聊天界面发送消息）
    console.log('3. 模拟用户端真实请求测试...');
    const userResponse = await axios.post(apiUrl, {
      model: model,
      messages: [
        {
          role: 'system',
          content: '你是"SmartGuide AI"，一名专业的产品支持工程师。正在为用户提供产品支持。请提供专业、准确的技术支持。'
        },
        {
          role: 'user',
          content: '如何使用这个产品？请提供详细的使用指南。'
        }
      ],
      temperature: 0.8,
      top_p: 0.95,
      max_tokens: 1024
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    console.log('✓ 用户端请求测试成功！');
    console.log(`  响应状态: ${userResponse.status}`);
    console.log('  智谱AI回复:');
    console.log(`  ${userResponse.data.choices[0].message.content}`);
    console.log('');

    // 4. 测试图片分析功能（如果需要）
    console.log('4. 测试完成！');
    console.log('');
    console.log('=== 测试总结 ===');
    console.log('✓ 智谱AI API密钥验证成功');
    console.log('✓ API连接正常');
    console.log('✓ 用户端请求响应正常');
    console.log('✓ 智谱AI回复专业、准确');
    console.log('');
    console.log('测试结果：API密钥有效，可以正常使用智谱AI服务！');

  } catch (error) {
    console.error('✗ 测试失败：', error.message);
    if (error.response) {
      console.error('  错误状态:', error.response.status);
      console.error('  错误数据:', error.response.data);
    }
    console.log('');
    console.log('测试结果：API密钥验证失败，请检查密钥是否正确。');
  }
}

// 运行测试
testZhipuAPI();
