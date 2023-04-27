import Message from './Message.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Call from './Call.js'
import TextField from '@mui/material/TextField';
import { useEffect, useState, useRef } from 'react';

function EndMsg(){
    const elementRef = useRef(null);
    useEffect(() => elementRef.current.scrollIntoView({ behaviour: 'smooth' }));
    return <div ref={elementRef} />;
};




export default function Chat(props) {
    const [callOn, setCallOn] = useState(false);


    const setCallFn = (callOn) => {
        setCallOn(callOn);
    }

    const handleMessageSend = (e) => {
        if (e.key === 'Enter') {
            let message = e.target.value
            e.target.value = '';

            if (!message) return;
            console.log("typed message", message);
            console.log("peerConn:", props.peerConn)
            props.peerConn.forEach((conn) => {
                //console.log("in handle message send", conn)
                conn.send(message);
            })
            let id = props.peerClient.id
            props.setMsgFn({ 'id': id, 'data': message })

        }
    }

    return (
        <>
            <ThemeProvider theme={props.darkTheme}>
                <CssBaseline />
                <div style={{display:'flex', height:'100%'}}>

                    <Box sx={{ height: '100%', width: callOn ? ('30%') : ('70%'), margin: callOn ? ('0px') : ('auto') }}>
                        {/* <h1>Client Lobby</h1> */}
                        <div id='chatInfo' style={{ height: '10%', border:'1px solid white' }}>
                        Chat
                        </div>
                        <div id='messageDisp' style={{ height: '80%', overflowY: 'scroll', padding: '0px 15px 0px 15px' }}>
                            {props.messageArray.map((mes, i) => {
                                let isFirstMes = 0;
                                if (i == 0 || props.messageArray[i].id !== props.messageArray[i - 1].id)
                                    isFirstMes = 1;
                                else
                                    isFirstMes = 0;

                                if (mes.id === props.peerClient.id)
                                    // return <Typography sx={{wordWrap:'break-word', width:'30%'}}>hisuhefsdhfjdsfhjdsfhjdshfdsjkfhjdsfhsdjkfhjdsfksdfjsdfjkdshfjksdhfjdskfhjdsfhjdskfhsdjfhsdjkfhdsjkfhdsjkfhsdjkfhsdjkfhsdkfjhdsfjksdhfsdhfjkhjfkdsfdsjfkdsjfhdskfds</Typography>
                                    return <Message key={i} name={'You'} message={mes.data} sender={1} isFirstMes={isFirstMes} />
                                else
                                    return <Message key={i} name={mes.name} color={mes.color} message={mes.data} sender={0} isFirstMes={isFirstMes} />
                            })}
                            <EndMsg />
                        </div>


                        <div id='msgBar' style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <TextField sx={{ width: '80%', paddingRight: '10px' }} placeholder='Enter Message' onKeyPress={handleMessageSend}></TextField>
                            <Button  onClick={()=>{setCallFn(true)}} sx={{}} variant='outlined'>Call</Button>
                        </div>
                    </Box>
                    {callOn ? (<Call setCallFn={setCallFn} peerConn={props.peerConn} peerClient={props.peerClient}/>) : (<></>)}
                </div>
            </ThemeProvider>
        </>
    )
}