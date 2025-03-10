
import { toast } from "sonner";

// Base API URL - updated to use localhost:8000
const API_BASE_URL = "http://localhost:8000"; // Updated to use localhost development server

// Types
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Campaign {
  id: number;
  user_id: number;
  product_name: string;
  product_description: string;
  target_audience: string;
  key_use_cases: string;
  campaign_goal: string;
  niche: string;
  created_at: string;
  updated_at: string;
}

export interface RedditReference {
  title: string;
  content: string;
  url: string;
}

export interface AdScript {
  id: number;
  campaign_id: number;
  provider: string;
  model: string;
  platform?: string; // Made platform optional
  content: string;
  reddit_references: RedditReference[];
  created_at: string;
}

// API client
export const api = {
  // Sets the auth token for all future requests
  setToken: (token: string) => {
    localStorage.setItem("auth_token", token);
  },

  // Gets the auth token
  getToken: (): string | null => {
    return localStorage.getItem("auth_token");
  },

  // Removes the auth token
  removeToken: () => {
    localStorage.removeItem("auth_token");
  },

  // Headers for authenticated requests
  authHeaders: (): Headers => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const token = api.getToken();
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
    return headers;
  },

  // Handle response
  handleResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "An unknown error occurred",
      }));
      
      // Show error toast
      toast.error(error.detail || "An error occurred");
      
      // Throw error to be caught by caller
      throw new Error(error.detail || "An error occurred");
    }
    
    // Return JSON if there is content, else return empty object
    if (response.status === 204) {
      return {};
    }
    
    return response.json();
  },

  // Auth endpoints
  auth: {
    register: async (username: string, email: string, password: string): Promise<User> => {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      return api.handleResponse(response);
    },
    
    login: async (username: string, password: string): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/api/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await api.handleResponse(response);
      api.setToken(data.access_token);
      return data;
    },
    
    logout: () => {
      api.removeToken();
    },
    
    isAuthenticated: (): boolean => {
      return !!api.getToken();
    },
  },

  // Campaign endpoints
  campaigns: {
    create: async (campaignData: Omit<Campaign, "id" | "user_id" | "created_at" | "updated_at">): Promise<Campaign> => {
      const response = await fetch(`${API_BASE_URL}/api/campaigns/`, {
        method: "POST",
        headers: api.authHeaders(),
        body: JSON.stringify(campaignData),
      });
      
      return api.handleResponse(response);
    },
    
    get: async (id: number): Promise<Campaign> => {
      const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}`, {
        headers: api.authHeaders(),
      });
      
      return api.handleResponse(response);
    },
    
    update: async (id: number, campaignData: Partial<Campaign>): Promise<Campaign> => {
      const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}`, {
        method: "PUT",
        headers: api.authHeaders(),
        body: JSON.stringify(campaignData),
      });
      
      return api.handleResponse(response);
    },
    
    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}`, {
        method: "DELETE",
        headers: api.authHeaders(),
      });
      
      return api.handleResponse(response);
    },
    
    list: async (): Promise<Campaign[]> => {
      const response = await fetch(`${API_BASE_URL}/api/campaigns/`, {
        headers: api.authHeaders(),
      });
      
      return api.handleResponse(response);
    },
  },

  // Ad script endpoints
  adScripts: {
    generate: async (
      campaign_id: number, 
      provider: string, 
      model: string,
      platform?: string // Made platform optional
    ): Promise<AdScript> => {
      const response = await fetch(`${API_BASE_URL}/api/ad-scripts/generate`, {
        method: "POST",
        headers: api.authHeaders(),
        body: JSON.stringify({ 
          campaign_id, 
          provider, 
          model, 
          platform: platform === "all" ? "none" : platform // Send "none" if "all" is selected
        }),
      });
      
      return api.handleResponse(response);
    },
    
    getByCampaign: async (campaign_id: number): Promise<AdScript[]> => {
      const response = await fetch(`${API_BASE_URL}/api/ad-scripts/campaign/${campaign_id}`, {
        headers: api.authHeaders(),
      });
      
      return api.handleResponse(response);
    },
  },

  // LLM providers - mock data for demonstration
  // In production, this would come from an endpoint
  llmProviders: {
    getProviders: (): { name: string; models: string[] }[] => {
      return [
        {
          name: "openai",
          models: ["gpt-4", "gpt-3.5-turbo"],
        },
        {
          name: "claude",
          models: ["claude-instant", "claude-2"],
        },
        {
          name: "groq",
          models: ["llama-7b", "deepseek-r1-distill-llama-70b"],
        },
      ];
    },
  },
};
