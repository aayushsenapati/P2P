import { useRef, useEffect } from 'react'



export default function Call(props) {

    var userStream;

    const vidOff = () => {
        //clearInterval(theDrawLoop);
        //ExtensionData.vidStatus = 'off';
        userVideo.current.pause();
        userVideo.current.src= '';
        // userStream.getTracks().map  (track => { track.stop();});
        // userStream.getTracks().map  (track => { track.stop();});
        userStream.getAudioTracks()[0].stop();
        userStream.getVideoTracks()[0].stop();
        console.log("Vid off");
    }

    const startCall = () => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (stream) => {
            console.log("in get user media", stream);
            userStream = stream;
            userVideo.current.srcObject = stream;
            userVideo.current.play();
        })
    }

    useEffect(() => {
        startCall();
    }, [])

    const userVideo = useRef();

    return (<>
        <button onClick={() => { props.setCallFn(false); vidOff() }}>Cok</button>
        <video ref={userVideo} style={{width:'100%',height:'56.25%'}}></video>
    </>)
}