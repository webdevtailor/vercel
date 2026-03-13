import React, { useEffect, useRef, useState } from 'react';

const API_KEY = 'AIzaSyAUS4-W6y5fGecr4dwL_k1jEZ_X6hjsTFA';

const App = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Ben');
  const [calendarTasks, setCalendarTasks] = useState<any[]>([]);

  const calendarMap: any = {
    'Ben': 'webdevtailor@gmail.com',
    'İşim': 'f4e89acaf3fe49c3eded76e97a41794d4046c4eb5d05390012fdced6fc7de77b@group.calendar.google.com',
    'Kişisel Gelişimim': '1ab4ca4860a2cce0e42525fb6b90f9f150a848706ca7f235ee21a4e05645645c@group.calendar.google.com',
    'Etkinliklerim': 'eee8507f922f61f8b9fd1bb92b93669d2f7137c1194c3e39202b3769c2209271@group.calendar.google.com',
    'Sağlığım': '70085d6768fba04f3eab51577dc2a2687105b76b1d4a6ecfde3160231d2c3366@group.calendar.google.com'
  };

  const categories = [
    { name: 'Ben', color: '#ef4444' },
    { name: 'İşim', color: '#3b82f6' },
    { name: 'Kişisel Gelişimim', color: '#10b981' },
    { name: 'Etkinliklerim', color: '#f59e0b' },
    { name: 'Sağlığım', color: '#8b5cf6' },
  ];

  const shRef = useRef<HTMLDivElement>(null);
  const smRef = useRef<HTMLDivElement>(null);
  const duRef = useRef<HTMLDivElement>(null);

  const fetchCalendarEvents = async () => {
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    let fetched: any[] = [];

    for (const [name, id] of Object.entries(calendarMap)) {
      try {
        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(id as string)}/events?key=${API_KEY}&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&singleEvents=true&orderBy=startTime`);
        const data = await res.json();
        if (data.items) {
          data.items.forEach((e: any) => {
            const s = new Date(e.start.dateTime || e.start.date);
            fetched.push({
              id: e.id,
              startTime: s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
              title: e.summary || 'İsimsiz',
              calName: name,
            });
          });
        }
      } catch (err) { console.error(err); }
    }
    setCalendarTasks(fetched.sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  useEffect(() => { fetchCalendarEvents(); }, []);

  const handleSave = async () => {
    if (!taskText.trim() || !shRef.current || !smRef.current || !duRef.current) return;
    const h = (Math.round(shRef.current.scrollTop / 40) + 1) % 24;
    const m = (Math.round(smRef.current.scrollTop / 40) + 1) % 60;
    const dur = (Math.round(duRef.current.scrollTop / 40) % 120) + 2;
    
    const startDate = new Date(); startDate.setHours(h, m, 0);
    const endDate = new Date(startDate.getTime() + dur * 60000);

    const res = await fetch('/api/add-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskText, start: startDate.toISOString(), end: endDate.toISOString(), calendarId: calendarMap[selectedCategory] }),
    });

    if (res.ok) { fetchCalendarEvents(); setTaskText(''); setIsFormOpen(false); }
  };

  const renderWheel = (ref: React.RefObject<HTMLDivElement>, data: any[]) => (
    <div ref={ref} className="wheel-container no-scrollbar">
      {[...data, ...data, ...data].map((val, i) => (
        <div key={i} className="wheel-item">{typeof val === 'number' ? val.toString().padStart(2, '0') : val}</div>
      ))}
    </div>
  );

  return (
    <div className="app-container">
      <style>{`
        .app-container { max-width: 400px; margin: 20px auto; padding: 20px; font-family: sans-serif; background: white; border-radius: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid #f0f0f0; min-height: 90vh; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .plus-btn { font-size: 28px; cursor: pointer; border: none; background: #f1f5f9; width: 35px; height: 35px; border-radius: 10px; }
        .form-card { background: #1e293b; border-radius: 20px; padding: 15px; color: white; margin-bottom: 20px; }
        .wheel-box { background: #0f172a; border-radius: 12px; height: 120px; display: flex; position: relative; overflow: hidden; }
        .wheel-highlight { position: absolute; top: 40px; left: 0; right: 0; height: 40px; background: rgba(59, 130, 246, 0.2); border-top: 1px solid #3b82f6; border-bottom: 1px solid #3b82f6; pointer-events: none; }
        .wheel-container { flex: 1; overflow-y: auto; scroll-snap-type: y mandatory; }
        .wheel-item { height: 40px; display: flex; align-items: center; justify-content: center; scroll-snap-align: center; color: #475569; font-size: 12px; font-weight: bold; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .cat-btn { padding: 6px 10px; font-size: 9px; font-weight: 800; border-radius: 8px; border: none; background: #334155; color: #94a3b8; cursor: pointer; margin: 2px; }
        .cat-btn.active { color: white; }
        textarea { width: 100%; background: #334155; border: none; border-radius: 10px; padding: 10px; color: white; height: 50px; margin-top: 10px; resize: none; }
        .save-btn { width: 100%; background: #2563eb; color: white; border: none; padding: 10px; border-radius: 10px; font-weight: bold; margin-top: 10px; cursor: pointer; }
        .task-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
        .task-title { font-weight: 700; font-size: 13px; color: #0f172a; }
        .task-tag { font-size: 8px; font-weight: 800; padding: 2px 5px; border-radius: 4px; text-transform: uppercase; }
      `}</style>

      <div className="header">
        <h1 style={{fontSize: '20px', fontWeight: '900'}}>To do list</h1>
        <button className="plus-btn" onClick={() => setIsFormOpen(!isFormOpen)}>{isFormOpen ? '×' : '+'}</button>
      </div>

      {isFormOpen && (
        <div className="form-card">
          <div className="wheel-box">
            <div className="wheel-highlight"></div>
            {renderWheel(shRef, Array.from({length: 24}, (_, i) => i))}
            <div style={{lineHeight: '120px'}}>:</div>
            {renderWheel(smRef, Array.from({length: 60}, (_, i) => i))}
            <div style={{width: '20px'}}></div>
            {renderWheel(duRef, Array.from({length: 120}, (_, i) => i + 1))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
            {categories.map(cat => (
              <button key={cat.name} className={`cat-btn ${selectedCategory === cat.name ? 'active' : ''}`} style={selectedCategory === cat.name ? {backgroundColor: cat.color} : {}} onClick={() => setSelectedCategory(cat.name)}>{cat.name}</button>
            ))}
          </div>
          <textarea placeholder="Yeni görev..." value={taskText} onChange={e => setTaskText(e.target.value)} />
          <button className="save-btn" onClick={handleSave}>KAYDET</button>
        </div>
      )}

      <div className="list">
        {calendarTasks.map(t => (
          <div key={t.id} className="task-item">
            <div>
              <div className="task-title">{t.title}</div>
              <span className="task-tag" style={{ background: categories.find(c => c.name === t.calName)?.color + '15', color: categories.find(c => c.name === t.calName)?.color }}>{t.calName}</span>
            </div>
            <div style={{ fontSize: '10px', fontWeight: '900', color: '#64748b' }}>{t.startTime}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
