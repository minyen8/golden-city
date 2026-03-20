import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

const cwd = 'C:\\TempClaude\\golden-city\\project-modified';
const npmPath = 'C:\\Users\\mmmin\\node-portable\\node-v22.16.0-win-x64\\npm.cmd';

try {
  console.log('Installing dependencies...');
  const result = execSync(`"${npmPath}" install --legacy-peer-deps`, {
    cwd,
    encoding: 'utf-8',
    timeout: 180000,
    stdio: 'pipe',
    env: {
      ...process.env,
      PATH: 'C:\\Users\\mmmin\\node-portable\\node-v22.16.0-win-x64;' + (process.env.PATH || '')
    }
  });
  console.log(result);
} catch (e) {
  console.error('Install error:', e.message?.slice(0, 500));
  if (e.stdout) console.log('stdout:', e.stdout.slice(-1000));
  if (e.stderr) console.log('stderr:', e.stderr.slice(-1000));
}

console.log('vite exists:', existsSync(path.join(cwd, 'node_modules', 'vite')));
console.log('@stripe/stripe-js exists:', existsSync(path.join(cwd, 'node_modules', '@stripe', 'stripe-js')));
console.log('stripe exists:', existsSync(path.join(cwd, 'node_modules', 'stripe')));
