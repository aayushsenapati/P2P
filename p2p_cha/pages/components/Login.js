import {ThemeProvider}  from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const colorArr = ['#1abc9c','#2ecc71','#3498db','#9b59b6','#e91e63','#f1c40f']


import { useState, useEffect } from 'react';

export default function Login(props) {

  const [clientName, setClientName] = useState('');//your name
  const [selectedClients, setSelectedClients] = useState([]);//selected clients

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const temp = formData.get('clientName')
    setSelectedClients([...selectedClients, temp]);
    console.log("in handleSubmit", temp);
    setClientName(temp);
    props.setClientFn(temp);
    props.socket.emit('register', temp);
  };

  const handleNameEnter = (e) => {
    if (e.target.key === 'Enter')
      handleSubmit();
  }

  // Handle checkbox click event
  const handleCheckboxClick = (e) => {
    const checkName = e.target.value;
    if (e.target.checked) {
      setSelectedClients([...selectedClients, checkName]);
    } else {
      setSelectedClients(selectedClients.filter((name) => name !== clientName));
      console.log("in handleCheckboxClick", clientName);
    }
  };

  const handleCreateRoomClick = () => {
    // Send request to server to create new room and add selected clients to it
    if (selectedClients.length < 2) return;
    props.socket.emit('createRoom', { clientArray: selectedClients });
    setSelectedClients([]);
  };
  
  
  
    return(
      <>
        <ThemeProvider theme={props.darkTheme}>
        <CssBaseline/>
        <Typography variant='h2' style={{margin:'30px', marginLeft:'10px'}}>Client Lobby</Typography>
        <form onSubmit={handleSubmit}>
          <div style={{display:'flex', alignItems:'center', marginLeft:'20px'}}>
            <Typography variant='h5' style={{marginRight:'10px',}}>Enter your name: </Typography>
            <TextField placeholder="Enter Name" variant="outlined" size='small' id="clientName" name="clientName" required onKeyPress={handleNameEnter}/>
            <Button type='submit' variant='outline'>Register</Button>
          </div>
          
        </form>
        <Typography>Active clients:</Typography>
        <ul>
          {Array.from(props.clients.values())
            .filter((client) => client !== clientName)
            .map((client, i) => (
              client && (<li key={i}>
                <input
                  type="checkbox"
                  value={client}
                  onChange={handleCheckboxClick}
                  defaultChecked={selectedClients.includes(client)}
                />
                {client}
              </li>)
            ))}
        </ul>
        <button onClick={handleCreateRoomClick} disabled={selectedClients.length === 0}>
          Create Room
        </button>
      </ThemeProvider>
      </>
    )
};