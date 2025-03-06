
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Campaign } from "@/services/api";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="glass-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium line-clamp-1">
            {campaign.product_name}
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Tag className="h-3 w-3" />
            {campaign.niche}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {campaign.product_description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          <span>Created {formatDate(campaign.created_at)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/campaigns/${campaign.id}`} className="w-full">
          <Button variant="outline" className="w-full group">
            <span className="mr-auto">View campaign</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
