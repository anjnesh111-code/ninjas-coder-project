import { useState } from "react";
import { useCommunityPosts, formatRelativeTime, useCreateCommunityPost } from "../hooks/useCommunity";
import { useToast } from "@/hooks/use-toast";
import { CommunityPost } from "../types";

const Community = () => {
  const { toast } = useToast();
  const { data: posts, isLoading, error } = useCommunityPosts();
  const createPost = useCreateCommunityPost();
  
  const [newPost, setNewPost] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      setShowComposer(false);
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
    <div className="p-4 md:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-2">
          Community
        </h1>
        <p className="text-gray-400">
          Connect with others on their mental wellness journey and share experiences
        </p>
      </div>
      
      {/* Create Post */}
      <div className="bg-surface rounded-xl p-5 mb-6">
        {showComposer ? (
          <form onSubmit={handleCreatePost}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your experience, tips, or challenges..."
              className="w-full bg-surface-light rounded-lg p-4 mb-3 text-sm text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[120px]"
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm border border-gray-600 rounded-lg text-gray-300 hover:bg-surface-lighter transition"
                onClick={() => {
                  setShowComposer(false);
                  setNewPost("");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-primary rounded-lg text-white hover:bg-primary-dark transition"
                disabled={createPost.isPending}
              >
                {createPost.isPending ? "Posting..." : "Share"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center mr-3">
              <i className="ri-user-line text-gray-300"></i>
            </div>
            <button
              className="flex-1 text-left p-3 bg-surface-light rounded-lg text-gray-400 hover:bg-surface-lighter transition"
              onClick={() => setShowComposer(true)}
            >
              Share your thoughts with the community...
            </button>
          </div>
        )}
      </div>
      
      {/* Community Guidelines */}
      <div className="bg-surface-light rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-3 text-secondary mb-2">
          <i className="ri-information-line text-lg"></i>
          <h3 className="font-medium">Community Guidelines</h3>
        </div>
        <p className="text-sm text-gray-300">
          Please be respectful and supportive. This is a safe space to share experiences and encourage each other.
          All posts are anonymous to protect your privacy.
        </p>
      </div>
      
      {/* Posts Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-surface rounded-xl p-5 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading community posts...</p>
          </div>
        ) : error ? (
          <div className="bg-surface rounded-xl p-5 text-center">
            <p className="text-error">Failed to load community posts. Please try again later.</p>
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="bg-surface rounded-xl p-5 text-center">
            <p className="text-gray-400">No community posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

interface PostCardProps {
  post: CommunityPost;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  return (
    <div className="bg-surface rounded-xl p-5">
      <p className="text-gray-300 mb-4">"{post.content}"</p>
      
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <div className="w-6 h-6 rounded-full bg-surface-light flex items-center justify-center">
            <i className="ri-user-line text-xs"></i>
          </div>
          <span>Anonymous</span>
          <span>•</span>
          <span>{formatRelativeTime(post.createdAt)}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className={`flex items-center space-x-1 ${liked ? 'text-primary' : 'text-gray-400'}`}
            onClick={() => setLiked(!liked)}
          >
            <i className={`${liked ? 'ri-heart-fill' : 'ri-heart-line'}`}></i>
            <span>{liked ? post.likes + 1 : post.likes}</span>
          </button>
          <button 
            className="flex items-center space-x-1 text-gray-400"
            onClick={() => setShowComments(!showComments)}
          >
            <i className="ri-chat-1-line"></i>
            <span>{post.comments}</span>
          </button>
        </div>
      </div>
      
      {showComments && (
        <div className="border-t border-surface-light pt-3 mt-3">
          {post.comments > 0 ? (
            <div className="space-y-3">
              <div className="bg-surface-light rounded-lg p-3">
                <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
                  <span>Anonymous</span>
                  <span>•</span>
                  <span>1 hour ago</span>
                </div>
                <p className="text-sm text-gray-300">I've experienced this too. It does get better with practice.</p>
              </div>
              
              {post.comments > 1 && (
                <div className="bg-surface-light rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
                    <span>Anonymous</span>
                    <span>•</span>
                    <span>3 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-300">Thank you for sharing this. It made me feel less alone.</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No comments yet. Be the first to respond!</p>
          )}
          
          <div className="mt-3 flex items-center">
            <input 
              type="text" 
              placeholder="Add a supportive comment..." 
              className="flex-1 bg-surface-light rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="ml-2 p-2 bg-primary rounded-lg">
              <i className="ri-send-plane-fill text-white"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
