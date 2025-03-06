import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthLayout from "@/components/AuthLayout";
import { api, Campaign } from "@/services/api";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    target_audience: "",
    key_use_cases: "",
    campaign_goal: "",
    niche: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const campaign = await api.campaigns.create(formData);
      
      toast.success("Campaign created successfully");
      
      navigate(`/campaigns/${campaign.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      // Toast is shown by api.handleResponse
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Create New Campaign</h1>

        <Card className="max-w-2xl mx-auto animate-scale-in">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Fill in the details about your product and campaign goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  placeholder="e.g., SleepWell Mattress"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product_description">Product Description</Label>
                <Textarea
                  id="product_description"
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleChange}
                  placeholder="Describe your product and its main benefits..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience</Label>
                <Textarea
                  id="target_audience"
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  placeholder="Who is your ideal customer? Include demographics, pain points, etc."
                  rows={2}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="key_use_cases">Key Use Cases</Label>
                <Textarea
                  id="key_use_cases"
                  name="key_use_cases"
                  value={formData.key_use_cases}
                  onChange={handleChange}
                  placeholder="How do people use your product? What problems does it solve?"
                  rows={2}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign_goal">Campaign Goal</Label>
                <Input
                  id="campaign_goal"
                  name="campaign_goal"
                  value={formData.campaign_goal}
                  onChange={handleChange}
                  placeholder="e.g., Increase sales, generate leads, build brand awareness"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="niche">Product Niche</Label>
                <Input
                  id="niche"
                  name="niche"
                  value={formData.niche}
                  onChange={handleChange}
                  placeholder="e.g., Health & Wellness, Technology, Finance"
                  required
                />
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Campaign"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default CreateCampaign;
