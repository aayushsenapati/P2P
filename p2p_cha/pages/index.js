import { useState, useEffect } from 'react';
import io from 'socket.io-client';

//peer ids of selected clients


const socket = io('http://localhost:3001'); // Change URL to match your server


export default function Home() {
  const [clients, setClients] = useState(new Map());//active clients
  const [clientName, setClientName] = useState('');//your name
  const [selectedClients, setSelectedClients] = useState([]);//selected clients
  const [render, setRender] = useState(false);
  const [messageArray, setMessageArray] = useState([]);
  const [peerClient, setPeerClient] = useState("");
  const [peerConn, setPeerConn] = useState([]);



  useEffect(() => {
    console.log(messageArray);
  }, [messageArray]);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "turn:relay1.expressturn.com:3478", username: "efZU0G18FKVK6GOKSN", credential: "3NiZNfNHWglGkCcu" },
    ],
  };
  function getUrlParam(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
      return null;
    else
      return results[1];
  };
  // Listen for list of active clients
  useEffect(() => {
    import('peerjs').then(module => {
      const Peer = module.default;
      const peer = new Peer(undefined, {
        host: '/',
        port: '3002',
        path: '/peerjs',
        config: configuration,
        debug: 1
      });
      setPeerClient[peer]
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
      peer.on('connection', function (connec) {
        console.log("connec.peer:", connec.peer)
        connec.on("data", (data) => {
          // Will print 'hi!'
          console.log(data);
          let id = connec.peer
          setMessageArray(((messageArray) => [...messageArray, { 'id': id, 'data': data }]))
        });
        connec.on("error", (err) => {
          console.log(err.message);
        });
      });
      socket.on('clientPeerID', (clientPeerID) => {
        console.log('connected client peer id:', clientPeerID);
        const conn = peer.connect(clientPeerID, { reliable: true });
        setPeerConn((peerConn)=>[...peerConn, conn])
        console.log("peerConn in peer.connect:", peerConn)
        conn.on("open", () => {
          console.log("Connected to: " + conn.peer);
          var command = getUrlParam("command");
          if ("command:", command)
            conn.send(command);
          conn.send("hello");
        });
        conn.on("error", (err) => {
          console.log(err.message);
        });
      })
    });
    socket.on('clientList', ({ mapData }) => {
      setClients(new Map(mapData))
    });
    return () => {
      socket.off('clientList');
      socket.off('clientPeerID');
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

  const handleMessageSend = (e) => {
    if (e.key === 'Enter') {
      let message = e.target.value
      e.target.value = '';

      if (!message) return;
      console.log("typed message",message);
      console.log("peerConn:", peerConn)
      peerConn.forEach((conn) => {
        console.log("in handle message send", conn)
        conn.send(message);
      })
      let id = peerClient.id
      setMessageArray(((messageArray) => [...messageArray, { 'id': id, 'data': message }]))

    }
  }

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
    return (
      <>
        <h1>Client Lobby</h1>
        <div id='messageDisp' style={{ marginBottom: '30px' }}>
          {messageArray.map((mes, i) => {
            if (mes.id === peerClient.id)
              return <h2 key={i} style={{ justifyContent: 'left', color: 'blue' }}>{mes.data}</h2>
            else
              return <h2 key={i} style={{ justifyContent: 'right', color: 'green' }}>{mes.data}</h2>

          })}
        </div>
        <input style={{ border: 'black' }} placeholder='Enter Message' onKeyPress={handleMessageSend}></input>
      </>);
  }
}
