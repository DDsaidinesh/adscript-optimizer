import { useState, useEffect } from "react";
import { Copy, ExternalLink, Video, Play, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdScript } from "@/services/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AdScriptCardProps {
  adScript: AdScript;
}

const AdScriptCard = ({ adScript }: AdScriptCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoFormat, setVideoFormat] = useState<"vertical" | "horizontal">("vertical");
  const [bgMusic, setBgMusic] = useState<string>("none");
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<"pending" | "processing" | "completed" | "failed">("pending");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videos, setVideos] = useState<Array<{id: string, url: string, format: string, created_at: string}>>([]);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/video/list/${adScript.id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    if (videoDialogOpen) {
      fetchVideos();
    }
  }, [videoDialogOpen, adScript.id]);

  useEffect(() => {
    let intervalId: number;
    
    if (videoId && videoStatus === "processing") {
      setCheckingStatus(true);
      intervalId = window.setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/video/${videoId}`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
            },
          });
          
          if (!response.ok) {
            throw new Error("Failed to check video status");
          }
          
          const data = await response.json();
          
          setVideoStatus(data.status);
          setProgress(Math.min(90, progress + 5));
          
          if (data.status === "completed") {
            setVideoUrl(data.video_url);
            setProgress(100);
            await fetchVideos();
            toast.success("Video generation completed");
            clearInterval(intervalId);
            setCheckingStatus(false);
          } else if (data.status === "failed") {
            toast.error("Video generation failed");
            clearInterval(intervalId);
            setCheckingStatus(false);
          }
        } catch (error) {
          console.error("Error checking video status:", error);
          setCheckingStatus(false);
          clearInterval(intervalId);
        }
      }, 5000);
    }
    
    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [videoId, videoStatus, progress]);

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

  const handleGenerateVideo = async () => {
    try {
      setGeneratingVideo(true);
      setProgress(10);
      
      const response = await fetch("http://localhost:8000/api/video/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          ad_script_id: adScript.id,
          video_format: videoFormat,
          background_music: bgMusic !== "none" ? bgMusic : undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to initiate video generation");
      }
      
      const data = await response.json();
      setVideoId(data.video_id);
      setVideoStatus("processing");
      setProgress(30);
      toast.success("Video generation started");
    } catch (error) {
      console.error("Error generating video:", error);
      toast.error("Failed to generate video");
    } finally {
      setGeneratingVideo(false);
    }
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
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={copyToClipboard}
        >
          <Copy className="mr-2 h-3 w-3" />
          Copy
        </Button>
        
        <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex-1"
            >
              <Video className="mr-2 h-3 w-3" />
              Videos
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ad Video Generation</DialogTitle>
              <DialogDescription>
                Generate video content from your ad script.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Format</label>
                  <Select
                    value={videoFormat}
                    onValueChange={(value: "vertical" | "horizontal") => setVideoFormat(value)}
                    disabled={generatingVideo}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vertical">Vertical (9:16)</SelectItem>
                      <SelectItem value="horizontal">Horizontal (16:9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Music</label>
                  <Select
                    value={bgMusic}
                    onValueChange={setBgMusic}
                    disabled={generatingVideo}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select music" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Music</SelectItem>
                      <SelectItem value="upbeat">Upbeat</SelectItem>
                      <SelectItem value="dramatic">Dramatic</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="gentle">Gentle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleGenerateVideo} 
                  disabled={generatingVideo || (videoStatus === "processing" && !!videoId)}
                  className="w-full"
                >
                  {generatingVideo || (videoStatus === "processing" && !!videoId) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {generatingVideo ? "Starting..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-4 w-4" />
                      Generate Video
                    </>
                  )}
                </Button>
                
                {(generatingVideo || videoStatus === "processing") && (
                  <div className="mt-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {checkingStatus 
                        ? "Processing your video. This may take a few minutes..." 
                        : "Initiating video generation..."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      You can close this dialog. We'll notify you when your video is ready!
                    </p>
                  </div>
                )}
              </div>
              
              {videos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Your Videos</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {videos.map((video) => (
                      <div 
                        key={video.id} 
                        className="flex items-center justify-between p-2 border rounded-md bg-secondary/20"
                      >
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {video.format === "vertical" ? "9:16" : "16:9"}
                          </Badge>
                          <span className="text-xs">{formatDate(video.created_at)}</span>
                        </div>
                        <a 
                          href={video.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="ghost">
                            <Play className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setVideoDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default AdScriptCard;
