
import React from 'react';
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '智能变频空调 Pro',
    model: 'AC-2024-X',
    description: '搭载AI算法的高效节能空调，支持智能诊断、远程控制及OTA更新。',
    category: '家用电器',
    status: 'active',
    updatedAt: '2024-05-20',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=smartguide-p1',
    documents: [
      { id: 'd1', name: 'AC-2024-X 安装手册.pdf', size: '2.4MB', type: 'pdf', uploadDate: '2024-01-10' },
      { id: 'd2', name: '常见故障排查指南 v2.0.docx', size: '1.1MB', type: 'docx', uploadDate: '2024-03-15' }
    ]
  },
  {
    id: 'p2',
    name: '全自动智能咖啡机',
    model: 'CM-ESPRESSO-01',
    description: '商用级压力泵，多级研磨，支持语音交互及个性化配方定制。',
    category: '厨电',
    status: 'active',
    updatedAt: '2024-05-18',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=smartguide-p2',
    documents: [
      { id: 'd3', name: '全自动咖啡机操作手册.pdf', size: '3.8MB', type: 'pdf', uploadDate: '2024-02-12' }
    ]
  },
  {
    id: 'p3',
    name: '户外便携储能电源',
    model: 'PP-1000W-SOLAR',
    description: '1000Wh大容量，支持太阳能快充、多种接口输出及手机App监控。',
    category: '数码配件',
    status: 'draft',
    updatedAt: '2024-05-15',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=smartguide-p3',
    documents: []
  }
];

export const MOCK_STATS = [
  { name: '周一', visits: 400, queries: 240, ocr: 50, knowledge: 30 },
  { name: '周二', visits: 300, queries: 280, ocr: 60, knowledge: 40 },
  { name: '周三', visits: 350, queries: 139, ocr: 45, knowledge: 25 },
  { name: '周四', visits: 278, queries: 320, ocr: 70, knowledge: 50 },
  { name: '周五', visits: 340, queries: 290, ocr: 65, knowledge: 45 },
  { name: '周六', visits: 380, queries: 380, ocr: 80, knowledge: 60 },
  { name: '周日', visits: 400, queries: 340, ocr: 75, knowledge: 55 },
];

// 产品使用统计数据
export const PRODUCT_USAGE_STATS = [
  { productId: 'p1', name: '智能变频空调 Pro', totalQueries: 120, solvedQueries: 115, satisfaction: 96, ocrUsage: 35, knowledgeUsage: 85 },
  { productId: 'p2', name: '全自动智能咖啡机', totalQueries: 85, solvedQueries: 80, satisfaction: 94, ocrUsage: 25, knowledgeUsage: 60 },
  { productId: 'p3', name: '户外便携储能电源', totalQueries: 45, solvedQueries: 42, satisfaction: 93, ocrUsage: 15, knowledgeUsage: 30 },
];

// 月度趋势数据
export const MONTHLY_TREND = [
  { month: '1月', totalUsers: 1200, activeUsers: 850, queries: 3200, satisfaction: 94 },
  { month: '2月', totalUsers: 1350, activeUsers: 920, queries: 3600, satisfaction: 95 },
  { month: '3月', totalUsers: 1500, activeUsers: 1050, queries: 4200, satisfaction: 96 },
  { month: '4月', totalUsers: 1650, activeUsers: 1180, queries: 4800, satisfaction: 95 },
  { month: '5月', totalUsers: 1800, activeUsers: 1320, queries: 5400, satisfaction: 97 },
  { month: '6月', totalUsers: 2000, activeUsers: 1480, queries: 6200, satisfaction: 96 },
];

// 常见问题统计
export const COMMON_QUESTIONS = [
  { id: 'q1', question: '如何连接WiFi', frequency: 45, category: '网络设置' },
  { id: 'q2', question: '如何重置设备', frequency: 38, category: '设备管理' },
  { id: 'q3', question: '如何更新固件', frequency: 32, category: '系统更新' },
  { id: 'q4', question: '如何添加新设备', frequency: 28, category: '设备管理' },
  { id: 'q5', question: '如何设置智能场景', frequency: 25, category: '场景设置' },
];

// 知识库使用统计
export const KNOWLEDGE_BASE_STATS = {
  totalDocuments: 128,
  vectorizedDocuments: 112,
  searchCount: 850,
  averageSearchTime: 0.8,
  mostPopularDocument: '虚拟客服小百科',
  mostSearchedKeyword: '连接WiFi',
};

export const Icons = {
  Dashboard: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  ),
  Products: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
  ),
  Analytics: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 01-2 2h2a2 2 0 012-2zm0 0h6v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4zm0 0h6a2 2 0 012 2h-2a2 2 0 01-2-2zm3.374-12.94A1 1 0 0113 3.07a1 1 0 011 1.03l-1 5a1 1 0 01-2 0l1-5z" /></svg>
  ),
  Settings: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
  Knowledge: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  ),
  Search: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
  ),
  Logo: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Send: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
  ),
  Close: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
  ),
  Microphone: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
  ),
  Image: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ),
  Download: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ),
  Brain: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
  ),
  Lightbulb: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ),
  CheckCircle: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  Heart: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  )
};
