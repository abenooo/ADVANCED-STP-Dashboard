// Helper to get auth token from cookies
export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  // Try to get token from cookies
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? match[1] : null;
}

// Helper to create headers with auth token
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Redirect to login if not authenticated
export function requireAuth(redirectUrl = '/login'): void {
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    window.location.href = redirectUrl;
  }
}
