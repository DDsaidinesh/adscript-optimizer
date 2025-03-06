
import { useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdScript } from "@/services/api";
import { toast } from "sonner";

interface AdScriptCardProps {
  adScript: AdScript;
}

const AdScriptCard = ({ adScript }: AdScriptCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(adScript.content);
    toast.success("Ad script copied to clipboard");
  };

  return (
    <Card className="glass-card transition-all duration-300 hover:shadow-elevated">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>
            {adScript.provider.charAt(0).toUpperCase() + adScript.provider.slice(1)} / {adScript.model}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(adScript.created_at)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="whitespace-pre-line text-sm">
          {expanded 
            ? adScript.content 
            : `${adScript.content.substring(0, 150)}${adScript.content.length > 150 ? "..." : ""}`}
        </div>
        {adScript.content.length > 150 && (
          <Button
            variant="link"
            onClick={() => setExpanded(!expanded)}
            className="p-0 h-auto text-xs text-primary mt-2"
          >
            {expanded ? "Show less" : "Show more"}
          </Button>
        )}

        {adScript.reddit_references && adScript.reddit_references.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-medium mb-2">References:</h4>
            <ul className="space-y-2">
              {adScript.reddit_references.map((ref, index) => (
                <li key={index} className="text-xs">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    <span className="line-clamp-1">{ref.title}</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={copyToClipboard}
        >
          <Copy className="mr-2 h-3 w-3" />
          Copy to clipboard
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdScriptCard;
