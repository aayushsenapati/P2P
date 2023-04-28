import {useRef, useState, useEffect} from 'react';



export default function VideoPlayer(props){

    const videoRef = useRef();

    useEffect(()=>{
        if(videoRef.current) videoRef.current.srcObject = props.stream;
        console.log("VIDEO AAAAAAAAAAAA");
    }, [props.stream]);
    return <video ref = {videoRef} autoPlay muted style = {{width : '100px', height : '100px'}}></video>

}