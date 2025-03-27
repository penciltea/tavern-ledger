const API_URL = process.env.API_URL || "http://localhost:3000";

interface QuestFilters {
  search?: string;
  status?: string;
  questType?: string;
  difficulty?: string;
  page?: number;
}

export const defaultQuestFilters: QuestFilters = {
  search: "",
  status: undefined,
  questType: undefined,
  difficulty: undefined,
  page: 1,
};

export const generateQuestKey = (filters: QuestFilters) => {
  const defaultFilters = { search: "", page: 1 };

  // Merge filters with defaults
  const finalFilters = { ...defaultFilters, ...filters };
  const queryParams = new URLSearchParams();

  // Iterate through the filters and append them to the query parameters
  for (const [key, value] of Object.entries(finalFilters)) {
    if (Array.isArray(value)) {
      // For arrays, join the values into a single comma-separated string
      queryParams.append(key, value.join(","));  // Join array items with a comma
    } else if (value !== undefined && value !== "") {
      // For non-array values, append normally
      queryParams.append(key, String(value));
    }
  }

  return `${API_URL}/api/quests?${queryParams.toString()}`;
};
