import React, { useState } from 'react';

function App() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(''); // New state for Date
  const [time, setTime] = useState(''); // New state for Time
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    if (!title || !date || !time) {
      setStatus('Lütfen tüm alanları doldurun (Title, Date, Time).');
      return;
    }

    setStatus('Saving...');
    try {
      // Combine date and time into a single timestamp
      const startDateTime = new Date(`${date}T${time}:00`);
      
      const response = await fetch('/api/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          date, // Sending the specific date
          time, // Sending the specific time
        }),
      });

      if (response.ok) {
        setStatus('Success! Event added to Aşklarım.');
        setTitle('');
        setDate('');
        setTime('');
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
      <div style={{ marginBottom: '10px' }}>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Event title" 
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <input 
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <input 
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button onClick={handleSave} style={{ padding: '10px 20px', cursor: 'pointer' }}>Kaydet</button>
      </div>
      <p><strong>Status:</strong> {status}</p>
    </div>
  );
}

export default App;
