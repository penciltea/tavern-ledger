const API_URL = process.env.API_URL || "http://localhost:3000";

// Generate SWR keys for quests
export const generateQuestKey = (searchText: string = "", currentPage: number = 1) => 
  `${API_URL}/api/quests?search=${encodeURIComponent(searchText)}&page=${currentPage}`;