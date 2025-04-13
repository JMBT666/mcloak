/**
 * Handles redirection based on visitor type and parameters
 * @param destination Where to redirect the user
 */
export function redirectUser(destination: string): void {
  // If it's an external URL, use window.location
  if (destination.startsWith('http')) {
    window.location.href = destination;
    return;
  }
  
  // Otherwise, do nothing as the router will handle internal redirects
}

/**
 * Checks if current visitor is blacklisted
 * Uses localStorage to persist the blacklisted state
 * This is a client-side cache to avoid excessive API calls
 */
export function isBlacklistedInSession(): boolean {
  try {
    return localStorage.getItem('visitor_status') === 'blacklisted';
  } catch (e) {
    // Fallback for private browsing mode
    return false;
  }
}

/**
 * Mark the current visitor as blacklisted in session storage
 * This caches the blacklisted status on the client to reduce API calls
 */
export function markAsBlacklisted(): void {
  try {
    localStorage.setItem('visitor_status', 'blacklisted');
  } catch (e) {
    // Ignore errors in private browsing mode
    console.warn('Could not blacklist visitor in localStorage');
  }
}

/**
 * Restricts navigation if user is blacklisted
 * @param currentPath The current path 
 * @returns True if navigation should be allowed, false if it should be blocked
 */
export function allowNavigation(currentPath: string): boolean {
  // If already on blog or 404, always allow
  if (currentPath === '/blog' || currentPath === '/404') {
    return true;
  }
  
  // Otherwise, check if blacklisted
  if (isBlacklistedInSession()) {
    // Only allow blog and 404 page when blacklisted
    return false;
  }
  
  // Not blacklisted, allow all navigation
  return true;
}
