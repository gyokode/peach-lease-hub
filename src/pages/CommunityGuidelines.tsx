import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Flag, Users, Heart, AlertTriangle, CheckCircle, MessageCircle, Lock } from "lucide-react";

const CommunityGuidelines = () => {
  const guidelines = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Be Honest & Accurate",
      description: "All listing information must be truthful. Fake photos, misleading prices, or false availability dates violate our community standards.",
      examples: ["Use real photos of your actual space", "Post accurate pricing and dates", "Be upfront about any issues or limitations"]
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Respect Fellow Students",
      description: "Treat every interaction with kindness and professionalism. Remember, we're all students trying to help each other.",
      examples: ["Respond to messages promptly", "Be patient with questions", "No harassment or discriminatory language"]
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "Protect Personal Information",
      description: "Keep sensitive details private until you're ready to move forward with someone. Safety first!",
      examples: ["Don't share full addresses publicly", "Use our messaging system initially", "Meet in public places when viewing"]
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Keep It Student-Focused",
      description: "Our platform is designed for student-to-student connections. Commercial listings should be clearly identified.",
      examples: ["Only verified .edu users can post", "Clearly mark if you're a property manager", "No spam or unrelated content"]
    }
  ];

  const reportingProcess = [
    {
      step: "1",
      title: "Spot Something Wrong?",
      description: "Look for the flag icon (🚩) on any listing or comment that seems inappropriate."
    },
    {
      step: "2",
      title: "Report It",
      description: "Click the flag and tell us what's wrong. Your report is anonymous and helps keep our community safe."
    },
    {
      step: "3",
      title: "We Review",
      description: "Our team reviews all reports promptly and takes appropriate action, from warnings to account removal."
    }
  ];

  const safetyTips = [
    "Always verify the person you're dealing with through multiple channels",
    "Meet in public places when viewing apartments",
    "Bring a friend when meeting someone new",
    "Trust your instincts - if something feels off, it probably is",
    "Never send money before seeing the space in person",
    "Use our platform's messaging system for initial communications",
    "Ask to see the lease or proof of residence before committing"
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-4xl mb-4 block">🍑</span>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Community Guidelines
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            These guidelines help us maintain a safe, trustworthy community 
            where Georgia students can connect with confidence.
          </p>
        </div>

        {/* Core Guidelines */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Our Community Standards
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guidelines.map((guideline, index) => (
              <Card key={index} className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {guideline.icon}
                    {guideline.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {guideline.description}
                  </p>
                  <div className="space-y-2">
                    {guideline.examples.map((example, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Reporting System */}
        <section className="mb-12">
          <Card className="shadow-card border-0 bg-gradient-subtle">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Flag className="h-6 w-6 text-primary" />
                Peer Reporting System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground mb-8">
                Our community polices itself. When you see something that doesn't belong, 
                help us keep Peach Lease safe for everyone.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {reportingProcess.map((process, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                      {process.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {process.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {process.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Safety Tips */}
        <section className="mb-12">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <AlertTriangle className="h-6 w-6 text-primary" />
                Safety & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                While our verification system helps ensure everyone is a legitimate student, 
                it's still important to practice good safety habits:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {safetyTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Verification */}
        <section className="mb-12">
          <Card className="shadow-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                .edu Email Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Why We Require University Email Verification
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>🎓 Ensures all users are legitimate students</p>
                    <p>🛡️ Creates accountability within our community</p>
                    <p>🤝 Builds trust between student users</p>
                    <p>🚫 Keeps out spam and fake accounts</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Supported Universities
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span className="text-sm">University of Georgia (@uga.edu)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span className="text-sm">Georgia Tech (@gatech.edu)</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      More universities coming soon!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Consequences */}
        <section className="mb-12">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-2xl">
                Violations & Consequences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                We believe in giving everyone a chance to learn and improve, but serious or 
                repeated violations will result in consequences:
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-yellow-600 text-xs">!</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">First Warning</h4>
                    <p className="text-sm text-muted-foreground">
                      Minor violations get a friendly reminder about our guidelines
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-6 h-6 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-orange-600 text-xs">⚠</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Temporary Restrictions</h4>
                    <p className="text-sm text-muted-foreground">
                      Repeated violations may result in temporary posting restrictions
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-6 h-6 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-red-600 text-xs">✕</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Account Removal</h4>
                    <p className="text-sm text-muted-foreground">
                      Serious violations (harassment, fraud, safety threats) result in immediate removal
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact & Questions */}
        <section className="mb-12">
          <Card className="shadow-card border-0 bg-gradient-peach text-primary-foreground">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary-foreground" />
              <h2 className="text-2xl font-bold mb-4">
                Questions About These Guidelines?
              </h2>
              <p className="mb-6 text-primary-foreground/90">
                We're here to help! If you're unsure about anything or need clarification, 
                don't hesitate to reach out.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/support">Contact Support</Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-card text-foreground hover:bg-muted" asChild>
                  <Link to="/story">Learn About Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Ready to join our trusted community of Georgia students?
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/post">Post Your First Listing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;