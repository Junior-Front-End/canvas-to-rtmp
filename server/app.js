const child_process = require('child_process');
const express = require('express');
const WebSocketServer = require('ws').Server;
const http = require('http');


// ------------------------------------------------------
// Definition
// ------------------------------------------------------

// Define server 
const app = express();
const server = http.createServer(app).listen(3000, () => {
  console.log('Listening on port 3000');
});

// Define websocket
const wss = new WebSocketServer({server});

// ------------------------------------------------------
// Middlewares
// ------------------------------------------------------

// 
app.use((req, res, next) => {
  console.log('HTTP Request: ' + req.method + ' ' + req.originalUrl);
  return next();
});

// load static codes
app.use(express.static(__dirname + '/static'));


// ------------------------------------------------------
// Function
// ------------------------------------------------------

// create FFmpeg Child Process
function createFFmpegChildProcess(rtmpUrl) { 
  
  // define variables
  var isInstagramLive = false;
  var arr = [];

  // is Instagram Live ? 
  if (rtmpUrl.includes("rtmps://live-upload.instagram.com:443/rtmp/")) {
    isInstagramLive = true
    console.log(`
    --------------------------------------------------------
    isInstagram live: ${isInstagramLive}
    --------------------------------------------------------
    `);
  }

  // Rotate Video or not ?
  if(isInstagramLive){

    // Rotate (Docs in README) 
    arr = [
      '-f', 'lavfi', '-i', 'anullsrc', 
      '-i', '-', 
      '-shortest',
      '-vcodec', 'libx264', 
      '-acodec', 'aac', 
      '-f', 'flv',
      '-vf' , 'transpose=2', 
      rtmpUrl
    ];

  } else {

    // Don't Rotate 
    arr = [
      '-f', 'lavfi', '-i', 'anullsrc', 
      '-i', '-', 
      '-shortest',
      '-vcodec', 'libx264', 
      '-acodec', 'aac', 
      '-f', 'flv', 
      rtmpUrl
    ];

  }


  // process the ffmpeg  
  const ffmpeg = child_process.spawn('ffmpeg', arr);

  return ffmpeg

}

// ------------------------------------------------------
// Main Process
// ------------------------------------------------------

// websocket events
wss.on('connection', (ws, req) => {
  
  // -------------------------------------
  // get rtmp from request
  // -------------------------------------

  // Ensure that the URL starts with '/rtmp/', and extract the target RTMP URL.
  let match;

  if ( !(match = req.url.match(/^\/rtmp\/(.*)$/)) ) {
    ws.terminate(); // No match, reject the connection.
    return;
  }
  
  const rtmpUrl = decodeURIComponent(match[1]);
  console.log('Target RTMP URL:', rtmpUrl);
   
  // FFmpeg define
  var ffmpeg = createFFmpegChildProcess(rtmpUrl)
  
  // -------------------------------------
  // FFmpeg and WebSocket events
  // -------------------------------------

  // If FFmpeg stops for any reason, close the WebSocket connection.
  ffmpeg.on('close', (code, signal) => {
    // Disconnected due to ffmpeg arr syntax
    console.log('FFmpeg child process closed, code ' + code + ', signal ' + signal);
    ws.terminate();
  });
  
  // Handle STDIN pipe errors by logging to the console.
  // These errors most commonly occur when FFmpeg closes and there is still
  // data to write.  If left unhandled, the server will crash.
  ffmpeg.stdin.on('error', (e) => {
    console.log('FFmpeg STDIN Error', e);
  });
  
  // FFmpeg outputs all of its messages to STDERR.  Let's log them to the console.
  ffmpeg.stderr.on('data', (data) => {
    console.log('FFmpeg STDERR:', data.toString());
  });


  // -------------------------------------
  // websocket events
  // -------------------------------------

  // When data comes in from the WebSocket, write it to FFmpeg's STDIN.
  ws.on('message', (msg) => {
    console.log('DATA', msg);
    ffmpeg.stdin.write(msg);
  });
  
  // If the client disconnects, stop FFmpeg.
  ws.on('close', (e) => {
    ffmpeg.kill('SIGINT');
    console.log(`
    --------------------------------------------------------------------------
    connection is closed! 
    -------------------------------------------------------------------------- 
    `);
  });

  
});
