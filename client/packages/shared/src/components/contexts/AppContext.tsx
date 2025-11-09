import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  content: {
    contentTopNav: React.ReactNode[];
    contentLsidebar: React.ReactNode[];
    contentRsidebar: React.ReactNode[];
    contentFooter: React.ReactNode[];
  };
  setContent: React.Dispatch<React.SetStateAction<{
    contentTopNav: React.ReactNode[];
    contentLsidebar: React.ReactNode[];
    contentRsidebar: React.ReactNode[];
    contentFooter: React.ReactNode[];
  }>>;
  pageType: 'fixed' | 'stretch';
  setPageType: React.Dispatch<React.SetStateAction<'fixed' | 'stretch'>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppContextType['content']>({
    contentTopNav: [],
    contentLsidebar: [],
    contentRsidebar: [],
    contentFooter: [],
  });

  const [pageType, setPageType] = useState<'fixed' | 'stretch'>('fixed'); // ← добавили сюда

  return (
    <AppContext.Provider value={{ content, setContent, pageType, setPageType }}>
      {children}
    </AppContext.Provider>
  );
};