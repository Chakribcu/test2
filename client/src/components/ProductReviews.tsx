import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Filter, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import OptimizedImage from './ui/optimized-image';

// Sample review data - in a real app this would come from the API
const sampleReviews = [
  {
    id: 1,
    author: "Emily R.",
    rating: 5,
    date: "2025-04-15",
    title: "Perfect for my needs!",
    content: "I've been using this product for a few weeks now and I'm extremely impressed. It's comfortable, durable, and does exactly what it promises. Highly recommend!",
    helpfulCount: 12,
    images: [
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1582727273520-5adbd886c853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    ],
    verified: true
  },
  {
    id: 2,
    author: "Michael T.",
    rating: 4,
    date: "2025-04-02",
    title: "Great product with minor issues",
    content: "Overall, this is a quality product that meets most of my expectations. The only downside is that it took a bit longer than expected to start seeing results. The customer service was excellent when I had questions.",
    helpfulCount: 8,
    images: [],
    verified: true
  },
  {
    id: 3,
    author: "Sarah K.",
    rating: 5,
    date: "2025-03-25",
    title: "Best purchase I've made all year",
    content: "Absolutely love this product! It has made such a difference in my daily routine. The quality is outstanding and it's clear a lot of thought went into the design. Will be purchasing more as gifts.",
    helpfulCount: 15,
    images: [
      "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    ],
    verified: true
  },
  {
    id: 4,
    author: "David L.",
    rating: 3,
    date: "2025-03-18",
    title: "Good but not great",
    content: "The product is decent for the price. It does what it's supposed to do, but I've used better. The packaging was nice and delivery was quick. Might recommend to friends who are on a budget.",
    helpfulCount: 5,
    images: [],
    verified: false
  },
  {
    id: 5,
    author: "Jennifer P.",
    rating: 5,
    date: "2025-03-10",
    title: "Exceeded my expectations",
    content: "Wow! I didn't expect to be this impressed. The quality is outstanding and the results were immediate. The attention to detail really shows. This brand has earned a loyal customer!",
    helpfulCount: 22,
    images: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1517705474211-a6ed9ce8d8c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    ],
    verified: true
  }
];

interface ProductReviewsProps {
  productId: string | number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Filter reviews based on selected criteria
  const filteredReviews = sampleReviews.filter(review => {
    if (activeTab === 'verified' && !review.verified) return false;
    if (activeTab === 'with-photos' && review.images.length === 0) return false;
    if (selectedRatingFilter !== null && review.rating !== selectedRatingFilter) return false;
    return true;
  });
  
  // Sort reviews based on selected option
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOption === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortOption === 'highest') {
      return b.rating - a.rating;
    } else if (sortOption === 'lowest') {
      return a.rating - b.rating;
    } else if (sortOption === 'most-helpful') {
      return b.helpfulCount - a.helpfulCount;
    }
    return 0;
  });
  
  // Calculate review statistics
  const totalReviews = sampleReviews.length;
  const averageRating = 
    sampleReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  
  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: sampleReviews.filter(review => review.rating === rating).length,
    percentage: (sampleReviews.filter(review => review.rating === rating).length / totalReviews) * 100
  }));
  
  const handleRatingFilter = (rating: number) => {
    if (selectedRatingFilter === rating) {
      setSelectedRatingFilter(null);
    } else {
      setSelectedRatingFilter(rating);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, you would upload these to a server and get back URLs
    // For this demo, we'll just create object URLs
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setReviewImages([...reviewImages, ...newImages]);
    
    toast({
      title: "Images added",
      description: `${files.length} image${files.length > 1 ? 's' : ''} added to your review`,
      variant: "default",
    });
  };
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your API
    toast({
      title: "Review submitted!",
      description: "Thank you for your feedback. Your review will be published after moderation.",
      variant: "default",
    });
    
    setShowReviewForm(false);
    setReviewImages([]);
  };
  
  const toggleExpandReview = (reviewId: number) => {
    if (expandedReviews.includes(reviewId)) {
      setExpandedReviews(expandedReviews.filter(id => id !== reviewId));
    } else {
      setExpandedReviews([...expandedReviews, reviewId]);
    }
  };
  
  const isReviewExpanded = (reviewId: number) => expandedReviews.includes(reviewId);
  
  // Helper to render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 py-8 border-t">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Review Summary */}
        <div className="md:col-span-1">
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="mb-1">
              <div className="flex mb-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-sm text-muted-foreground">
                Based on {totalReviews} reviews
              </span>
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="space-y-2 mt-6">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div 
                key={rating} 
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-sm transition-colors"
                onClick={() => handleRatingFilter(rating)}
              >
                <div className="w-10 text-sm font-medium">{rating} stars</div>
                <Progress
                  value={percentage}
                  className="h-2 flex-1"
                />
                <div className="w-8 text-sm text-right text-muted-foreground">
                  {count}
                </div>
              </div>
            ))}
          </div>
          
          {/* Write a Review Button */}
          <div className="mt-8">
            <Button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Write a Review
            </Button>
          </div>
        </div>
        
        {/* Review Listings */}
        <div className="md:col-span-2">
          {/* Review Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Reviews</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="with-photos">With Photos</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2 items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              
              <select 
                className="py-1.5 px-3 text-sm border rounded-md bg-white"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="most-helpful">Most Helpful</option>
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {selectedRatingFilter !== null && (
            <div className="mb-4 flex gap-2">
              <div className="bg-gray-100 rounded-full py-1 px-3 text-sm flex items-center">
                {selectedRatingFilter} Stars
                <button 
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedRatingFilter(null)}
                >
                  ×
                </button>
              </div>
            </div>
          )}
          
          {/* No Reviews Message */}
          {sortedReviews.length === 0 && (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-1">No reviews found</h3>
              <p className="text-muted-foreground text-sm">
                Try changing your filters or be the first to write a review!
              </p>
            </div>
          )}
          
          {/* Review List */}
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {renderStars(review.rating)}
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium">{review.title}</h3>
                  </div>
                  <div className="text-sm text-right text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className={`text-sm ${
                    !isReviewExpanded(review.id) && review.content.length > 200
                      ? "line-clamp-3"
                      : ""
                  }`}>
                    {review.content}
                  </p>
                  
                  {/* Show More/Less Button */}
                  {review.content.length > 200 && (
                    <button
                      className="text-sm text-primary mt-1 flex items-center"
                      onClick={() => toggleExpandReview(review.id)}
                    >
                      {isReviewExpanded(review.id) ? (
                        <>Show Less <ChevronUp className="ml-1 h-3 w-3" /></>
                      ) : (
                        <>Show More <ChevronDown className="ml-1 h-3 w-3" /></>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Review Images */}
                {review.images.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto py-1">
                    {review.images.map((image, index) => (
                      <div 
                        key={index}
                        className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border"
                      >
                        <OptimizedImage
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-full object-cover"
                          objectFit="cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Review Footer */}
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    By {review.author}
                  </div>
                  <Button variant="ghost" size="sm" className="text-sm gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    Helpful ({review.helpfulCount})
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Review Submission Form */}
      {showReviewForm && (
        <div className="border rounded-lg p-6 bg-white mt-8 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className="h-10 w-10 rounded-md flex items-center justify-center border hover:bg-gray-50"
                    >
                      <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="title">Review Title</Label>
                <Input 
                  id="title" 
                  placeholder="Summarize your experience" 
                  className="mt-1" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="content">Review</Label>
                <Textarea 
                  id="content"
                  placeholder="What did you like or dislike? How was the fit? How was the quality?"
                  className="mt-1"
                  rows={5}
                  required
                />
              </div>
              
              <div>
                <Label>Photos (Optional)</Label>
                <div className="mt-1 border-2 border-dashed rounded-lg p-4 text-center">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {reviewImages.map((image, index) => (
                      <div key={index} className="w-16 h-16 relative rounded overflow-hidden">
                        <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-white/80 rounded-full p-0.5"
                          onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== index))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <label className="cursor-pointer inline-flex items-center gap-1 text-sm text-primary">
                    <ImageIcon className="h-4 w-4" />
                    Add Photos
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    You can add up to 5 photos. Each image must be less than 5MB.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Review</Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}