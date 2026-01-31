import React, { useState, useEffect } from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  relevance: number;
  source: string;
}

const SmartSearch: React.FC = () => {
  const { t } = useLocale();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // 加载最近搜索记录
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updatedSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    setIsSearching(true);
    saveRecentSearch(query);

    // 模拟智能搜索
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: t('search.result1Title'),
          content: t('search.result1Content'),
          relevance: 0.95,
          source: t('search.knowledgeBase')
        },
        {
          id: '2',
          title: t('search.result2Title'),
          content: t('search.result2Content'),
          relevance: 0.87,
          source: t('search.document')
        },
        {
          id: '3',
          title: t('search.result3Title'),
          content: t('search.result3Content'),
          relevance: 0.75,
          source: t('search.faq')
        }
      ];
      setResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    handleSearch();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('search.title')}</h3>
      
      <div className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('search.placeholder')}
            className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isSearching ? t('search.searching') : t('search.search')}
          </button>
        </div>
      </div>

      {recentSearches.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">{t('search.recentSearches')}</h4>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearch(search)}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-3">{t('search.results', { count: results.length })}</h4>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="border rounded p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800">{result.title}</h5>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {t('search.relevance', { score: Math.round(result.relevance * 100) })}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{result.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">{result.source}</span>
                  <button className="text-blue-500 text-sm hover:underline">{t('search.viewDetails')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSearching && (
        <div className="mt-6 flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="mt-6">
        <h4 className="font-medium text-gray-700 mb-2">{t('search.features')}</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>{t('search.feature1')}</li>
          <li>{t('search.feature2')}</li>
          <li>{t('search.feature3')}</li>
          <li>{t('search.feature4')}</li>
        </ul>
      </div>
    </div>
  );
};

export default SmartSearch;