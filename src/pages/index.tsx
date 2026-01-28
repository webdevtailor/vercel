/* VERSION: 3.0 
   UPDATES: Fixed for Vercel Serverless Function & Private Google Integration
   TARGET: GitHub src/pages/Index.tsx (Vercel Project)
*/

import React, { useEffect, useRef, useState } from 'react';

// NOTE: We keep CALENDAR_IDS for fetching/viewing, 
// but saving happens via the Vercel API we built.
const CALENDAR_IDS = [
  'twomy1@gmail.com',
  'm4arsogahrubaolgt28k86grtk@group.calendar.google.com', // Aşklarım
  's1trj95268fv97i43akhsvutrc@group.calendar.google.com', // İş
  '013rv4hra17mda0af8jp0hh4dk@group.calendar.google.com'  // Kişisel
];

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Aşklarım');
  const [tasks, setTasks] = useState<any[]>([]);
  const [calendarTasks, setCalendarTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [tempTask, setTempTask] = useState<any | null>(null);

  const [headerDate] = useState(
    new Date()
      .toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      .toUpperCase()
  );

  const categories = [
    { name: 'Aşklarım', color: '#ef4444' },
    { name: 'İş', color: '#3b82f6' },
    { name: 'Kişisel', color: '#10b981' },
  ];

  const dRef = useRef<HTMLDivElement>(null);
  const dnRef = useRef<HTMLDivElement>(null);
  const mRef = useRef<HTMLDivElement>(null);
  const yRef = useRef<HTMLDivElement>(null);
  const shRef = useRef<HTMLDivElement>(null);
  const smRef = useRef<HTMLDivElement>(null);
  const duRef = useRef<HTMLDivElement>(null);
  const ehRef = useRef<HTMLDivElement>(null);
  const emRef = useRef<HTMLDivElement>(null);

  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const years = Array.from({ length: 51 }, (_, i) => 2026 + i);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const durations = Array.from({ length: 120 }, (_, i) => i + 1);

  const isSyncing = useRef(false);
  const lastDayIdx = useRef(-1);

  // FETCHING: This is for viewing only
  const fetchCalendarEvents = async () => {
    // We will implement a secure fetch later. 
    // For now, let's focus on the "Save" button working with your new Vercel API.
    console.log("Fetch requested...");
  };

  useEffect(() => { fetchCalendarEvents(); }, []);

  const getPos = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    const START_H = 5, END_H = 24;
    return ((h * 60 + m - START_H * 60) / ((END_H - START_H) * 60)) * 100;
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return "";
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    let diff = (eH * 60 + eM) - (sH * 60 + sM);
    if (diff < 0) diff += 1440; 
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (h > 0 && m > 0) return `${h} sa ${m} dk`;
    if (h > 0) return `${h} saat`;
    return `${m} dakika`;
  };

  const updateDayName = () => {
    if (!dRef.current || !mRef.current || !yRef.current || !dnRef.current || isSyncing.current) return;
    const dayIndex = Math.round(dRef.current.scrollTop / 40);
    const d = (dayIndex % 31) + 1;
    const m = Math.round(mRef.current.scrollTop / 40) % 12;
    const y = years[Math.round(yRef.current.scrollTop / 40) % years.length];
    const dateObj = new Date(y, m, d);
    const dayOfWeek = dateObj.getDay();
    dnRef.current.scrollTop = (dayOfWeek + 7) * 40;
    [dRef, mRef, yRef, dnRef].forEach((ref) => handleScrollHighlight(ref.current));
  };

  useEffect(() => {
    if (isFormOpen) {
      const now = new Date();
      setTimeout(() => {
        if (dRef.current) dRef.current.scrollTop = (now.getDate() + 31 - 1) * 40;
        if (mRef.current) mRef.current.scrollTop = (now.getMonth() + 12) * 40;
        if (yRef.current) yRef.current.scrollTop = (now.getFullYear() - 2026 + 50) * 40;
        if (dnRef.current) dnRef.current.scrollTop = (now.getDay() + 7) * 40;
        if (shRef.current) shRef.current.scrollTop = (now.getHours() + 24) * 40;
        if (smRef.current) smRef.current.scrollTop = (now.getMinutes() + 60) * 40;
        if (duRef.current) duRef.current.scrollTop = (13 + 120) * 40;
        syncTime();
        updateDayName();
      }, 100);
    }
  }, [isFormOpen]);

  const handleScrollHighlight = (el: HTMLDivElement | null) => {
    if (!el) return;
    const index = Math.round(el.scrollTop / 40);
    const children = el.querySelectorAll('.wheel-item');
    children.forEach((child, i) => {
      if (i === index + 1) child.classList.add('active-item');
      else child.classList.remove('active-item');
    });
  };

  const syncTime = () => {
    if (!shRef.current || !smRef.current || !duRef.current || !ehRef.current || !emRef.current) return;
    const startH = Math.round(shRef.current.scrollTop / 40) % 24;
    const startM = Math.round(smRef.current.scrollTop / 40) % 60;
    const dur = (Math.round(duRef.current.scrollTop / 40) % 120) + 1;
    const totalMinutes = startH * 60 + startM + dur;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    ehRef.current.scrollTop = (endH + 24) * 40;
    emRef.current.scrollTop = (endM + 60) * 40;
    [shRef, smRef, duRef, ehRef, emRef].forEach((ref) => {
      if (ref.current) handleScrollHighlight(ref.current);
    });
  };

  // THE SAVIOR: Updated handleSave to use your Vercel API
  const handleSave = async () => {
    if (!taskText.trim() || !shRef.current || !smRef.current) return;

    const h = Math.round(shRef.current.scrollTop / 40) % 24;
    const m = Math.round(smRef.current.scrollTop / 40) % 60;
    const day = (Math.round(dRef.current?.scrollTop || 0) / 40 % 31) + 1;
    const month = (Math.round(mRef.current?.scrollTop || 0) / 40 % 12);
    const year = years[Math.round(yRef.current?.scrollTop || 0) / 40 % years.length];
    const dur = (Math.round(duRef.current?.scrollTop || 0) / 40 % 120) + 1;

    const startDate = new Date(year, month, day, h, m);
    const endDate = new Date(startDate.getTime() + dur * 60 * 1000);

    const payload = {
      eventName: taskText, // Matching Vercel API expectation
      start: startDate.toISOString(),
      end: endDate.toISOString()
    };

    try {
      const response = await fetch('/api/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Harika! Aşklarım takvimine eklendi.');
        setTaskText('');
        setIsFormOpen(false);
      } else {
        const errData = await response.json();
        alert('Hata: ' + errData.message);
      }
    } catch (err) {
      alert('Bağlantı hatası oluştu.');
    }
  };

  const renderWheel = (ref: React.RefObject<HTMLDivElement>, data: any[], pad = true, onScroll?: () => void) => (
    <div ref={ref} className="wheel-container no-scrollbar" onScroll={() => { handleScrollHighlight(ref.current); if (onScroll) onScroll(); }}>
      {[...data, ...data, ...data].map((val, i) => (
        <div key={i} className="wheel-item">{pad && typeof val === 'number' ? val.toString().padStart(2, '0') : val}</div>
      ))}
    </div>
  );

  return (
    <div className="app-container">
      {/* (CSS styles here - kept exactly from your Index.tsx) */}
      <style>{`.app-container { max-width: 400px; margin: 20px auto; padding: 20px; font-family: sans-serif; background: white; border-radius: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid #f0f0f0; min-height: 90vh; display: flex; flex-direction: column; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .header h1 { font-size: 22px; font-weight: 900; text-transform: uppercase; margin: 0; }
        .date-plus { display: flex; align-items: center; gap: 12px; }
        .plus-btn { font-size: 28px; cursor: pointer; border: none; background: #f1f5f9; width: 35px; height: 35px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .form-card { background: #1e293b; border-radius: 24px; padding: 20px; color: white; margin-bottom: 25px; }
        .wheel-box { background: #0f172a; border-radius: 16px; position: relative; overflow: hidden; margin-bottom: 12px; }
        .wheel-highlight { position: absolute; top: 50%; left: 0; right: 0; height: 40px; transform: translateY(-50%); background: rgba(59, 130, 246, 0.25); border-top: 1px solid rgba(59, 130, 246, 0.4); border-bottom: 1px solid rgba(59, 130, 246, 0.4); pointer-events: none; z-index: 5; }
        .wheel-container { height: 120px; overflow-y: auto; scroll-snap-type: y mandatory; position: relative; z-index: 10; flex: 1; }
        .wheel-item { height: 40px; display: flex; align-items: center; justify-content: center; scroll-snap-align: center; color: #475569; font-weight: bold; font-size: 11px; }
        .active-item { color: #ffffff !important; font-size: 13px !important; font-weight: 900 !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .grid-4 { display: grid; grid-template-columns: 0.8fr 1.2fr 1.5fr 1fr; gap: 5px; }
        .label { font-size: 9px; text-transform: uppercase; color: #94a3b8; display: block; margin-bottom: 6px; text-align: center; font-weight: 900; }
        .category-row { display: flex; gap: 8px; margin: 15px 0; }
        .cat-btn { flex: 1; padding: 10px 5px; font-size: 10px; font-weight: 800; border-radius: 12px; border: 2px solid #334155; background: #334155; color: #94a3b8; cursor: pointer; }
        .cat-btn.active { border-color: #3b82f6; background: #3b82f6; color: white; }
        textarea { width: 100%; box-sizing: border-box; background: #334155; border: none; border-radius: 14px; padding: 12px; color: white; margin-top: 5px; height: 70px; font-size: 13px; outline: none; }
        .save-btn { width: 100%; background: #2563eb; color: white; border: none; padding: 15px; border-radius: 14px; font-weight: 900; margin-top: 15px; cursor: pointer; text-transform: uppercase; font-size: 12px; }
      `}</style>

      <div className="header">
        <span style={{ fontSize: '20px' }}>🏠</span>
        <h1>To do list</h1>
        <div className="date-plus">
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>{headerDate}</span>
          <button className="plus-btn" onClick={() => setIsFormOpen(!isFormOpen)}>{isFormOpen ? '×' : '+'}</button>
        </div>
      </div>

      {isFormOpen && (
        <div className="form-card">
          <div className="wheel-box">
            <div className="wheel-highlight"></div>
            <div className="grid-4">
              {renderWheel(dRef, Array.from({ length: 31 }, (_, i) => i + 1), true, updateDayName)}
              {renderWheel(mRef, months, false, updateDayName)}
              {renderWheel(dnRef, dayNames, false)}
              {renderWheel(yRef, years, false, updateDayName)}
            </div>
          </div>
          <div className="grid-3">
            <div>
              <label className="label">Başlangıç</label>
              <div className="wheel-box" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="wheel-highlight"></div>
                {renderWheel(shRef, hours, true, syncTime)}
                <span className="time-separator">:</span>
                {renderWheel(smRef, minutes, true, syncTime)}
              </div>
            </div>
            <div>
              <label className="label">Süre (Dk)</label>
              <div className="wheel-box">
                <div className="wheel-highlight"></div>
                {renderWheel(duRef, durations, false, syncTime)}
              </div>
            </div>
            <div>
              <label className="label">Bitiş</label>
              <div className="wheel-box" style={{ display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <div className="wheel-highlight"></div>
                {renderWheel(ehRef, hours)}
                <span className="time-separator">:</span>
                {renderWheel(emRef, minutes)}
              </div>
            </div>
          </div>
          <textarea placeholder="Planınız nedir?" value={taskText} onChange={(e) => setTaskText(e.target.value)} />
          <button className="save-btn" onClick={handleSave}>Kaydet</button>
        </div>
      )}
      <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '12px'}}>Yeni tasarıma hoş geldin!</p>
    </div>
  );
};

export default Index;
