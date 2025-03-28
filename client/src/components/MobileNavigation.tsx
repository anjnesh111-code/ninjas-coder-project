import { Link, useLocation } from "wouter";

const MobileNavigation = () => {
  const [location] = useLocation();

  const navItems = [
<<<<<<< HEAD
    { path: "/dashboard", label: "Home", icon: "ri-dashboard-line" },
=======
    { path: "/", label: "Home", icon: "ri-dashboard-line" },
>>>>>>> ade6a7e91046f58a1680c172edb7cb1f5b8cbde1
    { path: "/mood-tracking", label: "Mood", icon: "ri-emotion-line" },
    { path: "/meditation", label: "Meditate", icon: "ri-meditation-line" },
    { path: "/ai-companion", label: "AI Chat", icon: "ri-chat-3-line" },
    { path: "/sleep-tracker", label: "Sleep", icon: "ri-sleep-line" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-lighter px-2 py-3 z-10">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center px-3 py-1 ${
              location === item.path ? "text-primary" : "text-gray-400"
            }`}
          >
            <i className={`${item.icon} text-lg`}></i>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
