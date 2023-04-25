import { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Login from './components/Login.js';
import Chat from './components/Chat.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//peer ids of selected clients


const socket = io('http://localhost:3001'); // Change URL to match your server
const colorArr = ['#1abc9c','#2ecc71','#3498db','#9b59b6','#e91e63','#f1c40f']


export default function Home() {
  const [clients, setClients] = useState(new Map());//active clients
  const [clientName, setClientName] = useState('');//your name upon registration
  const [render, setRender] = useState(false);
  const [messageArray, setMessageArray] = useState([]);//array of messages from users
  const [peerClient, setPeerClient] = useState("");//current peer object
  const [peerConn, setPeerConn] = useState([]);//array of connections


  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "turn:relay1.expressturn.com:3478", username: "efZU0G18FKVK6GOKSN", credential: "3NiZNfNHWglGkCcu" },
    ],
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const setClientFn = (clientName) => {
    setClientName(clientName);
  }

  const setMsgFn = (message) => {
    setMessageArray(((messageArray) => [...messageArray, message]));
  }



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
      if (!clientName)
        return;
      const Peer = module.default;
      const peer = new Peer(undefined, {
        host: '/',
        port: '3002',
        path: '/peerjs',
        config: configuration,
        debug: 1
      });
      setPeerClient(peer)
      peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
        socket.on('renderRoom', (roomName) => {
          console.log(roomName)
          socket.emit('peerID', id, roomName);
        })
      });
      peer.on('error', function (err) {
        console.log(err.message);
      });
      peer.on('connection', function (connec) {
        console.log("connected peer id:", connec.peer, connec.label)
        //random color
        const randomInd = Math.floor(Math.random() * colorArr.length)
        const randomColor = colorArr[randomInd];
        colorArr.splice(randomInd, 1);
        setRender(true);
        connec.on("data", (data) => {
          // Will print 'hi!'
          console.log(data);
          let id = connec.peer
          if (!data.includes(":connected")) {
            setMessageArray(((messageArray) => [...messageArray, { 'id': id, 'data': data, 'name': connec.label, 'color': randomColor }]))
          }
        });
        connec.on("error", (err) => {
          console.log(err.message);
        });
      });
      socket.on('clientPeerID', (clientPeerID) => {
        //console.log('connected client peer id:', clientPeerID);
        const conn = peer.connect(clientPeerID, { reliable: true, label: clientName });
        console.log('peer.connect name', clientName);
        console.log('in peer.connect', conn);
        setPeerConn((peerConn) => [...peerConn, conn])
        //console.log("peerConn in peer.connect:", peerConn) wont do anything,
        conn.on("open", () => {
          //console.log("Connected to: " + conn.peer);
          var command = getUrlParam("command");
          if (command)
            conn.send("command:", command);
          conn.send(`${peer.id}:connected`);
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
  }, [clientName]);






  // Handle create room button click event


  if (!render) {
    return (
      <Login
        darkTheme={darkTheme}
        clients={clients}
        clientName={clientName}
        socket={socket}
        setClientFn={setClientFn}

      />
    );
  }
  else {
    return (<Chat
      darkTheme={darkTheme}
      messageArray={messageArray}
      setMsgFn={setMsgFn}
      peerConn={peerConn}
      peerClient={peerClient}

    />)
  }
}
