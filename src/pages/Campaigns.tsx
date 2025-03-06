
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/components/AuthLayout";
import CampaignCard from "@/components/CampaignCard";
import { api, Campaign } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  
  const { 
    data: campaigns = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['campaigns'],
    queryFn: api.campaigns.list,
  });

  // If needed, we can handle errors with the error variable
  useEffect(() => {
    if (error) {
      console.error("Error fetching campaigns:", error);
    }
  }, [error]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCampaigns(campaigns);
    } else {
      const filtered = campaigns.filter(
        (campaign) =>
          campaign.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.product_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCampaigns(filtered);
    }
  }, [searchQuery, campaigns]);

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <Link to="/campaigns/create" className="mt-4 md:mt-0">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search campaigns by name, niche or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-blur-in">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
            <Link to="/campaigns/create" className="block h-full">
              <div className="flex flex-col items-center justify-center h-full text-center p-6 border border-dashed rounded-lg bg-transparent hover:bg-accent/50 transition-colors">
                <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="font-medium">Create new campaign</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Set up a new product campaign
                </p>
              </div>
            </Link>
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
                <p className="text-muted-foreground mb-6">
                  Try using different keywords or clear the search
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Campaigns;
