import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [serverOnline, setServerOnline] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [bg3DEnabled, setBg3DEnabled] = useState(true);
  const [aiProviderInfo, setAiProviderInfo] = useState('');

  const triggerRefresh = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Check health and AI provider
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await api.getHealth();
        setServerOnline(true);
        if (health.ai_provider) {
          setAiProviderInfo(health.ai_provider);
        }
      } catch (err) {
        setServerOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        activeTab,
        setActiveTab,
        serverOnline,
        refreshIndex,
        triggerRefresh,
        toasts,
        addToast,
        removeToast,
        globalSearch,
        setGlobalSearch,
        bg3DEnabled,
        setBg3DEnabled,
        aiProviderInfo,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
