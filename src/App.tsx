import React, { useState } from 'react';

function App() {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    setStatus('Saving...');
    try {
      const response = await fetch('/api/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          start: new Date().toISOString(),
          end: new Date(Date.now() + 3600000).toISOString(),
        }),
      });

      if (response.ok) {
        setStatus('Success! Event added to Aşklarım.');
        setTitle('');
      } else {
        const err = await response.json();
        setStatus('Error: ' + err.error);
      }
    } catch (e) {
      setStatus('Failed to connect to server.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Kiya Calendar</h1>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Event title" 
        style={{ padding: '10px', marginRight: '10px' }}
      />
      <button onClick={handleSave} style={{ padding: '10px 20px' }}>Kaydet</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
