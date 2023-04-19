import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Change URL to match your server

export default function Home() {
  const [clients, setClients] = useState(new Map());
  const [clientName, setClientName] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);

  // Listen for list of active clients
  useEffect(() => {
    socket.on('clientList', ({ mapData }) => {
      setClients(new Map(mapData));
      console.log(Array.from(clients));
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
    setSelectedClients([...selectedClients,temp]);
    setClientName(temp);
    socket.emit('register', temp);

  };

  // Handle checkbox click event
  const handleCheckboxClick = (e) => {
    const checkName = e.target.value;
    if (e.target.checked) {
      setSelectedClients([...selectedClients,checkName]);
    } else {
      setSelectedClients(selectedClients.filter((name) => name !== clientName));
    }
  };

  // Handle create room button click event
  const handleCreateRoomClick = () => {
    // Send request to server to create new room and add selected clients to it
    if(selectedClients.length < 2) return;
    socket.emit('createRoom', { clientArray: selectedClients });
    setSelectedClients([]);
  };

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
            client&&(<li key={i}>
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
