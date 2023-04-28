import { useRef, useEffect, useState } from 'react'

import VideoPlayer from './VideoPlayer.js'

export default function Call(props) {
    const userVideo = useRef();
    const connVideo = useRef();
    const [userStream, setUserStream] = useState(null);

    const [peerStreamArray, setPeerStreamArray] = useState([]);

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

    function peerStream(stream) {
        if(!peerStreamArray.includes(stream))
        setPeerStreamArray((peerStreamArray)=>[...peerStreamArray, stream]);
    }

    const startCall = async () => {

        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (stream) => {
            console.log("in get user media", stream);
            setUserStream(stream);
            userVideo.current.srcObject = stream;
            userVideo.current.play();
            props.peerConn.forEach(async (conn) => {
                console.log("this is halal",conn.peer)
                const call = await props.peerClient.call(conn.peer, stream, [conn.metadata]);
                console.log(call)
                call.on('stream', function (str) {
                    // `stream` is the MediaStream of the remote peer.
                    // Here you'd add it to an HTML video/canvas element.
                    console.log("in call on stream", str);
                    peerStream(str)
                    

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

    useEffect(() => {
        console.log("peer stream array", peerStreamArray)
    }, [peerStreamArray])


    return (<>
        <button onClick={() => { props.setCallFn(false); vidOff() }}>Cok</button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <video ref={userVideo} style={{ width: '100%', height: '56.25%', transform: 'rotateY(180deg)' }} muted></video>
            {peerStreamArray&&peerStreamArray.map((str, i) => {
                return <VideoPlayer key={i} stream={str}/>
            })}
        </div>
    </>)
}