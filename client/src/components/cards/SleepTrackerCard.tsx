import { useSleep, getAverageSleepHours } from "../../hooks/useSleep";
import { DAYS_OF_WEEK_SHORT } from "../../lib/constants";

const SleepTrackerCard = () => {
  const { data: sleepData, isLoading, error } = useSleep(undefined, 7);
  
  // Values for the chart (0-100%, representing percentage of 8 hours)
  const sleepHours = !isLoading && sleepData ? 
    sleepData.map(sleep => sleep.hours).reverse() : 
    [6.5, 7.5, 7.0, 6.0, 5.0, 8.0, 8.5];
  
  // Convert hours to percentage (assuming 8 hours is 100%)
  const sleepPercentages = sleepHours.map(hours => Math.min((hours / 8) * 100, 100));
  
  // Fill in remaining days if we have less than 7 days of data
  while (sleepPercentages.length < 7) {
    sleepPercentages.unshift(60);
  }

  const avgHours = !isLoading && sleepData ? 
    getAverageSleepHours(sleepData) : 
    6.8;

  return (
    <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
      <div className="bg-gradient-to-r from-primary-dark to-secondary-dark p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">Sleep Tracker</h3>
          <i className="ri-sleep-line text-white text-xl"></i>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Last 7 nights</span>
          <div className="flex items-center space-x-1">
            <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
            <span className="text-xs text-gray-400">Avg. {avgHours}hrs</span>
          </div>
        </div>
        
        {/* Sleep Graph */}
        <div className="h-32 flex items-end space-x-2 mb-2">
          {sleepPercentages.map((percentage, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="h-24 w-full bg-surface-lighter rounded-sm overflow-hidden">
                <div 
                  className="bg-primary-dark w-full" 
                  style={{ height: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-xs mt-1 text-gray-400">{DAYS_OF_WEEK_SHORT[index]}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-2">
          <button className="w-full py-2 text-sm text-primary-dark border border-primary-dark rounded-lg hover:bg-primary-dark hover:bg-opacity-10 transition">
            Log Tonight's Sleep
          </button>
        </div>
      </div>
    </div>
  );
};

export default SleepTrackerCard;
