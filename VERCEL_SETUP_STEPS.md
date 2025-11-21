# Vercel पर Environment Variables कैसे Set करें

## तुरंत करने वाले Steps:

### Step 1: Vercel Dashboard में जाएं
1. https://vercel.com/dashboard खोलें
2. अपने project **main-ten-weld** को select करें

### Step 2: Environment Variables Add करें
1. **Settings** tab पर click करें
2. Left sidebar में **Environment Variables** पर click करें
3. निचे दिए गए variables को एक-एक करके add करें:

#### जरूरी Variables:

| Variable Name | Value | Kahan Use Hota Hai |
|--------------|-------|-------------------|
| `MONGODB_URI` | `mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin` | Database connection |
| `NEXTAUTH_SECRET` | Generate new secret (देखें नीचे) | NextAuth security |
| `NEXTAUTH_URL` | `https://main-ten-weld.vercel.app` | NextAuth configuration |

#### Optional OAuth Variables (अभी के लिए skip कर सकते हैं):
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

### Step 3: NEXTAUTH_SECRET Generate करें

**Option 1**: Terminal में run करें:
```bash
openssl rand -base64 32
```

**Option 2**: Online generator use करें:
- https://generate-secret.vercel.app/32 पर जाएं
- Generate होने वाली string को copy करें

### Step 4: Variables Add कैसे करें

हर variable के लिए:
1. **Key** में variable name लिखें (जैसे `MONGODB_URI`)
2. **Value** में actual value paste करें
3. **Environments** में तीनों select करें:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
4. **Save** button पर click करें

### Step 5: Redeploy करें

Variables add करने के बाद:
1. **Deployments** tab पर जाएं
2. Latest deployment के right side में **⋯** (three dots) पर click करें
3. **Redeploy** select करें
4. Confirm करें

**या** Terminal से:
```bash
cd /Users/manmohankumar/Desktop/coupledelight/apps/main
vercel --prod
```

## Verification Steps (जांच करें)

1. Deployment complete होने के बाद:
   - https://main-ten-weld.vercel.app/register पर जाएं
   - Signup form भरें
   - Error नहीं आनी चाहिए

2. अगर अभी भी error आए:
   - Vercel dashboard में **Functions** tab check करें
   - Logs में exact error message देखें
   - Console logs check करें (browser F12)

## Common Issues और Solutions

### Issue 1: "Application error" अभी भी आ रहा है
**Solution**: 
- Check करें कि सभी environment variables properly set हैं
- Variable names में typo नहीं होनी चाहिए
- Redeploy जरूर करें variables add करने के बाद

### Issue 2: Database connection fail हो रहा है
**Solution**:
- MongoDB URI check करें
- Database server accessible है या नहीं verify करें
- MongoDB से connection test करें

### Issue 3: NextAuth error आ रहा है
**Solution**:
- `NEXTAUTH_URL` exactly अपनी Vercel URL हो: `https://main-ten-weld.vercel.app`
- `NEXTAUTH_SECRET` properly set हो
- कोई extra spaces या quotes नहीं होने चाहिए

## Files में जो Changes हुए हैं:

### ✅ Fixed Files:
1. **apps/main/src/lib/auth.ts**
   - Added `trustHost: true` for Vercel compatibility
   - Fixed session type handling

2. **apps/main/src/app/api/auth/register/route.ts**
   - Added detailed error logging
   - Better error messages
   - MongoDB duplicate key error handling

## अगले Steps:

1. ✅ Vercel पर environment variables set करें (ऊपर देखें)
2. ✅ Application redeploy करें
3. ✅ Signup test करें
4. ⏭️ OAuth providers setup करें (optional, बाद में)

## Help की जरूरत है?

- Detailed guide देखें: `VERCEL_DEPLOYMENT_GUIDE.md`
- Vercel docs: https://vercel.com/docs
- NextAuth docs: https://next-auth.js.org

---

**Important Note**: Production के लिए नया MongoDB database और credentials use करना better है security के लिए!