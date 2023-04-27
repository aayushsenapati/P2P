import { useRef, useEffect } from 'react'



export default function Call(props) {
    const userVideo = useRef();
    const connVideo = useRef();

    var userStream;

    const vidOff = () => {
        //clearInterval(theDrawLoop);
        //ExtensionData.vidStatus = 'off';
        userVideo.current.pause();
        userVideo.current.src = '';
        // userStream.getTracks().map  (track => { track.stop();});
        // userStream.getTracks().map  (track => { track.stop();});
        if (userStream) {
            userStream.getAudioTracks()[0].stop();
            userStream.getVideoTracks()[0].stop();
            console.log("Vid off");
        }
    }

    const startCall = async () => {

        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        navigator.getUserMedia({ video: true, audio: true }, async (stream) => {
            console.log("in get user media", stream);
            userStream = stream;
            userVideo.current.srcObject = stream;
            userVideo.current.play();
            props.peerConn.forEach(async (conn) => {
                const call = await props.peerClient.call(conn.peer, stream, [conn.metadata]);
                console.log(call)
                call.on('stream', function (str) {
                    // `stream` is the MediaStream of the remote peer.
                    // Here you'd add it to an HTML video/canvas element.
                    const t = connVideo.current
                    t.srcObject = str;
                    connVideo.current.play();
                    console.log("in call on stream");
                });
            })

        },
            err => { console.log(err) })
        props.peerClient.on('call', function (call) {
            getUserMedia({ video: true, audio: true }, function (stream) {
                console.log("answering call now");
                // Answer the call, providing our mediaStream
                call.answer(stream)
            })
        
    })

}


    useEffect(() => {
                startCall();
            }, [])



    return (<>
            <button onClick={() => { props.setCallFn(false); vidOff() }}>Cok</button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <video ref={userVideo} style={{ width: '100%', height: '56.25%', transform: 'rotateY(180deg)' }} muted></video>
                <video ref={connVideo} style={{ width: '100%', height: '56.25%', transform: 'rotateY(180deg)' }}        ></video>
            </div>
        </>)
    }