import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Route } from "wouter";
import AuthModal from "@/components/AuthModal";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: any; // Allow any component type including those with parameters
}) {
  const { user, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Open auth modal if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      setIsAuthModalOpen(true);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If user is not authenticated, show login modal and render the page underneath
  // (which will be visible but not functional until logged in)
  return (
    <Route path={path}>
      <>
        {!user && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}
        <Component />
      </>
    </Route>
  );
}