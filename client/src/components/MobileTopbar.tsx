import { useState } from "react";
import { Link } from "wouter";
import { APP_CONSTANTS } from "../lib/constants";

const MobileTopbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
    { path: "/mood-tracking", label: "Mood Tracking", icon: "ri-emotion-line" },
    { path: "/ai-companion", label: "AI Companion", icon: "ri-chat-3-line" },
    { path: "/meditation", label: "Meditation", icon: "ri-meditation-line" },
    { path: "/calming-sounds", label: "Calming Sounds", icon: "ri-music-2-line" },
    { path: "/sleep-tracker", label: "Sleep Tracker", icon: "ri-sleep-line" },
    { path: "/community", label: "Community", icon: "ri-group-line" },
    { path: "/wellness-games", label: "Wellness Games", icon: "ri-gamepad-line" },
  ];

  return (
    <nav className="md:hidden bg-surface p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <i className="ri-mental-health-line text-lg text-white"></i>
        </div>
        <h1 className="text-lg font-serif font-semibold text-white">
          {APP_CONSTANTS.APP_NAME}
        </h1>
      </div>
      <button 
        className="p-2 rounded-full hover:bg-surface-light" 
        aria-label="Menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <i className={`${menuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-64 bg-surface p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button 
                className="p-2 rounded-full hover:bg-surface-light" 
                onClick={() => setMenuOpen(false)}
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-surface-light text-gray-300 hover:text-white transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="mt-6 pt-6 border-t border-surface-light">
              <div className="flex items-center space-x-3 p-3 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <i className="ri-user-line text-gray-300"></i>
                </div>
                <div>
                  <p className="text-sm font-medium">Alex Morgan</p>
                  <p className="text-xs text-gray-400">alex@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MobileTopbar;
