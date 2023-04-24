import ThemeProvider  from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export default function Register(props) {
    return(
        <ThemeProvider theme={props.darkTheme}>
        <CssBaseline/>
        <h1>Client Lobby</h1>
        <form onSubmit={props.handleSubmit}>
          <Typography variant='h5' htmlFor="clientName">Enter your name:  
            <TextField label="Name" variant="outlined" id="clientName" name="clientName" required onKeyPress={props.handleNameEnter}/>
          <Button type='submit'>Register</Button>
          </Typography>
          
        </form>
        <h2>Active clients:</h2>
        <ul>
          {Array.from(props.clients.values())
            .filter((client) => client !== clientName)
            .map((client, i) => (
              client && (<li key={i}>
                <input
                  type="checkbox"
                  value={client}
                  onChange={props.handleCheckboxClick}
                  defaultChecked={props.selectedClients.includes(client)}
                />
                {client}
              </li>)
            ))}
        </ul>
        <button onClick={props.handleCreateRoomClick} disabled={props.selectedClients.length === 0}>
          Create Room
        </button>
      </ThemeProvider>
    )
}