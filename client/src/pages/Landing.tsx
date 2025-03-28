import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Heart, 
  Moon, 
  Sun, 
  MessageSquare, 
  Activity,
  Music, 
  Users, 
  Clock, 
  Sparkles,
  Check
} from "lucide-react";
import { useRef } from "react";

const Landing = () => {
  // Refs for scroll to section
  const featuresRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Features data
  const features = [
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "AI Mental Health Companion",
      description: "Intelligent conversations and personalized guidance for your mental wellness journey."
    },
    {
      icon: <Moon className="h-10 w-10 text-primary" />,
      title: "Sleep Tracking",
      description: "Monitor your sleep patterns and get insights to improve your rest quality."
    },
    {
      icon: <Activity className="h-10 w-10 text-primary" />,
      title: "Mood Tracking",
      description: "Track your emotional states and identify patterns for better self-awareness."
    },
    {
      icon: <Sun className="h-10 w-10 text-primary" />,
      title: "Guided Meditation",
      description: "A variety of meditation sessions tailored to different needs and experience levels."
    },
    {
      icon: <Music className="h-10 w-10 text-primary" />,
      title: "Calming Sounds",
      description: "Soothing audio tracks to help you relax, focus, or fall asleep easier."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Supportive Community",
      description: "Connect with others on similar journeys and share experiences in a safe space."
    }
  ];

  // Benefits data
  const benefits = [
    {
      title: "Reduced Stress & Anxiety",
      description: "Regular practice with our guided tools helps lower stress levels and manage anxiety."
    },
    {
      title: "Improved Sleep Quality",
      description: "Our sleep-focused features help you achieve more restful and rejuvenating sleep."
    },
    {
      title: "Enhanced Self-Awareness",
      description: "Gain deeper insights into your emotional patterns and triggers."
    },
    {
      title: "Better Focus & Productivity",
      description: "Meditation and mindfulness practices help sharpen concentration and efficiency."
    },
    {
      title: "Emotional Resilience",
      description: "Build stronger coping mechanisms for life's challenges."
    },
    {
      title: "Digital Wellbeing",
      description: "Create healthier relationships with technology through mindful usage."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "This app has transformed my daily routine. The meditation sessions are perfect for my busy schedule, and I've noticed a significant improvement in my stress levels.",
      author: "Sarah T."
    },
    {
      quote: "The sleep tracking feature helped me identify what was causing my insomnia. Now I'm sleeping better than I have in years.",
      author: "Michael R."
    },
    {
      quote: "I was skeptical about the AI companion, but it's become an invaluable tool for my mental health. It's like having a supportive friend available anytime.",
      author: "Elena K."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-0"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
        
        <div className="container relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Your Journey to <span className="text-primary">Mental Wellness</span> Starts Here
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
            Experience a comprehensive approach to mental health with personalized tools, AI assistance, and a supportive community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-8">Get Started</Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              Learn More
            </Button>
          </div>
          
          <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 rounded-full p-3 mb-2">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <span className="text-3xl font-bold">5-15</span>
              <span className="text-muted-foreground text-sm">Minutes Daily</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 rounded-full p-3 mb-2">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <span className="text-3xl font-bold">89%</span>
              <span className="text-muted-foreground text-sm">Stress Reduction</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 rounded-full p-3 mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <span className="text-3xl font-bold">100K+</span>
              <span className="text-muted-foreground text-sm">Active Users</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 rounded-full p-3 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <span className="text-3xl font-bold">4.8</span>
              <span className="text-muted-foreground text-sm">App Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        ref={featuresRef}
        className="py-20 px-4 bg-background-light"
      >
        <div className="container text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our holistic approach covers all aspects of mental wellbeing with these powerful tools
          </p>
        </div>
        
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-all hover:border-primary/50"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Begin your wellness journey in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line (desktop only) */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-primary/30"></div>
            
            {/* Steps */}
            <div className="flex flex-col items-center text-center relative">
              <div className="w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center mb-6 z-10">1</div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">Sign up and personalize your preferences for a tailored experience.</p>
            </div>
            
            <div className="flex flex-col items-center text-center relative">
              <div className="w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center mb-6 z-10">2</div>
              <h3 className="text-xl font-semibold mb-2">Explore Features</h3>
              <p className="text-muted-foreground">Discover the various tools available to support your mental wellbeing.</p>
            </div>
            
            <div className="flex flex-col items-center text-center relative">
              <div className="w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center mb-6 z-10">3</div>
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-muted-foreground">Monitor your journey with detailed insights and personalized recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        id="benefits" 
        ref={benefitsRef}
        className="py-20 px-4 bg-background-light"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of Regular Use</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience these positive changes in your daily life with consistent practice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex">
                <div className="mr-4 mt-1">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials" 
        ref={testimonialsRef}
        className="py-20 px-4"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from people who've experienced positive change
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background border border-border rounded-lg p-6 relative">
                <div className="absolute -top-3 left-6 text-primary text-5xl">"</div>
                <p className="text-muted-foreground mb-4 pt-4">{testimonial.quote}</p>
                <p className="font-semibold">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/10">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of others who have transformed their mental wellbeing with our comprehensive tools.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="px-8">Get Started Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;