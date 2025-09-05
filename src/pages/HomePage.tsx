import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, DollarSign, Users, Shield, Clock } from "lucide-react";

const HomePage = () => {
  const howItWorksSteps = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Browse Verified Listings",
      description: "All posts require .edu verification for trusted student-to-student connections."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Connect Safely",
      description: "Message directly through our secure platform with verified students only."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Peace of Mind",
      description: "Community reporting and guidelines keep our platform safe and reliable."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-subtle py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-6xl mb-6 block">🍑</span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Find your home away from home with ease
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The trusted platform built by Georgia students, for Georgia students. 
              Skip the chaos, find your perfect sublease at UGA and Georgia Tech.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search apartments, complexes, or areas..." 
                    className="pl-10 h-12 bg-card shadow-soft"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const searchTerm = (e.target as HTMLInputElement).value;
                        window.location.href = `/browse?search=${encodeURIComponent(searchTerm)}`;
                      }
                    }}
                  />
                </div>
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={() => {
                    const searchInput = document.querySelector('input[placeholder*="Search apartments"]') as HTMLInputElement;
                    const searchTerm = searchInput?.value || '';
                    window.location.href = `/browse?search=${encodeURIComponent(searchTerm)}`;
                  }}
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/browse">Browse All Listings</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/post">Post Your Sublease</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How Peach Lease Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by students who understand the struggle. We're making subleasing 
              as easy as it should be.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {howItWorksSteps.map((step, index) => (
          <Card key={index} className="text-center shadow-card border-0">
            <CardContent className="pt-8">
              <div className="flex justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Latest Listings at UGA & Georgia Tech
              </h2>
              <p className="text-muted-foreground">
                Fresh opportunities from your fellow students
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/browse">View All</Link>
            </Button>
          </div>

          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="h-32 w-32 bg-muted/50 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">🍑</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No listings yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Be the first to post a sublease! Help build our community of verified student housing.
              </p>
              <Button variant="hero" asChild>
                <Link to="/post">Post the First Sublease</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-subtle border-0 shadow-card">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Local Landlord Partnerships
              </h3>
              <p className="text-muted-foreground mb-4">
                Trusted property partners in the Athens & Atlanta areas
              </p>
              <div className="h-24 bg-muted/50 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Partner Sponsor Space</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-peach py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to find your perfect sublease?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of Georgia students who trust Peach Lease for their housing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/browse">Start Browsing</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-card text-foreground hover:bg-muted" asChild>
              <Link to="/story">Learn Our Story</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;