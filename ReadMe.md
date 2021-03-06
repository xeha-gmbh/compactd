# Compactd 

[![npm version](https://badge.fury.io/js/compactd.svg)](https://badge.fury.io/js/compactd) [![](https://tokei.rs/b1/github/compactd/compactd)](https://github.com/compactd/compactd).

(pronounce compact-D)

Compactd aims to be a self-hosted remote music player in your browser,
streaming from you own personal server. It will also allows to download new
music onto your server just like headphones does.

![Main view](https://raw.githubusercontent.com/compactd/compactd/master/art/main_view.png)
![Waveform](https://raw.githubusercontent.com/compactd/compactd/master/art/waveform.png)

## Features

 - Scan any download folder (no neeed for a specific format like Plex)
 - Finder-like columns for browsing library
 - Fuzzy finder for searching library
 - Library reorganization (moving an album to a different artist)
 - Hidding and removing track (only from the database) from library
 - Streaming music 
 - Music transcoding on-the-fly
 - Hotkey controls (J, K, L, Ctrl+P)
 - Artist and album downloading
 - Gazelle-based trackers support
 - Deluge torrent client supported
 - Waveform vizualisation 

## Future development

 - SoundScrape support: download from SoundCloud or Bandcamp
 - Youtube support : download music from youtube
 - Standalone desktop app: with or without server local playback / downloading
 - Folder view: browse by folders instead of artists / albums

## Stack

Redux, React, PouchDB, Webpack, Typescript, Socket.io...

## Prequisites

 - Node v8 and npm v5. I recommend using https://github.com/creationix/nvm
 - CouchDB v2. You can install it following [this guide](https://github.com/apache/couchdb/blob/master/INSTALL.Unix.md) for linux . Windows is quite straightforward, on Debian, you will need to build it from source following the tutorial. Just make sure you don't configure anything or any password.
 - Latest Ffmpeg. Installation varies from OS, you might wanna follow [this guide](https://github.com/adaptlearning/adapt_authoring/wiki/Installing-FFmpeg)
 - deluge with deluge-web are optionnal (for downloading new content)
 - [audiowaveform](https://github.com/bbc/audiowaveform) is optionnal, only  if you  want to use the waveform feature. Ubuntu, Arch, and Mac OS are straightforward, debian requires building from source; Windows doesn't work.
 - opencv2 is optional, it allows the artwork processing tool to recognize face and crops images if they are not squared
 
## Installation

```
$ npm install --global compactd
$ compactd --configure
```
Follow the steps. Once it is down everything is configured!

## Nginx configuration

You need at least to locations, one for the http part and one for the socket server which allows realtime data update. Example:

```nginx
server {

    listen 443 ssl;                                                             
    server_name compactd.io;

    include snippets/ssl-compactd.io.conf;
    include snippets/ssl-params.conf;

    access_log            /var/log/nginx/access.log;

    location /engine.io/ {
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_http_version 1.1;
      proxy_set_header        Host $host;
      proxy_set_header        X-Real-IP $remote_addr;
      proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header        X-Forwarded-Proto $scheme;

      proxy_pass          http://127.0.0.1:9001;
    }

    location / {
      proxy_set_header        Host $host;
      proxy_set_header        X-Real-IP $remote_addr;
      proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header        X-Forwarded-Proto $scheme;

      # Fix the âIt appears that your reverse proxy set up is broken" error.
      proxy_pass          http://127.0.0.1:9000;
      proxy_read_timeout  90;

      proxy_redirect      http://127.0.0.1:9000 https://compactd.io;
    }
  }
```

 
## Starting
 
 Just run
 
 ```
 $ compactd --serve
 ```
 
 This will spawn a pm2 process in the background if it's not already running for process management.
 
 ## Stopping, restarting
 
 ```
 $ pm2 restart compactd
 $ pm2 stop compactd
 ```
 
