import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchDialogProps {
  children: React.ReactNode;
}

const SearchDialog = ({ children }: SearchDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [university, setUniversity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('q', searchQuery);
    if (university) params.append('university', university);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);
    if (bedrooms) params.append('bedrooms', bedrooms);
    if (bathrooms) params.append('bathrooms', bathrooms);

    navigate(`/browse?${params.toString()}`);
    setIsOpen(false);
  };

  const universities = [
    "University of Georgia",
    "Georgia Tech",
    "Georgia State University",
    "Emory University",
    "Agnes Scott College",
    "Mercer University",
    "Clark Atlanta University",
    "Spelman College",
    "Morehouse College"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Housing
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search Keywords</Label>
            <Input
              id="search"
              placeholder="Apartment, complex name, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>University</Label>
            <Select value={university} onValueChange={setUniversity}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {uni}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Bedrooms</Label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        {num} bed{num > 1 ? 's' : ''}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Bathrooms</Label>
              <Select value={bathrooms} onValueChange={setBathrooms}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} bath{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="$5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSearch} variant="hero" className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;