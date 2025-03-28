import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "./components/Layout";
import LandingLayout from "./components/LandingLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import MoodTracking from "./pages/MoodTracking";
import AiCompanion from "./pages/AiCompanion";
import Meditation from "./pages/Meditation";
import CalmingSounds from "./pages/CalmingSounds";
import SleepTracker from "./pages/SleepTracker";
import Community from "./pages/Community";
import WellnessGames from "./pages/WellnessGames";

function Router() {
  const [location] = useLocation();
  const isLandingPage = location === "/";

  // Use different layout for landing page vs app pages
  return isLandingPage ? (
    <LandingLayout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    </LandingLayout>
  ) : (
    <Layout>
      <Switch>
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/mood-tracking" component={MoodTracking}/>
        <Route path="/ai-companion" component={AiCompanion}/>
        <Route path="/meditation" component={Meditation}/>
        <Route path="/calming-sounds" component={CalmingSounds}/>
        <Route path="/sleep-tracker" component={SleepTracker}/>
        <Route path="/community" component={Community}/>
        <Route path="/wellness-games" component={WellnessGames}/>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
