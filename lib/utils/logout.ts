/**
 * Comprehensive logout function that clears all authentication data
 * and redirects to login page
 */
export async function performLogout(): Promise<void> {
  try {
    // Call logout API to clear HTTP-only cookies
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies in request
    });
  } catch (error) {
    console.warn('Error calling logout API:', error);
    // Continue with client-side cleanup even if API call fails
  }

  // Clear all client-side storage
  if (typeof window !== 'undefined') {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('mustChangePassword');
    
    // Clear sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('mustChangePassword');
    
    // Clear all localStorage items that might contain auth data
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth') || key.includes('token') || key.includes('user'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear all sessionStorage items that might contain auth data
    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('auth') || key.includes('token') || key.includes('user'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

    console.log('All authentication data cleared');

    // Force redirect to login page with full page reload
    window.location.href = '/login';
  }
}
