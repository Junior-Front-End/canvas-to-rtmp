
document.addEventListener('DOMContentLoaded', () => {


    // -----------------------------------------------------------------------------
    // config rtmp server
    // -----------------------------------------------------------------------------

    var rtmp_selector = document.querySelector("#rtmp_selector"); 

    //
    rtmp_selector.addEventListener("submit", (e) => {
        
        e.preventDefault();

        //
        var rtmp_server = e.target[0].value
        var stream_key = e.target[1].value
        var rtmp = `${rtmp_server}/${stream_key}`; 
        console.log(rtmp_server);
        console.log(stream_key);

        //
        goLive(rtmp)

    });

    // -----------------------------------------------------------------------------
    // go live
    // -----------------------------------------------------------------------------
    function goLive(rtmp) {
            
        //
        let mediaRecorder;
        let mediaStream;

        
        // http: => ws:, https: -> wss:
        var protocol = window.location.protocol.replace('http', 'ws');
        var host = window.location.host;
        var rtmp_encoded = encodeURIComponent(rtmp);

        //
        const ws = new WebSocket(`${protocol}//${host}/rtmp/${rtmp_encoded}`);

        // 1st ws event
        ws.addEventListener('open', (e) => {

            console.log('WebSocket Started!');
            mediaStream = document.querySelector('canvas').captureStream(30); // 30 FPS

            mediaRecorder = new MediaRecorder(mediaStream);

            mediaRecorder.addEventListener('dataavailable', (e) => {
                ws.send(e.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                ws.close()
            });

            mediaRecorder.start(1000); // Start recording, and dump data every second

            
            // stop recorder
            var rtmp_selector = document.querySelector(".rtmp_selector");
            var stop_live = document.querySelector("#stoplive");
            var stopliveDiv = document.querySelector(".stoplive");

            stopliveDiv.style.display = "block"
            rtmp_selector.style.display = "none"

            stop_live.addEventListener("click", () => { 

                // stop connection 
                mediaRecorder.stop() 

                // appearance
                stopliveDiv.style.display = "none"
                rtmp_selector.style.display = "block"

            })

        });

        // 2nd ws event
        ws.addEventListener('close', (e) => {

            //
            console.log('WebSocket Closed!');
            mediaRecorder.stop();

            // 
            var rtmp_selector = document.querySelector(".rtmp_selector");
            var stopliveDiv = document.querySelector(".stoplive");

            // appearance
            stopliveDiv.style.display = "none"
            rtmp_selector.style.display = "block"

        }); 

        
    }


});
  