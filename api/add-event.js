import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { title, date, time } = req.body;

  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar']
  );

  const calendar = google.calendar({ version: 'v3', auth });

  // 1. Create the start string with the Istanbul +03:00 offset included
  // Format: YYYY-MM-DDTHH:mm:ss+03:00
  const startString = `${date}T${time}:00+03:00`;

  // 2. Calculate the end time (1 hour later)
  const startDateObj = new Date(`${date}T${time}:00Z`); // Use Z just for calculation
  const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000);
  
  const endHours = String(endDateObj.getUTCHours()).padStart(2, '0');
  const endMinutes = String(endDateObj.getUTCMinutes()).padStart(2, '0');
  const endString = `${date}T${endHours}:${endMinutes}:00+03:00`;

  try {
    await calendar.events.insert({
      calendarId: 'webdevtailor@gmail.com',
      resource: {
        summary: title || 'Yeni Etkinlik',
        start: {
          dateTime: startString,
          timeZone: 'Europe/Istanbul',
        },
        end: {
          dateTime: endString,
          timeZone: 'Europe/Istanbul',
        },
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Google API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
