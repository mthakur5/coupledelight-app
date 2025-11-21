# Vercel Deployment Guide for CoupleDelight

## Problem Identified

The signup error "Application error: a client-side exception has occurred" was happening because:

1. **NEXTAUTH_URL mismatch**: Environment variable was set to `http://localhost:3000` but the app is deployed on Vercel
2. **Missing trustHost configuration**: NextAuth requires `trustHost: true` for Vercel deployments
3. **Missing production environment variables**: Vercel deployment needs all environment variables configured in the dashboard

## Solution Implemented

### Code Changes Made:

1. ✅ Added `trustHost: true` to NextAuth configuration in [`apps/main/src/lib/auth.ts`](apps/main/src/lib/auth.ts:109)
2. ✅ Added comprehensive error logging in [`apps/main/src/app/api/auth/register/route.ts`](apps/main/src/app/api/auth/register/route.ts)
3. ✅ Fixed TypeScript type errors in session handling

### Required Environment Variables on Vercel

You must configure these environment variables in your Vercel project dashboard:

#### Essential Variables:

```bash
# Database Connection
MONGODB_URI=mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=https://main-ten-weld.vercel.app

# OAuth Providers (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

## How to Configure Environment Variables on Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `main-ten-weld`
3. Click on **Settings** tab
4. Click on **Environment Variables** in the sidebar
5. Add each variable:
   - **Key**: Variable name (e.g., `MONGODB_URI`)
   - **Value**: Variable value
   - **Environments**: Select `Production`, `Preview`, and `Development`
6. Click **Save**
7. **Redeploy** your application for changes to take effect

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add MONGODB_URI production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production

# Redeploy
vercel --prod
```

## Critical Environment Variable Notes

### 1. NEXTAUTH_URL
**MUST** be set to your actual Vercel deployment URL:
```bash
NEXTAUTH_URL=https://main-ten-weld.vercel.app
```

### 2. NEXTAUTH_SECRET
Generate a secure secret for production:
```bash
# Generate using OpenSSL
openssl rand -base64 32

# Or use online generator
# https://generate-secret.vercel.app/32
```

### 3. MONGODB_URI
Ensure your MongoDB server allows connections from Vercel's IP addresses. If using MongoDB Atlas or a cloud database, add `0.0.0.0/0` to IP whitelist (or Vercel's specific IPs for better security).

## Security Recommendations

### For Production Deployment:

1. **Change NEXTAUTH_SECRET**: Use a strong, randomly generated secret
   ```bash
   # Generate new secret
   openssl rand -base64 32
   ```

2. **Update MongoDB credentials**: Don't use the same credentials for development and production

3. **Configure OAuth properly**:
   - Add Vercel domain to Google OAuth Console
   - Add Vercel domain to Facebook App settings
   - Update callback URLs to include your Vercel domain

4. **Database Security**:
   - Use MongoDB Atlas with IP whitelisting
   - Enable authentication
   - Use strong passwords
   - Enable encryption at rest

## Testing After Deployment

1. Redeploy your application after adding environment variables
2. Test signup flow at: https://main-ten-weld.vercel.app/register
3. Check Vercel function logs for any errors:
   - Go to your project dashboard
   - Click on **Deployments**
   - Click on the latest deployment
   - Click on **Functions** to see logs

## Troubleshooting

### Still Getting Errors?

1. **Check Vercel Logs**:
   ```bash
   vercel logs --follow
   ```

2. **Verify Environment Variables**:
   - Make sure all required variables are set
   - Check for typos in variable names
   - Ensure values don't have extra spaces or quotes

3. **Database Connection Issues**:
   - Verify MongoDB URI is correct
   - Check if MongoDB server is accessible from Vercel
   - Test connection string locally

4. **Clear Browser Cache**:
   - Clear cookies and localStorage
   - Try in incognito mode

5. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for specific error messages
   - Check Network tab for failed requests

## Next Steps

1. ✅ Set all environment variables on Vercel dashboard
2. ✅ Redeploy your application
3. ✅ Test signup functionality
4. ✅ Configure OAuth providers if needed
5. ✅ Set up production database with proper security

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js Deployment Documentation](https://next-auth.js.org/deployment)
- [MongoDB Atlas Setup Guide](https://docs.atlas.mongodb.com/getting-started/)