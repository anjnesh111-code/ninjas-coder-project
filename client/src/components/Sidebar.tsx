import { Link, useLocation } from "wouter";
import { APP_CONSTANTS } from "../lib/constants";

const Sidebar = () => {
  const [location] = useLocation();

  const navItems = [
<<<<<<< HEAD
    { path: "/dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
=======
    { path: "/", label: "Dashboard", icon: "ri-dashboard-line" },
>>>>>>> ade6a7e91046f58a1680c172edb7cb1f5b8cbde1
    { path: "/mood-tracking", label: "Mood Tracking", icon: "ri-emotion-line" },
    { path: "/ai-companion", label: "AI Companion", icon: "ri-chat-3-line" },
    { path: "/meditation", label: "Meditation", icon: "ri-meditation-line" },
    { path: "/calming-sounds", label: "Calming Sounds", icon: "ri-music-2-line" },
    { path: "/wellness-games", label: "Wellness Games", icon: "ri-gamepad-line" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface p-4 space-y-6">
      {/* Logo */}
      <div className="flex items-center space-x-3 py-2">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <i className="ri-mental-health-line text-xl text-white"></i>
        </div>
        <h1 className="text-xl font-serif font-semibold text-white">
          {APP_CONSTANTS.APP_NAME}
        </h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            href={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
              location === item.path 
                ? "bg-surface-light text-white" 
                : "hover:bg-surface-light text-gray-300 hover:text-white transition"
            }`}
          >
            <i className={`${item.icon} text-lg`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* User Profile */}
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-surface-light">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <i className="ri-user-line text-gray-300"></i>
        </div>
        <div>
          <p className="text-sm font-medium">Alex Morgan</p>
          <p className="text-xs text-gray-400">alex@example.com</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
