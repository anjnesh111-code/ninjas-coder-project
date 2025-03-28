import { ChatMessage } from "../types";

// Interface for Gemini API request
interface GeminiRequest {
  contents: {
    role: string;
    parts: {
      text: string;
    }[];
  }[];
}

// Interface for Gemini API response
interface GeminiResponse {
  candidates: {
    content: {
      role: string;
      parts: {
        text: string;
      }[];
    };
  }[];
}

// Convert our chat messages to Gemini API format
const formatMessages = (messages: ChatMessage[]): GeminiRequest => {
  return {
    contents: messages.map(message => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }]
    }))
  };
};

// Get Gemini API key with fallback
const getApiKey = (): string => {
  return process.env.GEMINI_API_KEY || 
         process.env.API_KEY || 
         import.meta.env.VITE_GEMINI_API_KEY || 
         "";
};

// Send message to Google Gemini API
export const sendMessageToGemini = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.warn("Gemini API key not found. Using fallback response.");
      return getFallbackResponse(messages[messages.length - 1].content);
    }
    
    const formattedMessages = formatMessages(messages);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedMessages)
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return getFallbackResponse(messages[messages.length - 1].content);
  }
};

// Fallback responses when API is unavailable
const getFallbackResponse = (userMessage: string): string => {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  if (lowerCaseMessage.includes("stress") || lowerCaseMessage.includes("anxious") || 
      lowerCaseMessage.includes("anxiety") || lowerCaseMessage.includes("worried")) {
    return "I understand that you're feeling stressed. Stress can be challenging, but there are techniques that might help. Would you like to try a 5-minute breathing exercise or perhaps talk more about what's causing your stress?";
  }
  
  if (lowerCaseMessage.includes("sad") || lowerCaseMessage.includes("depress") || 
      lowerCaseMessage.includes("unhappy") || lowerCaseMessage.includes("down")) {
    return "I'm sorry to hear you're feeling this way. It's important to acknowledge these feelings. Would it help to talk more about what's bothering you, or would you prefer to try an activity that might lift your mood?";
  }
  
  if (lowerCaseMessage.includes("sleep") || lowerCaseMessage.includes("tired") || 
      lowerCaseMessage.includes("insomnia") || lowerCaseMessage.includes("rest")) {
    return "Sleep is essential for mental health. Some strategies that might help include maintaining a regular sleep schedule, avoiding screens before bed, and creating a relaxing bedtime routine. Would you like more specific suggestions?";
  }
  
  if (lowerCaseMessage.includes("meditation") || lowerCaseMessage.includes("meditate") || 
      lowerCaseMessage.includes("calm") || lowerCaseMessage.includes("relax")) {
    return "Meditation can be a wonderful practice for mental wellbeing. Even just a few minutes of mindfulness each day can make a difference. Would you like to try a short guided meditation exercise?";
  }
  
  return "I'm here to support you. Would you like to talk more about how you're feeling, or would you prefer suggestions for activities that might help with your mental wellbeing?";
};
