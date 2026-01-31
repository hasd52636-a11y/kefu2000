import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { PRODUCT_USAGE_STATS, MONTHLY_TREND, COMMON_QUESTIONS, KNOWLEDGE_BASE_STATS, Icons } from '../constants';
import { useLocale } from '../contexts/LocaleContext';
import { analyticsService } from '../services/analyticsService';

const Stats: React.FC = () => {
  const { t } = useLocale();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ['#8B5CF6', '#D4AF37', '#10B981', '#3B82F6', '#F59E0B'];

  // 加载分析报告
  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // 使用异步方法获取报告（测试AI分析功能）
        console.log('开始加载AI分析报告...');
        const reportData = await analyticsService.generateReport();
        console.log('AI分析报告加载成功:', reportData);
        setReport(reportData);
      } catch (err) {
        console.error('Failed to load report:', err);
        setError('加载分析报告失败，使用默认数据');
        // 使用默认数据
        const totalQueries = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.totalQueries, 0);
        const totalSolved = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.solvedQueries, 0);
        const avgSatisfaction = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.satisfaction, 0) / PRODUCT_USAGE_STATS.length;
        const totalOcr = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.ocrUsage, 0);
        const totalKnowledge = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.knowledgeUsage, 0);
        
        setReport({
          overallStats: {
            totalQueries,
            totalSolved,
            resolutionRate: Math.round((totalSolved / totalQueries) * 100),
            avgSatisfaction: Math.round(avgSatisfaction),
            totalOcr,
            totalKnowledge
          },
          aiInsights: {
            performance: [
              `对话解决率达到 ${Math.round((totalSolved / totalQueries) * 100)}%，系统表现良好`,
              `用户满意度稳定在 ${Math.round(avgSatisfaction)}%，服务质量较高`,
              `知识库使用率正常，用户依赖度适中`,
              `OCR 功能使用频率合理`
            ],
            recommendations: [
              '增加常见问题的知识库文档覆盖',
              '优化知识库搜索算法，提高响应速度',
              '针对高频问题创建详细的图文指南',
              '增加视频教程，提高用户理解度',
              '定期更新知识库内容，确保信息准确性'
            ]
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, []);

  // 计算总体统计
  const getOverallStats = () => {
    if (report?.overallStats) {
      return report.overallStats;
    }
    // 默认统计数据
    const totalQueries = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.totalQueries, 0);
    const totalSolved = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.solvedQueries, 0);
    const avgSatisfaction = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.satisfaction, 0) / PRODUCT_USAGE_STATS.length;
    const totalOcr = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.ocrUsage, 0);
    const totalKnowledge = PRODUCT_USAGE_STATS.reduce((sum, product) => sum + product.knowledgeUsage, 0);

    return {
      totalQueries,
      totalSolved,
      resolutionRate: Math.round((totalSolved / totalQueries) * 100),
      avgSatisfaction: Math.round(avgSatisfaction),
      totalOcr,
      totalKnowledge
    };
  };

  const overallStats = getOverallStats();

  return (
    <div className="space-y-12 animate-slide-in pb-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
             <div className="w-2 h-10 bg-[#D4AF37] rounded-full shadow-[0_0_10px_var(--gold-glow)]"></div>
             <h1 className="text-5xl font-black tracking-tighter text-[#1E293B]">
              {t.stats.title} <span className="text-[#D4AF37]">Analytics</span>
            </h1>
          </div>
          <p className="text-gray-400 font-bold text-xl ml-6">深度分析报告与数据洞察</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex space-x-2 bg-white p-2 rounded-2xl border-2 border-[#D4AF37]/20">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-xl font-black text-xs transition-all ${
                  timeRange === range ? 'bg-[#D4AF37] text-white shadow-lg' : 'text-gray-400 hover:text-[#D4AF37]'
                }`}
              >
                {range === 'week' ? '周' : range === 'month' ? '月' : '年'}
              </button>
            ))}
          </div>
          <button className="btn-base btn-primary px-8 py-4 text-xs">
            <Icons.Download className="w-5 h-5 mr-2" />
            导出报告
          </button>
        </div>
      </div>

      <div className="gold-divider opacity-30"></div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="premium-card p-8 border-[#D4AF37]/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Icons.Analytics className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">总对话数</p>
              <h3 className="text-3xl font-black text-[#1E293B]">{overallStats.totalQueries}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-500">+12% 较上月</span>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{ value: 60 }, { value: 80 }, { value: 70 }, { value: 90 }, { value: 100 }]}>
                  <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="premium-card p-8 border-[#D4AF37]/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Icons.CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">解决率</p>
              <h3 className="text-3xl font-black text-[#1E293B]">{overallStats.resolutionRate}%</h3>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-500">+2% 较上月</span>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{ value: 85 }, { value: 88 }, { value: 90 }, { value: 92 }, { value: 94 }]}>
                  <Line type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="premium-card p-8 border-[#D4AF37]/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Icons.Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">满意度</p>
              <h3 className="text-3xl font-black text-[#1E293B]">{overallStats.avgSatisfaction}%</h3>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-500">+1% 较上月</span>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{ value: 90 }, { value: 92 }, { value: 93 }, { value: 94 }, { value: 95 }]}>
                  <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="premium-card p-8 border-[#D4AF37]/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Icons.Knowledge className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">知识库使用</p>
              <h3 className="text-3xl font-black text-[#1E293B]">{overallStats.totalKnowledge}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-500">+18% 较上月</span>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{ value: 40 }, { value: 55 }, { value: 65 }, { value: 80 }, { value: 95 }]}>
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="premium-card p-10 border-[#D4AF37]/30">
        <h2 className="text-2xl font-black text-[#1E293B] mb-8">月度趋势分析</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '2px solid #D4AF37', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="activeUsers" stroke="#8B5CF6" strokeWidth={3} name="活跃用户" />
              <Line type="monotone" dataKey="queries" stroke="#D4AF37" strokeWidth={3} name="对话数" />
              <Line type="monotone" dataKey="satisfaction" stroke="#10B981" strokeWidth={3} name="满意度" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Usage and Common Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Usage */}
        <div className="premium-card p-10 border-[#D4AF37]/30">
          <h2 className="text-2xl font-black text-[#1E293B] mb-8">产品使用分析</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRODUCT_USAGE_STATS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis type="category" dataKey="name" stroke="#64748b" width={150} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '2px solid #D4AF37', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="totalQueries" name="总对话数" fill="#8B5CF6" />
                <Bar dataKey="solvedQueries" name="已解决" fill="#10B981" />
                <Bar dataKey="satisfaction" name="满意度" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Common Questions */}
        <div className="premium-card p-10 border-[#D4AF37]/30">
          <h2 className="text-2xl font-black text-[#1E293B] mb-8">常见问题分析</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COMMON_QUESTIONS}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="frequency"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {COMMON_QUESTIONS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '2px solid #D4AF37', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Knowledge Base Stats */}
      <div className="premium-card p-10 border-[#D4AF37]/30">
        <h2 className="text-2xl font-black text-[#1E293B] mb-8">知识库使用统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-2xl">
                <p className="text-sm font-bold text-gray-400 mb-2">总文档数</p>
                <h3 className="text-4xl font-black text-[#1E293B]">{KNOWLEDGE_BASE_STATS.totalDocuments}</h3>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl">
                <p className="text-sm font-bold text-gray-400 mb-2">已向量化文档</p>
                <h3 className="text-4xl font-black text-[#1E293B]">{KNOWLEDGE_BASE_STATS.vectorizedDocuments}</h3>
                <p className="text-sm font-bold text-emerald-500 mt-2">
                  {Math.round((KNOWLEDGE_BASE_STATS.vectorizedDocuments / KNOWLEDGE_BASE_STATS.totalDocuments) * 100)}% 完成
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl">
                <p className="text-sm font-bold text-gray-400 mb-2">搜索次数</p>
                <h3 className="text-4xl font-black text-[#1E293B]">{KNOWLEDGE_BASE_STATS.searchCount}</h3>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl">
                <p className="text-sm font-bold text-gray-400 mb-2">平均搜索时间</p>
                <h3 className="text-4xl font-black text-[#1E293B]">{KNOWLEDGE_BASE_STATS.averageSearchTime}s</h3>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="p-6 bg-gray-50 rounded-2xl h-full">
              <h3 className="text-xl font-bold text-[#1E293B] mb-4">最受欢迎文档</h3>
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h4 className="text-lg font-bold text-purple-600 mb-2">{KNOWLEDGE_BASE_STATS.mostPopularDocument}</h4>
                <p className="text-gray-600">
                  该文档包含了虚拟客服的完整使用说明，是用户最常访问的知识库文档。
                  内容涵盖了系统概述、核心功能、技术栈、用户端功能说明、商家端功能说明等详细信息。
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#1E293B] mb-4">最常搜索关键词</h3>
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                    {KNOWLEDGE_BASE_STATS.mostSearchedKeyword}
                  </div>
                  <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    设备重置
                  </div>
                  <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    固件更新
                  </div>
                  <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                    添加设备
                  </div>
                  <div className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                    智能场景
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="premium-card p-10 border-[#D4AF37]/30">
        <h2 className="text-2xl font-black text-[#1E293B] mb-8">AI 分析洞察</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
            <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              <Icons.Brain className="w-6 h-6" />
              系统性能洞察
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">对话解决率达到 {overallStats.resolutionRate}%，高于行业平均水平 15%</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">知识库使用率提升 18%，表明用户越来越依赖自助服务</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">OCR 功能使用频率增长 24%，图像识别需求显著增加</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">用户满意度稳定在 {overallStats.avgSatisfaction}%，系统表现良好</p>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100">
            <h3 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">
              <Icons.Lightbulb className="w-6 h-6" />
              改进建议
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">增加 "如何连接WiFi" 相关的知识库文档，满足高频需求</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">优化知识库搜索算法，提高搜索响应速度</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">针对设备重置流程，创建更详细的图文指南</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">增加视频教程，提高用户理解度和解决率</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;