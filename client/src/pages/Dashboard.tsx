import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, APP_CONSTANTS, getGreeting } from "../lib/constants";
import { User } from "../types";
import QuickMoodCheck from "../components/QuickMoodCheck";
import MoodTrackingCard from "../components/cards/MoodTrackingCard";
import AIChatbotCard from "../components/cards/AIChatbotCard";
import MeditationCard from "../components/cards/MeditationCard";
import SleepTrackerCard from "../components/cards/SleepTrackerCard";
import SoundTherapyCard from "../components/cards/SoundTherapyCard";
import FaceRecognitionCard from "../components/cards/FaceRecognitionCard";
import DailyPractices from "../components/DailyPractices";
import CommunityInsights from "../components/CommunityInsights";

const Dashboard = () => {
  const { data: user } = useQuery<User>({
    queryKey: [`${API_ENDPOINTS.USERS}/${APP_CONSTANTS.DEFAULT_USER_ID}`],
  });

  const greeting = getGreeting();
  const userName = user?.name || "there";

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white">
            {greeting}, {userName}
          </h1>
          <p className="text-gray-400 mt-1">How are you feeling today?</p>
        </div>
        <div className="bg-surface-light p-3 rounded-lg flex items-center space-x-2">
          <i className="ri-notification-3-line text-lg text-gray-300"></i>
          <span className="bg-primary w-2 h-2 rounded-full"></span>
        </div>
      </div>

      {/* Quick Mood Check */}
      <QuickMoodCheck />

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <MoodTrackingCard />
        <AIChatbotCard />
        <MeditationCard />
        <SleepTrackerCard />
        <SoundTherapyCard />
        <FaceRecognitionCard />
      </div>

      {/* Daily Practice Section */}
      <DailyPractices />
      
      {/* Community Insights */}
      <CommunityInsights />
    </div>
  );
};

export default Dashboard;
