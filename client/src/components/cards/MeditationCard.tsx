import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../lib/constants";
import { Meditation } from "../../types";

const MeditationCard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const { data: meditations, isLoading } = useQuery<Meditation[]>({
    queryKey: [API_ENDPOINTS.MEDITATIONS],
  });

  // Get the first meditation or use a default one
  const meditation = !isLoading && meditations && meditations.length > 0
    ? meditations[0]
    : {
        id: 1,
        title: "Stress Relief",
        description: "Calm your mind with deep breathing and guided visualization.",
        duration: 10,
        type: "guided"
      };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / (meditation.duration * 60));
        });
      }, 1000);
    } else {
      // Reset progress when stopped
      setProgress(0);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentTime = formatTime(Math.floor((meditation.duration * 60) * (progress / 100)));
  const totalTime = formatTime(meditation.duration * 60);

  return (
    <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
      <div className="bg-gradient-to-r from-accent-blue to-primary p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">Guided Meditation</h3>
          <i className="ri-meditation-line text-white text-xl"></i>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Recommended for you</span>
          <span className="text-sm text-primary-light cursor-pointer">View All</span>
        </div>
        
        {/* Meditation session */}
        <div className="bg-surface-light rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{meditation.title}</h4>
            <span className="text-xs bg-surface px-2 py-1 rounded-full">{meditation.duration} min</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">{meditation.description}</p>
          <div className="flex items-center space-x-3">
            <button 
              className={`w-10 h-10 rounded-full ${isPlaying ? 'bg-gray-500' : 'bg-primary'} flex items-center justify-center breathing-animation`}
              onClick={togglePlay}
            >
              <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-white text-xl`}></i>
            </button>
            <div className="flex-1">
              <div className="h-1 w-full bg-surface-lighter rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">{currentTime}</span>
                <span className="text-xs text-gray-400">{totalTime}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <button className="w-full py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:bg-opacity-10 transition">
            Start Breathing Exercise
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeditationCard;
