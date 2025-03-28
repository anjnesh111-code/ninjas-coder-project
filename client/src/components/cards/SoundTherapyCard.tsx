import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../lib/constants";
import { CalmingSound } from "../../types";

const SoundTherapyCard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { data: sounds, isLoading } = useQuery<CalmingSound[]>({
    queryKey: [API_ENDPOINTS.CALMING_SOUNDS],
  });

  // Get the first sound or use a default one
  const sound = !isLoading && sounds && sounds.length > 0
    ? sounds[0]
    : {
        id: 1,
        title: "Ocean Waves",
        description: "Soothing water sounds",
        category: "nature",
        duration: 900,
        audioUrl: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0b9fbac55.mp3"
      };
  
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(sound.audioUrl);
      
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', () => {
          setIsPlaying(false);
        });
      }
    };
  }, [sound.audioUrl]);

  const updateProgress = () => {
    if (audioRef.current) {
      const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percentage);
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const displayCurrentTime = formatTime(currentTime);
  const totalTime = formatTime(sound.duration);

  const soundOptions = [
    { icon: "ri-cloud-line", name: "Rain" },
    { icon: "ri-fire-line", name: "Fireplace" },
    { icon: "ri-plant-line", name: "Forest" }
  ];

  return (
    <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
      <div className="bg-gradient-to-r from-secondary-dark to-accent-blue p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">Calming Sounds</h3>
          <i className="ri-music-2-line text-white text-xl"></i>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Recently Played</span>
          <span className="text-sm text-accent-blue cursor-pointer">Browse All</span>
        </div>
        
        {/* Sound Player */}
        <div className="bg-surface-light rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-accent-blue bg-opacity-20 flex items-center justify-center">
              <i className="ri-water-line text-accent-blue text-xl"></i>
            </div>
            <div>
              <h4 className="font-medium">{sound.title}</h4>
              <p className="text-xs text-gray-400">{sound.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className={`w-8 h-8 rounded-full ${isPlaying ? 'bg-gray-500' : 'bg-accent-blue'} flex items-center justify-center`}
              onClick={togglePlay}
            >
              <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-white`}></i>
            </button>
            <div className="flex-1">
              <div className="h-1 w-full bg-surface-lighter rounded-full overflow-hidden">
                <div 
                  className="bg-accent-blue h-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">{displayCurrentTime}</span>
                <span className="text-xs text-gray-400">{totalTime}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sound Options */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {soundOptions.map((option, index) => (
            <button 
              key={index}
              className="flex flex-col items-center p-2 rounded-lg bg-surface-light hover:bg-surface-lighter transition"
            >
              <i className={`${option.icon} text-gray-300 mb-1`}></i>
              <span className="text-xs">{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoundTherapyCard;
