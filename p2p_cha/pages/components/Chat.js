import Message from './Message.js';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useEffect, useRef } from 'react';

export default function Chat(props) {

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
        <ThemeProvider theme={props.darkTheme} sx={{ width: '100vw' }} >
            <CssBaseline />

            <div style={{width: '70%', height: '100vh', backgroundColor: '#151515', margin: 'auto', overflowY: 'scroll', padding: '0px 0px 0px 0px' }}>
                <h1>Client Lobby</h1>
                <div id='messageDisp' style={{ marginBottom: '100px' ,padding:'0px 20px 0px 20px'}}>
                    {props.messageArray.map((mes, i) => {
                        let isFirstMes = 0;
                        if (i == 0 || props.messageArray[i].id !== props.messageArray[i - 1].id)
                            isFirstMes = 1;
                        else
                            isFirstMes = 0;

                        if (mes.id === props.peerClient.id)
                            // return <Typography sx={{wordWrap:'break-word', width:'30%'}}>hisuhefsdhfjdsfhjdsfhjdshfdsjkfhjdsfhsdjkfhjdsfksdfjsdfjkdshfjksdhfjdskfhjdsfhjdskfhsdjfhsdjkfhdsjkfhdsjkfhsdjkfhsdjkfhsdkfjhdsfjksdhfsdhfjkhjfkdsfdsjfkdsjfhdskfds</Typography>
                            return <Message name={'You'} message={mes.data} sender={1} isFirstMes={isFirstMes} />
                        else
                            return <Message name={mes.name} color={mes.color} message={mes.data} sender={0} isFirstMes={isFirstMes} />
                    })}
                </div>
                <div style={{ position:'fixed', bottom:'0px', height:'10%',borderTop:'1px solid white',backgroundColor:'#101010', width: '70%', display:'flex', alignItems:'center', margin:'0px', padding:'10px 0px 10px 0px'}}>
                    <TextField fullHeight sx={{'& .MuiInputBase-root':{height:'100%'},height:'100%',width:'90%',marginRight:'10px'}} placeholder='Enter Message' onKeyPress={handleMessageSend}></TextField>
                    <Button sx={{height:'100%',width:'10%'}}size='large' variant='outlined'>Call</Button>
                </div>
            </div>
        </ThemeProvider>)
}