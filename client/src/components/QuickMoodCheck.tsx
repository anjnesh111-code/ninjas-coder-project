import { useState } from "react";
import { useCreateMood } from "../hooks/useMoods";
import { MOOD_EMOJIS } from "../lib/constants";
import { MoodType } from "../types";
import { useToast } from "@/hooks/use-toast";

const QuickMoodCheck = () => {
  const { toast } = useToast();
  const createMood = useCreateMood();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  
  const moodOptions: { type: MoodType; value: number }[] = [
    { type: "happy", value: 90 },
    { type: "calm", value: 75 },
    { type: "neutral", value: 50 },
    { type: "anxious", value: 30 },
    { type: "sad", value: 15 },
  ];

  const handleMoodSelection = async (mood: MoodType, value: number) => {
    setSelectedMood(mood);
    
    try {
      await createMood.mutateAsync({
        mood,
        value,
        note: `Quick mood check: ${mood}`
      });
      
      toast({
        title: "Mood recorded",
        description: `Thank you for sharing how you feel.`,
      });
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
    <div className="bg-surface rounded-xl p-5 mb-6">
      <h2 className="text-lg font-medium mb-4">How are you feeling right now?</h2>
      <div className="flex justify-between items-center">
        {moodOptions.map(({ type, value }) => (
          <button
            key={type}
            className={`p-3 flex flex-col items-center rounded-lg transition wave-animation ${
              selectedMood === type ? "bg-surface-light" : "hover:bg-surface-light"
            }`}
            onClick={() => handleMoodSelection(type, value)}
          >
            <div className="text-3xl mb-2">{MOOD_EMOJIS[type]}</div>
            <span className="text-sm capitalize">{type}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickMoodCheck;
