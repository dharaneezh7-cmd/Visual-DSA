import { config } from './src/config.mjs';
import { connectDatabase, disconnectDatabase } from './src/db.mjs';
import { createApp } from './src/app.mjs';

async function main() {
  try {
    await connectDatabase();
    const app = createApp();
    const server = app.listen(config.port, () => {
      console.log(`[server] Visual DSA backend running at http://localhost:${config.port}`);
      console.log(`[server] Environment: ${config.nodeEnv}`);
    });

    const shutdown = async () => {
      console.log('\n[server] Shutting down...');
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  }
}

main();