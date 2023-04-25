import Message from './Message.js';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';



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

            <Box sx={{ width: '70%', height: '100%', backgroundColor: '#151515', margin: 'auto' }}>
                <h1>Client Lobby</h1>
                <div id='messageDisp' style={{ marginBottom: '30px' }}>
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
                <input style={{ border: 'black' }} placeholder='Enter Message' onKeyPress={handleMessageSend}></input>
            </Box>
        </ThemeProvider>)
}