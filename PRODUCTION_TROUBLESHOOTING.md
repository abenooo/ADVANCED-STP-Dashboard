# Production Troubleshooting Guide

## Common Production Issues & Solutions

### 1. Environment Variables Missing
**Error**: API calls failing, undefined environment variables
**Solution**: Ensure all environment variables are set in production:

Required Environment Variables:
```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=abenezerkifle000@gmail.com
COMPANY_NAME=Advanced TSP Services
CONTACT_PERSON=Support Team
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NODE_ENV=production
```

### 2. Hydration Mismatch Errors
**Error**: "Text content does not match server-rendered HTML"
**Solution**: Add `suppressHydrationWarning={true}` to components with dynamic content

### 3. API Endpoint Issues
**Error**: 404 on API routes, CORS issues
**Solution**: Check that all API routes are properly deployed and accessible

### 4. Missing Dependencies
**Error**: Module not found errors
**Solution**: Ensure all dependencies are in package.json and installed

### 5. Cookie/Authentication Issues
**Error**: Users getting logged out, authentication failing
**Solution**: Check cookie settings for production domain

## Quick Fixes

### Fix 1: Update Next.js Config for Production
Create/update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['resend']
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

### Fix 2: Add Error Boundary
Create error boundary component to catch production errors gracefully.

### Fix 3: Update Cookie Settings for Production
Ensure cookies work across domains in production.

## Deployment Checklist

- [ ] All environment variables set in production
- [ ] Build completes successfully (`npm run build`)
- [ ] All API endpoints accessible
- [ ] Database connections working
- [ ] Email service configured
- [ ] Domain/CORS settings correct
- [ ] SSL certificate installed

## Common Error Messages & Solutions

### "Module not found: Can't resolve '@/...'"
- Check tsconfig.json paths configuration
- Ensure all imports use correct paths

### "fetch failed" or "ECONNREFUSED"
- Check API endpoint URLs
- Verify backend service is running
- Check firewall/network settings

### "Hydration failed"
- Add suppressHydrationWarning to dynamic content
- Ensure server and client render the same content

### "Authentication failed"
- Check JWT_SECRET in production
- Verify cookie domain settings
- Check token expiration

## Debug Production Issues

1. Check browser console for client-side errors
2. Check server logs for API errors
3. Verify environment variables are loaded
4. Test API endpoints directly
5. Check network requests in browser dev tools
