import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RulerIcon } from 'lucide-react';

interface SizeGuideProps {
  productType?: 'footwear' | 'clothing' | 'accessories';
  triggerClassName?: string;
}

/**
 * SizeGuide Component
 * 
 * Provides a size guide dialog with measurement information for different product types
 * - Supports footwear, clothing, and accessories sizing
 * - Includes US, EU, UK, and CM measurements for footwear
 * - Includes international size conversions for clothing
 * - Responsive design for all device sizes
 */
export default function SizeGuide({ 
  productType = 'footwear',
  triggerClassName
}: SizeGuideProps) {
  const [open, setOpen] = useState(false);
  
  const renderFootwearSizeTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px] text-sm border-collapse">
        <thead>
          <tr className="bg-muted/50">
            <th className="border px-4 py-2 text-left font-medium">US</th>
            <th className="border px-4 py-2 text-left font-medium">EU</th>
            <th className="border px-4 py-2 text-left font-medium">UK</th>
            <th className="border px-4 py-2 text-left font-medium">CM</th>
            <th className="border px-4 py-2 text-left font-medium">Inches</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">6</td>
            <td className="border px-4 py-2">39</td>
            <td className="border px-4 py-2">5.5</td>
            <td className="border px-4 py-2">24</td>
            <td className="border px-4 py-2">9.4"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">6.5</td>
            <td className="border px-4 py-2">39.5</td>
            <td className="border px-4 py-2">6</td>
            <td className="border px-4 py-2">24.5</td>
            <td className="border px-4 py-2">9.6"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">7</td>
            <td className="border px-4 py-2">40</td>
            <td className="border px-4 py-2">6.5</td>
            <td className="border px-4 py-2">25</td>
            <td className="border px-4 py-2">9.8"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">7.5</td>
            <td className="border px-4 py-2">40.5</td>
            <td className="border px-4 py-2">7</td>
            <td className="border px-4 py-2">25.5</td>
            <td className="border px-4 py-2">10.0"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">8</td>
            <td className="border px-4 py-2">41</td>
            <td className="border px-4 py-2">7.5</td>
            <td className="border px-4 py-2">26</td>
            <td className="border px-4 py-2">10.2"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">8.5</td>
            <td className="border px-4 py-2">42</td>
            <td className="border px-4 py-2">8</td>
            <td className="border px-4 py-2">26.5</td>
            <td className="border px-4 py-2">10.4"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">9</td>
            <td className="border px-4 py-2">42.5</td>
            <td className="border px-4 py-2">8.5</td>
            <td className="border px-4 py-2">27</td>
            <td className="border px-4 py-2">10.6"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">9.5</td>
            <td className="border px-4 py-2">43</td>
            <td className="border px-4 py-2">9</td>
            <td className="border px-4 py-2">27.5</td>
            <td className="border px-4 py-2">10.8"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">10</td>
            <td className="border px-4 py-2">44</td>
            <td className="border px-4 py-2">9.5</td>
            <td className="border px-4 py-2">28</td>
            <td className="border px-4 py-2">11.0"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">10.5</td>
            <td className="border px-4 py-2">44.5</td>
            <td className="border px-4 py-2">10</td>
            <td className="border px-4 py-2">28.5</td>
            <td className="border px-4 py-2">11.2"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">11</td>
            <td className="border px-4 py-2">45</td>
            <td className="border px-4 py-2">10.5</td>
            <td className="border px-4 py-2">29</td>
            <td className="border px-4 py-2">11.4"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">11.5</td>
            <td className="border px-4 py-2">45.5</td>
            <td className="border px-4 py-2">11</td>
            <td className="border px-4 py-2">29.5</td>
            <td className="border px-4 py-2">11.6"</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">12</td>
            <td className="border px-4 py-2">46</td>
            <td className="border px-4 py-2">11.5</td>
            <td className="border px-4 py-2">30</td>
            <td className="border px-4 py-2">11.8"</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  
  const renderClothingSizeTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px] text-sm border-collapse">
        <thead>
          <tr className="bg-muted/50">
            <th className="border px-4 py-2 text-left font-medium">Size</th>
            <th className="border px-4 py-2 text-left font-medium">US</th>
            <th className="border px-4 py-2 text-left font-medium">UK</th>
            <th className="border px-4 py-2 text-left font-medium">EU</th>
            <th className="border px-4 py-2 text-left font-medium">Chest (in)</th>
            <th className="border px-4 py-2 text-left font-medium">Waist (in)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">XS</td>
            <td className="border px-4 py-2">34</td>
            <td className="border px-4 py-2">34</td>
            <td className="border px-4 py-2">44</td>
            <td className="border px-4 py-2">34-36</td>
            <td className="border px-4 py-2">28-30</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">S</td>
            <td className="border px-4 py-2">36</td>
            <td className="border px-4 py-2">36</td>
            <td className="border px-4 py-2">46</td>
            <td className="border px-4 py-2">36-38</td>
            <td className="border px-4 py-2">30-32</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">M</td>
            <td className="border px-4 py-2">38-40</td>
            <td className="border px-4 py-2">38-40</td>
            <td className="border px-4 py-2">48-50</td>
            <td className="border px-4 py-2">38-40</td>
            <td className="border px-4 py-2">32-34</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">L</td>
            <td className="border px-4 py-2">42-44</td>
            <td className="border px-4 py-2">42-44</td>
            <td className="border px-4 py-2">52-54</td>
            <td className="border px-4 py-2">42-44</td>
            <td className="border px-4 py-2">36-38</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">XL</td>
            <td className="border px-4 py-2">46-48</td>
            <td className="border px-4 py-2">46-48</td>
            <td className="border px-4 py-2">56-58</td>
            <td className="border px-4 py-2">46-48</td>
            <td className="border px-4 py-2">40-42</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="border px-4 py-2">XXL</td>
            <td className="border px-4 py-2">50-52</td>
            <td className="border px-4 py-2">50-52</td>
            <td className="border px-4 py-2">60-62</td>
            <td className="border px-4 py-2">50-52</td>
            <td className="border px-4 py-2">44-46</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  
  const renderAccessoriesSizeTable = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Hats & Caps</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border px-4 py-2 text-left font-medium">Size</th>
                <th className="border px-4 py-2 text-left font-medium">Head Circumference (cm)</th>
                <th className="border px-4 py-2 text-left font-medium">Head Circumference (in)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="border px-4 py-2">S</td>
                <td className="border px-4 py-2">54-55</td>
                <td className="border px-4 py-2">21.3-21.7</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="border px-4 py-2">M</td>
                <td className="border px-4 py-2">56-57</td>
                <td className="border px-4 py-2">22.0-22.4</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="border px-4 py-2">L</td>
                <td className="border px-4 py-2">58-59</td>
                <td className="border px-4 py-2">22.8-23.2</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="border px-4 py-2">XL</td>
                <td className="border px-4 py-2">60-61</td>
                <td className="border px-4 py-2">23.6-24.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Gloves</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border px-4 py-2 text-left font-medium">Size</th>
                <th className="border px-4 py-2 text-left font-medium">Hand Circumference (cm)</th>
                <th className="border px-4 py-2 text-left font-medium">Hand Length (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="border px-4 py-2">S</td>
                <td className="border px-4 py-2">18-19</td>
                <td className="border px-4 py-2">17-18</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="border px-4 py-2">M</td>
                <td className="border px-4 py-2">20-21</td>
                <td className="border px-4 py-2">18.5-19.5</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="border px-4 py-2">L</td>
                <td className="border px-4 py-2">22-23</td>
                <td className="border px-4 py-2">20-21</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="border px-4 py-2">XL</td>
                <td className="border px-4 py-2">24-25</td>
                <td className="border px-4 py-2">21.5-22.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  const renderMeasurementInstructions = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">How to Measure</h3>
        <p className="text-muted-foreground">For the most accurate results, measurements should be taken directly on your body wearing minimal clothing. Use a soft measuring tape.</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Chest / Bust</h4>
        <p className="text-sm text-muted-foreground">Measure around the fullest part of your chest, keeping the measuring tape horizontal.</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Waist</h4>
        <p className="text-sm text-muted-foreground">Measure around your natural waistline, keeping the tape comfortably loose.</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Hips</h4>
        <p className="text-sm text-muted-foreground">Measure around the fullest part of your hips, about 8" below your natural waistline.</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Inseam</h4>
        <p className="text-sm text-muted-foreground">Measure from the crotch to the bottom of your ankle.</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Foot Length</h4>
        <p className="text-sm text-muted-foreground">Measure from your heel to the tip of your longest toe while standing.</p>
      </div>
    </div>
  );
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-1.5 ${triggerClassName}`}
        >
          <RulerIcon className="h-4 w-4" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
          <DialogDescription>
            Use this guide to find your perfect fit
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={productType}>
          <TabsList className="mb-4">
            <TabsTrigger value="footwear">Footwear</TabsTrigger>
            <TabsTrigger value="clothing">Clothing</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
            <TabsTrigger value="how-to-measure">How to Measure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="footwear" className="space-y-4">
            <p className="text-sm text-muted-foreground">Find your perfect shoe size using our international conversion chart.</p>
            {renderFootwearSizeTable()}
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <strong>Tip:</strong> For the most accurate fit, measure your foot in the evening as feet tend to expand throughout the day.
            </div>
          </TabsContent>
          
          <TabsContent value="clothing" className="space-y-4">
            <p className="text-sm text-muted-foreground">Standard clothing sizes with measurements in inches.</p>
            {renderClothingSizeTable()}
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <strong>Note:</strong> These measurements are guidelines only. For the best fit, please refer to specific product size guides where available.
            </div>
          </TabsContent>
          
          <TabsContent value="accessories" className="space-y-4">
            <p className="text-sm text-muted-foreground">Sizing information for accessories.</p>
            {renderAccessoriesSizeTable()}
          </TabsContent>
          
          <TabsContent value="how-to-measure" className="space-y-4">
            {renderMeasurementInstructions()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}