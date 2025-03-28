import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../lib/constants";
import { Meditation as MeditationType } from "../types";
import { useToast } from "@/hooks/use-toast";

const Meditation = () => {
  const { toast } = useToast();
  const [activeMeditation, setActiveMeditation] = useState<MeditationType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [breathingStep, setBreathingStep] = useState("inhale"); // inhale, hold, exhale
  const timerRef = useRef<number | null>(null);
  const breathingTimerRef = useRef<number | null>(null);
  
  const { data: meditations, isLoading } = useQuery<MeditationType[]>({
    queryKey: [API_ENDPOINTS.MEDITATIONS],
  });

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (breathingTimerRef.current) {
        clearInterval(breathingTimerRef.current);
      }
    };
  }, []);

  // Calculate remaining time
  useEffect(() => {
    if (activeMeditation) {
      setTimeRemaining(Math.max(0, Math.floor(activeMeditation.duration * 60 * (1 - progress / 100))));
    }
  }, [progress, activeMeditation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startMeditation = (meditation: MeditationType) => {
    // Stop current meditation if there is one
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (breathingTimerRef.current) {
      clearInterval(breathingTimerRef.current);
    }
    
    setActiveMeditation(meditation);
    setIsPlaying(true);
    setProgress(0);
    setTimeRemaining(meditation.duration * 60);
    
    // Start progress timer
    const totalDuration = meditation.duration * 60 * 1000; // Convert to milliseconds
    const interval = 1000; // Update every second
    const increment = (interval / totalDuration) * 100;
    
    timerRef.current = window.setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsPlaying(false);
          toast({
            title: "Meditation complete",
            description: "Great job completing your meditation session!",
          });
          return 100;
        }
        return newProgress;
      });
    }, interval);
    
    // For breathing type, start breathing cycle
    if (meditation.type === "breathing") {
      startBreathingCycle();
    }
  };

  const startBreathingCycle = () => {
    // Clear any existing breathing timer
    if (breathingTimerRef.current) {
      clearInterval(breathingTimerRef.current);
    }
    
    setBreathingStep("inhale");
    let currentStep = "inhale";
    let secondsInStep = 0;
    
    breathingTimerRef.current = window.setInterval(() => {
      secondsInStep++;
      
      if (currentStep === "inhale" && secondsInStep >= 4) {
        currentStep = "hold";
        secondsInStep = 0;
        setBreathingStep("hold");
      } else if (currentStep === "hold" && secondsInStep >= 4) {
        currentStep = "exhale";
        secondsInStep = 0;
        setBreathingStep("exhale");
      } else if (currentStep === "exhale" && secondsInStep >= 6) {
        currentStep = "inhale";
        secondsInStep = 0;
        setBreathingStep("inhale");
      }
    }, 1000);
  };

  const pauseResumeMeditation = () => {
    if (isPlaying) {
      // Pause
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathingTimerRef.current) clearInterval(breathingTimerRef.current);
      setIsPlaying(false);
    } else {
      // Resume
      setIsPlaying(true);
      
      if (activeMeditation) {
        const remainingDuration = activeMeditation.duration * 60 * 1000 * (1 - progress / 100);
        const interval = 1000;
        const increment = (interval / remainingDuration) * 100 * (1 - progress / 100);
        
        timerRef.current = window.setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + increment;
            if (newProgress >= 100) {
              if (timerRef.current) clearInterval(timerRef.current);
              setIsPlaying(false);
              toast({
                title: "Meditation complete",
                description: "Great job completing your meditation session!",
              });
              return 100;
            }
            return newProgress;
          });
        }, interval);
        
        if (activeMeditation.type === "breathing") {
          startBreathingCycle();
        }
      }
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-2">
          Meditation
        </h1>
        <p className="text-gray-400">
          Find peace and calm with guided meditation and breathing exercises
        </p>
      </div>
      
      {/* Active Meditation */}
      {activeMeditation && (
        <div className="bg-surface rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium">{activeMeditation.title}</h2>
              <p className="text-sm text-gray-400">{activeMeditation.type === "breathing" ? "Breathing Exercise" : "Guided Meditation"}</p>
            </div>
            <button 
              className="px-3 py-1 text-sm text-gray-400 border border-gray-600 rounded-lg hover:bg-surface-light"
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                if (breathingTimerRef.current) clearInterval(breathingTimerRef.current);
                setActiveMeditation(null);
                setIsPlaying(false);
                setProgress(0);
              }}
            >
              Close
            </button>
          </div>
          
          {/* Meditation Animation */}
          <div className="relative h-60 rounded-lg bg-surface-light flex items-center justify-center mb-4 overflow-hidden">
            {activeMeditation.type === "breathing" ? (
              <div className="flex flex-col items-center justify-center">
                <div className={`w-32 h-32 rounded-full bg-primary opacity-20 transition-transform duration-4000 ${
                  breathingStep === "inhale" ? "scale-150" : 
                  breathingStep === "hold" ? "scale-150" : 
                  "scale-100"
                }`}></div>
                <div className={`absolute w-24 h-24 rounded-full bg-primary opacity-30 transition-transform duration-4000 ${
                  breathingStep === "inhale" ? "scale-150" : 
                  breathingStep === "hold" ? "scale-150" : 
                  "scale-100"
                }`}></div>
                <div className={`absolute w-16 h-16 rounded-full bg-primary opacity-40 transition-transform duration-4000 ${
                  breathingStep === "inhale" ? "scale-150" : 
                  breathingStep === "hold" ? "scale-150" : 
                  "scale-100"
                }`}></div>
                <p className="absolute text-white font-medium z-10 mt-40">
                  {breathingStep === "inhale" ? "Breathe in..." : 
                   breathingStep === "hold" ? "Hold..." : 
                   "Breathe out..."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-5xl mb-4 animate-float">🧘</span>
                <p className="text-white text-center max-w-md">
                  {activeMeditation.description}
                </p>
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="mb-4">
            <div className="relative h-2 bg-surface-lighter rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-400">{formatTime(timeRemaining)}</span>
              <span className="text-xs text-gray-400">{activeMeditation.duration}:00</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              className="px-6 py-3 bg-primary rounded-full text-white flex items-center space-x-2 hover:bg-primary-dark transition"
              onClick={pauseResumeMeditation}
            >
              <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-xl`}></i>
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Meditation List */}
      {!activeMeditation && (
        <>
          {/* Guided Meditations */}
          <div className="bg-surface rounded-xl p-5 mb-6">
            <h2 className="text-lg font-medium mb-4">Guided Meditations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : !meditations || meditations.filter(m => m.type === "guided").length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-400">
                  No guided meditations available
                </div>
              ) : (
                meditations.filter(m => m.type === "guided").map(meditation => (
                  <div key={meditation.id} className="bg-surface-light rounded-lg p-4 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{meditation.title}</h3>
                        <p className="text-xs text-gray-400">{meditation.duration} minutes</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary bg-opacity-20 flex items-center justify-center">
                        <i className="ri-mental-health-line text-secondary"></i>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">{meditation.description}</p>
                    <button 
                      className="w-full py-2 bg-secondary rounded-lg text-white text-sm hover:bg-secondary-dark transition"
                      onClick={() => startMeditation(meditation)}
                    >
                      Start Session
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Breathing Exercises */}
          <div className="bg-surface rounded-xl p-5">
            <h2 className="text-lg font-medium mb-4">Breathing Exercises</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : !meditations || meditations.filter(m => m.type === "breathing").length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-400">
                  No breathing exercises available
                </div>
              ) : (
                meditations.filter(m => m.type === "breathing").map(meditation => (
                  <div key={meditation.id} className="bg-surface-light rounded-lg p-4 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{meditation.title}</h3>
                        <p className="text-xs text-gray-400">{meditation.duration} minutes</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
                        <i className="ri-lungs-line text-primary"></i>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">{meditation.description}</p>
                    <button 
                      className="w-full py-2 bg-primary rounded-lg text-white text-sm hover:bg-primary-dark transition"
                      onClick={() => startMeditation(meditation)}
                    >
                      Start Exercise
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Meditation;
