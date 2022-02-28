# canvas to rtmp
1400.12.09  

## test

* youtube: success
* twitch: success 

### (Push) creating OBS studio online 

1. article: https://www.smashingmagazine.com/2021/04/building-video-streaming-app-nuxtjs-node-express/
1. github: https://github.com/smashingmagazine/Nuxt-Node-video-streaming/

2. article: https://medium.com/swlh/video-streaming-using-opencv4nodejs-with-node-js-express-and-socket-io-3806abb049a
2. github: https://github.com/narenltk/opencv4nodejs_webcam

One way to send our edited video content is to create something like OBS studio 
that can get `fps: 30` and `server: rtmp://...` from ArvanCloud LiveStreaming service!

### (Pull) why creating a rtmp server?

second tutorial: https://github.com/waleedahmad/node-stream
3rd: https://mux.com/articles/how-to-build-your-own-live-streaming-app-with-mux-video/

* Setup your own RTMP Server to Receive and Redistribute Live Streaming Video
* set delay for live palying

```
var arvan_pull = {
    server: rtmp://localhost:8080/live
    stream_key: gold 
}
```

### (high quality) creating openvidu.io

instead of arvan (paid) rtmp server or twitch (free) server use the kurento media server from openvidu.io (paid) for higher quality.

