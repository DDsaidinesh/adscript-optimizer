
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layout, MessageSquare, Sparkles } from "lucide-react";
import { api } from "@/services/api";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (api.auth.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Layout className="h-6 w-6 text-primary" />
          <span className="font-display font-semibold text-xl">AdSynth</span>
        </div>
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">
              Get started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32 container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in">
              Create compelling ad scripts with AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: "0.2s" }}>
              AdSynth helps you generate high-converting ad scripts powered by the latest AI models
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in opacity-0" style={{ animationDelay: "0.4s" }}>
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto group">
                  <span>Get started for free</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-accent/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg glass-panel animate-slide-up opacity-0" style={{ animationDelay: "0.1s" }}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Leverage multiple AI models to generate engaging ad scripts tailored to your product.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-lg glass-panel animate-slide-up opacity-0" style={{ animationDelay: "0.2s" }}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Reddit-Informed</h3>
                <p className="text-muted-foreground">
                  Scripts are created using real consumer language and pain points from Reddit discussions.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-lg glass-panel animate-slide-up opacity-0" style={{ animationDelay: "0.3s" }}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 12a5 5 0 0 1 0 10H7A5 5 0 0 1 7 2h10a5 5 0 0 1 0 10" />
                    <path d="M10 8a2 2 0 1 0 4 0 2 2 0 0 0-4 0M10 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Multiple Providers</h3>
                <p className="text-muted-foreground">
                  Choose from various AI providers to find the perfect model for your specific needs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AdSynth. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
