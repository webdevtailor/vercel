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

  // Create the date object
  const startDateTime = new Date(`${date}T${time}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

  try {
    await calendar.events.insert({
      calendarId: 'webdevtailor@gmail.com',
      resource: {
        summary: title || 'Yeni Etkinlik',
        start: {
          // REMOVED .toISOString() - This keeps your local time numbers!
          dateTime: `${date}T${time}:00`, 
          timeZone: 'Europe/Istanbul',
        },
        end: {
          // Manual calculation for the end time string
          dateTime: new Date(endDateTime.getTime() - (endDateTime.getTimezoneOffset() * 60000)).toISOString().split('.')[0].slice(0, -3),
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
