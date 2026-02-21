const { sendSuccess } = require('../utils/response');

function humanizeSeconds(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);
  return parts.join(' ');
}

function health(req, res) {
  const uptimeSeconds = process.uptime();

  return sendSuccess(res, {
    message: 'Server healthy',
    data: {
      status: 'ok',
      uptime: humanizeSeconds(uptimeSeconds),
      timestamp: new Date().toISOString(),
    },
  });
}

module.exports = {
  health,
};
