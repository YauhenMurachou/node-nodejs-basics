import { spawn } from 'child_process';
import path from 'path';

const spawnChildProcess = async (args) => {
  const scriptPath = path.join(path.dirname(import.meta.url), './files/script.js');
  const child = spawn(process.execPath, [scriptPath], {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
  });

  child.on('message', (message) => {
    process.stdout.write(message);
  });

  child.on('error', (error) => {
    console.error(`Error occurred in child process: ${error}`);
  });

  process.stdin.on('data', (data) => {
    child.send(data.toString());
  });

  child.stdin.write(JSON.stringify(args) + '\n');

  return new Promise((resolve, reject) => {
    child.on('close', (code, signal) => {
      if (code !== 0) {
        console.error(`Child process exited with code ${code}`);
        reject(new Error(`Child process exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
};

spawnChildProcess(['someArgument1', 'someArgument2']);