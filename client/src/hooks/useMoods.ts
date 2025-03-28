import { useQuery, useMutation } from "@tanstack/react-query";
import { Mood, MoodType } from "../types";
import { API_ENDPOINTS, APP_CONSTANTS } from "../lib/constants";
import { apiRequest } from "../lib/queryClient";
import { queryClient } from "../lib/queryClient";

export const useMoods = (userId: number = APP_CONSTANTS.DEFAULT_USER_ID, limit?: number) => {
  const queryKey = limit 
    ? [`${API_ENDPOINTS.USERS}/${userId}/moods`, { limit }] 
    : [`${API_ENDPOINTS.USERS}/${userId}/moods`];

  return useQuery<Mood[]>({
    queryKey,
    refetchOnWindowFocus: false
  });
};

export const useCreateMood = () => {
  return useMutation({
    mutationFn: async ({ 
      userId = APP_CONSTANTS.DEFAULT_USER_ID, 
      mood, 
      value, 
      note
    }: {
      userId?: number;
      mood: MoodType;
      value: number;
      note?: string;
    }) => {
      const response = await apiRequest("POST", API_ENDPOINTS.MOODS, {
        userId,
        mood,
        value,
        note
      });
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate the moods query to refresh mood data
      queryClient.invalidateQueries({ 
        queryKey: [`${API_ENDPOINTS.USERS}/${APP_CONSTANTS.DEFAULT_USER_ID}/moods`] 
      });
    }
  });
};

// Helper function to get recent mood trend
export const getMoodTrend = (moods: Mood[]): "improving" | "declining" | "stable" => {
  if (moods.length < 2) return "stable";
  
  // Sort by date (newest first)
  const sortedMoods = [...moods].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Get average of last 3 moods vs average of 3 moods before that
  const recent = sortedMoods.slice(0, 3).reduce((sum, mood) => sum + mood.value, 0) / 
                Math.min(3, sortedMoods.slice(0, 3).length);
  
  const previous = sortedMoods.slice(3, 6).reduce((sum, mood) => sum + mood.value, 0) / 
                  Math.min(3, sortedMoods.slice(3, 6).length);
  
  if (recent > previous + 5) return "improving";
  if (recent < previous - 5) return "declining";
  return "stable";
};

// Helper function to get mood status text
export const getMoodStatusText = (moods: Mood[]): string => {
  const trend = getMoodTrend(moods);
  
  if (trend === "improving") {
    return "Your mood has been improving recently. Great progress!";
  } else if (trend === "declining") {
    return "Your mood seems to be declining. Want to talk about it?";
  } else {
    return "Your mood has been relatively stable lately.";
  }
};
