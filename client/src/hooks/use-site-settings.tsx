import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define types for site settings
interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  pinterest?: string;
  linkedin?: string;
}

interface CompanyInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  favicon?: string;
}

interface SiteTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  darkMode: boolean;
}

interface HomePageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  featuredProductIds: number[];
  showNewsletter: boolean;
  showTestimonials: boolean;
}

export interface SiteSettings {
  socialLinks: SocialLinks;
  companyInfo: CompanyInfo;
  theme: SiteTheme;
  homePage: HomePageSettings;
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    ogImage?: string;
  };
  footerLinks: {
    column1Title: string;
    column1Links: { text: string; url: string }[];
    column2Title: string;
    column2Links: { text: string; url: string }[];
    column3Title: string;
    column3Links: { text: string; url: string }[];
  };
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSocialLinks: (links: SocialLinks) => Promise<void>;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => Promise<void>;
  updateTheme: (theme: Partial<SiteTheme>) => Promise<void>;
  updateHomePageSettings: (settings: Partial<HomePageSettings>) => Promise<void>;
  updateSeoSettings: (settings: Partial<SiteSettings['seoSettings']>) => Promise<void>;
  updateFooterLinks: (links: Partial<SiteSettings['footerLinks']>) => Promise<void>;
}

// Default settings
const defaultSettings: SiteSettings = {
  socialLinks: {
    facebook: "https://facebook.com/kavinora",
    instagram: "https://instagram.com/kavinora",
    twitter: "https://twitter.com/kavinora",
    youtube: "https://youtube.com/c/kavinora",
    pinterest: "https://pinterest.com/kavinora",
    linkedin: "https://linkedin.com/company/kavinora"
  },
  companyInfo: {
    name: "KavinoRa",
    address: "123 Wellness Street, San Francisco, CA 94107",
    phone: "1-800-KAVINORA",
    email: "support@kavinora.com",
    logo: "https://via.placeholder.com/150x50",
    favicon: "https://via.placeholder.com/32x32"
  },
  theme: {
    primaryColor: "#0F766E",
    secondaryColor: "#0E7490",
    accentColor: "#8B5CF6",
    textColor: "#1F2937",
    backgroundColor: "#FFFFFF",
    darkMode: false
  },
  homePage: {
    heroTitle: "Effortless Comfort for Every Step",
    heroSubtitle: "Experience the perfect blend of wellness and style with our innovative footwear",
    heroImage: "https://via.placeholder.com/1200x600",
    featuredProductIds: [1, 2, 3, 4],
    showNewsletter: true,
    showTestimonials: true
  },
  seoSettings: {
    metaTitle: "KavinoRa | Wellness Footwear for Healthy Living",
    metaDescription: "Discover KavinoRa's revolutionary wellness footwear designed for optimal comfort, support, and health. Shop our collection of innovative shoes today.",
    metaKeywords: ["wellness footwear", "comfortable shoes", "orthopedic sandals", "health shoes", "therapeutic footwear"],
    ogImage: "https://via.placeholder.com/1200x630"
  },
  footerLinks: {
    column1Title: "Shop",
    column1Links: [
      { text: "All Products", url: "/product" },
      { text: "Wellness Sandals", url: "/product?category=sandals" },
      { text: "Active Footwear", url: "/product?category=active" },
      { text: "Orthopedic Collection", url: "/product?category=orthopedic" }
    ],
    column2Title: "Company",
    column2Links: [
      { text: "About Us", url: "/about" },
      { text: "Our Story", url: "/about#story" },
      { text: "Careers", url: "/careers" },
      { text: "Contact", url: "/contact" }
    ],
    column3Title: "Support",
    column3Links: [
      { text: "FAQs", url: "/faq" },
      { text: "Shipping & Returns", url: "/shipping" },
      { text: "Privacy Policy", url: "/privacy-policy" },
      { text: "Terms of Service", url: "/terms-of-service" }
    ]
  }
};

// Create the context
const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  
  // In a real application, you would fetch settings from your API
  const { isLoading } = useQuery({
    queryKey: ['/api/site-settings'],
    // Using a placeholder queryFn since we don't have a real API yet
    queryFn: async () => {
      // In a real app, this would be an API call
      // For now, we'll just return our local default settings
      return defaultSettings;
    },
    // Disable for now since we don't have a real API
    enabled: false
  });
  
  // Effect to update settings when fetched
  useEffect(() => {
    // Initialize with default settings
    setSiteSettings(defaultSettings);
  }, []);

  // Update social links mutation
  const updateSocialLinksMutation = useMutation({
    mutationFn: async (links: SocialLinks) => {
      // In a real app, this would be an API call
      setSiteSettings(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          ...links
        }
      }));
      return links;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      toast({
        title: "Social links updated",
        description: "Your social media links have been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update social links",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update company info mutation
  const updateCompanyInfoMutation = useMutation({
    mutationFn: async (info: Partial<CompanyInfo>) => {
      // In a real app, this would be an API call
      setSiteSettings(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          ...info
        }
      }));
      return info;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      toast({
        title: "Company info updated",
        description: "Your company information has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update company info",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: async (theme: Partial<SiteTheme>) => {
      // In a real app, this would be an API call
      setSiteSettings(prev => ({
        ...prev,
        theme: {
          ...prev.theme,
          ...theme
        }
      }));
      return theme;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      toast({
        title: "Theme updated",
        description: "Your site theme has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update theme",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update home page settings mutation
  const updateHomePageSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<HomePageSettings>) => {
      // In a real app, this would be an API call
      setSiteSettings(prev => ({
        ...prev,
        homePage: {
          ...prev.homePage,
          ...settings
        }
      }));
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      toast({
        title: "Home page updated",
        description: "Your home page settings have been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update home page",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update SEO settings mutation
  const updateSeoSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<SiteSettings['seoSettings']>) => {
      // In a real app, this would be an API call
      setSiteSettings(prev => ({
        ...prev,
        seoSettings: {
          ...prev.seoSettings,
          ...settings
        }
      }));
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      toast({
        title: "SEO settings updated",
        description: "Your SEO settings have been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update SEO settings",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update footer links mutation
  const updateFooterLinksMutation = useMutation({
    mutationFn: async (links: Partial<SiteSettings['footerLinks']>) => {
      // In a real app, this would be an API call
      setSiteSettings(prev => ({
        ...prev,
        footerLinks: {
          ...prev.footerLinks,
          ...links
        }
      }));
      return links;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      toast({
        title: "Footer links updated",
        description: "Your footer links have been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update footer links",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Helper functions that use the mutations
  const updateSocialLinks = async (links: SocialLinks) => {
    await updateSocialLinksMutation.mutateAsync(links);
  };

  const updateCompanyInfo = async (info: Partial<CompanyInfo>) => {
    await updateCompanyInfoMutation.mutateAsync(info);
  };

  const updateTheme = async (theme: Partial<SiteTheme>) => {
    await updateThemeMutation.mutateAsync(theme);
  };

  const updateHomePageSettings = async (settings: Partial<HomePageSettings>) => {
    await updateHomePageSettingsMutation.mutateAsync(settings);
  };

  const updateSeoSettings = async (settings: Partial<SiteSettings['seoSettings']>) => {
    await updateSeoSettingsMutation.mutateAsync(settings);
  };

  const updateFooterLinks = async (links: Partial<SiteSettings['footerLinks']>) => {
    await updateFooterLinksMutation.mutateAsync(links);
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings: siteSettings,
        loading: isLoading,
        updateSocialLinks,
        updateCompanyInfo,
        updateTheme,
        updateHomePageSettings,
        updateSeoSettings,
        updateFooterLinks
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}