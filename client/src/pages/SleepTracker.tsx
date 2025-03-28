import { useState } from "react";
import { useSleep, useCreateSleep, getAverageSleepHours, getSleepStatusText } from "../hooks/useSleep";
import { DAYS_OF_WEEK } from "../lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Sleep, SleepQuality } from "../types";

const SleepTracker = () => {
  const { toast } = useToast();
  const { data: sleepData, isLoading } = useSleep();
  const createSleep = useCreateSleep();
  
  const [hours, setHours] = useState(7.5);
  const [quality, setQuality] = useState<SleepQuality>("good");
  const [note, setNote] = useState("");
  
  const avgSleepHours = !isLoading && sleepData ? getAverageSleepHours(sleepData) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hours < 0 || hours > 24) {
      toast({
        title: "Invalid hours",
        description: "Sleep hours must be between 0 and 24.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createSleep.mutateAsync({
        hours,
        quality,
        note
      });
      
      toast({
        title: "Sleep recorded",
        description: "Your sleep data has been successfully recorded.",
      });
      
      // Reset form
      setHours(7.5);
      setQuality("good");
      setNote("");
    } catch (error) {
      console.error("Error recording sleep:", error);
      toast({
        title: "Error",
        description: "Failed to record your sleep data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get last 7 days for the graph
  const getLastSevenDays = (): { date: Date; sleep?: Sleep }[] => {
    const today = new Date();
    const days: { date: Date; sleep?: Sleep }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const sleepForDay = sleepData?.find(sleep => {
        const sleepDate = new Date(sleep.createdAt);
        sleepDate.setHours(0, 0, 0, 0);
        return sleepDate.getTime() === date.getTime();
      });
      
      days.push({ date, sleep: sleepForDay });
    }
    
    return days;
  };

  const lastSevenDays = getLastSevenDays();

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-2">
          Sleep Tracker
        </h1>
        <p className="text-gray-400">
          Track your sleep patterns to improve your rest quality and mental wellbeing
        </p>
      </div>
      
      {/* Sleep Overview */}
      <div className="bg-surface rounded-xl p-5 mb-6">
        <h2 className="text-lg font-medium mb-4">Sleep Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-surface-light rounded-lg p-4">
            <h3 className="text-sm text-gray-400 mb-1">Average Sleep</h3>
            <div className="flex items-end">
              <span className="text-2xl font-medium text-white">{avgSleepHours}</span>
              <span className="text-gray-400 ml-1 mb-0.5">hours</span>
            </div>
          </div>
          
          <div className="bg-surface-light rounded-lg p-4">
            <h3 className="text-sm text-gray-400 mb-1">Sleep Goal</h3>
            <div className="flex items-end">
              <span className="text-2xl font-medium text-white">8</span>
              <span className="text-gray-400 ml-1 mb-0.5">hours</span>
            </div>
          </div>
          
          <div className="bg-surface-light rounded-lg p-4">
            <h3 className="text-sm text-gray-400 mb-1">Sleep Quality</h3>
            <div className="flex items-center">
              {sleepData && sleepData.length > 0 ? (
                <div className="text-lg font-medium capitalize">
                  {sleepData[0].quality || "Unknown"}
                </div>
              ) : (
                <div className="text-lg font-medium text-gray-400">No data</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sleep Graph */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Last 7 Days</h3>
            <div className="flex items-center space-x-1">
              <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
              <span className="text-xs text-gray-400">Hours Slept</span>
            </div>
          </div>
          
          <div className="h-48 flex items-end space-x-2">
            {lastSevenDays.map((day, index) => {
              const sleepHours = day.sleep?.hours || 0;
              const percentage = Math.min((sleepHours / 10) * 100, 100); // 10 hours as max for scale
              const barColor = sleepHours >= 7 ? "bg-primary" : 
                              sleepHours >= 6 ? "bg-warning" : "bg-error";
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="h-40 w-full bg-surface-lighter rounded-sm overflow-hidden relative">
                    <div 
                      className={`absolute bottom-0 w-full ${barColor} transition-all duration-500`} 
                      style={{ height: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex flex-col items-center">
                    <span className="text-xs text-gray-300">{sleepHours ? sleepHours.toFixed(1) : "-"}</span>
                    <span className="text-xs text-gray-400 mt-1">{DAYS_OF_WEEK[index].substring(0, 1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <p className="text-sm text-gray-300 mt-4">
            {!isLoading && sleepData ? getSleepStatusText(sleepData) : "Track your sleep to see insights."}
          </p>
        </div>
      </div>
      
      {/* Log Sleep */}
      <div className="bg-surface rounded-xl p-5">
        <h2 className="text-lg font-medium mb-4">Log Your Sleep</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Hours Slept</label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-surface-lighter rounded-lg appearance-none cursor-pointer accent-primary mr-4"
              />
              <div className="w-16 p-2 bg-surface-light rounded text-center">
                {hours.toFixed(1)}
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">0h</span>
              <span className="text-xs text-gray-400">12h</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Sleep Quality</label>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg text-sm ${
                  quality === "good" ? "bg-primary text-white" : "bg-surface-light text-gray-300"
                }`}
                onClick={() => setQuality("good")}
              >
                Good
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg text-sm ${
                  quality === "fair" ? "bg-warning text-white" : "bg-surface-light text-gray-300"
                }`}
                onClick={() => setQuality("fair")}
              >
                Fair
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-lg text-sm ${
                  quality === "poor" ? "bg-error text-white" : "bg-surface-light text-gray-300"
                }`}
                onClick={() => setQuality("poor")}
              >
                Poor
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How did you sleep? Any factors that affected your rest?"
              className="w-full bg-surface-light rounded-lg p-3 text-sm text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-primary-dark rounded-lg text-white font-medium hover:bg-opacity-90 transition"
            disabled={createSleep.isPending}
          >
            {createSleep.isPending ? "Logging..." : "Log Sleep"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SleepTracker;
