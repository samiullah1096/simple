import React, { useState, useEffect } from 'react';
import ToolShell from '../../../components/Tools/ToolShell';

const TabManager = () => {
  const [tabs, setTabs] = useState([]);
  const [newTabName, setNewTabName] = useState('');
  const [newTabUrl, setNewTabUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTabs, setSelectedTabs] = useState(new Set());

  useEffect(() => {
    // Load saved tabs from localStorage
    const savedTabs = localStorage.getItem('tab-manager-tabs');
    if (savedTabs) {
      try {
        setTabs(JSON.parse(savedTabs));
      } catch (error) {
        console.error('Error loading tabs:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save tabs to localStorage
    localStorage.setItem('tab-manager-tabs', JSON.stringify(tabs));
  }, [tabs]);

  const addTab = () => {
    if (!newTabName.trim()) {
      alert('Please enter a tab name');
      return;
    }

    const newTab = {
      id: Date.now(),
      name: newTabName.trim(),
      url: newTabUrl.trim() || '#',
      category: 'General',
      created: new Date().toISOString(),
      accessed: 0
    };

    setTabs(prev => [newTab, ...prev]);
    setNewTabName('');
    setNewTabUrl('');
  };

  const deleteTab = (tabId) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    setSelectedTabs(prev => {
      const newSet = new Set(prev);
      newSet.delete(tabId);
      return newSet;
    });
  };

  const openTab = (tab) => {
    if (tab.url && tab.url !== '#') {
      window.open(tab.url, '_blank');
      
      // Update access count
      setTabs(prev => prev.map(t => 
        t.id === tab.id 
          ? { ...t, accessed: t.accessed + 1, lastAccessed: new Date().toISOString() }
          : t
      ));
    }
  };

  const toggleTabSelection = (tabId) => {
    setSelectedTabs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tabId)) {
        newSet.delete(tabId);
      } else {
        newSet.add(tabId);
      }
      return newSet;
    });
  };

  const selectAllTabs = () => {
    const filteredTabIds = filteredTabs.map(tab => tab.id);
    setSelectedTabs(new Set(filteredTabIds));
  };

  const deselectAllTabs = () => {
    setSelectedTabs(new Set());
  };

  const deleteSelectedTabs = () => {
    if (selectedTabs.size === 0) return;
    
    if (confirm(`Delete ${selectedTabs.size} selected tab(s)?`)) {
      setTabs(prev => prev.filter(tab => !selectedTabs.has(tab.id)));
      setSelectedTabs(new Set());
    }
  };

  const openSelectedTabs = () => {
    if (selectedTabs.size === 0) return;
    
    const tabsToOpen = tabs.filter(tab => selectedTabs.has(tab.id) && tab.url && tab.url !== '#');
    
    if (tabsToOpen.length > 10) {
      if (!confirm(`This will open ${tabsToOpen.length} tabs. Continue?`)) {
        return;
      }
    }

    tabsToOpen.forEach(tab => {
      window.open(tab.url, '_blank');
      
      // Update access count
      setTabs(prev => prev.map(t => 
        t.id === tab.id 
          ? { ...t, accessed: t.accessed + 1, lastAccessed: new Date().toISOString() }
          : t
      ));
    });
  };

  const exportTabs = () => {
    const tabsData = tabs.map(tab => ({
      name: tab.name,
      url: tab.url,
      category: tab.category,
      created: tab.created
    }));

    const dataStr = JSON.stringify(tabsData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tab-manager-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importTabs = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTabs = JSON.parse(e.target.result);
        const newTabs = importedTabs.map(tab => ({
          ...tab,
          id: Date.now() + Math.random(),
          accessed: 0
        }));
        setTabs(prev => [...newTabs, ...prev]);
        alert(`Imported ${newTabs.length} tabs successfully`);
      } catch (error) {
        alert('Error importing tabs. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const categories = [...new Set(tabs.map(tab => tab.category))];
  
  const filteredTabs = tabs.filter(tab =>
    tab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tab.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tab.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ToolShell
      title="Tab Manager"
      description="Organize and manage browser tabs efficiently with categories, search, and bulk operations"
      category="Productivity Tools"
      features={[
        "Save and organize browser tabs",
        "Category-based organization",
        "Bulk operations on multiple tabs",
        "Import/export tab collections"
      ]}
      faqs={[
        {
          question: "How do I add a new tab?",
          answer: "Enter a name and optionally a URL, then click 'Add Tab'. The tab will be saved in your collection for easy access later."
        },
        {
          question: "Can I organize tabs into categories?",
          answer: "Yes, you can assign categories to tabs for better organization. The category field helps group related tabs together."
        },
        {
          question: "How do I open multiple tabs at once?",
          answer: "Select multiple tabs using the checkboxes, then click 'Open Selected' to open all selected tabs in new browser windows."
        }
      ]}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Tab</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tab Name</label>
              <input
                type="text"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                placeholder="Enter tab name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">URL (optional)</label>
              <input
                type="url"
                value={newTabUrl}
                onChange={(e) => setNewTabUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          
          <button
            onClick={addTab}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add Tab
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h3 className="text-lg font-semibold">Saved Tabs ({tabs.length})</h3>
            
            <div className="flex flex-wrap gap-2">
              <input
                type="file"
                accept=".json"
                onChange={importTabs}
                className="hidden"
                id="import-tabs"
              />
              <label
                htmlFor="import-tabs"
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-200 cursor-pointer text-sm"
              >
                Import
              </label>
              
              <button
                onClick={exportTabs}
                disabled={tabs.length === 0}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 text-sm"
              >
                Export
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search tabs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          {tabs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={selectAllTabs}
                className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition duration-200 text-sm"
              >
                Select All
              </button>
              
              <button
                onClick={deselectAllTabs}
                className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition duration-200 text-sm"
              >
                Deselect All
              </button>
              
              <button
                onClick={openSelectedTabs}
                disabled={selectedTabs.size === 0}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50 text-sm"
              >
                Open Selected ({selectedTabs.size})
              </button>
              
              <button
                onClick={deleteSelectedTabs}
                disabled={selectedTabs.size === 0}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50 text-sm"
              >
                Delete Selected
              </button>
            </div>
          )}
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTabs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {tabs.length === 0 ? 'No tabs saved yet' : 'No tabs found matching your search'}
              </div>
            ) : (
              filteredTabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`p-4 rounded-lg border transition duration-200 ${
                    selectedTabs.has(tab.id)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedTabs.has(tab.id)}
                        onChange={() => toggleTabSelection(tab.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{tab.name}</h4>
                        {tab.url && tab.url !== '#' && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 truncate hover:underline">
                            <a href={tab.url} target="_blank" rel="noopener noreferrer">
                              {tab.url}
                            </a>
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>Created: {formatDate(tab.created)}</span>
                          <span>Accessed: {tab.accessed} times</span>
                          {tab.lastAccessed && (
                            <span>Last: {formatDate(tab.lastAccessed)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {tab.url && tab.url !== '#' && (
                        <button
                          onClick={() => openTab(tab)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-200 text-sm"
                        >
                          Open
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteTab(tab.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-200 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Tab Management Tips</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>• Use descriptive names for easy identification</p>
            <p>• Group related tabs with categories</p>
            <p>• Use bulk operations to manage multiple tabs efficiently</p>
            <p>• Export your tab collections for backup or sharing</p>
            <p>• Search by name, URL, or category to find tabs quickly</p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};

export default TabManager;