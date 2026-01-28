import { google } from 'googleapis';

export default async function handler(req, res) {
  // 1. Only allow the "Save" button to talk to this file
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { title, start, end } = req.body;
    
    // 2. Log in using your CnJ M1 credentials (we will set these in Vercel later)
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/calendar.events']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // 3. Send the event directly to Aşklarım
    await calendar.events.insert({
      calendarId: 'm4arsogahrubaolgt28k86grtk@group.calendar.google.com', 
      requestBody: {
        summary: title,
        start: { dateTime: start, timeZone: 'Europe/Istanbul' },
        end: { dateTime: end, timeZone: 'Europe/Istanbul' },
      },
    });

    // 4. Tell the website it worked!
    return res.status(200).json({ success: true });
  } catch (error) {
    // If something breaks, tell us exactly what
    return res.status(500).json({ error: error.message });
  }
}
