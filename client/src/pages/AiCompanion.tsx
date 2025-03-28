import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS, APP_CONSTANTS } from "../lib/constants";
import { ChatMessage } from "../types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const AiCompanion = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch chat history
  const { data: chatHistory, isLoading, refetch } = useQuery<{ messages: ChatMessage[] }>({
    queryKey: [`${API_ENDPOINTS.CHAT_HISTORY.replace(':userId', APP_CONSTANTS.DEFAULT_USER_ID.toString())}`],
  });

  const messages = chatHistory?.messages || [
    { role: "system", content: "Hello! I'm your AI mental health companion. How can I support you today?" }
  ];

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest("POST", API_ENDPOINTS.AI_CHAT, {
        message: messageText,
        userId: APP_CONSTANTS.DEFAULT_USER_ID
      });
      return await response.json();
    },
    onSuccess: () => {
      refetch(); // Refresh chat history
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSending) return;

    setIsSending(true);
    
    try {
      await sendMessage.mutateAsync(message);
      setMessage("");
    } finally {
      setIsSending(false);
    }
  };

  // Suggested prompts
  const suggestedPrompts = [
    "I'm feeling stressed about work",
    "How can I improve my sleep?",
    "I need a quick calming exercise",
    "What are some mindfulness techniques?",
    "Help me with anxiety symptoms"
  ];

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-64px)] md:h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-2">
          AI Companion
        </h1>
        <p className="text-gray-400">
          Chat with your personal AI wellness guide for support, advice, and exercises
        </p>
      </div>
      
      <div className="bg-surface rounded-xl p-5 flex-1 flex flex-col overflow-hidden">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user" 
                      ? "bg-primary-dark text-white" 
                      : "bg-surface-light text-gray-200"
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {sendMessage.isPending && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-surface-light">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        {/* Suggested prompts */}
        {messages.length <= 2 && (
          <div className="mb-4">
            <h3 className="text-sm text-gray-400 mb-2">Suggested topics:</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="px-3 py-1 bg-surface-light text-gray-300 rounded-full text-sm hover:bg-surface-lighter transition"
                  onClick={() => {
                    setMessage(prompt);
                    setTimeout(() => {
                      const submitEvent = new Event("submit") as any;
                      document.getElementById("chat-form")?.dispatchEvent(submitEvent);
                    }, 100);
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Message input */}
        <form id="chat-form" className="flex items-center gap-2" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="bg-surface-light text-gray-200 rounded-lg px-4 py-3 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-secondary"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
          />
          <button 
            type="submit" 
            className={`p-3 rounded-lg ${isSending ? 'bg-gray-600' : 'bg-secondary hover:bg-secondary-dark'} transition`}
            disabled={isSending}
          >
            <i className="ri-send-plane-fill text-white"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiCompanion;
