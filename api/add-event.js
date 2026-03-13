const { google } = require('googleapis');

// Repair the private key formatting from Vercel
const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
  : undefined;

const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: privateKey,
  project_id: process.env.GOOGLE_PROJECT_ID, // Added this parameter
};

const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/calendar'],
  null,
  credentials.project_id // Added this parameter
);

const calendar = google.calendar({ version: 'v3', auth });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  // Use the CALENDAR_ID from Vercel environment variables
  const { title, start, end, calendarId } = req.body;
  const targetCalendarId = calendarId || process.env.CALENDAR_ID;

  try {
    const response = await calendar.events.insert({
      calendarId: targetCalendarId,
      resource: {
        summary: title,
        start: { dateTime: start, timeZone: process.env.VITE_APP_TZ || 'Europe/Istanbul' }, // Use TZ from Vercel
        end: { dateTime: end, timeZone: process.env.VITE_APP_TZ || 'Europe/Istanbul' },
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Detailed Calendar Error:', error);
    res.status(500).json({ error: error.message });
  }
}
