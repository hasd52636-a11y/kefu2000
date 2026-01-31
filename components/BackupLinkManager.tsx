import React, { useState, useEffect } from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface BackupLink {
  id: string;
  url: string;
  createdAt: Date;
  lastUsed: Date | null;
  useCount: number;
}

const BackupLinkManager: React.FC = () => {
  const { t } = useLocale();
  const [backupLinks, setBackupLinks] = useState<BackupLink[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);

  // 生成复杂的长链接
  const generateComplexLink = (projectId: string, linkId: string): string => {
    const baseUrl = window.location.origin;
    const randomParams = {
      // 随机字符串参数
      r: Math.random().toString(36).substring(2, 15),
      // 时间戳参数
      ts: Date.now().toString(36),
      // 哈希参数
      h: btoa(`${projectId}_${linkId}_${Date.now()}`).substring(0, 20),
      // 随机数字参数
      n: Math.floor(Math.random() * 1000000).toString(),
      // 字母混合参数
      s: Array.from({ length: 10 }, () => Math.random().toString(36)[2]).join('')
    };

    const paramsString = new URLSearchParams(randomParams).toString();
    return `${baseUrl}/#/view/${projectId}?${paramsString}`;
  };

  // 生成100个备用链接
  const generateBackupLinks = (projectId: string) => {
    setIsGenerating(true);
    
    const links: BackupLink[] = [];
    for (let i = 0; i < 100; i++) {
      const linkId = `link_${i}_${Date.now()}`;
      links.push({
        id: linkId,
        url: generateComplexLink(projectId, linkId),
        createdAt: new Date(),
        lastUsed: null,
        useCount: 0
      });
    }

    setBackupLinks(links);
    // 保存到localStorage
    localStorage.setItem(`backup_links_${projectId}`, JSON.stringify(links));
    setIsGenerating(false);
  };

  // 获取下一个备用链接（循环使用）
  const getNextBackupLink = (projectId: string): string => {
    const storedLinks = localStorage.getItem(`backup_links_${projectId}`);
    let links: BackupLink[] = [];
    
    if (storedLinks) {
      links = JSON.parse(storedLinks);
    } else {
      // 如果没有链接，生成新的
      links = [];
      for (let i = 0; i < 100; i++) {
        const linkId = `link_${i}_${Date.now()}`;
        links.push({
          id: linkId,
          url: generateComplexLink(projectId, linkId),
          createdAt: new Date(),
          lastUsed: null,
          useCount: 0
        });
      }
      localStorage.setItem(`backup_links_${projectId}`, JSON.stringify(links));
    }

    // 循环使用链接
    const currentIndex = currentLinkIndex % links.length;
    const selectedLink = links[currentIndex];
    
    // 更新链接使用信息
    selectedLink.lastUsed = new Date();
    selectedLink.useCount++;
    localStorage.setItem(`backup_links_${projectId}`, JSON.stringify(links));
    
    // 更新当前索引
    setCurrentLinkIndex(currentIndex + 1);
    
    return selectedLink.url;
  };

  // 加载项目的备用链接
  const loadBackupLinks = (projectId: string) => {
    const storedLinks = localStorage.getItem(`backup_links_${projectId}`);
    if (storedLinks) {
      setBackupLinks(JSON.parse(storedLinks));
    }
  };

  // 测试链接是否可用
  const testLink = (url: string) => {
    // 这里可以实现链接测试逻辑
    console.log('Testing link:', url);
    // 可以通过fetch或其他方式测试链接是否可用
  };

  // 导出链接
  const exportLinks = () => {
    const linksJson = JSON.stringify(backupLinks, null, 2);
    const blob = new Blob([linksJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_links.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 导入链接
  const importLinks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const links = JSON.parse(event.target?.result as string);
          setBackupLinks(links);
          // 保存到localStorage
          // 注意：这里需要知道项目ID才能正确保存
          // 实际使用时需要传入项目ID
        } catch (error) {
          console.error('Failed to import links:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-[#1E293B] mb-4">
          备用链接管理
        </h3>
        <p className="text-gray-500 mb-6">
          生成和管理100个复杂的长链接，用于循环使用避免被屏蔽
        </p>

        {/* 链接生成 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="输入项目ID"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              id="projectIdInput"
            />
            <button
              onClick={() => {
                const projectId = (document.getElementById('projectIdInput') as HTMLInputElement).value;
                if (projectId) {
                  generateBackupLinks(projectId);
                }
              }}
              disabled={isGenerating}
              className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C09B30] disabled:bg-gray-400 transition-colors"
            >
              {isGenerating ? '生成中...' : '生成100个链接'}
            </button>
            <button
              onClick={() => {
                const projectId = (document.getElementById('projectIdInput') as HTMLInputElement).value;
                if (projectId) {
                  loadBackupLinks(projectId);
                }
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              加载链接
            </button>
          </div>
        </div>

        {/* 链接列表 */}
        {backupLinks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-700">
                备用链接列表 ({backupLinks.length}/100)
              </h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportLinks}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  导出
                </button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importLinks}
                  className="hidden"
                  id="importLinksInput"
                />
                <button
                  onClick={() => document.getElementById('importLinksInput')?.click()}
                  className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  导入
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      链接
                    </th>
                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最后使用
                    </th>
                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      使用次数
                    </th>
                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {backupLinks.slice(0, 10).map((link) => (
                    <tr key={link.id}>
                      <td className="py-2 px-4 border-b text-sm text-gray-900">
                        {link.id.substring(0, 10)}...
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {link.url}
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-500">
                        {new Date(link.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-500">
                        {link.lastUsed ? new Date(link.lastUsed).toLocaleString() : '未使用'}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-500">
                        {link.useCount}
                      </td>
                      <td className="py-2 px-4 border-b text-sm">
                        <button
                          onClick={() => testLink(link.url)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          测试
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {backupLinks.length > 10 && (
              <p className="text-sm text-gray-500 text-center">
                显示前10个链接，共 {backupLinks.length} 个
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 导出工具函数
export const backupLinkUtils = {
  generateComplexLink: (projectId: string, linkId: string): string => {
    const baseUrl = window.location.origin;
    const randomParams = {
      r: Math.random().toString(36).substring(2, 15),
      ts: Date.now().toString(36),
      h: btoa(`${projectId}_${linkId}_${Date.now()}`).substring(0, 20),
      n: Math.floor(Math.random() * 1000000).toString(),
      s: Array.from({ length: 10 }, () => Math.random().toString(36)[2]).join('')
    };

    const paramsString = new URLSearchParams(randomParams).toString();
    return `${baseUrl}/#/view/${projectId}?${paramsString}`;
  },

  getNextBackupLink: (projectId: string): string => {
    const storedLinks = localStorage.getItem(`backup_links_${projectId}`);
    let links: BackupLink[] = [];
    
    if (storedLinks) {
      links = JSON.parse(storedLinks);
    } else {
      // 如果没有链接，生成新的
      links = [];
      for (let i = 0; i < 100; i++) {
        const linkId = `link_${i}_${Date.now()}`;
        links.push({
          id: linkId,
          url: backupLinkUtils.generateComplexLink(projectId, linkId),
          createdAt: new Date(),
          lastUsed: null,
          useCount: 0
        });
      }
      localStorage.setItem(`backup_links_${projectId}`, JSON.stringify(links));
    }

    // 获取当前索引
    const currentIndexKey = `current_link_index_${projectId}`;
    const storedIndex = localStorage.getItem(currentIndexKey);
    const currentIndex = storedIndex ? parseInt(storedIndex) : 0;
    
    // 循环使用链接
    const selectedIndex = currentIndex % links.length;
    const selectedLink = links[selectedIndex];
    
    // 更新链接使用信息
    selectedLink.lastUsed = new Date();
    selectedLink.useCount++;
    localStorage.setItem(`backup_links_${projectId}`, JSON.stringify(links));
    
    // 更新当前索引
    localStorage.setItem(currentIndexKey, (currentIndex + 1).toString());
    
    return selectedLink.url;
  },

  generateBackupLinks: (projectId: string): BackupLink[] => {
    const links: BackupLink[] = [];
    for (let i = 0; i < 100; i++) {
      const linkId = `link_${i}_${Date.now()}`;
      links.push({
        id: linkId,
        url: backupLinkUtils.generateComplexLink(projectId, linkId),
        createdAt: new Date(),
        lastUsed: null,
        useCount: 0
      });
    }
    localStorage.setItem(`backup_links_${projectId}`, JSON.stringify(links));
    return links;
  },

  loadBackupLinks: (projectId: string): BackupLink[] => {
    const storedLinks = localStorage.getItem(`backup_links_${projectId}`);
    if (storedLinks) {
      return JSON.parse(storedLinks);
    }
    return [];
  }
};

export default BackupLinkManager;