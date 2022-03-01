# canvas to rtmp
1400.12.09  

[related article](https://juniorfrontend.ir/%d8%aa%da%af-%da%a9%d8%a7%d9%86%d9%88%d8%a7%d8%b3-%d8%b3%d8%b1%d9%88%d8%b1-rtmp/)


## run

simply by `npm start`

## process

0. insert stream key from youtube or twitch
1. canvas capture stream
2. websocket
3. ffmpeg h.264 codec
4. go live on youtube or twitch

## ffmpeg options array

```
[
    // Facebook requires an audio track, so we create a silent one here.
    // Remove this line, as well as `-shortest`, if you send audio from the browser.
    '-f', 'lavfi', '-i', 'anullsrc',
    
    // FFmpeg will read input video from STDIN
    '-i', '-',
    
    // Because we're using a generated audio source which never ends,
    // specify that we'll stop at end of other input.  Remove this line if you
    // send audio from the browser.
    '-shortest',
    
    // If we're encoding H.264 in-browser, we can set the video codec to 'copy'
    // so that we don't waste any CPU and quality with unnecessary transcoding.
    // If the browser doesn't support H.264, set the video codec to 'libx264'
    // or similar to transcode it to H.264 here on the server.
    '-vcodec', 'libx264',
    
    // AAC audio is required for Facebook Live.  No browser currently supports
    // encoding AAC, so we must transcode the audio to AAC here on the server.
    '-acodec', 'aac',
    
    // FLV is the container format used in conjunction with RTMP
    '-f', 'flv',
    '-vf' , 'transpose=2',
    
    // The output RTMP URL.
    // For debugging, you could set this to a filename like 'test.flv', and play
    // the resulting file with VLC.
    rtmpUrl 
  ]
```