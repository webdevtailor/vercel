import React, { useState, ChangeEvent } from 'react';

export default function App() {
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>(''); 
  const [time, setTime] = useState<string>(''); 
  const [status, setStatus] = useState<string>('');

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
        setStatus('Hata: ' + (err.error || 'Bilinmeyen hata'));
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <input 
          type="date" 
          value={date} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <input 
          type="time" 
          value={time} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTime(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <button 
          onClick={handleSave} 
          style={{ padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          KAYDET
        </button>
      </div>
      <p><strong>Durum:</strong> {status}</p>
    </div>
  );
}
