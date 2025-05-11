import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler, Footprints, Camera, ArrowRight, HelpCircle, Check, ScanLine } from "lucide-react";

interface FootScanResult {
  archType: 'high' | 'medium' | 'low';
  footLength: number;
  footWidth: 'narrow' | 'medium' | 'wide';
  pressurePoints: string[];
}

export function InteractiveElements() {
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState<FootScanResult | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedWidth, setSelectedWidth] = useState<string | null>(null);

  // Simulate foot scan process
  const handleScanFoot = () => {
    // In a real app, this would connect to camera API and analyze foot images
    setTimeout(() => {
      setScanComplete(true);
      setScanResults({
        archType: 'medium',
        footLength: 26.5,
        footWidth: 'medium',
        pressurePoints: ['ball of foot', 'outer heel']
      });
    }, 2000);
  };

  const resetScan = () => {
    setScanComplete(false);
    setScanResults(null);
  };

  // Size guide data
  const sizeChart = [
    { us: '7', eu: '40', uk: '6', cm: '25.1' },
    { us: '8', eu: '41', uk: '7', cm: '25.7' },
    { us: '9', eu: '42', uk: '8', cm: '26.4' },
    { us: '10', eu: '43', uk: '9', cm: '27.1' },
    { us: '11', eu: '44', uk: '10', cm: '27.8' },
    { us: '12', eu: '45', uk: '11', cm: '28.5' },
  ];

  const widthOptions = ['Narrow (B)', 'Medium (D)', 'Wide (E)', 'Extra Wide (EE)'];

  const getRecommendedSize = () => {
    if (!scanResults) return null;
    
    // Find closest size based on foot length
    const closestSize = sizeChart.reduce((prev, curr) => {
      return Math.abs(parseFloat(curr.cm) - scanResults.footLength) < 
             Math.abs(parseFloat(prev.cm) - scanResults.footLength) ? curr : prev;
    });
    
    // Get recommended width based on scan
    let recommendedWidth = 'Medium (D)';
    switch(scanResults.footWidth) {
      case 'narrow': recommendedWidth = 'Narrow (B)'; break;
      case 'medium': recommendedWidth = 'Medium (D)'; break;
      case 'wide': recommendedWidth = 'Wide (E)'; break;
    }
    
    return {
      size: closestSize,
      width: recommendedWidth
    };
  };

  const recommendation = getRecommendedSize();

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Interactive Fitting Tools</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Our advanced digital tools help you find your perfect fit and visualize how KavinoRa shoes will look and feel
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Virtual Try-On Section */}
          <div className="bg-card rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Virtual Try-On</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                See how our shoes look on your feet using augmented reality technology
              </p>
              
              <Dialog open={showVirtualTryOn} onOpenChange={setShowVirtualTryOn}>
                <DialogTrigger asChild>
                  <Button className="w-full btn-primary">
                    Try Shoes Virtually <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Virtual Try-On Experience</DialogTitle>
                    <DialogDescription>
                      Use your device camera to see KavinoRa shoes on your feet in real-time
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <div className="text-center p-4">
                      <Camera className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Camera access required for virtual try-on
                      </p>
                      <Button className="mt-4 btn-primary">Allow Camera Access</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => setShowVirtualTryOn(false)}>
                      Close
                    </Button>
                    <Button variant="secondary" disabled>
                      Try Different Style
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Works best on mobile devices with AR capability
              </p>
            </div>
            <div className="h-48 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
              <img 
                src="https://placehold.co/400x200/e5edff/6366f1?text=AR+Preview" 
                alt="Virtual Try-On Preview" 
                className="max-h-full"
              />
            </div>
          </div>

          {/* Size Finder Section */}
          <div className="bg-card rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Footprints className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI Foot Scanner</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Get accurate size recommendations with our foot scanning technology
              </p>
              
              <Tabs defaultValue="scanner" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="scanner" className="text-sm">
                    <Footprints className="h-4 w-4 mr-2" />
                    Foot Scanner
                  </TabsTrigger>
                  <TabsTrigger value="chart" className="text-sm">
                    <Ruler className="h-4 w-4 mr-2" />
                    Size Chart
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="scanner" className="space-y-4">
                  {!scanComplete ? (
                    <div className="text-center py-4">
                      <Footprints className="h-12 w-12 mx-auto mb-4 text-primary/60" />
                      <h4 className="font-medium mb-2">Scan Your Feet</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Take a photo of your foot to get a personalized size recommendation
                      </p>
                      
                      <Button onClick={handleScanFoot} className="btn-primary">
                        Start Scan
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Check className="h-4 w-4 mr-2 text-primary" />
                          Scan Complete
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Arch Type:</p>
                            <p className="font-medium capitalize">{scanResults?.archType}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Foot Length:</p>
                            <p className="font-medium">{scanResults?.footLength} cm</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Foot Width:</p>
                            <p className="font-medium capitalize">{scanResults?.footWidth}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pressure Points:</p>
                            <p className="font-medium capitalize">{scanResults?.pressurePoints.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-secondary/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Recommended Size</h4>
                        {recommendation && (
                          <>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                              <div className="text-center">
                                <div className="text-xs text-muted-foreground mb-1">US</div>
                                <div className="font-medium">{recommendation.size.us}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-muted-foreground mb-1">EU</div>
                                <div className="font-medium">{recommendation.size.eu}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-muted-foreground mb-1">UK</div>
                                <div className="font-medium">{recommendation.size.uk}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-muted-foreground mb-1">CM</div>
                                <div className="font-medium">{recommendation.size.cm}</div>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-1">Recommended Width</p>
                              <p className="font-medium">{recommendation.width}</p>
                            </div>
                          </>
                        )}
                        
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm" onClick={resetScan}>
                            Rescan
                          </Button>
                          <Button size="sm">
                            Shop My Size
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="chart" className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">US</th>
                          <th className="text-left py-2 px-3 font-medium">EU</th>
                          <th className="text-left py-2 px-3 font-medium">UK</th>
                          <th className="text-left py-2 px-3 font-medium">CM</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeChart.map((size, i) => (
                          <tr key={i} className="border-b border-border/40 hover:bg-muted/40">
                            <td className="py-2 px-3">{size.us}</td>
                            <td className="py-2 px-3">{size.eu}</td>
                            <td className="py-2 px-3">{size.uk}</td>
                            <td className="py-2 px-3">{size.cm}</td>
                            <td className="py-2 px-3">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className={selectedSize === size.us ? "bg-primary/10 text-primary" : ""}
                                onClick={() => setSelectedSize(size.us)}
                              >
                                Select
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Select Width</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {widthOptions.map((width, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className={selectedWidth === width ? "bg-primary/10 border-primary text-primary" : ""}
                          onClick={() => setSelectedWidth(width)}
                        >
                          {width}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <Button 
                      className="w-full"
                      disabled={!selectedSize || !selectedWidth}
                    >
                      Save Size Preference
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <HelpCircle className="h-3 w-3" />
                    <p>
                      Not sure? Use the AI Foot Scanner for more accurate results or chat with our fit specialist.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}