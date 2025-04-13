import { apiRequest } from "@/lib/queryClient";
import { isBlacklistedInSession } from "./redirectService";

export interface VisitorCheckResult {
  isBot: boolean;
  isBlacklisted: boolean;
  hasParameter: boolean;
  redirectTo: string;
}

/**
 * Detects if the current visitor is a bot or human, and determines the appropriate redirection
 * @param currentPath The current path the user is on
 */
export async function detectVisitorType(currentPath: string): Promise<VisitorCheckResult> {
  // Check if already blacklisted in local storage first
  const locallyBlacklisted = isBlacklistedInSession();
  
  try {
    // Include client-side blacklist status in the URL to inform the server
    const response = await apiRequest(
      'GET', 
      `/api/check-visitor?url=${encodeURIComponent(window.location.href)}&clientBlacklisted=${locallyBlacklisted}`
    );
    
    const result = await response.json() as VisitorCheckResult;
    
    // If we're locally blacklisted but server doesn't know yet, override the result
    if (locallyBlacklisted && !result.isBlacklisted) {
      console.log('Client-side blacklisting applied - overriding server response');
      result.isBlacklisted = true;
      
      // Blacklisted users can only access blog or 404
      if (currentPath !== '/blog' && currentPath !== '/404') {
        result.redirectTo = '/blog';
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error detecting visitor type:', error);
    
    // On error, fallback to client-side blacklist state
    if (locallyBlacklisted) {
      return {
        isBot: false,
        isBlacklisted: true,
        hasParameter: false,
        redirectTo: '/blog'  // Default to blog page
      };
    }
    
    throw new Error('Failed to detect visitor type');
  }
}
