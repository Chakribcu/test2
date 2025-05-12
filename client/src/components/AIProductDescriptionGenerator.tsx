import { useState, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Copy, Check, ArrowRight, RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GenerationRequest {
  productName: string;
  productType: string;
  keywords: string[];
  targetAudience?: string;
  toneOfVoice: string;
  benefitsToHighlight?: string[];
  lengthPreference: 'short' | 'medium' | 'long';
  includeBulletPoints?: boolean;
  emphasizeSEO?: boolean;
  creativityLevel: number;
}

interface GenerationResponse {
  description: string;
  shortDescription?: string;
  bulletPoints?: string[];
  seoKeywords?: string[];
  seoTitle?: string;
  seoMetaDescription?: string;
}

export function AIProductDescriptionGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("wellness shoes");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [toneOfVoice, setToneOfVoice] = useState("professional");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState("");
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [includeBullets, setIncludeBullets] = useState(true);
  const [emphasizeSEO, setEmphasizeSEO] = useState(true);
  const [creativity, setCreativity] = useState(70);
  const [generatedContent, setGeneratedContent] = useState<GenerationResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'result'>('form');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Mock simulation of AI generation (would connect to OpenAI or Anthropic)
  const generateMutation = useMutation({
    mutationFn: async (data: GenerationRequest) => {
      // In a real implementation, this would call the server API
      // For demo, we'll simulate a server request
      try {
        const response = await apiRequest("POST", "/api/generate-description", data);
        return await response.json();
      } catch (error) {
        console.error("Error generating description:", error);
        
        // For demo purposes, simulate response since API doesn't exist yet
        return simulateGenerationResponse(data);
      }
    },
    onSuccess: (data: GenerationResponse) => {
      setGeneratedContent(data);
      setActiveTab('result');
      toast({
        title: "Description Generated",
        description: "Your AI-powered product description is ready!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };
  
  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };
  
  const handleAddBenefit = () => {
    if (benefitInput.trim() && !benefits.includes(benefitInput.trim())) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput("");
    }
  };
  
  const handleRemoveBenefit = (benefit: string) => {
    setBenefits(benefits.filter(b => b !== benefit));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName) {
      toast({
        title: "Missing Information",
        description: "Please enter a product name",
        variant: "destructive",
      });
      return;
    }
    
    const generationRequest: GenerationRequest = {
      productName,
      productType,
      keywords,
      targetAudience: targetAudience || undefined,
      toneOfVoice,
      benefitsToHighlight: benefits.length > 0 ? benefits : undefined,
      lengthPreference: length,
      includeBulletPoints: includeBullets,
      emphasizeSEO,
      creativityLevel: creativity,
    };
    
    generateMutation.mutate(generationRequest);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard",
    });
  };
  
  // For demo purposes only - simulates AI response
  const simulateGenerationResponse = (data: GenerationRequest): GenerationResponse => {
    // These templates would be replaced by real AI generation
    const productDescriptionTemplates = [
      `Introducing the revolutionary ${data.productName}, a premium ${data.productType} designed with your wellness in mind. Crafted using advanced ergonomic technology, these shoes provide exceptional support for ${data.targetAudience || "all users"}. ${data.keywords.slice(0, 3).join(", ")} are at the core of our design philosophy.`,
      
      `Experience unparalleled comfort with our innovative ${data.productName}. These state-of-the-art ${data.productType} combine cutting-edge technology with elegant design to deliver a product that truly understands your needs. Perfect for ${data.targetAudience || "everyday use"}, they incorporate ${data.keywords.slice(0, 2).join(" and ")} to ensure maximum satisfaction.`,
      
      `The ${data.productName} represents the pinnacle of ${data.productType} evolution. Meticulously engineered for ${data.targetAudience || "wellness enthusiasts"}, these remarkable shoes feature ${data.keywords[0] || "advanced comfort technology"} that sets a new standard in the industry.`
    ];
    
    // Randomly select a template for demonstration
    const templateIndex = Math.floor(Math.random() * productDescriptionTemplates.length);
    const baseDescription = productDescriptionTemplates[templateIndex];
    
    // Add benefits if provided
    let fullDescription = baseDescription;
    if (data.benefitsToHighlight && data.benefitsToHighlight.length > 0) {
      fullDescription += ` The key benefits include ${data.benefitsToHighlight.join(", ")}, making it the perfect choice for enhancing your daily wellness routine.`;
    }
    
    // Add tone-specific closing
    if (data.toneOfVoice === "professional") {
      fullDescription += " Invest in your wellness today with this scientifically backed solution.";
    } else if (data.toneOfVoice === "casual") {
      fullDescription += " Why wait? Your feet will thank you!";
    } else if (data.toneOfVoice === "luxury") {
      fullDescription += " Experience the exclusive comfort that only premium wellness innovation can provide.";
    }
    
    // Create bullet points if requested
    const bulletPoints = data.includeBulletPoints ? [
      `Enhanced comfort with proprietary cushioning`,
      `Ergonomic design supports natural foot alignment`,
      `Breathable materials for all-day freshness`,
      `Durable construction ensures lasting quality`,
      ...(data.benefitsToHighlight || []).map(benefit => `${benefit}`)
    ] : undefined;
    
    return {
      description: fullDescription,
      shortDescription: fullDescription.split('.')[0] + ".",
      bulletPoints,
      seoKeywords: data.emphasizeSEO ? [
        ...data.keywords,
        "foot comfort",
        "wellness footwear",
        "ergonomic shoes",
        "foot pain relief"
      ] : undefined,
      seoTitle: `${data.productName} | Premium ${data.productType} for Ultimate Comfort`,
      seoMetaDescription: `Discover the ${data.productName}, innovative ${data.productType} designed for ${data.targetAudience || "optimal comfort"}. Features ${data.keywords.slice(0, 3).join(", ")}.`
    };
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Description Generator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Product Description Generator
          </DialogTitle>
          <DialogDescription>
            Generate compelling product descriptions optimized for SEO with our AI-powered tool
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="form" value={activeTab} onValueChange={(value) => setActiveTab(value as 'form' | 'result')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Input</TabsTrigger>
            <TabsTrigger 
              value="result" 
              disabled={!generatedContent}
              className={!generatedContent ? "opacity-50 cursor-not-allowed" : ""}
            >
              Result
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="productName" className="font-medium">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <input
                  id="productName"
                  className="input-apple w-full mt-1"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. CloudWalk Pro 2000"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="productType" className="font-medium">
                  Product Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="productType"
                  className="input-apple w-full mt-1"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                >
                  <option value="wellness shoes">Wellness Shoes</option>
                  <option value="orthopedic footwear">Orthopedic Footwear</option>
                  <option value="ergonomic insoles">Ergonomic Insoles</option>
                  <option value="comfort sandals">Comfort Sandals</option>
                  <option value="walking shoes">Walking Shoes</option>
                  <option value="running shoes">Running Shoes</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="keywords" className="font-medium">
                  Keywords (features, materials, technologies)
                </Label>
                <div className="flex mt-1">
                  <input
                    id="keywords"
                    className="input-apple w-full"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="e.g. memory foam, arch support"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="ml-2" 
                    onClick={handleAddKeyword}
                  >
                    Add
                  </Button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map((keyword) => (
                      <div 
                        key={keyword} 
                        className="bg-secondary text-foreground px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {keyword}
                        <button
                          type="button"
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveKeyword(keyword)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="targetAudience" className="font-medium">
                  Target Audience
                </Label>
                <input
                  id="targetAudience"
                  className="input-apple w-full mt-1"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. active seniors, office workers, athletes"
                />
              </div>
              
              <div>
                <Label htmlFor="benefits" className="font-medium">
                  Benefits to Highlight
                </Label>
                <div className="flex mt-1">
                  <input
                    id="benefits"
                    className="input-apple w-full"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    placeholder="e.g. reduces foot pain, improves posture"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="ml-2" 
                    onClick={handleAddBenefit}
                  >
                    Add
                  </Button>
                </div>
                {benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {benefits.map((benefit) => (
                      <div 
                        key={benefit} 
                        className="bg-secondary text-foreground px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {benefit}
                        <button
                          type="button"
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveBenefit(benefit)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="toneOfVoice" className="font-medium">
                  Tone of Voice
                </Label>
                <select
                  id="toneOfVoice"
                  className="input-apple w-full mt-1"
                  value={toneOfVoice}
                  onChange={(e) => setToneOfVoice(e.target.value)}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual & Friendly</option>
                  <option value="luxury">Premium & Luxury</option>
                  <option value="scientific">Scientific & Technical</option>
                  <option value="empathetic">Empathetic & Caring</option>
                </select>
              </div>
              
              <div className="border border-border rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-semibold flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </h3>
                
                <div>
                  <Label htmlFor="length" className="text-sm font-medium">
                    Description Length
                  </Label>
                  <select
                    id="length"
                    className="input-apple w-full mt-1"
                    value={length}
                    onChange={(e) => setLength(e.target.value as 'short' | 'medium' | 'long')}
                  >
                    <option value="short">Short (~50 words)</option>
                    <option value="medium">Medium (~100 words)</option>
                    <option value="long">Long (~200 words)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="creativity" className="text-sm font-medium">
                    Creativity Level: {creativity}%
                  </Label>
                  <Slider
                    id="creativity"
                    defaultValue={[70]}
                    max={100}
                    step={10}
                    className="w-2/3"
                    onValueChange={(value) => setCreativity(value[0])}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="includeBullets" className="text-sm font-medium">
                      Include Bullet Points
                    </Label>
                    <p className="text-xs text-muted-foreground">Generate a list of key features</p>
                  </div>
                  <Switch
                    id="includeBullets"
                    checked={includeBullets}
                    onCheckedChange={setIncludeBullets}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emphasizeSEO" className="text-sm font-medium">
                      Optimize for SEO
                    </Label>
                    <p className="text-xs text-muted-foreground">Generate SEO title and meta description</p>
                  </div>
                  <Switch
                    id="emphasizeSEO"
                    checked={emphasizeSEO}
                    onCheckedChange={setEmphasizeSEO}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={generateMutation.isPending || !productName}
                  className="btn-primary"
                >
                  {generateMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Description
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="result" className="py-4">
            {generatedContent && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Product Description</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(generatedContent.description)}
                      className="h-8"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      Copy
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-sm">{generatedContent.description}</p>
                  </div>
                </div>
                
                {generatedContent.shortDescription && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Short Description</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(generatedContent.shortDescription!)}
                        className="h-8"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">{generatedContent.shortDescription}</p>
                    </div>
                  </div>
                )}
                
                {generatedContent.bulletPoints && generatedContent.bulletPoints.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Key Features</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(generatedContent.bulletPoints!.map(b => `• ${b}`).join('\n'))}
                        className="h-8"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <ul className="text-sm space-y-2 list-disc pl-5">
                        {generatedContent.bulletPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* SEO Section */}
                {generatedContent.seoTitle && (
                  <div className="border border-primary/20 rounded-lg p-4 bg-primary/5 space-y-4">
                    <h3 className="text-sm font-semibold">SEO Recommendations</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium">Page Title</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(generatedContent.seoTitle!)}
                          className="h-6"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-background p-2 rounded border border-border text-sm">
                        {generatedContent.seoTitle}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium">Meta Description</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(generatedContent.seoMetaDescription!)}
                          className="h-6"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-background p-2 rounded border border-border text-sm">
                        {generatedContent.seoMetaDescription}
                      </div>
                    </div>
                    
                    {generatedContent.seoKeywords && generatedContent.seoKeywords.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Recommended Keywords</p>
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.seoKeywords.map((keyword, index) => (
                            <div 
                              key={index} 
                              className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs"
                            >
                              {keyword}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('form')}
                  >
                    Edit Parameters
                  </Button>
                  <Button 
                    onClick={() => generateMutation.mutate({
                      productName,
                      productType,
                      keywords,
                      targetAudience,
                      toneOfVoice,
                      benefitsToHighlight: benefits,
                      lengthPreference: length,
                      includeBulletPoints: includeBullets,
                      emphasizeSEO,
                      creativityLevel: creativity,
                    })}
                    disabled={generateMutation.isPending}
                  >
                    {generateMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}