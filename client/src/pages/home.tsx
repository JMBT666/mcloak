import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // The default landing page checks parameters and redirects
    // This is a fallback in case the router doesn't handle it
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("fbcli")) {
      setLocation("/blog");
    }
  }, [setLocation]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
            <p className="mb-6">You will be redirected to the appropriate page.</p>
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
