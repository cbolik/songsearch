# Spotify Authentication Migration Plan

## Overview
Migrate Song Search from Spotify's deprecated **Implicit Grant** flow to the **Authorization Code with PKCE** flow, as required by Spotify's updated authentication requirements.

**Strategy:** Fully client-side implementation (no backend changes needed)

**Related Issue:** #2
**References:**
- [Spotify PKCE Flow Documentation](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)
- [Migration Guide](https://developer.spotify.com/documentation/web-api/tutorials/migration-implicit-auth-code)

---

## Current Implementation Analysis

### What's Currently Used (Implicit Grant)
- **Flow:** Client-side only, returns access token directly in URL hash
- **Token Location:** `window.location.hash` (e.g., `#access_token=...&state=...`)
- **Security:** Less secure (token exposed in browser history, logs)
- **Token Refresh:** Not supported (requires re-authentication)
- **Code Locations:**
  - [scripts.js:296-304](public/scripts.js#L296-L304) - `getHashParams()` parses hash fragments
  - [scripts.js:375-388](public/scripts.js#L375-L388) - `spotifyGetAccessToken()` redirects to implicit grant endpoint
  - [scripts.js:332-373](public/scripts.js#L332-L373) - `spotifyCheckForCurrentTrack()` handles callback
  - [scripts.js:327](public/scripts.js#L327) - Base64 encoded client ID

### What Needs to Change (PKCE Flow)
- **Flow:** Uses authorization code + code verifier/challenge
- **Token Location:** Query parameters (`?code=...&state=...`), then exchanged for token via **client-side** API call
- **Security:** More secure (code can only be used once, requires verifier)
- **Token Refresh:** Supports refresh tokens (optional for this implementation)
- **Backend:** ✅ **Not required** - PKCE is designed for public clients and Spotify's token endpoint supports CORS

---

## Why Client-Side PKCE Works

PKCE (Proof Key for Code Exchange) was specifically designed for public clients like SPAs where storing secrets isn't possible. Key points:

1. **No Client Secret Needed:** PKCE replaces the client secret with a dynamically generated code verifier
2. **Spotify Supports CORS:** The token endpoint allows direct browser calls for PKCE flows
3. **Secure by Design:** Even if an attacker intercepts the authorization code, they can't use it without the code verifier
4. **Officially Recommended:** Spotify explicitly recommends this approach for single-page applications

**Benefits for this project:**
- ✅ No backend/serverless infrastructure needed
- ✅ Current GitHub Pages deployment works as-is
- ✅ Zero additional costs
- ✅ Simpler architecture

---

## Migration Steps

### 1. Frontend Changes (public/scripts.js)

#### 1.1 Replace Hash-Based Token Parsing
**Remove:**
- [scripts.js:296-304](public/scripts.js#L296-L304) - `getHashParams()` function (no longer needed)

**Add:**
- `getQueryParams()` - Parse query string for authorization code
- Handle `?code=...&state=...` instead of `#access_token=...`

**Implementation:**
```javascript
const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    code: params.get('code'),
    state: params.get('state'),
    error: params.get('error')
  };
};
```

#### 1.2 Implement PKCE Helper Functions
**New functions needed:**

```javascript
// Generate code verifier (cryptographically random, 43-128 chars)
const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
};

// Generate code challenge from verifier (SHA-256 hash, base64url encoded)
const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(hash));
};

// Base64URL encoding helper (no padding, URL-safe)
const base64URLEncode = (buffer) => {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};
```

#### 1.3 Update Authorization Flow
**Modify:** [scripts.js:375-388](public/scripts.js#L375-L388) - `spotifyGetAccessToken()`

**Changes:**
```javascript
const spotifyGetAccessToken = async () => {
  const scope = "user-read-currently-playing user-read-recently-played";
  const state = generateRandomString(16);

  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store state and verifier for callback validation
  localStorage.setItem(SPOTIFY_STATE_KEY, state);
  localStorage.setItem(SPOTIFY_CODE_VERIFIER_KEY, codeVerifier);

  // Build authorization URL with PKCE parameters
  let url = "https://accounts.spotify.com/authorize";
  url += "?response_type=code";  // Changed from 'token'
  url += "&client_id=" + encodeURIComponent(SPOTIFY_CLIENT_ID);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(SPOTIFY_REDIRECT_URI);
  url += "&state=" + encodeURIComponent(state);
  url += "&code_challenge=" + encodeURIComponent(codeChallenge);
  url += "&code_challenge_method=S256";

  window.location = url;
};
```

#### 1.4 Implement Token Exchange (Client-Side)
**New function:**

```javascript
const exchangeCodeForToken = async (code, codeVerifier) => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: codeVerifier
    })
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  return await response.json();
};
```

#### 1.5 Update Callback Handling
**Modify:** [scripts.js:332-373](public/scripts.js#L332-L373) - `spotifyCheckForCurrentTrack()`

**Changes:**
```javascript
const spotifyCheckForCurrentTrack = async () => {
  const params = getQueryParams();

  const code = params.code;
  const state = params.state;
  const error = params.error;
  const storedState = localStorage.getItem(SPOTIFY_STATE_KEY);
  const codeVerifier = localStorage.getItem(SPOTIFY_CODE_VERIFIER_KEY);

  // Handle authorization errors
  if (error) {
    console.error("Spotify authorization error:", error);
    localStorage.removeItem(SPOTIFY_STATE_KEY);
    localStorage.removeItem(SPOTIFY_CODE_VERIFIER_KEY);
    return;
  }

  // If we have a code, exchange it for a token
  if (code && state != null && state === storedState && codeVerifier) {
    // Clean up stored values
    localStorage.removeItem(SPOTIFY_STATE_KEY);
    localStorage.removeItem(SPOTIFY_CODE_VERIFIER_KEY);

    try {
      // Exchange authorization code for access token
      const tokenData = await exchangeCodeForToken(code, codeVerifier);
      const access_token = tokenData.access_token;

      // Get currently playing track
      let url = "https://api.spotify.com/v1/me/player/currently-playing";
      url += "?market=from_token";
      const resp = await fetch(url, {
        headers: {
          Authorization: "Bearer " + access_token,
          Accept: "application/json"
        }
      });

      localStorage.setItem(SPOTIFY_USED_KEY, true);

      if (resp.status === 204) {
        // Nothing playing, try recently played
        await spotifyCheckLastPlayedTrack(access_token);
      } else {
        const data = await resp.json();
        if (data && data.item) {
          populateFromSpotify(data.item);
        } else {
          await spotifyCheckLastPlayedTrack(access_token);
        }
      }

      // Clean up URL by removing query parameters
      window.history.replaceState({}, document.title, window.location.pathname);

    } catch (err) {
      console.error("Error during token exchange or API call:", err);
      localStorage.setItem(SPOTIFY_USED_KEY, true);
    }
  } else if (localStorage.getItem(SPOTIFY_USED_KEY)) {
    // Spotify used previously, trying to obtain new token
    localStorage.removeItem(SPOTIFY_USED_KEY);
    spotifyGetAccessToken();
  }
};
```

#### 1.6 Constants Update
**Modify:** [scripts.js:327-330](public/scripts.js#L327-L330)

**Changes:**
```javascript
// Decode the base64 client ID (can now be plain text since no secret involved)
const SPOTIFY_CLIENT_ID = atob("MmQ3MzQyZjg2MTdmNGVhNmFmMmM4ODRjYTcwZTJiNDA=");
const SPOTIFY_REDIRECT_URI = getRedirectURI(window.location);
const SPOTIFY_STATE_KEY = "spotify_auth_state";
const SPOTIFY_CODE_VERIFIER_KEY = "spotify_code_verifier";  // NEW
const SPOTIFY_USED_KEY = "spotify_used";
```

**Files to modify:**
- [public/scripts.js](public/scripts.js) - All changes are in this file only!

---

## Testing Plan

### 2.1 Local Testing
1. Run `npm start` and open http://localhost:8000
2. Click Spotify button to trigger authorization
3. Verify redirect to Spotify login
4. After authorization, verify:
   - Redirect back to app with `?code=...&state=...` in URL
   - Token exchange completes successfully
   - Currently playing track populates (or recently played if nothing playing)
   - URL gets cleaned up (query params removed)
5. Test error cases:
   - Deny authorization at Spotify (should handle gracefully)
   - Clear localStorage and test state validation

### 2.2 Mobile/Desktop Testing
- Test on mobile browsers (iOS Safari, Android Chrome)
- Test on desktop browsers (Chrome, Firefox, Safari)
- Verify existing mobile/tablet detection logic still works

### 2.3 Spotify Developer Dashboard
Before deployment, update your app settings:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Edit Settings → Redirect URIs
4. Ensure these URIs are whitelisted:
   - `http://localhost:8000` (for local testing)
   - `https://yourusername.github.io/SongSearch` (for production)
5. Save changes

### 2.4 GitHub Pages Deployment
1. Commit changes to master
2. Deploy: `git subtree push --prefix public origin gh-pages`
3. Test production URL
4. Monitor browser console for any CORS or API errors

---

## Security Considerations

### 3.1 PKCE Implementation
✅ **Code verifier:** Generated using `crypto.getRandomValues()` (cryptographically secure)
✅ **Length:** 43 characters (base64url encoded from 32 bytes)
✅ **Code challenge:** SHA-256 hash of verifier, base64url encoded
✅ **Storage:** Stored in localStorage only temporarily, cleared after token exchange

### 3.2 State Parameter
✅ **CSRF Protection:** Random state generated and validated on callback
✅ **Validation:** State must match before proceeding with token exchange

### 3.3 Client ID Exposure
✅ **Acceptable:** Client ID in frontend code is normal for public SPAs
✅ **No Secret:** PKCE doesn't require client secret
✅ **Security:** Code verifier provides the security, not the client ID

### 3.4 Token Handling
✅ **No localStorage for tokens:** Access tokens stay in memory only (function scope)
✅ **URL cleanup:** Query parameters removed from URL after processing
✅ **Error handling:** Failed exchanges don't expose sensitive data

---

## Rollout Strategy

### 4.1 Development
1. Create feature branch: `git checkout -b feature/spotify-pkce-auth`
2. Implement changes to [public/scripts.js](public/scripts.js)
3. Test locally with `npm start`
4. Verify all existing functionality works

### 4.2 Spotify Developer Dashboard Updates
**Before deployment:**
1. Log in to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your Song Search app
3. Edit Settings → Redirect URIs
4. Ensure production URL is whitelisted (e.g., `https://cbolik.github.io/SongSearch`)

### 4.3 Deployment
1. Merge to master: `git checkout master && git merge feature/spotify-pkce-auth`
2. Push to GitHub: `git push origin master`
3. Deploy to GitHub Pages: `git subtree push --prefix public origin gh-pages`
4. Test production URL immediately
5. Monitor browser console for errors

### 4.4 Backward Compatibility
- **Not needed:** Spotify will deprecate implicit grant for everyone
- **Clean cutover:** New flow replaces old flow completely
- **User impact:** Users may need to re-authenticate once after deployment

---

## Files to Modify

**Single file change:**
- [public/scripts.js](public/scripts.js) - All PKCE implementation changes

**No changes needed:**
- ~~app.js~~ - Backend not required for PKCE
- ~~package.json~~ - No new dependencies needed
- ~~.env~~ - No environment configuration needed

---

## Success Criteria

- [ ] PKCE helper functions implemented (code verifier, challenge generation, base64url encoding)
- [ ] Authorization flow updated to use `response_type=code` with PKCE parameters
- [ ] Token exchange implemented client-side with proper error handling
- [ ] Callback handling migrated from hash-based to query parameter-based
- [ ] State validation working correctly (CSRF protection)
- [ ] Users can authenticate with Spotify successfully
- [ ] "Currently playing" feature works as before
- [ ] "Recently played" feature works as before
- [ ] URL cleanup after callback (query params removed)
- [ ] All existing functionality remains intact (radio stations, search buttons, etc.)
- [ ] Works on desktop browsers (Chrome, Firefox, Safari)
- [ ] Works on mobile browsers (iOS Safari, Android Chrome)
- [ ] Spotify Developer Dashboard redirect URIs configured correctly
- [ ] Deployed successfully to GitHub Pages
- [ ] Production testing completed with no console errors
- [ ] No security vulnerabilities introduced

---

## Token Storage Options

The PKCE flow provides several options for handling access tokens and refresh tokens. Each has trade-offs between user experience and security.

### Option 1: SessionStorage (Current Implementation)

**Status:** ✅ **Implemented**

**How it works:**
- Access token stored in `sessionStorage` after successful authorization
- Token persists across page reloads within the same browser session
- Token automatically cleared when browser/tab closes
- User only needs to authorize once per browser session

**Implementation:**
```javascript
// After successful token exchange
sessionStorage.setItem('spotify_access_token', access_token);

// On page load/button click, check for existing token
const storedToken = sessionStorage.getItem('spotify_access_token');
if (storedToken) {
  // Use stored token to fetch currently playing track
}
```

**Pros:**
- ✅ Great UX - user authorizes once per session
- ✅ Simple to implement
- ✅ Token automatically expires with session
- ✅ No persistent storage of sensitive data

**Cons:**
- ⚠️ Token visible in browser DevTools
- ⚠️ User must re-authorize when opening new browser session
- ⚠️ Tokens typically expire after 1 hour (Spotify default)

**Best for:** Current use case where users check "now playing" occasionally

---

### Option 2: Memory-Only (No Storage)

**Status:** Previous implementation (less user-friendly)

**How it works:**
- Access token kept only in function scope/memory
- Never stored anywhere
- User must re-authorize on every button click or page reload

**Pros:**
- ✅ Most secure - token never persisted
- ✅ No storage to clear

**Cons:**
- ❌ Poor UX - constant re-authorization required
- ❌ Makes the app nearly unusable for frequent checks

---

### Option 3: Refresh Token Implementation (Future Enhancement)

**Status:** 🔮 **Not yet implemented - future consideration**

**How it works:**
1. During authorization, request `offline_access` scope (not needed for Spotify, they provide refresh tokens automatically with PKCE)
2. After token exchange, receive both `access_token` (1 hour expiry) and `refresh_token` (long-lived)
3. Store refresh token in `localStorage` (or encrypted cookie if backend added)
4. When access token expires, use refresh token to get new access token without user interaction
5. Refresh tokens can be revoked by user or expire after extended non-use

**Implementation complexity:**
- Medium - requires token expiry tracking
- Need to handle refresh token API calls
- Should implement token refresh before expiry (not after failure)
- Consider adding backend to store refresh tokens more securely

**Code sketch:**
```javascript
// Constants
const SPOTIFY_REFRESH_TOKEN_KEY = "spotify_refresh_token";
const SPOTIFY_TOKEN_EXPIRY_KEY = "spotify_token_expiry";

// After initial token exchange
const tokenData = await exchangeCodeForToken(code, codeVerifier);
sessionStorage.setItem('spotify_access_token', tokenData.access_token);
localStorage.setItem(SPOTIFY_REFRESH_TOKEN_KEY, tokenData.refresh_token);
const expiryTime = Date.now() + (tokenData.expires_in * 1000);
localStorage.setItem(SPOTIFY_TOKEN_EXPIRY_KEY, expiryTime);

// Before making API calls
const refreshTokenIfNeeded = async () => {
  const expiryTime = localStorage.getItem(SPOTIFY_TOKEN_EXPIRY_KEY);
  const now = Date.now();

  // Refresh 5 minutes before expiry
  if (expiryTime && (now + 300000) >= expiryTime) {
    const refreshToken = localStorage.getItem(SPOTIFY_REFRESH_TOKEN_KEY);
    const newTokenData = await refreshAccessToken(refreshToken);
    sessionStorage.setItem('spotify_access_token', newTokenData.access_token);
    const newExpiry = Date.now() + (newTokenData.expires_in * 1000);
    localStorage.setItem(SPOTIFY_TOKEN_EXPIRY_KEY, newExpiry);

    // Refresh token might also be rotated
    if (newTokenData.refresh_token) {
      localStorage.setItem(SPOTIFY_REFRESH_TOKEN_KEY, newTokenData.refresh_token);
    }
  }
};

// New function to refresh tokens
const refreshAccessToken = async (refreshToken) => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID
    })
  });

  if (!response.ok) {
    // Refresh token invalid/expired, need to re-authorize
    localStorage.removeItem(SPOTIFY_REFRESH_TOKEN_KEY);
    localStorage.removeItem(SPOTIFY_TOKEN_EXPIRY_KEY);
    throw new Error('Refresh token expired');
  }

  return await response.json();
};
```

**Pros:**
- ✅ Excellent UX - user rarely needs to re-authorize
- ✅ Works across multiple browser sessions
- ✅ Automatic token refresh before expiry
- ✅ Standard OAuth2 pattern

**Cons:**
- ⚠️ More complex implementation
- ⚠️ Refresh tokens stored in localStorage (XSS risk if app has vulnerabilities)
- ⚠️ Need to handle refresh token expiration/revocation
- ⚠️ Need UI for user to manually disconnect/revoke

**Security considerations:**
- Refresh tokens should ideally be stored server-side (requires backend)
- For client-side storage, ensure app has no XSS vulnerabilities
- Implement a "Sign Out" button to clear refresh token
- Consider adding expiry monitoring to show "session will expire" warnings

**When to implement:**
- If users complain about frequent re-authorization
- If you add more features requiring frequent Spotify API access
- If you're willing to add backend infrastructure for secure token storage

**Migration path from Option 1 to Option 3:**
1. Add token expiry tracking to sessionStorage implementation
2. Add refresh token handling to `exchangeCodeForToken()`
3. Create `refreshAccessToken()` function
4. Add `refreshTokenIfNeeded()` check before API calls
5. Add "Sign Out" button to revoke tokens
6. Test token refresh flow
7. (Optional) Add backend for secure refresh token storage

---

## Summary

This migration moves Song Search from the deprecated Implicit Grant flow to the modern Authorization Code with PKCE flow using a **fully client-side implementation**. This approach:

- Requires changes to only one file ([public/scripts.js](public/scripts.js))
- Maintains the current GitHub Pages deployment workflow
- Costs $0 (no backend infrastructure needed)
- Is officially supported and recommended by Spotify for SPAs
- Provides better security than the old implicit grant flow
- **Token storage:** Uses sessionStorage (Option 1) for good UX with reasonable security

The implementation adds ~100 lines of code for PKCE functionality and session-based token storage.
