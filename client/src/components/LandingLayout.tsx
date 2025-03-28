import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface LandingLayoutProps {
  children: ReactNode;
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
  const isMobile = useIsMobile();
  const [navOpen, setNavOpen] = useState(false);
  
  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary animate-pulse-slow"></div>
            <span className="text-xl font-semibold">MindfulMe</span>
          </div>
          
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={toggleNav} className="md:hidden">
              {navOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          ) : (
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features">
                <Button variant="link">Features</Button>
              </Link>
              <Link href="#benefits">
                <Button variant="link">Benefits</Button>
              </Link>
              <Link href="#testimonials">
                <Button variant="link">Testimonials</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="default">Get Started</Button>
              </Link>
            </nav>
          )}
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobile && navOpen && (
          <div className="container pb-4 flex flex-col gap-2 md:hidden">
            <Link href="#features" onClick={() => setNavOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Features</Button>
            </Link>
            <Link href="#benefits" onClick={() => setNavOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Benefits</Button>
            </Link>
            <Link href="#testimonials" onClick={() => setNavOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Testimonials</Button>
            </Link>
            <Link href="/dashboard" onClick={() => setNavOpen(false)}>
              <Button className="w-full mt-2">Get Started</Button>
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background p-6 md:p-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary"></div>
                <span className="text-lg font-semibold">MindfulMe</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your daily companion for mental wellness and mindfulness practices.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Mood Tracking</li>
                <li>Meditation</li>
                <li>Sleep Tracker</li>
                <li>AI Companion</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Blog</li>
                <li>Community</li>
                <li>Support</li>
                <li>FAQs</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} MindfulMe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;