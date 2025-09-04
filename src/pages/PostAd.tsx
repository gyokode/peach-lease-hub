import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, DollarSign, Calendar, MapPin, Home, Star, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const PostAd = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    university: "",
    complex: "",
    title: "",
    price: "",
    startDate: "",
    endDate: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    amenities: [] as string[],
    isPremium: false
  });

  // Redirect to auth if not logged in
  if (!loading && !user) {
    return (
      <div className="min-h-screen py-8 bg-gradient-subtle">
        <div className="container mx-auto px-4 max-w-md text-center">
          <span className="text-4xl mb-4 block">🍑</span>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Sign In Required
          </h1>
          <p className="text-muted-foreground mb-6">
            You need to sign in with a verified .edu email to post a sublease.
          </p>
          <Button variant="hero" asChild>
            <Link to="/auth">Sign In / Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 bg-muted animate-pulse rounded mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const availableAmenities = [
    "Pool", "Gym", "Parking", "WiFi Included", "Pet Friendly", 
    "Laundry", "Study Rooms", "Rooftop", "Balcony", "Bus Route",
    "Dishwasher", "Air Conditioning", "Heating", "Security"
  ];

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate required fields
    if (!formData.university || !formData.complex || !formData.title || 
        !formData.price || !formData.startDate || !formData.endDate || 
        !formData.bedrooms || !formData.bathrooms || !formData.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Connect to Supabase once types are updated
      // Simulate posting for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Sublease posted successfully!",
        description: "Your listing is now live and visible to other students.",
      });

      navigate('/browse');
    } catch (error: any) {
      toast({
        title: "Error posting sublease",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🍑</span>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Post Your Sublease
          </h1>
          <p className="text-muted-foreground">
            Help a fellow student find their perfect home away from home
          </p>
        </div>

        {/* User Info */}
        {profile && (
          <Card className="mb-8 bg-gradient-subtle border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {profile.display_name?.[0] || profile.email[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Posting as {profile.display_name || profile.email.split('@')[0]}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.university} • Verified .edu Student
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* University */}
              <div>
                <Label htmlFor="university">University *</Label>
                <Select value={formData.university} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, university: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uga">University of Georgia</SelectItem>
                    <SelectItem value="gatech">Georgia Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Complex Name */}
              <div>
                <Label htmlFor="complex">Apartment Complex / Building *</Label>
                <Input
                  id="complex"
                  placeholder="e.g., The Standard Athens, West Village"
                  value={formData.complex}
                  onChange={(e) => setFormData(prev => ({ ...prev, complex: e.target.value }))}
                />
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Listing Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Cozy 2BR Near Campus - Perfect for Summer"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Dates */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price */}
              <div>
                <Label htmlFor="price">Monthly Rent *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="650"
                    className="pl-10"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Available From *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Available Until *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bedrooms & Bathrooms */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Select value={formData.bedrooms} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, bedrooms: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Studio</SelectItem>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Select value={formData.bathrooms} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, bathrooms: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bathroom</SelectItem>
                      <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                      <SelectItem value="2">2 Bathrooms</SelectItem>
                      <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                      <SelectItem value="3">3+ Bathrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your space, location benefits, what makes it special, any important details..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                {availableAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <Label htmlFor={amenity} className="text-sm">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border p-8 rounded-lg text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  Upload photos of your space
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Good photos help your listing get more interest
                </p>
                <Button variant="outline">
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Option */}
          <Card className="shadow-card border-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-premium" />
                Make It Stand Out
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="premium"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isPremium: !!checked }))
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="premium" className="font-medium">
                    Highlight my ad for $5 🍑
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Premium ads appear at the top of search results with special highlighting 
                    and get 3x more views on average.
                  </p>
                  {formData.isPremium && (
                    <Badge className="mt-2 gradient-premium text-premium-foreground">
                      Premium Listing Selected
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  By posting, you agree to our Community Guidelines and confirm 
                  that all information is accurate.
                </p>
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg"
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post My Sublease'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Your listing will be visible to verified students immediately
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default PostAd;