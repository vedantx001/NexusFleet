require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        // Port is already in use — provide actionable guidance.
        console.error(`\nPort ${PORT} is already in use.`);
        console.error('Stop the other process using it, or start this server on a different port.');
        console.error('Examples:');
        console.error('  PowerShell:  $env:PORT=5001; npm run dev');
        console.error('  Bash:        PORT=5001 npm run dev');
        console.error('  CMD:         set PORT=5001 && npm run dev\n');
        process.exit(1);
    }

    console.error(err);
    process.exit(1);
});
