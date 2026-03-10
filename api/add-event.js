import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { title, date, time } = req.body;

  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar']
  );

  const calendar = google.calendar({ version: 'v3', auth });

  // Combine user input into a real date object
  const startDateTime = new Date(`${date}T${time}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hour

  try {
    await calendar.events.insert({
      calendarId: 'm4arsogahrubaolgt28k86grtk@group.calendar.google.com',
      resource: {
        summary: title,
        start: { dateTime: startDateTime.toISOString(), timeZone: 'Europe/Istanbul' },
        end: { dateTime: endDateTime.toISOString(), timeZone: 'Europe/Istanbul' },
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
