import { spawn } from 'child_process';
import process from 'process';
import * as crypto from 'crypto';

export function hash(): string {
  // Generate a random string or use any value you want to hash
  const randomValue = crypto.randomBytes(20).toString('hex');

  // Generate a MD5 hash from the random value
  const hash = crypto.createHash('md5').update(randomValue).digest('hex');

  // Return the first 6 characters of the MD5 hash
  return hash.substring(0, 6);
}

export function run(cmdWithArgs: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = cmdWithArgs;
    const proc = spawn(cmd, args);

    let output = '';
    let err = '';

    proc.stdout.on('data', data => {
      console.log(
        (data + "").trim().split("\n").map(line => `docker: ${line}`).join("\n")
      )
    });

    proc.stderr.on('data', data => { err += (data.toString()) });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(`Command failed with exit code ${code}: ${err}`);
      }
    });
  });
}

export const getEnv = (name: string): string => {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment Varible ${name} is not set.`)
  }

  return value;
};

export const singletone = <T>(fac: () => T): () => T => {
  let instance: T;

  return () => {
    if (!instance) {
      instance = fac();
    }
    return instance;
  };
};


