import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import os from 'os';

const performCalculations = async () => {
  const numCores = os.cpus().length;
  const workers = [];
  const results = new Array(numCores);

  for (let i = 0; i < numCores; i++) {
    const worker = new Worker('worker.js');
    workers.push(worker);

    worker.on('message', (message) => {
      if (message.type === 'result') {
        results[i] = { status: 'resolved', data: message.data };
      } else {
        results[i] = { status: 'error', data: null };
      }
    });

    worker.on('error', () => {
      results[i] = { status: 'error', data: null };
    });

    worker.postMessage({ type: 'compute', data: 10 + i });
  }

  await Promise.all(workers.map((worker) => new Promise((resolve) => worker.on('exit', resolve))));

  console.log(results);
};

await performCalculations();