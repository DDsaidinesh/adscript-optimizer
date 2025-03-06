
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { api } from "@/services/api";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
