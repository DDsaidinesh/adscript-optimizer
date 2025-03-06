
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { Layout, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    api.auth.logout();
    navigate("/login");
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md shadow-subtle" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Layout className="h-6 w-6 text-primary" />
            <span className="font-display font-semibold text-xl">AdSynth</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/dashboard" ? "text-primary" : "text-foreground/80"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/campaigns"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname.includes("/campaigns") ? "text-primary" : "text-foreground/80"
              }`}
            >
              Campaigns
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-sm font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </nav>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-subtle animate-slide-down">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/dashboard"
              className={`py-2 text-base font-medium transition-colors hover:text-primary ${
                location.pathname === "/dashboard" ? "text-primary" : "text-foreground/80"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/campaigns"
              className={`py-2 text-base font-medium transition-colors hover:text-primary ${
                location.pathname.includes("/campaigns") ? "text-primary" : "text-foreground/80"
              }`}
            >
              Campaigns
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="justify-start px-0 hover:bg-transparent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
