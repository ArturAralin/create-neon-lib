export function stdAsk(q: string, defaultValue: string): Promise<string> {
  process.stdout.write(`${q} (${defaultValue}): `);

  return new Promise((resolve, rejects) => {
    process.stdin.once('data', (line) => {
      const value = line.toString().slice(0, -1);
      resolve(value || defaultValue);
    });

    process.stdin.once('error', (e) => {
      rejects(e);
    });
  });
}

export function stdWrite(s: string): void {
  process.stdout.write(`${s}\n`);
}

export function stdErrWrite(s: string): void {
  process.stderr.write(`${s}\n`);
}
