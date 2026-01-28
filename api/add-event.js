import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { eventName } = req.body;

  // This part is the "Fireproof" cleaner
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || "";
  const privateKey = rawKey.replace(/\\n/g, '\n'); 

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/calendar.events'],
  });

  const calendar = google.calendar({ version: 'v3', auth });
  const calendarId = 'primary'; 

  try {
    await calendar.events.insert({
      calendarId: calendarId,
      requestBody: {
        summary: eventName,
        start: { dateTime: new Date().toISOString() },
        end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
      },
    });
    res.status(200).send({ message: 'Success! Event added to Aşklarım' });
  } catch (error) {
    console.error('Google Calendar Error:', error);
    res.status(500).send({ message: 'Error: ' + error.message });
  }
}
