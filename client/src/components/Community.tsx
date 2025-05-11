import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users, Heart, ThumbsUp, Share2, Image, Plus } from "lucide-react";

interface Post {
  id: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
  isLiked?: boolean;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  attendees: number;
  isVirtual: boolean;
  isRegistered?: boolean;
}

export function Community() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("feed");
  const [newPostContent, setNewPostContent] = useState("");

  // Sample community posts
  const posts: Post[] = [
    {
      id: "post1",
      author: {
        id: 1,
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      content: "Just completed a 5k walk in my new KavinoRa walking shoes! My feet feel amazing even after pushing my pace. Anyone else tried the new CloudWalk series?",
      image: "https://placehold.co/600x400/e4e4e7/71717a?text=5k+Walk+Photo",
      likes: 24,
      comments: 8,
      shares: 3,
      timeAgo: "2 hours ago",
      isLiked: true,
    },
    {
      id: "post2",
      author: {
        id: 2,
        name: "Michael Chen",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      content: "Question for the community: I have high arches and often get foot fatigue when standing all day at work. Which KavinoRa model would you recommend for maximum support?",
      likes: 16,
      comments: 12,
      shares: 1,
      timeAgo: "5 hours ago",
    },
    {
      id: "post3",
      author: {
        id: 3,
        name: "Dr. Lisa Williams",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      content: "As a podiatrist, I've been recommending KavinoRa's wellness insoles to many of my patients with plantar fasciitis. The results have been impressive - 85% report significant pain reduction within 2 weeks.",
      likes: 45,
      comments: 7,
      shares: 12,
      timeAgo: "1 day ago",
    },
  ];

  // Sample upcoming events
  const events: Event[] = [
    {
      id: "event1",
      title: "Wellness Walk & Talk",
      date: "June 15, 2025",
      location: "Central Park, New York",
      image: "https://placehold.co/600x400/e4e4e7/71717a?text=Wellness+Walk+Event",
      attendees: 45,
      isVirtual: false,
      isRegistered: true,
    },
    {
      id: "event2",
      title: "Foot Health Webinar",
      date: "June 22, 2025",
      location: "Online",
      image: "https://placehold.co/600x400/e4e4e7/71717a?text=Webinar+Event",
      attendees: 128,
      isVirtual: true,
    },
    {
      id: "event3",
      title: "KavinoRa Product Showcase",
      date: "July 10, 2025",
      location: "San Francisco Wellness Expo",
      image: "https://placehold.co/600x400/e4e4e7/71717a?text=Product+Showcase",
      attendees: 86,
      isVirtual: false,
    },
  ];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim() === "") return;
    
    // In a real app, this would send the post to the server
    // For now we'll just clear the input
    setNewPostContent("");
    
    alert("Your post has been shared with the community!");
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Community sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-card p-5 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-4">KavinoRa Community</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Connect with fellow wellness enthusiasts, share experiences, and discover events.
              </p>
              
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?img=8" />
                      <AvatarFallback>{user.firstName?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Member'}</p>
                      <p className="text-xs text-muted-foreground">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>2 posts</span>
                    <span>5 comments</span>
                    <span>12 likes</span>
                  </div>
                </div>
              ) : (
                <button className="btn-primary w-full">Sign In to Join</button>
              )}
            </div>
            
            <div className="bg-card p-5 rounded-xl shadow-sm">
              <h3 className="font-medium mb-3">Popular Topics</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-primary hover:underline">#FootHealth</a></li>
                <li><a href="#" className="text-sm text-primary hover:underline">#WalkingTips</a></li>
                <li><a href="#" className="text-sm text-primary hover:underline">#PainRelief</a></li>
                <li><a href="#" className="text-sm text-primary hover:underline">#ProductReviews</a></li>
                <li><a href="#" className="text-sm text-primary hover:underline">#WellnessJourney</a></li>
              </ul>
            </div>
          </div>
          
          {/* Main content */}
          <div className="w-full md:w-3/4">
            <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="feed" className="text-sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Community Feed
                </TabsTrigger>
                <TabsTrigger value="events" className="text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Upcoming Events
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="feed" className="space-y-6">
                {/* Post form */}
                {user && (
                  <div className="bg-card p-5 rounded-xl shadow-sm">
                    <form onSubmit={handlePostSubmit}>
                      <textarea
                        className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Share your thoughts or ask the community..."
                        rows={3}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                      ></textarea>
                      <div className="flex justify-between items-center mt-3">
                        <button type="button" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                          <Image className="h-4 w-4 mr-1" />
                          Add Photo
                        </button>
                        <button type="submit" className="btn-primary px-4 py-2 text-sm">
                          Post
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Posts list */}
                <div className="space-y-6">
                  {posts.map(post => (
                    <div key={post.id} className="bg-card p-5 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{post.author.name}</p>
                          <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
                        </div>
                      </div>
                      
                      <p className="mb-4">{post.content}</p>
                      
                      {post.image && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img src={post.image} alt="Post attachment" className="w-full" />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-3 border-t border-border">
                        <button className={`flex items-center gap-1 text-sm ${post.isLiked ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}>
                          <Heart className="h-4 w-4" fill={post.isLiked ? "currentColor" : "none"} />
                          {post.likes}
                        </button>
                        
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                          <MessageSquare className="h-4 w-4" />
                          {post.comments}
                        </button>
                        
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                          <Share2 className="h-4 w-4" />
                          {post.shares}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="events" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map(event => (
                    <div key={event.id} className="bg-card rounded-xl shadow-sm overflow-hidden">
                      <div className="aspect-video relative">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        {event.isVirtual && (
                          <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
                            Virtual Event
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{event.date} • {event.location}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{event.attendees} attending</span>
                          
                          <button 
                            className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                              event.isRegistered 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-primary text-primary-foreground'
                            }`}
                          >
                            {event.isRegistered ? (
                              <>Registered</>
                            ) : (
                              <><Plus className="h-3 w-3" /> Register</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {user && (
                  <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold mb-2">Want to host a KavinoRa community event?</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      As a KavinoRa community member, you can organize local meetups, walking groups, or wellness workshops.
                    </p>
                    <button className="text-sm text-primary hover:underline">Learn more about hosting</button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}