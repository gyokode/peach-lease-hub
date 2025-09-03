import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Calendar, Users, Wifi, Car, Dog, Home, MessageCircle, Flag, ArrowLeft, Send } from "lucide-react";

const AdDetail = () => {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Mock ad data
  const ad = {
    id: 1,
    title: "Luxury 2BR/2BA Near UGA Campus",
    university: "University of Georgia",
    complex: "The Standard Athens",
    price: 650,
    dates: "May - July 2024",
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Pool", "24/7 Gym", "Parking Included", "WiFi Included", "Pet Friendly", "Study Rooms"],
    description: "Beautiful apartment with modern amenities and a perfect location just 5 minutes walk from UGA campus. The apartment features updated appliances, spacious bedrooms, and access to all building amenities. Perfect for students who want comfort and convenience during their time at UGA. The lease runs from May through July, perfect for summer internships or summer school.",
    isPremium: true,
    postedDate: "2 days ago",
    poster: {
      name: "Sarah M.",
      initials: "SM",
      year: "Junior",
      major: "Business"
    },
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    details: {
      floorPlan: "2BR/2BA",
      squareFootage: "950 sq ft",
      furnished: "Fully Furnished",
      parking: "1 Parking Space Included",
      utilities: "Water & Internet Included"
    }
  };

  // Mock comments
  const comments = [
    {
      id: 1,
      author: "Mike R.",
      initials: "MR",
      content: "Is parking really included? And are pets actually allowed in this complex?",
      timestamp: "1 day ago",
      replies: [
        {
          id: 2,
          author: "Sarah M.",
          initials: "SM",
          content: "Yes, parking is included with the lease! And pets are allowed with a small deposit. Feel free to message me for more details!",
          timestamp: "1 day ago",
          isOriginalPoster: true
        }
      ]
    },
    {
      id: 3,
      author: "Alex K.",
      initials: "AK",
      content: "This looks perfect for my summer internship! The location is exactly what I need.",
      timestamp: "12 hours ago",
      replies: []
    }
  ];

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // Handle comment submission
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/browse">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Link>
          </Button>
        </div>

        {/* Premium Badge */}
        {ad.isPremium && (
          <div className="mb-4">
            <Badge className="gradient-premium text-premium-foreground px-4 py-2">
              Featured 🍑 Premium Listing
            </Badge>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Basic Info */}
            <Card className="shadow-card mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{ad.title}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground mb-4">
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
                    <Badge variant="outline" className="text-2xl font-bold text-primary px-4 py-2">
                      ${ad.price}/month
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Images */}
            <Card className="shadow-card mb-6">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {ad.images.map((image, index) => (
                    <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Photo {index + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {ad.description}
                </p>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle>Apartment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(ad.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="shadow-card mb-8">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {ad.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Public Questions & Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add Comment */}
                <div className="mb-6">
                  <Textarea
                    placeholder="Ask a question or leave a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-3"
                  />
                  <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id}>
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarFallback>{comment.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-muted-foreground">{comment.content}</p>
                        </div>
                      </div>
                      
                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="ml-12 mt-4 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{reply.initials}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{reply.author}</span>
                                  {reply.isOriginalPoster && (
                                    <Badge variant="secondary" className="text-xs">OP</Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                                </div>
                                <p className="text-muted-foreground text-sm">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Poster Info & Message */}
            <Card className="shadow-card mb-6 sticky top-24">
              <CardHeader>
                <CardTitle>Contact Poster</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback>{ad.poster.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{ad.poster.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {ad.poster.year} • {ad.poster.major}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Posted {ad.postedDate}
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="hero" 
                  className="w-full mb-3"
                  onClick={() => setShowMessageModal(true)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Poster
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Private messaging for serious inquiries and negotiations
                </p>
              </CardContent>
            </Card>

            {/* University Info */}
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-medium mb-2">{ad.university}</h4>
                  <Badge variant="secondary" className="mb-2">
                    Verified .edu Student
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    All users verified with university email addresses
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Message Modal Placeholder */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-premium">
            <CardHeader>
              <CardTitle>Send Private Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This feature requires Supabase integration for user authentication and messaging.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                  Close
                </Button>
                <Button variant="hero">
                  Connect Supabase
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdDetail;