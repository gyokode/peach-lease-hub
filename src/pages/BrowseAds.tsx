import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Calendar, Users, Flag } from "lucide-react";

const BrowseAds = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [universityFilter, setUniversityFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // Mock data for ads
  const ads = [
    {
      id: 1,
      title: "Luxury 2BR/2BA Near UGA Campus",
      university: "University of Georgia",
      complex: "The Standard Athens",
      price: 650,
      dates: "May - July 2024",
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["Pool", "Gym", "Parking"],
      description: "Beautiful apartment with modern amenities, 5-minute walk to campus.",
      isPremium: true,
      postedDate: "2 days ago",
      poster: "Sarah M."
    },
    {
      id: 2,
      title: "Cozy Studio in Tech Square",
      university: "Georgia Tech",
      complex: "West Village",
      price: 850,
      dates: "June - August 2024",
      bedrooms: 0,
      bathrooms: 1,
      amenities: ["Study Rooms", "Rooftop"],
      description: "Perfect for grad students, right in the heart of Tech Square.",
      isPremium: false,
      postedDate: "1 day ago",
      poster: "Mike R."
    },
    {
      id: 3,
      title: "Shared House with Great Roommates",
      university: "University of Georgia",
      complex: "Private House",
      price: 450,
      dates: "Summer 2024",
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["Yard", "Parking", "Pets OK"],
      description: "Looking for one more roommate in our awesome house near campus!",
      isPremium: true,
      postedDate: "3 days ago",
      poster: "Alex K."
    },
    {
      id: 4,
      title: "Modern 1BR in Midtown Atlanta",
      university: "Georgia Tech",
      complex: "SQ5 Apartments",
      price: 1200,
      dates: "Fall Semester",
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["Concierge", "Gym", "Pool"],
      description: "High-rise living with amazing city views and easy MARTA access.",
      isPremium: false,
      postedDate: "5 days ago",
      poster: "Jordan L."
    },
    {
      id: 5,
      title: "Budget-Friendly Room Near UGA",
      university: "University of Georgia",
      complex: "College Station",
      price: 350,
      dates: "Spring Semester",
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["Bus Route", "Laundry"],
      description: "Great option for students on a budget, friendly community.",
      isPremium: false,
      postedDate: "1 week ago",
      poster: "Taylor B."
    }
  ];

  // Sort ads to show premium first
  const sortedAds = [...ads].sort((a, b) => {
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Browse Student Housing
          </h1>
          <p className="text-muted-foreground">
            Find your perfect sublease from verified students at UGA and Georgia Tech
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-soft">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search apartments, areas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* University Filter */}
              <Select value={universityFilter} onValueChange={setUniversityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  <SelectItem value="uga">University of Georgia</SelectItem>
                  <SelectItem value="gatech">Georgia Tech</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-500">Under $500</SelectItem>
                  <SelectItem value="500-800">$500 - $800</SelectItem>
                  <SelectItem value="800-1200">$800 - $1200</SelectItem>
                  <SelectItem value="1200+">$1200+</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Button */}
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {sortedAds.length} listings
          </p>
          <Button variant="hero" asChild>
            <Link to="/post">Post Your Sublease</Link>
          </Button>
        </div>

        {/* Ads Grid */}
        <div className="grid gap-6">
          {sortedAds.map((ad) => (
            <Card 
              key={ad.id} 
              className={`shadow-card transition-smooth hover:shadow-premium ${
                ad.isPremium ? 'border-premium shadow-premium' : ''
              }`}
            >
              {ad.isPremium && (
                <div className="bg-gradient-premium text-premium-foreground px-4 py-2 text-sm font-medium rounded-t-lg flex items-center justify-between">
                  <span>Featured 🍑</span>
                  <Badge variant="secondary" className="bg-premium-foreground/20 text-premium-foreground">
                    Premium
                  </Badge>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {ad.title}
                      </h3>
                      <Badge variant="outline" className="text-2xl font-bold text-primary">
                        ${ad.price}/mo
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{ad.complex}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{ad.dates}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{ad.bedrooms}BR/{ad.bathrooms}BA</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Report Button */}
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {ad.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {ad.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    <span>Posted by {ad.poster} • {ad.postedDate}</span>
                    <br />
                    <span className="text-xs">{ad.university}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/ad/${ad.id}`}>View Details</Link>
                    </Button>
                    <Button variant="default" size="sm" asChild>
                      <Link to={`/ad/${ad.id}#message`}>Message Poster</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Sponsor Sidebar */}
        <div className="mt-12">
          <Card className="bg-gradient-subtle border-0 shadow-card">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Local Landlord Sponsors
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Trusted partners in the Athens & Atlanta areas
              </p>
              <div className="h-16 bg-muted/50 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Sponsor Space</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrowseAds;