import { useMoods, getMoodStatusText } from "../../hooks/useMoods";
import { DAYS_OF_WEEK } from "../../lib/constants";
import { Mood } from "../../types";

const MoodTrackingCard = () => {
  const { data: moods, isLoading, error } = useMoods(undefined, 7);
  
  // Values for the mock chart (0-100)
  const moodValues = !isLoading && moods ? 
    moods.map(mood => mood.value).reverse() : 
    [70, 60, 45, 50, 30, 65, 75];
  
  // Status derived from the values (for color coding)
  const moodStatuses = moodValues.map(value => {
    if (value >= 65) return "good";
    if (value >= 40) return "neutral";
    return "bad";
  });
  
  // Fill in remaining days if we have less than 7 days of data
  while (moodValues.length < 7) {
    moodValues.unshift(50);
    moodStatuses.unshift("neutral");
  }

  const statusColors = {
    good: "bg-success",
    neutral: "bg-warning",
    bad: "bg-error"
  };

  const getStatusText = () => {
    if (isLoading) return "Loading your mood data...";
    if (error) return "Error loading mood data.";
    if (!moods || moods.length === 0) return "No mood data yet. Try logging how you feel!";
    
    return getMoodStatusText(moods);
  };

  return (
    <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
      <div className="bg-gradient-to-r from-primary to-primary-light p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">Mood Tracking</h3>
          <i className="ri-emotion-line text-white text-xl"></i>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Past 7 days</span>
          <span className="text-sm text-primary-light cursor-pointer">View Details</span>
        </div>
        
        {/* Mood Graph */}
        <div className="h-28 flex items-end space-x-3 mb-2">
          {moodValues.map((value, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`mood-dot w-3 h-3 rounded-full ${statusColors[moodStatuses[index]]} mb-1`}></div>
              <div className="h-20 w-full bg-surface-lighter rounded-sm overflow-hidden">
                <div 
                  className={`${
                    moodStatuses[index] === "good" ? "bg-primary-light" : 
                    moodStatuses[index] === "neutral" ? "bg-warning" : "bg-error"
                  } w-full`} 
                  style={{ height: `${value}%` }}
                ></div>
              </div>
              <span className="text-xs mt-1 text-gray-400">{DAYS_OF_WEEK[index]}</span>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-300 mt-2">{getStatusText()}</p>
      </div>
    </div>
  );
};

export default MoodTrackingCard;
