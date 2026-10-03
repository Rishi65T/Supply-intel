import { execSync } from 'child_process';

const port = process.env.PORT || 3000;
try {
  if (process.platform === 'win32') {
    const stdout = execSync(`netstat -ano -p tcp | findstr :${port}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    for (const line of lines) {
      if (line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && pid !== `${process.pid}`) {
          pids.add(pid);
        }
      }
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        console.log(`[PRE-DEV] Freed port ${port} by closing prior process ${pid}`);
      } catch (e) {}
    }
  } else {
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
  }
} catch (e) {
  // Port was not in use
}
