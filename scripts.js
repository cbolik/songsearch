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
    genAction(`http://www.wikipedia.org/search-redirect.php?language=${lang}&search=!TITLE!`);
  } else {
     genAction("http://www.wikipedia.org/search-redirect.php?search=!TITLE!");
  } 
}

const openWikiArtist = (lang) => {
  if (lang) {
    genAction(`http://www.wikipedia.org/search-redirect.php?language=${lang}&search=!ARTIST!`);
  } else {
    genAction("http://www.wikipedia.org/search-redirect.php?search=!ARTIST!");
  }
};

const openWikiAlbum = (lang) => {
  if (lang) {
    genAction(`http://www.wikipedia.org/search-redirect.php?language=${lang}&search=!ALBUM!`);
  } else {
    genAction("http://www.wikipedia.org/search-redirect.php?search=!ALBUM!");
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

const spotifySearch = () => {
  genAction("https://open.spotify.com/search/!TITLE!%20?ARTIST?");
}

const spotifySearchArtist = () => {
  genAction("https://open.spotify.com/search/!ARTIST!");
}

const spotifySearchAlbum = () => {
  genAction("https://open.spotify.com/search/!ALBUM!%20?ARTIST?");
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

const showHelp = () => {
  document.getElementById("help-block").style.display = "block";
  window.location = "#help-block";
};

const hideHelp = () => {
  document.getElementById("help-block").style.display = "none";
  window.location = "#top";
};

/**
 * Obtains parameters from the hash of the current URL.
 * Used for Spotify API's Implicit Grant flow.
 * @return Object
 */
const getHashParams = () => {
  let hashParams = {};
  let e, r = /([^&;=]+)=?([^&;]*)/g,
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
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const getRedirectURI = (loc) => {
  let uri = loc.origin + loc.pathname;
  return uri.replace(/\/$/, "");
}

const SPOTIFY_CLIENT_ID = "MmQ3MzQyZjg2MTdmNGVhNmFmMmM4ODRjYTcwZTJiNDA=";
const SPOTIFY_REDIRECT_URI = getRedirectURI(window.location);
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
        if (resp.status === 204) {
          localStorage.setItem(SPOTIFY_USED_KEY, true);
          return null;
        } else {
          return resp.json();
        }
      })
      .then((data) => {
        localStorage.setItem(SPOTIFY_USED_KEY, true);
        if (data) {
          populateFromSpotify(data.item);
        } else {
          spotifyCheckLastPlayedTrack(access_token);
        }
      });
  } else {
    if (localStorage.getItem(SPOTIFY_USED_KEY)) {
      // Spotify used previously, trying to obtain token
      localStorage.removeItem(SPOTIFY_USED_KEY); // remove to avoid infinite loop
      spotifyGetAccessToken();
    }
  }
}

const spotifyGetAccessToken = () => {
  // authorize user and get access token
  let scope = "user-read-currently-playing user-read-recently-played";
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
