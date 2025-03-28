import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../lib/constants";
import { CalmingSound } from "../types";

const CalmingSounds = () => {
  const [activeSound, setActiveSound] = useState<CalmingSound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [category, setCategory] = useState("All");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { data: sounds, isLoading } = useQuery<CalmingSound[]>({
    queryKey: [API_ENDPOINTS.CALMING_SOUNDS],
  });

  // Setup audio player and cleanup on unmount
  useEffect(() => {
    if (activeSound && (!audioRef.current || audioRef.current.src !== activeSound.audioUrl)) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', resetPlayer);
      }
      
      audioRef.current = new Audio(activeSound.audioUrl);
      audioRef.current.volume = volume;
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', resetPlayer);
      
      if (isPlaying) {
        audioRef.current.play();
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', resetPlayer);
      }
    };
  }, [activeSound]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const updateProgress = () => {
    if (audioRef.current) {
      const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percentage);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const resetPlayer = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  
  const playSound = (sound: CalmingSound) => {
    const isSameSound = activeSound && activeSound.id === sound.id;
    
    if (isSameSound) {
      togglePlayPause();
    } else {
      setActiveSound(sound);
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
    }
  };
  
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const seekPosition = parseInt(e.target.value);
    const seekTime = (seekPosition / 100) * audioRef.current.duration;
    
    audioRef.current.currentTime = seekTime;
    setProgress(seekPosition);
    setCurrentTime(seekTime);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get all unique categories
  const categories = sounds 
    ? ['All', ...new Set(sounds.map(sound => sound.category.charAt(0).toUpperCase() + sound.category.slice(1)))]
    : ['All', 'Nature', 'Ambient', 'Music'];

  // Filter sounds by category
  const filteredSounds = category === 'All' 
    ? sounds 
    : sounds?.filter(sound => sound.category.toLowerCase() === category.toLowerCase());

  // Icon mapping for sound categories
  const categoryIcons: { [key: string]: string } = {
    nature: "ri-plant-line",
    ambient: "ri-sound-module-line",
    music: "ri-music-2-line"
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-2">
          Calming Sounds
        </h1>
        <p className="text-gray-400">
          Relax with soothing sounds to help you focus, meditate, or fall asleep
        </p>
      </div>
      
      {/* Active Sound Player */}
      {activeSound && (
        <div className="bg-surface rounded-xl p-5 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 rounded-lg bg-accent-blue bg-opacity-20 flex items-center justify-center mr-4">
              <i className={`${categoryIcons[activeSound.category] || 'ri-volume-up-line'} text-accent-blue text-2xl`}></i>
            </div>
            <div>
              <h2 className="text-lg font-medium">{activeSound.title}</h2>
              <p className="text-sm text-gray-400">{activeSound.description}</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-2 bg-surface-lighter rounded-lg appearance-none cursor-pointer accent-accent-blue"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
              <span className="text-xs text-gray-400">{formatTime(activeSound.duration)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <i className="ri-volume-down-line text-gray-400"></i>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-surface-lighter rounded-lg appearance-none cursor-pointer accent-accent-blue"
              />
              <i className="ri-volume-up-line text-gray-400"></i>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                className="w-12 h-12 rounded-full bg-accent-blue flex items-center justify-center hover:bg-opacity-90 transition"
                onClick={togglePlayPause}
              >
                <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-white text-2xl`}></i>
              </button>
              <button 
                className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center hover:bg-surface-lighter transition"
                onClick={resetPlayer}
              >
                <i className="ri-stop-fill text-gray-300"></i>
              </button>
              <button 
                className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center hover:bg-surface-lighter transition"
                onClick={() => {
                  resetPlayer();
                  setActiveSound(null);
                }}
              >
                <i className="ri-close-line text-gray-300"></i>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Category Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 mb-2">
        {categories.map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              category === cat 
                ? 'bg-accent-blue text-white' 
                : 'bg-surface-light text-gray-300 hover:bg-surface-lighter'
            } transition`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* Sound Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-blue"></div>
          </div>
        ) : !filteredSounds || filteredSounds.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            No sounds available in this category
          </div>
        ) : (
          filteredSounds.map(sound => (
            <div key={sound.id} className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className={`bg-gradient-to-r from-accent-blue to-secondary p-4`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">{sound.title}</h3>
                  <i className={`${categoryIcons[sound.category] || 'ri-volume-up-line'} text-white text-xl`}></i>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-300 mb-3">
                  {sound.description}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400 capitalize">{sound.category}</span>
                  <span className="text-xs text-gray-400">{formatTime(sound.duration)}</span>
                </div>
                <button
                  className={`w-full py-2 ${
                    activeSound?.id === sound.id && isPlaying
                      ? 'bg-gray-600 text-white'
                      : 'bg-accent-blue text-white hover:bg-opacity-90'
                  } rounded-lg text-sm font-medium transition flex items-center justify-center space-x-2`}
                  onClick={() => playSound(sound)}
                >
                  <i className={`${
                    activeSound?.id === sound.id && isPlaying ? 'ri-pause-fill' : 'ri-play-fill'
                  } text-lg`}></i>
                  <span>{activeSound?.id === sound.id && isPlaying ? 'Pause' : 'Play'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalmingSounds;
