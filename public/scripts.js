/**
 * Song Search JS portions
 * 
 * Copyright (C) 2021 Christian Bolik
 */


 const getValue = (id) => {
  return document.getElementById(id).value;
}

const setValue = (id, value) => {
  return document.getElementById(id).value = value;
};

const setOptions = (id, divId, ...options) => {
  const listEl = document.getElementById(id);
  listEl.innerHTML = "";
  const uniqueOptions = [...new Set(options)];
  uniqueOptions.forEach(opt => {
    const optionEl = document.createElement("option");
    optionEl.value = opt;
    listEl.appendChild(optionEl);
  })
  const divEl = document.getElementById(divId);
  if (uniqueOptions.length > 1) {
    divEl.classList.add("drop_down_icon")
  } else {
    divEl.classList.remove("drop_down_icon")
  }
}

const setYear = (year) => {
  let el = document.getElementById("year");
  if (year) {
    el.innerHTML = "(" + year + ")";
  } else {
    el.innerHTML = "";
  }
  el.style.display = "inline";
};

const handleEmptyField = (field) => {
  console.error(field + " cannot be empty for this action");
  let capf = field.charAt(0).toUpperCase() + field.slice(1);
  alert(`This action requires ${capf} to be filled in.`);
};

const replaceFieldInURL = (urlTemplate, field) => {
  const regexReq = new RegExp("!" + field + "!", "gi");
  const regexOpt = new RegExp("\\?" + field + "\\?", "gi");
  if (urlTemplate.search(regexReq) > -1) {
    const val = getValue(field);
    if (val && val.length > -1) {
      return urlTemplate.replace(regexReq, encodeURIComponent(val));
    } else {
      handleEmptyField(field);
      return "";
    }
  } else if (urlTemplate.search(regexOpt) > -1) { 
    const val = getValue(field);
    if (val && val.length > -1) {
      return urlTemplate.replace(regexOpt, encodeURIComponent(val));
    } else {
      return urlTemplate.replace(regexOpt, "");
    }
  } else {
    return urlTemplate;
  }
}

const isMobile = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

const isMobileOrTablet = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

const genAction = (urlTemplate) => {
  urlTemplate = replaceFieldInURL(urlTemplate, "title");
  if (urlTemplate.length == 0) {
    return;
  }
  urlTemplate = replaceFieldInURL(urlTemplate, "artist");
  if (urlTemplate.length == 0) {
    return;
  }
  urlTemplate = replaceFieldInURL(urlTemplate, "album");
  if (urlTemplate.length == 0) {
    return;
  }

  if (isMobileOrTablet()) {
    // for mobile and tablets load in current tab 
    // (for current iPadOS this doesn't work - userAgent is the same as on MacOS)
    window.location = urlTemplate;
  } else {
    // for desktop load in new tab
    window.open(urlTemplate, "_blank");
  }
}

const openLyrics = () => {
  genAction("https://www.google.com/search?q=!TITLE!%20?ARTIST?%20lyrics");
}

const openGoogleAlbum = () => {
  genAction("https://www.google.com/search?q=!ALBUM!%20?ARTIST?");
}

const openGoogleArtist = () => {
  genAction("https://www.google.com/search?q=!ARTIST!");
}

const openGoogleSong = () => {
  genAction("https://www.google.com/search?q=!TITLE!%20?ARTIST?");
}

const openHomepage = () => {
  genAction("https://www.google.com/search?q=!ARTIST!%20homepage");
};

const openYouTubeSong = () => {
  genAction("https://www.youtube.com/results?search_query=!TITLE!%20?ARTIST?");
}

const openYouTubeArtist = () => {
  genAction("https://www.youtube.com/results?search_query=!ARTIST!");
};

const openYouTubeAlbum = () => {
  genAction("https://www.youtube.com/results?search_query=!ALBUM!");
};

const openWikiSong = (lang) => {
  if (lang) {
    genAction(`https://${lang}.wikipedia.org/wiki/Special:Search?search=!TITLE!%20?ARTIST?`);
  } else {
     genAction("https://en.wikipedia.org/wiki/Special:Search?search=!TITLE!%20?ARTIST?");
  } 
}

const openWikiArtist = (lang) => {
  if (lang) {
    genAction(`https://${lang}.wikipedia.org/wiki/Special:Search?search=!ARTIST!`);
  } else {
    genAction("https://en.wikipedia.org/wiki/Special:Search?search=!ARTIST!");
  }
};

const openWikiAlbum = (lang) => {
  if (lang) {
    genAction(`https://${lang}.wikipedia.org/wiki/Special:Search?search=!ALBUM!%20?ARTIST?`);
  } else {
    genAction("https://en.wikipedia.org/wiki/Special:Search?search=!ALBUM!%20?ARTIST?");
  }
};

const openDiscogs = () => {
  genAction("https://discogs.com/search/?q=!ALBUM!%20?ARTIST?");
};

const openMusicBrainz = () => {
  genAction("https://musicbrainz.org/search?query=!ALBUM!%20?ARTIST?&type=release");
};

const openAllMusicArtist = () => {
  genAction("https://www.allmusic.com/search/all/!ARTIST!");
};

const openBandcampArtist = () => {
  genAction("https://www.bandcamp.com/search?q=!ARTIST!");
};

const openAllMusicAlbum = () => {
  genAction("https://www.allmusic.com/search/all/!ALBUM!%20?ARTIST?");
};

const openMetaCritic = () => {
  genAction("https://www.metacritic.com/search/all/!ALBUM!/results");
};

const openUltimateGuitar = () => {
  genAction(
    "https://www.ultimate-guitar.com/search.php?search_type=title&value=!TITLE!%20?ARTIST?"
  );
}

const openMuseScore = () => {
  genAction("https://musescore.com/sheetmusic?text=!TITLE!%20?ARTIST?");
};

const openTwitter = () => {
  genAction("https://twitter.com/search?q=!ARTIST!");
};

const spotifyOpenOrSearch = (query) => {
  query = replaceFieldInURL(query, "title");
  if (query.length == 0) return;
  query = replaceFieldInURL(query, "artist");
  if (query.length == 0) return;
  query = replaceFieldInURL(query, "album");
  if (query.length == 0) return;

  const webUrl = `https://open.spotify.com/search/${query}`;
  const appUrl = `spotify:search:${query}`;

  if (isMobileOrTablet()) {
    // On mobile, use web URL (app URL doesn't work reliably in mobile browsers)
    window.location = webUrl;
  } else {
    // On desktop, try to open the Spotify app
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = appUrl;
    document.body.appendChild(iframe);

    // Clean up iframe after the URI scheme has been processed
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }
}

const spotifySearch = () => {
  spotifyOpenOrSearch("!TITLE!%20?ARTIST?");
}

const spotifySearchArtist = () => {
  spotifyOpenOrSearch("!ARTIST!");
}

const spotifySearchAlbum = () => {
  spotifyOpenOrSearch("!ALBUM!%20?ARTIST?");
}

const enterPressed = (event) => {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("lyrics").click();
  }
};

const albumKeyPressed = (event) => {
  event.preventDefault();
  document.getElementById("year").style.display = "none";
};

const resetFields = () => {
  setValue("title", "");
  setValue("artist", "");
  setValue("album", "");
  document.getElementById("year").style.display = "none";
};

const spotifySignOut = () => {
  clearStoredTokens();
  localStorage.removeItem(SPOTIFY_USED_KEY);
  alert("Signed out from Spotify. You'll need to authorize again on next use.");
};

const showHelp = () => {
  document.getElementById("help-block").style.display = "block";
  window.location = "#help-block";
};

const hideHelp = () => {
  document.getElementById("help-block").style.display = "none";
  window.location = "#top";
};

/**
 * Obtains parameters from the query string of the current URL.
 * Used for Spotify API's Authorization Code with PKCE flow.
 * @return Object
 */
const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    code: params.get('code'),
    state: params.get('state'),
    error: params.get('error')
  };
};

/**
 * Generates a random string containing numbers and letters
 * Used for Spotify API state parameter.
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * Base64URL encoding helper (no padding, URL-safe)
 * Used for PKCE code verifier and challenge encoding.
 * @param  {Uint8Array} buffer The buffer to encode
 * @return {string} The base64url encoded string
 */
const base64URLEncode = (buffer) => {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Generate PKCE code verifier (cryptographically random, 43-128 chars)
 * @return {string} The code verifier
 */
const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
};

/**
 * Generate PKCE code challenge from verifier (SHA-256 hash, base64url encoded)
 * @param  {string} verifier The code verifier
 * @return {Promise<string>} The code challenge
 */
const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(hash));
};

const getRedirectURI = (loc) => {
  let uri = loc.origin + loc.pathname;
  return uri.replace(/\/$/, "");
}

const SPOTIFY_CLIENT_ID = atob("MmQ3MzQyZjg2MTdmNGVhNmFmMmM4ODRjYTcwZTJiNDA=");
const SPOTIFY_REDIRECT_URI = getRedirectURI(window.location);
const SPOTIFY_STATE_KEY = "spotify_auth_state";
const SPOTIFY_CODE_VERIFIER_KEY = "spotify_code_verifier";
const SPOTIFY_ACCESS_TOKEN_KEY = "spotify_access_token";
const SPOTIFY_REFRESH_TOKEN_KEY = "spotify_refresh_token";
const SPOTIFY_TOKEN_EXPIRY_KEY = "spotify_token_expiry";
const SPOTIFY_USED_KEY = "spotify_used";

/**
 * Exchange authorization code for access token using PKCE
 * @param  {string} code The authorization code from Spotify
 * @param  {string} codeVerifier The PKCE code verifier
 * @return {Promise<Object>} Token data including access_token and refresh_token
 */
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

/**
 * Refresh the access token using the stored refresh token
 * @return {Promise<Object>} New token data including access_token
 */
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(SPOTIFY_REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID
    })
  });

  if (!response.ok) {
    // Refresh token invalid/expired, need to re-authorize
    clearStoredTokens();
    throw new Error('Refresh token expired');
  }

  return await response.json();
};

/**
 * Store token data in sessionStorage and localStorage
 * @param {Object} tokenData Token response from Spotify
 */
const storeTokenData = (tokenData) => {
  console.log('[Spotify Auth] Storing tokens', {
    hasAccessToken: !!tokenData.access_token,
    hasRefreshToken: !!tokenData.refresh_token,
    expiresIn: tokenData.expires_in
  });

  // Store access token in both sessionStorage and localStorage
  // sessionStorage for current session, localStorage as fallback for mobile
  sessionStorage.setItem(SPOTIFY_ACCESS_TOKEN_KEY, tokenData.access_token);
  localStorage.setItem(SPOTIFY_ACCESS_TOKEN_KEY, tokenData.access_token);

  // Store refresh token in localStorage (persists across sessions)
  if (tokenData.refresh_token) {
    localStorage.setItem(SPOTIFY_REFRESH_TOKEN_KEY, tokenData.refresh_token);
    console.log('[Spotify Auth] Refresh token stored in localStorage');
  } else {
    console.warn('[Spotify Auth] No refresh token in response - will require re-auth when access token expires');
  }

  // Store expiry time (current time + expires_in seconds)
  const expiryTime = Date.now() + (tokenData.expires_in * 1000);
  localStorage.setItem(SPOTIFY_TOKEN_EXPIRY_KEY, expiryTime.toString());

  const expiryDate = new Date(expiryTime);
  console.log('[Spotify Auth] Token expires at:', expiryDate.toLocaleString());
};

/**
 * Clear all stored tokens
 */
const clearStoredTokens = () => {
  console.log('[Spotify Auth] Clearing all stored tokens');
  sessionStorage.removeItem(SPOTIFY_ACCESS_TOKEN_KEY);
  localStorage.removeItem(SPOTIFY_ACCESS_TOKEN_KEY);
  localStorage.removeItem(SPOTIFY_REFRESH_TOKEN_KEY);
  localStorage.removeItem(SPOTIFY_TOKEN_EXPIRY_KEY);
};

/**
 * Check if token needs refresh and refresh if necessary
 * @return {Promise<string>} Valid access token
 */
const refreshTokenIfNeeded = async () => {
  // Try sessionStorage first, fall back to localStorage (for mobile)
  let storedToken = sessionStorage.getItem(SPOTIFY_ACCESS_TOKEN_KEY);
  if (!storedToken) {
    storedToken = localStorage.getItem(SPOTIFY_ACCESS_TOKEN_KEY);
    console.log('[Spotify Auth] Access token not in sessionStorage, using localStorage');
  }

  const expiryTime = localStorage.getItem(SPOTIFY_TOKEN_EXPIRY_KEY);
  const refreshToken = localStorage.getItem(SPOTIFY_REFRESH_TOKEN_KEY);

  console.log('[Spotify Auth] Token status:', {
    hasAccessToken: !!storedToken,
    hasRefreshToken: !!refreshToken,
    hasExpiryTime: !!expiryTime,
    expiryTime: expiryTime ? new Date(parseInt(expiryTime)).toLocaleString() : 'none'
  });

  if (!refreshToken) {
    console.warn('[Spotify Auth] No refresh token available - will need re-auth when token expires');
    return storedToken;
  }

  const now = Date.now();

  // Refresh 5 minutes before expiry (300000ms = 5 minutes)
  if (expiryTime && (now + 300000) >= parseInt(expiryTime)) {
    console.log('[Spotify Auth] Token expiring soon, refreshing...');
    try {
      const newTokenData = await refreshAccessToken();
      storeTokenData(newTokenData);
      return newTokenData.access_token;
    } catch (err) {
      console.error('[Spotify Auth] Token refresh failed:', err);
      // Fall back to stored token if refresh fails
      return storedToken;
    }
  }

  const minutesUntilExpiry = expiryTime ? Math.floor((parseInt(expiryTime) - now) / 60000) : null;
  console.log('[Spotify Auth] Token valid for', minutesUntilExpiry, 'more minutes');

  return storedToken;
};

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

      // Store tokens and expiry
      storeTokenData(tokenData);

      // Get currently playing track
      await fetchCurrentlyPlayingTrack(tokenData.access_token);

      // Clean up URL by removing query parameters
      window.history.replaceState({}, document.title, window.location.pathname);

    } catch (err) {
      console.error("Error during token exchange or API call:", err);
      clearStoredTokens();
    }
  } else {
    // Check if we have a stored access token
    const storedToken = sessionStorage.getItem(SPOTIFY_ACCESS_TOKEN_KEY);
    if (storedToken) {
      // Try to use stored token
      try {
        await fetchCurrentlyPlayingTrack(storedToken);
      } catch (err) {
        // Token might be expired, clear it and request new authorization
        console.error("Stored token invalid:", err);
        clearStoredTokens();
        if (localStorage.getItem(SPOTIFY_USED_KEY)) {
          localStorage.removeItem(SPOTIFY_USED_KEY);
          spotifyGetAccessToken();
        }
      }
    } else if (localStorage.getItem(SPOTIFY_USED_KEY)) {
      // Spotify used previously, trying to obtain new token
      localStorage.removeItem(SPOTIFY_USED_KEY);
      spotifyGetAccessToken();
    }
  }
};

/**
 * Fetch currently playing or recently played track from Spotify
 * @param {string} access_token The Spotify access token
 */
const fetchCurrentlyPlayingTrack = async (access_token) => {
  let url = "https://api.spotify.com/v1/me/player/currently-playing";
  url += "?market=from_token";
  const resp = await fetch(url, {
    headers: {
      Authorization: "Bearer " + access_token,
      Accept: "application/json"
    }
  });

  if (resp.status === 401) {
    // Token expired or invalid
    throw new Error("Token expired");
  }

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
};

/**
 * Main entry point for getting current track from Spotify
 * Checks for stored token first, refreshes if needed, otherwise initiates authorization
 */
const spotifyGetCurrentTrack = async () => {
  try {
    // Check if we have a token and refresh if needed
    const validToken = await refreshTokenIfNeeded();

    if (validToken) {
      // Try to use the token
      try {
        await fetchCurrentlyPlayingTrack(validToken);
      } catch (err) {
        // Token invalid despite refresh, need to re-authorize
        console.log("Token invalid, requesting new authorization");
        clearStoredTokens();
        await spotifyGetAccessToken();
      }
    } else {
      // No token available, start authorization flow
      await spotifyGetAccessToken();
    }
  } catch (err) {
    console.error("Error in spotifyGetCurrentTrack:", err);
    // Fall back to authorization
    await spotifyGetAccessToken();
  }
};

const spotifyGetAccessToken = async () => {
  // authorize user using PKCE flow
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
  url += "?response_type=code";
  url += "&client_id=" + encodeURIComponent(SPOTIFY_CLIENT_ID);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(SPOTIFY_REDIRECT_URI);
  url += "&state=" + encodeURIComponent(state);
  url += "&code_challenge=" + encodeURIComponent(codeChallenge);
  url += "&code_challenge_method=S256";

  window.location = url;
};

const spotifyCheckLastPlayedTrack = (access_token) => {
  // try to get recently played tracks
  url = "https://api.spotify.com/v1/me/player/recently-played?limit=1";
  fetch(url, {
    headers: {
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  })
    .then((resp) => {
      console.log(resp.status);
      if (resp.status === 204) {
        return null;
      } else {
        return resp.json();
      }
    })
    .then((data) => {
      if (data) {
        populateFromSpotify(data.items[0].track);
      }
    });
};

const populateFromSpotify = (attr_prefix) => {
  const orig_title = attr_prefix.name;
  // cut off " -..." and " (..."
  const title = orig_title.replace(/ [-\(].*$/, "");
  const orig_album = attr_prefix.album.name;
  // cut off " (..."
  const album = orig_album.replace(/ [\(\[].*$/, "");
  let artist = "";
  const artist_list = []
  // if multiple artists concat them together
  for (let a of attr_prefix.artists) {
    artist += a.name + " ";
    artist_list.push(a.name);
  }
  artist = artist.trimEnd();
  const releaseDate = attr_prefix.album.release_date;
  const releaseYear = releaseDate.split("-")[0];
  setValue("title", title);
  setOptions("title_list", "title_wrapper", title, orig_title)
  setValue("artist", artist);
  setOptions("artist_list", "artist_wrapper", ...artist_list)
  setValue("album", album);
  setOptions("album_list", "album_wrapper", album, orig_album)
  setYear(releaseYear);

}

const bbc6GetCurrentTrack = () => {
  // Use CORS proxy to bypass CORS restrictions on GitHub Pages
  const corsProxy = "https://corsproxy.io/?";
  url = corsProxy + encodeURIComponent("https://rms.api.bbc.co.uk/v2/services/bbc_6music/segments/latest?limit=1");
  console.log(url);
  fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })
  .then((resp) => {
    console.log(resp.status);
    if (resp.status === 204) {
      return null;
    } else {
      return resp.json();
    }
  })
  .then((data) => {
    if (data && data.data && data.data.length > 0) {
      populateFromBBC6(data.data[0]);
    } else if (data && data.length > 0) {
      populateFromBBC6(data[0]);
    } else {
      console.error("Unexpected BBC Radio 6 response structure:", data);
    }
  })
  .catch((error) => {
    console.error("Error fetching BBC Radio 6 data:", error);
  });
}

const populateFromBBC6 = (attr_prefix) => {
  let orig_title = attr_prefix.titles.secondary;
  let title = ""
  if (orig_title) {
    // cut off " - ..." and " (..."
    title = orig_title.replace(/ [-\(].*$/, "");
  }    
  setValue("title", title);
  setOptions("title_list", "title_wrapper", title, orig_title)

  let artist = attr_prefix.titles.primary;
  setValue("artist", artist);
  setOptions("artist_list", "artist_wrapper", artist)

  setValue("album", "");
  setOptions("album_list", "album_wrapper", "", "")

  setYear("");
}

const kexpGetCurrentTrack = () => {
  url = "https://api.kexp.org/v2/plays/?limit=2";
  fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })
  .then((resp) => {
    console.log(resp.status);
    if (resp.status === 204) {
      return null;
    } else {
      return resp.json();
    }
  })
  .then((data) => {
    if (data) {
      // check if in "airbreak", if yes skip to previous song
      if (data.results[0].song) {
        populateFromKEXP(data.results[0]);
      } else {
        populateFromKEXP(data.results[1]);
      }
    }
  });
}

const starfmGetCurrentTrack = () => {
  url = "https://api.streamabc.net/metadata/channel/30_vqtea82nbeon_wvxg.json";
  fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })
  .then((resp) => {
    console.log(resp.status);
    if (resp.status === 204) {
      return null;
    } else {
      return resp.json();
    }
  })
  .then((data) => {
    if (data) {
      populateFromSTARFM(data);
    }
  });
}

const populateFromKEXP = (attr_prefix) => {
  let orig_title = attr_prefix.song;
  let title = ""
  if (orig_title) {
    // cut off " - ..." and " (..."
    title = orig_title.replace(/ [-\(].*$/, "");
  }    
  setValue("title", title);
  setOptions("title_list", "title_wrapper", title, orig_title)

  let artist = attr_prefix.artist;
  setValue("artist", artist);
  setOptions("artist_list", "artist_wrapper", artist)

  let orig_album = attr_prefix.album;
  let album = ""
  if (orig_album) {
    // cut off " (..."
    album = orig_album.replace(/ [\(\[].*$/, "");
  }
  setValue("album", album);
  setOptions("album_list", "album_wrapper", album, orig_album)

  let releaseDate = attr_prefix.release_date;
  if (releaseDate) {
    let releaseYear = releaseDate.split("-")[0];
    setYear(releaseYear);
  } else {
    setYear("");
  }

}

const populateFromSTARFM = (current_track) => {
  let orig_title = current_track.song;
  let title = ""
  if (orig_title) {
    // cut off " - ..." and " (..."
    title = orig_title.replace(/ [-\(].*$/, "");
  }    
  setValue("title", title);
  setOptions("title_list", "title_wrapper", title, orig_title)

  let artist = current_track.artist;
  setValue("artist", artist);
  setOptions("artist_list", "artist_wrapper", artist)

  setValue("album", "");
  setOptions("album_list", "album_wrapper", album, "")

  setYear("");
}

const fluxfmGetCurrentTrack = (channelId) => {
  url = `https://fluxmusic.api.radiosphere.io/channels/${channelId}/current-track`;
  fetch(url, {
    headers: {
      Accept: "application/json",
    },
  })
  .then((resp) => {
    console.log(resp.status);
    if (resp.status === 204) {
      return null;
    } else {
      return resp.json();
    }
  })
  .then((data) => {
    if (data) {
      populateFromFluxFM(data.trackInfo);
    }
  });
}

const populateFromFluxFM = (attr_prefix) => {
  let orig_title = attr_prefix.title;
  let title = ""
  if (orig_title) {
    // cut off " - ..." and " (..."
    title = orig_title.replace(/ [-\(].*$/, "");
  }    
  setValue("title", title);
  setOptions("title_list", "title_wrapper", title, orig_title)
  
  let artist = attr_prefix.artistCredits;
  setValue("artist", artist);
  const artist_list = []
  for (let a of attr_prefix.artists) {
    artist_list.push(a.name);
  }
  setOptions("artist_list", "artist_wrapper", ...artist_list)

  if (attr_prefix.release) {
    let orig_album = attr_prefix.release.title;
    let album = ""
    if (orig_album) {
      // cut off " (..."
      album = orig_album.replace(/ [\(\[].*$/, "");
    }
    setValue("album", album);
    setOptions("album_list", "album_wrapper", album, orig_album)
  
    let releaseYear = attr_prefix.release.year;
    if (releaseYear) {
      setYear(releaseYear);
    } else {
      setYear("");
    }
  } else {
    setValue("album", "");
    setYear("");
  }

}

const checkForQueryParams = () => {
  let paramsString = window.location.search.substring(1);
  if (!paramsString) {
    const hashString = window.location.hash.substring(1);
    const queryIndex = hashString.indexOf('?');
    if (queryIndex > -1) {
      paramsString = hashString.substring(queryIndex + 1);
    } else {
      return false;
    }
  }
  //console.log("paramsString: " + paramsString);
  const keyValuePairs = paramsString.split('&');
  const paramsMap = {};
  keyValuePairs.forEach(pair => {
    const [key, value] = pair.split('=');
    paramsMap[key] = value;
  });
  //console.log(paramsMap);

  const title = paramsMap['title'];
  const artist = paramsMap['artist'];
  const album = paramsMap['album'];
  let gotParam = false;
  if (title || artist || album) {
    resetFields();
    gotParam = true;
  }
  if (title) {
    document.getElementById("title").value = decodeURIComponent(title);
  }
  if (artist) {
    document.getElementById("artist").value = decodeURIComponent(artist);
  }
  if (album) {
    document.getElementById("album").value = decodeURIComponent(album);
  }

  return gotParam;
}
