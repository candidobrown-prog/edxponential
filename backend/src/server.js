// Long-running server (local dev, Docker, Render/Railway/Fly). On Vercel, api/index.js uses app.js directly.
import cron from 'node-cron';
const { default: app } = await import('./app.js');
const { invokeFunction } = await import('./functions-runtime.js');

if (process.env.REMINDER_CRON !== 'off') {
  cron.schedule(process.env.REMINDER_CRON || '0 14 * * *', async () => {
    try {
      const out = await invokeFunction('sendSessionReminders', { body: Buffer.from('{}') });
      console.log('[cron] sendSessionReminders →', out.status, await out.text());
    } catch (e) { console.error('[cron] sendSessionReminders failed:', e.message); }
  });
}
const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`edXponential backend listening on :${port}`));
