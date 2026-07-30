import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentItem, Series, SubSeries } from '../types/content';
import { AppNotification } from '../types/notification';
import { memoryRepository } from '../repositories/memoryRepository';
import { useAuth } from '../auth/authContext';
import { logger } from '../services/logger';

interface AppContextType {
  contentItems: ContentItem[];
  seriesList: Series[];
  subSeriesList: SubSeries[];
  notifications: AppNotification[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [subSeriesList, setSubSeriesList] = useState<SubSeries[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [items, sList, subList] = await Promise.all([
        memoryRepository.getContentItems(),
        memoryRepository.getSeries(),
        memoryRepository.getSubSeries(),
      ]);
      setContentItems(items);
      setSeriesList(sList);
      setSubSeriesList(subList);

      if (currentUser) {
        const notifs = await memoryRepository.getNotificationsForUser(currentUser.userId);
        setNotifications(notifs);
      }
    } catch (err) {
      logger.error('Failed to load application data', { error: err });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  return (
    <AppContext.Provider
      value={{
        contentItems,
        seriesList,
        subSeriesList,
        notifications,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
