import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle, Shield } from "lucide-react";

const ContactSupport = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
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
            Contact Support
          </h1>
          <p className="text-muted-foreground">
            We're here to help you with any questions or issues
          </p>
        </div>

        {/* Contact Info */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Get in Touch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-subtle rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <a 
                    href="mailto:peachleaser@gmail.com" 
                    className="text-primary hover:underline"
                  >
                    peachleaser@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Safety & Trust</p>
                  <p className="text-sm text-muted-foreground">
                    Report suspicious activity or safety concerns immediately
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.edu" />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What can we help you with?" />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Describe your issue or question in detail..."
                  rows={6}
                />
              </div>

              <Button type="submit" variant="hero" className="w-full">
                Send Message
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                For urgent safety concerns, please email us directly at{' '}
                <a href="mailto:peachleaser@gmail.com" className="text-primary hover:underline">
                  peachleaser@gmail.com
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactSupport;