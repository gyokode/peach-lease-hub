import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, DollarSign, Calendar, Users, Home, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useHousingAds } from "@/hooks/useHousingAds";
import ImageUpload from "@/components/ImageUpload";

const PostAd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDemo = new URLSearchParams(location.search).get('demo') === '1';
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();
  const { createAd } = useHousingAds();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    datesAvailable: "",
    complex: "",
    university: "",
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user && !isDemo) {
      navigate('/auth');
    }
  }, [user, authLoading, isDemo, navigate]);

  // Predefined amenities
  const amenitiesList = [
    "Swimming Pool", "Gym/Fitness Center", "Parking", "Laundry", "Pet Friendly",
    "Study Rooms", "Rooftop Access", "Balcony", "In-Unit Washer/Dryer", 
    "Dishwasher", "Air Conditioning", "Heating", "High-Speed Internet",
    "Cable TV", "Security System", "Elevator", "Courtyard", "BBQ Area"
  ];

  const addAmenity = (amenity: string) => {
    if (!selectedAmenities.includes(amenity)) {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const removeAmenity = (amenity: string) => {
    setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities([...selectedAmenities, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.bedrooms || !formData.bathrooms || !formData.university || !formData.datesAvailable) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

  setIsSubmitting(true);

  if (isDemo) {
    const demoAds = JSON.parse(localStorage.getItem('demo_ads') || '[]');
    const newAd = {
      id: `demo-ad-${Date.now()}`,
      ...formData,
      amenities: selectedAmenities,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('demo_ads', JSON.stringify([newAd, ...demoAds]));
    toast({ title: 'Sublease Saved (Demo Mode)', description: 'Your listing is saved locally for testing.' });
    setIsSubmitting(false);
    navigate('/browse?demo=1');
    return;
  }
  
  const { data, error } = await createAd({
    title: formData.title,
    description: formData.description || null,
    price: parseFloat(formData.price),
    bedrooms: parseInt(formData.bedrooms),
    bathrooms: parseInt(formData.bathrooms),
    dates_available: formData.datesAvailable,
    amenities: selectedAmenities.length > 0 ? selectedAmenities : null,
    complex_name: formData.complex || null,
    university: formData.university,
    is_premium: false
  });

  if (error) {
    toast({
      title: "Error Creating Listing",
      description: error,
      variant: "destructive",
    });
  } else {
    toast({
      title: "Sublease Posted Successfully! 🍑",
      description: "Your listing is now live and visible to other students.",
    });
    navigate("/browse");
  }
  
  setIsSubmitting(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="h-32 w-32 bg-muted/50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🍑</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isDemo) {
    return null; // Will redirect to auth
  }

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
        {(profile || isDemo) && (
          <Card className="mb-8 bg-gradient-subtle border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {(profile?.display_name?.[0] || profile?.email?.[0]) ?? 'D'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Posting as {profile?.display_name || profile?.email?.split('@')[0] || 'Demo User'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {(profile?.university || 'Demo University')} {isDemo && '• Demo Mode'}
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
                    <SelectItem value="University of Georgia">University of Georgia</SelectItem>
                    <SelectItem value="Georgia Tech">Georgia Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Complex Name */}
              <div>
                <Label htmlFor="complex">Apartment Complex / Building</Label>
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

              {/* Dates Available */}
              <div>
                <Label htmlFor="datesAvailable">Dates Available *</Label>
                <Input
                  id="datesAvailable"
                  placeholder="e.g., May - July 2024, Summer 2024, Fall Semester"
                  value={formData.datesAvailable}
                  onChange={(e) => setFormData(prev => ({ ...prev, datesAvailable: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your space, what makes it special, any house rules..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Property Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={8}
              />
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Amenities & Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Amenities */}
              {selectedAmenities.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Selected Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedAmenities.map((amenity, index) => (
                      <Badge key={index} variant="default" className="text-sm">
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Amenities */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Available Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenitiesList.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            addAmenity(amenity);
                          } else {
                            removeAmenity(amenity);
                          }
                        }}
                      />
                      <Label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Amenity */}
              <div>
                <Label htmlFor="customAmenity" className="text-sm font-medium mb-3 block">
                  Add Custom Amenity
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="customAmenity"
                    placeholder="e.g., Private Entrance, Garden Access"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomAmenity();
                      }
                    }}
                  />
                  <Button type="button" onClick={addCustomAmenity} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground text-sm">
                  By posting this listing, you agree to our Community Guidelines and Terms of Service.
                  All listings are subject to verification.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button type="button" variant="outline" onClick={() => navigate('/browse')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="min-w-32">
                    {isSubmitting ? "Posting..." : "Post Sublease 🍑"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default PostAd;