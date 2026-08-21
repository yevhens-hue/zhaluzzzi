'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CityContextType {
  currentCity: string;
  isModalOpen: boolean;
  setCity: (cityName: string) => void;
  openModal: () => void;
  closeModal: () => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [currentCity, setCurrentCity] = useState('Місто');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_city');
      if (saved) {
        setCurrentCity(saved);
      }
    }
  }, []);

  const setCity = (cityName: string) => {
    setCurrentCity(cityName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_city', cityName);
    }
    setIsModalOpen(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <CityContext.Provider
      value={{
        currentCity,
        isModalOpen,
        setCity,
        openModal,
        closeModal,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}
