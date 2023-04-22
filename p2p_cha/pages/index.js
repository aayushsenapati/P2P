import { useState, useEffect } from 'react';
import io from 'socket.io-client';



const socket = io('http://localhost:3001'); // Change URL to match your server

export default function Home() {
  const [clients, setClients] = useState(new Map());//active clients
  const [clientName, setClientName] = useState('');//your name
  const [selectedClients, setSelectedClients] = useState([]);//selected clients
  const [render, setRender] = useState(false);
  const [peerID, setPeerID] = useState('');
  const [peerIds, setPeerIds] = useState([]);//peer ids of selected clients
  const [peer, setPeer] = useState(null);




  // Listen for list of active clients
  useEffect(() => {
    import('peerjs').then(module => {
      const Peer = module.default;
      const peer = new Peer(undefined, {
        host: '/',
        port: '3002',
        path: '/peerjs',
        debug: 3
      });

      peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
        socket.on('renderRoom', (roomName) => {
          console.log(roomName)
          setRender(true);
          socket.emit('peerID', id, roomName);
        })
      });
      peer.on('error', function (err) {
        console.log(err.message);
      });

      peer.on('connection', function (conn) {
        console.log("in connection denjfbvejrkbgvihjwberghivbewhrbgvhewbrhivbehirbvhebfrvhbehfrbvhe3b",conn)
        
        conn.on('open', function () {
          console.log("in open aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
          conn.on('data', function (data) {
            console.log('Received', data);
          });

          // Send messages
          conn.send('Hello!');
        });
      });

      socket.on('clientPeerID', (clientPeerID) => {
        console.log('connected client peer id:', clientPeerID);
        peer.connect(clientPeerID);
      })


    });


    socket.on('clientList', ({ mapData }) => {
      setClients(new Map(mapData))
    });



    return () => {
      socket.off('clientList');

    };
  }, []);



  // Handle registration form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const temp = formData.get('clientName')
    setSelectedClients([...selectedClients, temp]);
    setClientName(temp);
    socket.emit('register', temp);

  };

  // Handle checkbox click event
  const handleCheckboxClick = (e) => {
    const checkName = e.target.value;
    if (e.target.checked) {
      setSelectedClients([...selectedClients, checkName]);
    } else {
      setSelectedClients(selectedClients.filter((name) => name !== clientName));
    }
  };

  // Handle create room button click event
  const handleCreateRoomClick = () => {
    // Send request to server to create new room and add selected clients to it
    if (selectedClients.length < 2) return;
    socket.emit('createRoom', { clientArray: selectedClients });
    setSelectedClients([]);
  };

  if (!render) {
    return (
      <div>
        <h1>Client Lobby</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="clientName">Enter your name:</label>
          <input type="text" id="clientName" name="clientName" required />
          <button type="submit">Register</button>
        </form>
        <h2>Active clients:</h2>
        <ul>
          {Array.from(clients.values())
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
      </div>
    );
  }
  else {
    return (<h1>Cok</h1>);
  }
}
