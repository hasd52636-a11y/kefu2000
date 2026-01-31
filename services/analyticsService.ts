// analyticsService.ts
// 实现数据收集和分析功能

import { PRODUCT_USAGE_STATS, MONTHLY_TREND, COMMON_QUESTIONS, KNOWLEDGE_BASE_STATS } from '../constants';
import { getZhipuAI } from './zhipuService';
import { getGeminiResponse } from './geminiService';

// 定义数据类型
export interface SystemUsageData {
  timestamp: number;
  userId: string;
  action: 'chat' | 'ocr' | 'knowledge' | 'search' | 'preview';
  productId?: string;
  duration?: number;
  success: boolean;
  errorMessage?: string;
}

export interface AnalyticsReport {
  overallStats: {
    totalQueries: number;
    totalSolved: number;
    resolutionRate: number;
    avgSatisfaction: number;
    totalOcr: number;
    totalKnowledge: number;
  };
  productStats: typeof PRODUCT_USAGE_STATS;
  monthlyTrend: typeof MONTHLY_TREND;
  commonQuestions: typeof COMMON_QUESTIONS;
  knowledgeBaseStats: typeof KNOWLEDGE_BASE_STATS;
  aiInsights: {
    performance: string[];
    recommendations: string[];
  };
  generatedAt: number;
}

class AnalyticsService {
  private usageData: SystemUsageData[] = [];
  private storageKey = 'smartguide_analytics_data';

  constructor() {
    this.loadData();
  }

  // 加载存储的数据
  private loadData(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.usageData = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      this.usageData = [];
    }
  }

  // 保存数据到本地存储
  private saveData(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.usageData));
    } catch (error) {
      console.error('Failed to save analytics data:', error);
    }
  }

  // 收集系统使用数据
  trackUsage(data: SystemUsageData): void {
    this.usageData.push({
      ...data,
      timestamp: data.timestamp || Date.now()
    });
    this.saveData();
  }

  // 收集对话数据
  trackChat(userId: string, productId?: string, duration?: number, success: boolean = true, errorMessage?: string): void {
    this.trackUsage({
      timestamp: Date.now(),
      userId,
      action: 'chat',
      productId,
      duration,
      success,
      errorMessage
    });
  }

  // 收集OCR使用数据
  trackOcr(userId: string, productId?: string, success: boolean = true, errorMessage?: string): void {
    this.trackUsage({
      timestamp: Date.now(),
      userId,
      action: 'ocr',
      productId,
      success,
      errorMessage
    });
  }

  // 收集知识库使用数据
  trackKnowledge(userId: string, productId?: string, success: boolean = true, errorMessage?: string): void {
    this.trackUsage({
      timestamp: Date.now(),
      userId,
      action: 'knowledge',
      productId,
      success,
      errorMessage
    });
  }

  // 收集搜索使用数据
  trackSearch(userId: string, productId?: string, success: boolean = true, errorMessage?: string): void {
    this.trackUsage({
      timestamp: Date.now(),
      userId,
      action: 'search',
      productId,
      success,
      errorMessage
    });
  }

  // 收集预览使用数据
  trackPreview(userId: string, productId?: string, success: boolean = true, errorMessage?: string): void {
    this.trackUsage({
      timestamp: Date.now(),
      userId,
      action: 'preview',
      productId,
      success,
      errorMessage
    });
  }

  // 生成分析报告
  async generateReport(): Promise<AnalyticsReport> {
    // 计算总体统计
    const totalQueries = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.totalQueries, 0);
    const totalSolved = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.solvedQueries, 0);
    const avgSatisfaction = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.satisfaction, 0) / PRODUCT_USAGE_STATS.length;
    const totalOcr = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.ocrUsage, 0);
    const totalKnowledge = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.knowledgeUsage, 0);

    // 生成AI洞察（使用异步AI调用）
    const aiInsights = await this.generateAIInsights({
      totalQueries,
      totalSolved,
      resolutionRate: Math.round((totalSolved / totalQueries) * 100),
      avgSatisfaction: Math.round(avgSatisfaction),
      totalOcr,
      totalKnowledge
    });

    return {
      overallStats: {
        totalQueries,
        totalSolved,
        resolutionRate: Math.round((totalSolved / totalQueries) * 100),
        avgSatisfaction: Math.round(avgSatisfaction),
        totalOcr,
        totalKnowledge
      },
      productStats: PRODUCT_USAGE_STATS,
      monthlyTrend: MONTHLY_TREND,
      commonQuestions: COMMON_QUESTIONS,
      knowledgeBaseStats: KNOWLEDGE_BASE_STATS,
      aiInsights,
      generatedAt: Date.now()
    };
  }

  // 同步生成分析报告（用于不需要AI分析的场景）
  generateReportSync(): AnalyticsReport {
    // 计算总体统计
    const totalQueries = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.totalQueries, 0);
    const totalSolved = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.solvedQueries, 0);
    const avgSatisfaction = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.satisfaction, 0) / PRODUCT_USAGE_STATS.length;
    const totalOcr = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.ocrUsage, 0);
    const totalKnowledge = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.knowledgeUsage, 0);

    // 使用默认AI洞察
    const aiInsights = this.getDefaultAIInsights({
      totalQueries,
      totalSolved,
      resolutionRate: Math.round((totalSolved / totalQueries) * 100),
      avgSatisfaction: Math.round(avgSatisfaction),
      totalOcr,
      totalKnowledge
    });

    return {
      overallStats: {
        totalQueries,
        totalSolved,
        resolutionRate: Math.round((totalSolved / totalQueries) * 100),
        avgSatisfaction: Math.round(avgSatisfaction),
        totalOcr,
        totalKnowledge
      },
      productStats: PRODUCT_USAGE_STATS,
      monthlyTrend: MONTHLY_TREND,
      commonQuestions: COMMON_QUESTIONS,
      knowledgeBaseStats: KNOWLEDGE_BASE_STATS,
      aiInsights,
      generatedAt: Date.now()
    };
  }

  // 生成AI洞察
  private async generateAIInsights(stats: {
    totalQueries: number;
    totalSolved: number;
    resolutionRate: number;
    avgSatisfaction: number;
    totalOcr: number;
    totalKnowledge: number;
  }): Promise<{
    performance: string[];
    recommendations: string[];
  }> {
    try {
      // 准备分析数据
      const analysisData = {
        systemStats: stats,
        mostCommonQuestion: COMMON_QUESTIONS.sort((a, b) => b.frequency - a.frequency)[0],
        knowledgeBaseStats: KNOWLEDGE_BASE_STATS,
        productStats: PRODUCT_USAGE_STATS
      };

      // 构建分析提示
      const prompt = `
你是一位专业的系统分析师，请根据以下数据生成详细的系统性能洞察和改进建议：

## 系统统计数据
- 总对话数：${stats.totalQueries}
- 已解决对话：${stats.totalSolved}
- 解决率：${stats.resolutionRate}%
- 平均满意度：${stats.avgSatisfaction}%
- OCR使用次数：${stats.totalOcr}
- 知识库使用次数：${stats.totalKnowledge}

## 知识库统计
- 总文档数：${KNOWLEDGE_BASE_STATS.totalDocuments}
- 已向量化文档：${KNOWLEDGE_BASE_STATS.vectorizedDocuments}
- 搜索次数：${KNOWLEDGE_BASE_STATS.searchCount}
- 最常搜索关键词：${KNOWLEDGE_BASE_STATS.mostSearchedKeyword}
- 最受欢迎文档：${KNOWLEDGE_BASE_STATS.mostPopularDocument}

## 最常见问题
- 问题：${analysisData.mostCommonQuestion?.question}
- 频率：${analysisData.mostCommonQuestion?.frequency}
- 类别：${analysisData.mostCommonQuestion?.category}

请生成：
1. 系统性能洞察：基于数据分析系统的表现，指出优点和不足
2. 改进建议：具体、可操作的改进措施，优先解决高频问题

请以JSON格式返回，结构如下：
{
  "performance": ["洞察1", "洞察2", ...],
  "recommendations": ["建议1", "建议2", ...]
}
      `;

      // 尝试使用智谱AI模型
      try {
        const zhipuAI = getZhipuAI('glm-4.7');
        const content = await zhipuAI.chat([
          {
            role: 'user',
            content: prompt
          }
        ]);

        // 解析智谱AI响应
        console.log('智谱AI响应内容:', content);
        
        // 尝试解析JSON响应
        let parsedResponse;
        try {
          // 智谱AI返回的是content字符串
          parsedResponse = JSON.parse(content);
          console.log('智谱AI分析结果:', parsedResponse);
          return parsedResponse;
        } catch (parseError) {
          console.log('JSON解析失败，使用默认分析:', parseError);
          // JSON解析失败，使用默认分析
          return this.getDefaultAIInsights(stats);
        }
      } catch (zhipuError) {
        console.log('智谱AI调用失败，使用默认分析:', zhipuError);
        // 智谱AI调用失败，使用默认分析
        return this.getDefaultAIInsights(stats);
      }
    } catch (error) {
      console.error('AI分析失败，使用默认分析:', error);
      // 使用默认分析逻辑
      return this.getDefaultAIInsights(stats);
    }
  }

  // 默认AI洞察（当AI模型不可用时使用）
  private getDefaultAIInsights(stats: {
    totalQueries: number;
    totalSolved: number;
    resolutionRate: number;
    avgSatisfaction: number;
    totalOcr: number;
    totalKnowledge: number;
  }): {
    performance: string[];
    recommendations: string[];
  } {
    const performance: string[] = [];
    const recommendations: string[] = [];

    // 性能洞察
    if (stats.resolutionRate > 90) {
      performance.push(`对话解决率达到 ${stats.resolutionRate}%，高于行业平均水平 15%`);
    } else {
      performance.push(`对话解决率为 ${stats.resolutionRate}%，低于行业平均水平，需要优化`);
    }

    if (stats.avgSatisfaction > 90) {
      performance.push(`用户满意度稳定在 ${stats.avgSatisfaction}%，系统表现良好`);
    } else {
      performance.push(`用户满意度为 ${stats.avgSatisfaction}%，需要提高服务质量`);
    }

    if (stats.totalKnowledge > stats.totalQueries * 0.5) {
      performance.push(`知识库使用率较高，表明用户越来越依赖自助服务`);
    } else {
      performance.push(`知识库使用率较低，需要提高知识库的覆盖范围和质量`);
    }

    if (stats.totalOcr > stats.totalQueries * 0.1) {
      performance.push(`OCR 功能使用频率较高，图像识别需求显著`);
    }

    // 改进建议
    const mostCommonQuestion = COMMON_QUESTIONS.sort((a, b) => b.frequency - a.frequency)[0];
    if (mostCommonQuestion) {
      recommendations.push(`增加 "${mostCommonQuestion.question}" 相关的知识库文档，满足高频需求`);
    }

    recommendations.push(`优化知识库搜索算法，提高搜索响应速度`);
    recommendations.push(`针对设备重置流程，创建更详细的图文指南`);
    recommendations.push(`增加视频教程，提高用户理解度和解决率`);
    recommendations.push(`定期更新知识库内容，确保信息的准确性和时效性`);
    recommendations.push(`分析用户反馈，持续优化系统功能`);

    return {
      performance,
      recommendations
    };
  }

  // 导出分析报告
  async exportReport(format: 'json' | 'csv' | 'pdf' = 'json'): Promise<string | Blob> {
    const report = await this.generateReport();

    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'csv':
        return this.generateCSVReport(report);
      case 'pdf':
        return this.generatePDFReport(report);
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  // 同步导出分析报告（使用默认AI洞察）
  exportReportSync(format: 'json' | 'csv' | 'pdf' = 'json'): string | Blob {
    const report = this.generateReportSync();

    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'csv':
        return this.generateCSVReport(report);
      case 'pdf':
        return this.generatePDFReport(report);
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  // 生成CSV报告
  private generateCSVReport(report: AnalyticsReport): string {
    let csv = '指标,数值\n';
    
    // 总体统计
    csv += `总对话数,${report.overallStats.totalQueries}\n`;
    csv += `已解决对话,${report.overallStats.totalSolved}\n`;
    csv += `解决率,${report.overallStats.resolutionRate}%\n`;
    csv += `平均满意度,${report.overallStats.avgSatisfaction}%\n`;
    csv += `OCR使用次数,${report.overallStats.totalOcr}\n`;
    csv += `知识库使用次数,${report.overallStats.totalKnowledge}\n`;
    csv += '\n';

    // 产品统计
    csv += '产品名称,总对话数,已解决对话,满意度\n';
    report.productStats.forEach(product => {
      csv += `${product.name},${product.totalQueries},${product.solvedQueries},${product.satisfaction}%\n`;
    });
    csv += '\n';

    // 常见问题
    csv += '问题,频率,类别\n';
    report.commonQuestions.forEach(question => {
      csv += `${question.question},${question.frequency},${question.category}\n`;
    });

    return csv;
  }

  // 生成PDF报告
  private generatePDFReport(report: AnalyticsReport): Blob {
    // 这里只是一个模拟实现
    // 实际项目中可以使用PDF生成库
    const html = `
      <html>
        <head>
          <title>系统分析报告</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2, h3 { color: #333; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .stats { margin: 20px 0; }
            .insight { background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #8B5CF6; }
          </style>
        </head>
        <body>
          <h1>系统分析报告</h1>
          <p>生成时间: ${new Date(report.generatedAt).toLocaleString()}</p>
          
          <h2>总体统计</h2>
          <div class="stats">
            <p>总对话数: ${report.overallStats.totalQueries}</p>
            <p>已解决对话: ${report.overallStats.totalSolved}</p>
            <p>解决率: ${report.overallStats.resolutionRate}%</p>
            <p>平均满意度: ${report.overallStats.avgSatisfaction}%</p>
            <p>OCR使用次数: ${report.overallStats.totalOcr}</p>
            <p>知识库使用次数: ${report.overallStats.totalKnowledge}</p>
          </div>
          
          <h2>产品使用统计</h2>
          <table>
            <tr>
              <th>产品名称</th>
              <th>总对话数</th>
              <th>已解决对话</th>
              <th>满意度</th>
            </tr>
            ${report.productStats.map(product => `
              <tr>
                <td>${product.name}</td>
                <td>${product.totalQueries}</td>
                <td>${product.solvedQueries}</td>
                <td>${product.satisfaction}%</td>
              </tr>
            `).join('')}
          </table>
          
          <h2>AI 分析洞察</h2>
          <h3>系统性能洞察</h3>
          ${report.aiInsights.performance.map(insight => `
            <div class="insight">${insight}</div>
          `).join('')}
          
          <h3>改进建议</h3>
          ${report.aiInsights.recommendations.map(recommendation => `
            <div class="insight">${recommendation}</div>
          `).join('')}
        </body>
      </html>
    `;

    return new Blob([html], { type: 'text/html' });
  }

  // 清除所有数据
  clearData(): void {
    this.usageData = [];
    localStorage.removeItem(this.storageKey);
  }

  // 获取数据量
  getDataCount(): number {
    return this.usageData.length;
  }

  // 获取最近的使用数据
  getRecentData(days: number = 7): SystemUsageData[] {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.usageData.filter(data => data.timestamp >= cutoffTime);
  }

  // 分析用户行为
  analyzeUserBehavior(userId: string): {
    totalActions: number;
    actionBreakdown: Record<string, number>;
    avgSessionDuration: number;
    successRate: number;
  } {
    const userData = this.usageData.filter(data => data.userId === userId);
    const totalActions = userData.length;
    
    const actionBreakdown = userData.reduce((acc, data) => {
      acc[data.action] = (acc[data.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalDuration = userData.reduce((sum, data) => sum + (data.duration || 0), 0);
    const avgSessionDuration = totalActions > 0 ? totalDuration / totalActions : 0;

    const successfulActions = userData.filter(data => data.success).length;
    const successRate = totalActions > 0 ? (successfulActions / totalActions) * 100 : 0;

    return {
      totalActions,
      actionBreakdown,
      avgSessionDuration,
      successRate
    };
  }
}

// 导出单例实例
export const analyticsService = new AnalyticsService();
export default AnalyticsService;