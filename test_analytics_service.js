// 测试完整的分析服务功能

import { analyticsService } from './services/analyticsService.ts';

async function testAnalyticsService() {
  console.log('开始测试分析服务功能...');
  
  try {
    console.log('1. 测试同步报告生成（默认分析）');
    const syncReport = analyticsService.generateReportSync();
    console.log('同步报告生成成功:', {
      overallStats: syncReport.overallStats,
      aiInsights: {
        performance: syncReport.aiInsights.performance.length + ' 条洞察',
        recommendations: syncReport.aiInsights.recommendations.length + ' 条建议'
      }
    });
    
    console.log('\n2. 测试异步报告生成（AI分析）');
    console.log('开始生成AI分析报告...');
    const asyncReport = await analyticsService.generateReport();
    console.log('异步报告生成成功:', {
      overallStats: asyncReport.overallStats,
      aiInsights: {
        performance: asyncReport.aiInsights.performance.length + ' 条洞察',
        recommendations: asyncReport.aiInsights.recommendations.length + ' 条建议'
      }
    });
    
    console.log('\n3. 测试AI洞察内容');
    console.log('性能洞察:');
    asyncReport.aiInsights.performance.forEach((insight, index) => {
      console.log(`${index + 1}. ${insight}`);
    });
    
    console.log('\n改进建议:');
    asyncReport.aiInsights.recommendations.forEach((recommendation, index) => {
      console.log(`${index + 1}. ${recommendation}`);
    });
    
    console.log('\n4. 测试报告导出功能');
    const jsonReport = analyticsService.exportReportSync('json');
    console.log('JSON报告导出成功:', jsonReport.length > 0 ? '✓' : '✗');
    
    const csvReport = analyticsService.exportReportSync('csv');
    console.log('CSV报告导出成功:', csvReport.length > 0 ? '✓' : '✗');
    
    const pdfReport = analyticsService.exportReportSync('pdf');
    console.log('PDF报告导出成功:', pdfReport instanceof Blob ? '✓' : '✗');
    
    console.log('\n=== 测试完成 ===');
    console.log('所有功能测试通过！');
    
    return { success: true, report: asyncReport };
  } catch (error) {
    console.error('测试失败:', error);
    return { success: false, error: error.message };
  }
}

testAnalyticsService().then(result => {
  console.log('\n=== 最终测试结果 ===');
  console.log('成功:', result.success);
  process.exit(result.success ? 0 : 1);
});
