import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { APP_CONSTANTS } from "../../lib/constants";

const AIChatbotCard = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversation, setConversation] = useState([
    { role: "system", content: "Hi Alex, I noticed your stress levels were higher on Friday. Would you like to try a 5-minute breathing exercise?" }
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSending) return;

    // Add user message to conversation
    const userMessage = { role: "user", content: message };
    setConversation([...conversation, userMessage]);
    setMessage("");
    setIsSending(true);

    try {
      // Call the API endpoint
      const response = await apiRequest("POST", "/api/ai-chat", {
        message,
        userId: APP_CONSTANTS.DEFAULT_USER_ID
      });

      const data = await response.json();
      
      // Add AI response to conversation
      setConversation(prev => [...prev, { role: "system", content: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add a fallback response if the API call fails
      setConversation(prev => [
        ...prev,
        { 
          role: "system", 
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." 
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    // Add the quick reply as a user message and trigger response
    setMessage(reply);
    setTimeout(() => {
      handleSendMessage(new Event("submit") as any);
    }, 100);
  };

  return (
    <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
      <div className="bg-gradient-to-r from-secondary to-secondary-light p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">AI Companion</h3>
          <i className="ri-chat-3-line text-white text-xl"></i>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-3 max-h-40 overflow-y-auto mb-3">
          {conversation.map((msg, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full ${msg.role === "system" ? "bg-secondary" : "bg-surface-light"} flex items-center justify-center flex-shrink-0`}>
                <i className={`${msg.role === "system" ? "ri-robot-line" : "ri-user-line"} text-white`}></i>
              </div>
              <div className="bg-surface-light p-3 rounded-lg max-w-[85%]">
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isSending && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <i className="ri-robot-line text-white"></i>
              </div>
              <div className="bg-surface-light p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {conversation.length === 1 && (
          <div className="pl-11 flex gap-2 mb-4">
            <button 
              className="px-3 py-1 bg-secondary rounded-full text-xs"
              onClick={() => handleQuickReply("Yes, please")}
            >
              Yes, please
            </button>
            <button 
              className="px-3 py-1 bg-surface-light rounded-full text-xs"
              onClick={() => handleQuickReply("Maybe later")}
            >
              Maybe later
            </button>
          </div>
        )}
        
        <div className="mt-4">
          <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="bg-surface-light text-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-secondary"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
            />
            <button 
              type="submit" 
              className={`${isSending ? 'bg-gray-500' : 'bg-secondary'} p-2 rounded-lg`}
              disabled={isSending}
            >
              <i className="ri-send-plane-fill text-white"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatbotCard;
