import { useQuery, useMutation } from "@tanstack/react-query";
import { Sleep, SleepQuality } from "../types";
import { API_ENDPOINTS, APP_CONSTANTS } from "../lib/constants";
import { apiRequest } from "../lib/queryClient";
import { queryClient } from "../lib/queryClient";

export const useSleep = (userId: number = APP_CONSTANTS.DEFAULT_USER_ID, limit?: number) => {
  const queryKey = limit 
    ? [`${API_ENDPOINTS.USERS}/${userId}/sleep`, { limit }] 
    : [`${API_ENDPOINTS.USERS}/${userId}/sleep`];

  return useQuery<Sleep[]>({
    queryKey,
    refetchOnWindowFocus: false
  });
};

export const useCreateSleep = () => {
  return useMutation({
    mutationFn: async ({ 
      userId = APP_CONSTANTS.DEFAULT_USER_ID, 
      hours, 
      quality, 
      note 
    }: {
      userId?: number;
      hours: number;
      quality?: SleepQuality;
      note?: string;
    }) => {
      const response = await apiRequest("POST", API_ENDPOINTS.SLEEP, {
        userId,
        hours,
        quality,
        note
      });
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate the sleep query to refresh sleep data
      queryClient.invalidateQueries({ 
        queryKey: [`${API_ENDPOINTS.USERS}/${APP_CONSTANTS.DEFAULT_USER_ID}/sleep`] 
      });
    }
  });
};

// Helper function to get average sleep hours
export const getAverageSleepHours = (sleepData: Sleep[]): number => {
  if (sleepData.length === 0) return 0;
  
  const totalHours = sleepData.reduce((sum, sleep) => sum + sleep.hours, 0);
  return Number((totalHours / sleepData.length).toFixed(1));
};

// Helper function to get sleep quality trend
export const getSleepQualityTrend = (sleepData: Sleep[]): "improving" | "declining" | "stable" => {
  if (sleepData.length < 2) return "stable";
  
  // Sort by date (newest first)
  const sortedSleep = [...sleepData].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Get average of last 3 nights vs average of 3 nights before that
  const recent = sortedSleep.slice(0, 3).reduce((sum, sleep) => sum + sleep.hours, 0) / 
                Math.min(3, sortedSleep.slice(0, 3).length);
  
  const previous = sortedSleep.slice(3, 6).reduce((sum, sleep) => sum + sleep.hours, 0) / 
                  Math.min(3, sortedSleep.slice(3, 6).length);
  
  if (recent > previous + 0.5) return "improving";
  if (recent < previous - 0.5) return "declining";
  return "stable";
};

// Helper function to get sleep status text
export const getSleepStatusText = (sleepData: Sleep[]): string => {
  const avg = getAverageSleepHours(sleepData);
  const trend = getSleepQualityTrend(sleepData);
  
  if (avg < 6) {
    return "You're not getting enough sleep. Try to aim for 7-8 hours.";
  } else if (avg < 7) {
    return "You're getting close to the recommended amount of sleep.";
  } else {
    return "You're getting a healthy amount of sleep. Keep it up!";
  }
};
