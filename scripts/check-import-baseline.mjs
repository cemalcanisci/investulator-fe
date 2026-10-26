import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const temporary = await fs.mkdtemp(
  path.resolve(root, '../outputs/sise-integration-20261026/baseline-'),
);
const archive = path.join(temporary, 'baseline.tar');
await fs.writeFile(
  archive,
  execFileSync('git', ['archive', '--format=tar', 'HEAD'], {
    maxBuffer: 30 * 1024 * 1024,
  }),
);
execFileSync('tar', ['-xf', 'baseline.tar'], { cwd: temporary });
await fs.symlink(
  path.join(root, 'node_modules'),
  path.join(temporary, 'node_modules'),
  'junction',
);
const child = spawn(
  process.execPath,
  [
    path.join(root, 'node_modules/vitest/vitest.mjs'),
    'run',
    'src/__tests__/pages/AnalysisPage.test.tsx',
    'src/__tests__/services/research.test.ts',
    '--maxWorkers=2',
    '--reporter=json',
    `--outputFile=${path.resolve(root, '../outputs/sise-integration-20261026/baseline-tests.json')}`,
  ],
  { cwd: temporary, stdio: 'inherit', windowsHide: true },
);
child.on('exit', (code) => {
  process.exitCode = code;
});
