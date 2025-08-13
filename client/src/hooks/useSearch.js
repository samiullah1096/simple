import { useState, useEffect, useMemo } from 'react';
import { searchTools } from '../lib/toolsIndex';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) {
      return [];
    }
    return searchTools(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching
  };
}
