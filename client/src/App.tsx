import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Blog from "@/pages/blog";
import LoadingIndicator from "@/components/LoadingIndicator";
import { detectVisitorType } from "@/lib/userAgent";
import { markAsBlacklisted, isBlacklistedInSession } from "@/lib/redirectService";

function Router() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const checkVisitor = async () => {
      setIsLoading(true);
      setShouldRender(false);
      
      try {
        // Check if URL has any parameters, if not and not on restricted routes, mark as directly visiting
        const hasParameters = window.location.search.length > 0;
        const isRestrictedRoute = location === '/blog' || location === '/404';
        const isDirect = !hasParameters && !isRestrictedRoute;

        // Apply client-side blacklisting for direct visitors
        if (isDirect) {
          console.log('Direct domain visitor detected - applying permanent blacklisting');
          markAsBlacklisted();
        }
        
        // Always check with the server to handle both client and server-side blacklisting
        const result = await detectVisitorType(location);
        
        // If detected as a bot, log it and ensure proper handling
        if (result.isBot) {
          console.log('Bot visitor detected - redirecting to blog');
        }
        
        // If the server says user is blacklisted, make sure we update our local state
        if (result.isBlacklisted) {
          console.log('Blacklisted visitor detected - restricting navigation');
          markAsBlacklisted();
        }
        
        // Handle redirects based on server response
        if (result.redirectTo && result.redirectTo !== location) {
          if (result.redirectTo.startsWith("http")) {
            // External redirect - do immediately without rendering anything
            window.location.href = result.redirectTo;
            return; // Don't continue execution
          } else {
            // Internal redirect
            setLocation(result.redirectTo);
            // Wait until next tick to render
            setTimeout(() => setShouldRender(true), 0);
          }
        } else {
          setShouldRender(true);
        }
      } catch (error) {
        console.error("Error detecting visitor type:", error);
        
        // On error, default to 404 page
        setLocation("/404");
        setShouldRender(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkVisitor();
  }, [location, setLocation]);

  // Enforce restricted navigation for blacklisted visitors
  useEffect(() => {
    if (isBlacklistedInSession()) {
      // Only allow blog and 404 pages for blacklisted visitors
      if (location !== '/blog' && location !== '/404') {
        console.log('Blacklisted visitor attempting to access restricted content - redirecting to blog');
        setLocation('/blog');
      }
    }
  }, [location, setLocation]);

  // Don't render anything until we've checked visitor status
  if (!shouldRender && isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <Switch>
        <Route path="/blog" component={Blog} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
