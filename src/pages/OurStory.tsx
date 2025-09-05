import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Users, Shield, Lightbulb, Target, MapPin } from "lucide-react";

const OurStory = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-subtle py-20 px-4">
        <div className="container mx-auto text-center">
          <span className="text-6xl mb-6 block">🍑</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            How two frustrated college students decided to fix the chaotic subleasing 
            process for their fellow Georgia students.
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* The Problem */}
          <Card className="shadow-card mb-12 border-0">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    The Frustration That Started It All
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Picture this: It's August 2025, and Anirudh and Gio are desperately trying 
                    to find summer housing. They're scrolling through endless Facebook groups, 
                    dealing with sketchy Craigslist posts, and getting ghosted by random strangers.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    "There has to be a better way," they thought after spending their third 
                    consecutive evening sorting through spam posts and dealing with people 
                    who may or may not actually be students.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-6 text-center">
  <img
    src="/src/anirudhgio.jpg"
    alt="Anirudh and Gio brainstorming in their Athens apartment"
    className="w-full h-48 object-cover rounded-lg mb-4"
  />
  
  <p className="text-sm text-muted-foreground">
    The founders brainstorming in their Athens apartment
  </p>
</div>
              </div>
            </CardContent>
          </Card>

          {/* The Vision */}
          <Card className="shadow-card mb-12 border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  The Lightbulb Moment
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    What if we built something different?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Instead of another generic marketplace, what if we created a platform 
                    that actually understood the unique needs of college students? Something 
                    that prioritized trust, safety, and community.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    That's when Peach Lease was born - not just as a business idea, 
                    but as a solution to a problem they were personally living through.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Why Georgia?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    As students at UGA and Georgia Tech, Anirudh and Gio knew firsthand 
                    the housing challenges across Georgia's college towns. They decided 
                    to start where they knew best - their own backyard.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    The peach emoji wasn't just cute - it represented their pride in 
                    being a homegrown Georgia solution, built by Georgians for Georgians.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* The Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-card text-center border-0">
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Trust First
                </h3>
                <p className="text-muted-foreground text-sm">
                  Every user must verify their .edu email. No random strangers, 
                  just verified students helping students.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card text-center border-0">
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Community Driven
                </h3>
                <p className="text-muted-foreground text-sm">
                  Built by students, for students. We understand your needs 
                  because we share them.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card text-center border-0">
              <CardContent className="p-6">
                <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Genuine Care
                </h3>
                <p className="text-muted-foreground text-sm">
                  This isn't just a business to us - it's our contribution 
                  to making college life a little easier.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Status */}
          <Card className="shadow-card mb-12 bg-gradient-subtle border-0">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Where We Are Today
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
                We're currently in our pilot phase, focusing on UGA and Georgia Tech. 
                Every feature you see was built based on real feedback from students like you. 
                We're not done yet - we're just getting started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" asChild>
                  <Link to="/browse">Try Our Platform</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/guidelines">Community Guidelines</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Future Vision */}
          <Card className="shadow-card border-0">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Our Vision for the Future
                </h2>
              </div>
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We envision Peach Lease becoming the go-to platform for student housing 
                  across the Southeast. Not just a marketplace, but a trusted community 
                  where students can find safe, affordable housing with confidence.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  But we're taking it one step at a time, one university at a time, 
                  always keeping our community-first values at the heart of everything we do.
                </p>
                <p className="text-foreground font-medium">
                  Thanks for being part of our journey. 🍑
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  - Anirudh & Gio, Founders
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-peach py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary-foreground mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-primary-foreground/90 mb-6">
            Help us build something better, together.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/post">Post Your First Listing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
