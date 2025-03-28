import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const DailyPractices = () => {
  const { toast } = useToast();
  const [breathingActive, setBreathingActive] = useState(false);
  const [meditationActive, setMeditationActive] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");

  const startBreathingExercise = () => {
    setBreathingActive(true);
    toast({
      title: "Breathing exercise started",
      description: "Follow the animation and breathe in and out slowly.",
    });
    
    // Simulate completion after 30 seconds
    setTimeout(() => {
      setBreathingActive(false);
      toast({
        title: "Breathing exercise completed",
        description: "Great job! How do you feel now?",
      });
    }, 30000);
  };

  const startMeditationSession = () => {
    setMeditationActive(true);
    toast({
      title: "Meditation session started",
      description: "Find a comfortable position and focus on your breath.",
    });
    
    // Simulate completion after 60 seconds
    setTimeout(() => {
      setMeditationActive(false);
      toast({
        title: "Meditation session completed",
        description: "Well done! Remember to carry this mindfulness throughout your day.",
      });
    }, 60000);
  };

  const saveJournalEntry = () => {
    if (journalEntry.trim()) {
      toast({
        title: "Journal entry saved",
        description: "Your gratitude journal entry has been saved successfully.",
      });
      setJournalEntry("");
    } else {
      toast({
        title: "Empty entry",
        description: "Please write something before saving your entry.",
        variant: "destructive"
      });
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-serif font-medium mb-4">Your Daily Practices</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Breathing Exercise */}
        <div className="bg-surface rounded-xl p-4 hover:shadow-lg transition">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium">Deep Breathing</h3>
              <p className="text-xs text-gray-400">5 minutes</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center">
              <i className="ri-lungs-line text-primary-light"></i>
            </div>
          </div>
          <div className="relative h-36 rounded-lg bg-surface-light flex items-center justify-center mb-3 overflow-hidden">
            <div className={`absolute w-20 h-20 bg-primary rounded-full opacity-20 breathing-animation ${
              breathingActive ? 'animate-pulse-slow' : ''
            }`}></div>
            <div className={`absolute w-16 h-16 bg-primary rounded-full opacity-30 breathing-animation ${
              breathingActive ? 'animate-pulse-slow' : ''
            }`} style={{ animationDelay: "0.5s" }}></div>
            <div className={`absolute w-12 h-12 bg-primary rounded-full opacity-40 breathing-animation ${
              breathingActive ? 'animate-pulse-slow' : ''
            }`} style={{ animationDelay: "1s" }}></div>
            <p className="text-white z-10 font-medium">
              {breathingActive ? "Breathe in..." : "Start breathing exercise"}
            </p>
          </div>
          <button 
            className={`w-full py-2 ${
              breathingActive ? 'bg-gray-500' : 'bg-primary'
            } rounded-lg text-sm font-medium text-white hover:bg-primary-dark transition`}
            onClick={startBreathingExercise}
            disabled={breathingActive}
          >
            {breathingActive ? 'In Progress...' : 'Start Exercise'}
          </button>
        </div>
        
        {/* Meditation Session */}
        <div className="bg-surface rounded-xl p-4 hover:shadow-lg transition">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium">Daily Meditation</h3>
              <p className="text-xs text-gray-400">10 minutes</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center">
              <i className="ri-heart-pulse-line text-secondary"></i>
            </div>
          </div>
          <div className="relative h-36 rounded-lg bg-surface-light flex items-center justify-center mb-3">
            <div className="absolute inset-0 w-full h-full bg-surface-light opacity-60 rounded-lg"></div>
            <div className="z-10 flex flex-col items-center">
              <span className={`text-3xl font-light mb-2 ${
                meditationActive ? 'animate-float' : ''
              }`}>🧘</span>
              <p className="text-white text-sm text-center">
                {meditationActive 
                  ? "Focus on the present moment" 
                  : "Begin your meditation journey"
                }
              </p>
            </div>
          </div>
          <button 
            className={`w-full py-2 ${
              meditationActive ? 'bg-gray-500' : 'bg-secondary'
            } rounded-lg text-sm font-medium text-white hover:bg-secondary-dark transition`}
            onClick={startMeditationSession}
            disabled={meditationActive}
          >
            {meditationActive ? 'In Progress...' : 'Begin Session'}
          </button>
        </div>
        
        {/* Journal Entry */}
        <div className="bg-surface rounded-xl p-4 hover:shadow-lg transition">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium">Gratitude Journal</h3>
              <p className="text-xs text-gray-400">Evening reflection</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center">
              <i className="ri-book-read-line text-accent-blue"></i>
            </div>
          </div>
          <div className="h-36 rounded-lg bg-surface-light p-3 mb-3">
            <textarea 
              placeholder="What are you grateful for today?" 
              className="w-full h-full bg-transparent border-none resize-none focus:outline-none text-sm text-gray-300"
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
            ></textarea>
          </div>
          <button 
            className="w-full py-2 bg-accent-blue rounded-lg text-sm font-medium text-white hover:opacity-90 transition"
            onClick={saveJournalEntry}
          >
            Save Entry
          </button>
        </div>
      </div>
    </section>
  );
};

export default DailyPractices;
