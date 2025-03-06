
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import CampaignCard from "@/components/CampaignCard";
import { api, Campaign } from "@/services/api";

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Mock data for the preview
        // In production, this would be: const data = await api.campaigns.list();
        const mockData: Campaign[] = [
          {
            id: 1,
            user_id: 1,
            product_name: "SleepWell Mattress",
            product_description: "Premium memory foam mattress designed for optimal comfort and support.",
            target_audience: "Adults 25-45 with back pain issues and sleep problems",
            key_use_cases: "Better sleep, back pain relief, improved posture",
            campaign_goal: "Increase online sales",
            niche: "Health & Wellness",
            created_at: "2024-05-01T10:30:00Z",
            updated_at: "2024-05-01T10:30:00Z",
          },
          {
            id: 2,
            user_id: 1,
            product_name: "FocusBoost Pro",
            product_description: "Nootropic supplement that improves focus, concentration and mental clarity.",
            target_audience: "Students, professionals, and creative workers who need to focus for long periods",
            key_use_cases: "Exam preparation, work productivity, creative projects",
            campaign_goal: "Generate leads for subscription service",
            niche: "Productivity",
            created_at: "2024-05-10T15:45:00Z",
            updated_at: "2024-05-10T15:45:00Z",
          },
        ];
        setCampaigns(mockData);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to AdSynth</p>
          </div>
          <Link to="/campaigns/create" className="mt-4 md:mt-0">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Campaigns</CardTitle>
              <CardDescription>
                Create and manage your ad campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-muted rounded-lg"></div>
                  ))}
                </div>
              ) : campaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                  <Link to="/campaigns/create" className="block h-full">
                    <Card className="flex flex-col items-center justify-center h-full text-center p-6 border-dashed border-2 bg-transparent hover:bg-accent/50 transition-colors">
                      <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="font-medium">Create new campaign</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Set up a new product campaign
                      </p>
                    </Card>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first campaign to start generating ad scripts
                  </p>
                  <Link to="/campaigns/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Campaign
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Dashboard;
