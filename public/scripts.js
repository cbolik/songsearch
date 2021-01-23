/**
 * Song Search JS portions
 * 
 * (C) 2021 Christian Bolik
 */

const getValue = (id) => {
  return document.getElementById(id).value;
}

const setValue = (id, value) => {
  return document.getElementById(id).value = value;
};

const setYear = (year) => {
  let el = document.getElementById("year");
  el.innerHTML = "(" + year + ")";
  el.style.display = "inline";
};

const handleEmptyField = (field) => {
  console.error(field + " cannot be empty for this action");
  let capf = field.charAt(0).toUpperCase() + field.slice(1);
  alert(`Hello. This action requires ${capf} to be filled in.`);
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

  window.open(urlTemplate, "_blank");
}

const openLyrics = () => {
  genAction("https://www.google.com/search?q=!TITLE!%20?ARTIST?%20lyrics");
}

const openHomepage = () => {
  genAction("https://www.google.com/search?q=!ARTIST!%20homepage");
};

const openYouTube = () => {
  genAction("https://www.youtube.com/results?search_query=!TITLE!%20?ARTIST?");
}

const openWikiSong = () => {
  genAction("http://www.wikipedia.org/search-redirect.php?search=!TITLE!");
}

const openWikiArtist = () => {
  genAction("http://www.wikipedia.org/search-redirect.php?search=!ARTIST!");
};

const openWikiAlbum = () => {
  genAction("http://www.wikipedia.org/search-redirect.php?search=!ALBUM!");
};

const openDiscogs = () => {
  genAction("https://discogs.com/search/?q=!ALBUM!%20?ARTIST?");
};

const openUltimateGuitar = () => {
  genAction(
    "https://www.ultimate-guitar.com/search.php?search_type=title&value=!TITLE!%20?ARTIST?"
  );
}

const spotifySearch = () => {
  genAction("https://open.spotify.com/search/!TITLE!%20?ARTIST?");
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

/**
 * Obtains parameters from the hash of the current URL.
 * Used for Spotify API's Implicit Grant flow.
 * @return Object
 */
const getHashParams = () => {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

/**
 * Generates a random string containing numbers and letters
 * Used for Spotify API's Implicit Grant flow.
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

console.log(window.location);

const getRedirectURI = (loc) => {
  let uri = loc.origin + loc.pathname;
  return uri.replace(/\/$/, "");
}

const SPOTIFY_CLIENT_ID = "MmQ3MzQyZjg2MTdmNGVhNmFmMmM4ODRjYTcwZTJiNDA=";
const SPOTIFY_REDIRECT_URI = getRedirectURI(window.location);
console.log(SPOTIFY_REDIRECT_URI);
const SPOTIFY_STATE_KEY = "spotify_auth_state";
const SPOTIFY_USED_KEY = "spotify_used";

const spotifyCheckForCurrentTrack = () => {
  let params = getHashParams();

  let access_token = params.access_token,
    state = params.state,
    storedState = localStorage.getItem(SPOTIFY_STATE_KEY);

  if (access_token && state != null && state === storedState) {
    localStorage.removeItem(SPOTIFY_STATE_KEY); 
    // get currently playing track
    let url = "https://api.spotify.com/v1/me/player/currently-playing";
    url += "?market=from_token";
    fetch(url, {
      headers: {
        Authorization: "Bearer " + access_token,
        Accept: "application/json"
      },
    })
      .then((resp) => {
        console.log(resp);
        if (resp.status === 204) {
          return null;
        } else {
          return resp.json();
        }
      })
      .then((data) => {
        localStorage.setItem(SPOTIFY_USED_KEY, true);
        console.log("response from currently-playing", data);
        if (data) {
          let title = data.item.name;
          let album = data.item.album.name;
          let artist = "";
          // if multiple artists concat them together
          for (let a of data.item.artists) {
            artist += a.name + " ";
          }
          let releaseDate = data.item.album.release_date;
          let releaseYear = releaseDate.split("-")[0];
          console.log(releaseDate, releaseYear);
          setValue("title", title);
          setValue("artist", artist);
          setValue("album", album);
          setYear(releaseYear);
        }
      });
  } else {
    if (localStorage.getItem(SPOTIFY_USED_KEY)) {
      console.log("Spotify used previously, trying to obtain token");
      spotifyGetAccessToken();
    }
  }
}

const spotifyGetAccessToken = () => {
  // authorize user and get access token
  let scope = "user-read-currently-playing";
  let url = "https://accounts.spotify.com/authorize";
  let state = generateRandomString(16);
  localStorage.setItem(SPOTIFY_STATE_KEY, state);

  url += "?response_type=token";
  url += "&client_id=" + encodeURIComponent(atob(SPOTIFY_CLIENT_ID));
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(SPOTIFY_REDIRECT_URI);
  url += "&state=" + encodeURIComponent(state);
  window.location = url;
}

