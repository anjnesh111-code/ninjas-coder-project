import { useState } from "react";
import { useMoods, useCreateMood } from "../hooks/useMoods";
import { MOOD_EMOJIS } from "../lib/constants";
import { MoodType } from "../types";
import { useToast } from "@/hooks/use-toast";

const MoodTracking = () => {
  const { toast } = useToast();
  const { data: moods, isLoading } = useMoods();
  const createMood = useCreateMood();
  
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodValue, setMoodValue] = useState(50);
  const [moodNote, setMoodNote] = useState("");
  
  const moodOptions: MoodType[] = ["happy", "calm", "neutral", "anxious", "sad"];
  
  const handleMoodSelection = (mood: MoodType) => {
    setSelectedMood(mood);
    
    // Set default value based on mood
    switch (mood) {
      case "happy": setMoodValue(90); break;
      case "calm": setMoodValue(75); break;
      case "neutral": setMoodValue(50); break;
      case "anxious": setMoodValue(30); break;
      case "sad": setMoodValue(15); break;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMood) {
      toast({
        title: "Missing selection",
        description: "Please select a mood before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createMood.mutateAsync({
        mood: selectedMood,
        value: moodValue,
        note: moodNote
      });
      
      toast({
        title: "Mood recorded",
        description: "Your mood has been successfully recorded.",
      });
      
      // Reset form
      setSelectedMood(null);
      setMoodValue(50);
      setMoodNote("");
    } catch (error) {
      console.error("Error recording mood:", error);
      toast({
        title: "Error",
        description: "Failed to record your mood. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-2">
          Mood Tracking
        </h1>
        <p className="text-gray-400">
          Track your emotions to identify patterns and improve your mental wellness
        </p>
      </div>
      
      {/* Mood Input Form */}
      <div className="bg-surface rounded-xl p-5 mb-6">
        <h2 className="text-lg font-medium mb-4">How are you feeling right now?</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            {moodOptions.map(mood => (
              <button
                key={mood}
                type="button"
                className={`p-3 flex flex-col items-center rounded-lg transition ${
                  selectedMood === mood ? "bg-surface-light" : "hover:bg-surface-light"
                }`}
                onClick={() => handleMoodSelection(mood)}
              >
                <div className="text-3xl mb-2">{MOOD_EMOJIS[mood]}</div>
                <span className="text-sm capitalize">{mood}</span>
              </button>
            ))}
          </div>
          
          {selectedMood && (
            <>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Intensity</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={moodValue}
                  onChange={e => setMoodValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-lighter rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">Low</span>
                  <span className="text-xs text-gray-400">High</span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
                <textarea
                  value={moodNote}
                  onChange={e => setMoodNote(e.target.value)}
                  placeholder="What's contributing to your mood? Any thoughts you want to capture?"
                  className="w-full bg-surface-light rounded-lg p-3 text-sm text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-primary rounded-lg text-white font-medium hover:bg-primary-dark transition"
                disabled={createMood.isPending}
              >
                {createMood.isPending ? "Recording..." : "Record Mood"}
              </button>
            </>
          )}
        </form>
      </div>
      
      {/* Mood History */}
      <div className="bg-surface rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Your Mood History</h2>
          <span className="text-sm text-primary-light cursor-pointer">View All</span>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4">Loading your mood history...</div>
          ) : !moods || moods.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No mood entries yet. Start tracking to see your history!
            </div>
          ) : (
            moods.slice(0, 5).map(mood => (
              <div key={mood.id} className="bg-surface-light rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{MOOD_EMOJIS[mood.mood as MoodType]}</div>
                    <div>
                      <h3 className="font-medium capitalize">{mood.mood}</h3>
                      <p className="text-xs text-gray-400">
                        {new Date(mood.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {mood.value}%
                  </div>
                </div>
                {mood.note && (
                  <p className="mt-2 text-sm text-gray-300 border-t border-surface pt-2">
                    {mood.note}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracking;
