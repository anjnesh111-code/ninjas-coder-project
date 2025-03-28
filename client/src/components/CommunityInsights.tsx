import { useState } from "react";
import { useCommunityPosts, formatRelativeTime, useCreateCommunityPost } from "../hooks/useCommunity";
import { useToast } from "@/hooks/use-toast";

const CommunityInsights = () => {
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");
  const [isPostingOpen, setIsPostingOpen] = useState(false);
  
  const { data: posts, isLoading, error } = useCommunityPosts(2);
  const createPost = useCreateCommunityPost();

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before sharing.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createPost.mutateAsync({ content: newPost });
      toast({
        title: "Post shared",
        description: "Your experience has been shared with the community.",
      });
      setNewPost("");
      setIsPostingOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to share your post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif font-medium">Community Insights</h2>
        <button className="text-sm text-primary-light">See All</button>
      </div>
      <div className="bg-surface rounded-xl p-5">
        <p className="text-sm text-gray-300 mb-4">Anonymous thoughts from our community</p>
        
        <div className="space-y-3">
          {isLoading ? (
            <div className="bg-surface-light rounded-lg p-3">
              <div className="h-4 bg-surface-lighter rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-surface-lighter rounded w-1/2 animate-pulse"></div>
            </div>
          ) : error ? (
            <div className="bg-surface-light rounded-lg p-3 text-error">
              Unable to load community posts. Please try again later.
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-surface-light rounded-lg p-3">
                <p className="text-sm mb-2">"{post.content}"</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{formatRelativeTime(post.createdAt)}</span>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1">
                      <i className="ri-heart-line text-gray-400"></i>
                      <span className="text-xs text-gray-400">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1">
                      <i className="ri-chat-1-line text-gray-400"></i>
                      <span className="text-xs text-gray-400">{post.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-surface-light rounded-lg p-3 text-center">
              No community posts yet. Be the first to share your experience!
            </div>
          )}
          
          {isPostingOpen ? (
            <div className="bg-surface-light rounded-lg p-3">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your experience with mental wellness..."
                className="w-full bg-surface rounded-lg p-3 mb-3 text-sm text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setIsPostingOpen(false)}
                  className="px-3 py-1.5 text-sm border border-gray-600 rounded-lg text-gray-300 hover:bg-surface-lighter transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreatePost}
                  className="px-3 py-1.5 text-sm bg-primary rounded-lg text-white hover:bg-primary-dark transition"
                  disabled={createPost.isPending}
                >
                  {createPost.isPending ? "Posting..." : "Share"}
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsPostingOpen(true)}
              className="w-full py-2 text-sm border border-gray-600 rounded-lg text-gray-300 hover:bg-surface-lighter transition"
            >
              Share Your Experience
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommunityInsights;
