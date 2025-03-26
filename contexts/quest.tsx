'use client';
import React, { createContext, useContext, useState } from "react";

interface QuestContextType {
  searchText: string;
  setSearchText: (text: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const QuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, any>>({});

  return (
    <QuestContext.Provider value={{ searchText, setSearchText, currentPage, setCurrentPage, filters, setFilters }}>
      {children}
    </QuestContext.Provider>
  );
};

export const useQuestContext = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error("useQuestContext must be used within a QuestProvider");
  }
  return context;
};
