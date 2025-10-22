# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Song Search is a simple web application for finding additional information about songs, artists, and albums. The app provides integration with multiple music services and streaming APIs including Spotify, KEXP, BBC Radio 6, and FluxFM to automatically populate song details from currently playing tracks.

## Development Commands

- **Start development server**: `npm start` - Runs the Express server on port 8000
- **Install dependencies**: `npm install`

## Architecture

### Backend (Node.js/Express)
- **app.js**: Simple Express server that serves static files from the `/public` directory and handles Spotify OAuth redirect flow
- Runs on port 8000 and serves the web application

### Frontend (Vanilla JavaScript)
- **public/index.html**: Main HTML structure with form inputs for title, artist, album
- **public/scripts.js**: Core application logic containing:
  - Music service integrations (Spotify, KEXP, BBC Radio 6, FluxFM APIs)
  - Search functionality for multiple platforms (Google, YouTube, Wikipedia, Discogs, etc.)
  - Mobile/desktop detection and URL handling
  - OAuth flow handling for Spotify API
- **public/styles.css**: CSS styling with color theming
- **public/swipe.js**: Touch/swipe gesture handling for mobile devices

### Key Features
- **Spotify Integration**: OAuth2 implicit grant flow to fetch currently playing or recently played tracks
- **Radio Station APIs**: Integration with KEXP, BBC Radio 6, and FluxFM to get current track information
- **Multi-platform Search**: Generates search URLs for lyrics, videos, artist info across multiple services
- **Mobile-responsive**: Detects mobile/tablet devices and adjusts behavior accordingly
- **Query Parameter Support**: Accepts title, artist, album parameters via URL for direct linking

### API Integrations
- **Spotify Web API**: Currently playing and recently played tracks
- **KEXP API**: `https://api.kexp.org/v2/plays/`
- **BBC Radio API**: `https://rms.api.bbc.co.uk/v2/services/bbc_6music/segments/latest`
- **FluxFM API**: `https://fluxmusic.api.radiosphere.io/channels/{channelId}/current-track`

### URL Template System
The app uses a template system for generating search URLs with placeholders:
- `!FIELD!` - Required field (shows error if empty)
- `?FIELD?` - Optional field (removes placeholder if empty)
- Fields: title, artist, album

### Constants and Configuration
- Spotify client ID is base64 encoded in `scripts.js`
- Redirect URI is dynamically generated based on current location
- Local storage keys for OAuth state management