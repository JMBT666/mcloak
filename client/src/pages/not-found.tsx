import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Page Not Found</h2>
            <div className="mb-8">
              <AlertCircle className="h-24 w-24 text-red-500 mx-auto" />
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              onClick={() => setLocation("/")}
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
