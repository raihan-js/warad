import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchSurahs, Surah } from '../services/quranService';

const LAST_READ_KEY = '@warad:lastRead';

interface LastReadData {
  surahId: number;
  ayahNumber: number;
  surahName: string;
}

interface QuranContextType {
  surahs: Surah[];
  loading: boolean;
  error: string | null;
  lastRead: LastReadData | null;
  setLastRead: (data: LastReadData) => void;
}

const QuranContext = createContext<QuranContextType | undefined>(undefined);

export const QuranProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRead, setLastReadState] = useState<LastReadData | null>(null);

  // Load surahs from API
  useEffect(() => {
    const loadSurahs = async () => {
        try {
        const data = await fetchSurahs();
        setSurahs(data);
        } catch (error) {
        console.error('Failed to load surahs:', error);
        setError('Failed to load surahs. Please try again later.');
        } finally {
        setLoading(false);
        }
    };

    loadSurahs();
  }, []);

  // Load last read from AsyncStorage
  useEffect(() => {
    const loadLastRead = async () => {
      try {
        const savedLastRead = await AsyncStorage.getItem(LAST_READ_KEY);
        if (savedLastRead) {
          setLastReadState(JSON.parse(savedLastRead));
        }
      } catch (err) {
        console.error('Failed to load last read position', err);
      }
    };

    loadLastRead();
  }, []);

  // Function to update last read
  const setLastRead = async (data: LastReadData) => {
    try {
      await AsyncStorage.setItem(LAST_READ_KEY, JSON.stringify(data));
      setLastReadState(data);
    } catch (err) {
      console.error('Failed to save last read position', err);
    }
  };

  return (
    <QuranContext.Provider
      value={{
        surahs,
        loading,
        error,
        lastRead,
        setLastRead,
      }}
    >
      {children}
    </QuranContext.Provider>
  );
};

export const useQuran = () => {
  const context = useContext(QuranContext);
  if (context === undefined) {
    throw new Error('useQuran must be used within a QuranProvider');
  }
  return context;
};