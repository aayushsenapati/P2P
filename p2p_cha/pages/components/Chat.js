import Message from './Message.js';
import { ThemeProvider, createTheme  } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import {useState} from 'react'
import Call from './Call.js'



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

            <Box sx={{ width: callOn ? ('30%') : ('70%'), height: '100%', backgroundColor: '#151515', margin: callOn ? ('10px') : ('auto') }}>
                <h1>Client Lobby</h1>
                <div id='messageDisp' style={{ marginBottom: '30px' }}>
                    {props.messageArray.map((mes, i) => {
                        let isFirstMes = 0;
                        if (i == 0 || props.messageArray[i].id !== props.messageArray[i - 1].id)
                            isFirstMes = 1;
                        else
                            isFirstMes = 0;

                        if (mes.id === props.peerClient.id)
                            return <Message name={'You'} message={mes.data} sender={1} isFirstMes={isFirstMes} />
                        else
                            return <Message name={mes.name} color={mes.color} message={mes.data} sender={0} isFirstMes={isFirstMes} />
                    })}
                </div>
                <input style={{ border: 'black' }} placeholder='Enter Message' onKeyPress={handleMessageSend}></input>
                <button onClick={()=>{setCallOn(true)}}>Call</button>
            </Box>
        </ThemeProvider>
        {callOn?(<Call setCallFn={setCallFn}/>):(<></>)}
        </>
        )
}