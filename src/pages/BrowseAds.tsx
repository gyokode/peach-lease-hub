import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Calendar, Users, Flag } from "lucide-react";
import { useHousingAds } from "@/hooks/useHousingAds";

const BrowseAds = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [universityFilter, setUniversityFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const { ads, loading, error, searchAds } = useHousingAds();

  useEffect(() => {
    handleSearch();
  }, [universityFilter, priceFilter]);

  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
      searchAds(searchParam, universityFilter, priceFilter);
    }
  }, [searchParams]);

  const handleSearch = () => {
    searchAds(searchTerm, universityFilter, priceFilter);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="h-32 w-32 bg-muted/50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🍑</span>
          </div>
          <p className="text-muted-foreground">Loading housing ads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="h-32 w-32 bg-muted/50 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <p className="text-muted-foreground">Error loading ads: {error}</p>
        </div>
      </div>
    );
  }

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
                    onChange={handleSearchInputChange}
                    onKeyPress={handleKeyPress}
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

              {/* Search Button */}
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {ads.length} listings
          </p>
          <Button variant="hero" asChild>
            <Link to="/post">Post Your Sublease</Link>
          </Button>
        </div>

        {/* Ads Grid */}
        {ads.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="h-32 w-32 bg-muted/50 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">🍑</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No listings found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search filters or be the first to post a sublease!
              </p>
              <Button variant="hero" asChild>
                <Link to="/post">Post a Sublease</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {ads.map((ad) => (
              <Card 
                key={ad.id} 
                className={`shadow-card transition-smooth hover:shadow-premium ${
                  ad.is_premium ? 'border-premium shadow-premium' : ''
                }`}
              >
                {ad.is_premium && (
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
                        <span>{ad.complex_name || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{ad.dates_available}</span>
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
                  {ad.amenities?.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  )) || <span className="text-muted-foreground text-sm">No amenities listed</span>}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    <span>Posted by {ad.poster_name} • {new Date(ad.created_at).toLocaleDateString()}</span>
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
        )}

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