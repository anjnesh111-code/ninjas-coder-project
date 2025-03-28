import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileTopbar from "./MobileTopbar";
import MobileNavigation from "./MobileNavigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-gray-200">
      {/* Sidebar - Hidden on mobile */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {/* Top Navigation - Mobile only */}
        <MobileTopbar />
        
        {/* Page Content */}
        {children}
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default Layout;
