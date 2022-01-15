/**
 * Simple server just for getting the Spotify redirect URI going.
 * 
 * Copied from https://github.com/spotify/web-api-auth-examples
 * 
 * This is an example of a basic node.js script that performs
 * the Implicit Grant oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
 */

var express = require('express'); // Express web server framework
var app = express();
app.use(express.static(__dirname + '/public'));
console.log('Listening on 8000');
app.listen(8000);
