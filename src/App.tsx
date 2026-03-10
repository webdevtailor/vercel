import React, { useState } from 'react';

function App() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(''); 
  const [time, setTime] = useState(''); 
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    if (!title || !date || !time) {
      setStatus('Hata: Lütfen Başlık, Tarih ve Saat seçin!');
      return;
    }
    setStatus('Kaydediliyor...');
    try {
      const response = await fetch('/api/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, time }),
      });

      if (response.ok) {
        setStatus('Başarılı! Takvime eklendi.');
        setTitle(''); setDate(''); setTime('');
      } else {
        const err = await response.json();
        setStatus('Hata: ' + err.error);
      }
    } catch (e) {
      setStatus('Sunucuya bağlanılamadı.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h1>Kiya Calendar</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          placeholder="Etkinlik Başlığı" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ padding: '10px' }}
        />
        {/* HERE ARE YOUR DATE AND TIME BUTTONS */}
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          style={{ padding: '10px' }}
        />
