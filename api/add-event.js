const { google } = require('googleapis');

// Vercel will pull these from your Environment Variables settings
const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/calendar']
);

const calendar = google.calendar({ version: 'v3', auth });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { title, start, end, calendarId } = req.body;

  try {
    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: {
        summary: title,
        start: { dateTime: start, timeZone: 'Europe/Istanbul' },
        end: { dateTime: end, timeZone: 'Europe/Istanbul' },
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
