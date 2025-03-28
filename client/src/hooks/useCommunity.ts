import { useQuery, useMutation } from "@tanstack/react-query";
import { CommunityPost } from "../types";
import { API_ENDPOINTS, APP_CONSTANTS } from "../lib/constants";
import { apiRequest } from "../lib/queryClient";
import { queryClient } from "../lib/queryClient";

export const useCommunityPosts = (limit?: number) => {
  const queryKey = limit 
    ? [API_ENDPOINTS.COMMUNITY, { limit }]
    : [API_ENDPOINTS.COMMUNITY];

  return useQuery<CommunityPost[]>({
    queryKey,
    refetchOnWindowFocus: false
  });
};

export const useCreateCommunityPost = () => {
  return useMutation({
    mutationFn: async ({ 
      content, 
      userId = APP_CONSTANTS.DEFAULT_USER_ID 
    }: {
      content: string;
      userId?: number;
    }) => {
      const response = await apiRequest("POST", API_ENDPOINTS.COMMUNITY, {
        content,
        userId
      });
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate the community posts query to refresh data
      queryClient.invalidateQueries({ 
        queryKey: [API_ENDPOINTS.COMMUNITY] 
      });
    }
  });
};

// Format the time of a post relative to now
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  return postDate.toLocaleDateString();
};
