import { createServer } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { verifyBrowser } from './browser-external-import.mjs';

const root = process.cwd();
const output = path.resolve(root, '../outputs/sise-integration-20261026');
const temporary = await fs.mkdtemp(
  path.join(os.tmpdir(), 'investulator-import-'),
);
const dataPath = path.join(temporary, 'imported-research.json');
await fs.writeFile(
  dataPath,
  JSON.stringify({
    schemaVersion: 1,
    companies: [],
    reports: [],
    approximate: [],
    verified: [],
  }),
);
const protectedFiles = [
  'src/data/research/analysis-reports.json',
  'src/data/research/imported-research.json',
  'src/data/research/tuprs-approximate-history.json',
  'src/data/research/tuprs-dividend-history.json',
];
async function hashes() {
  return Promise.all(
    protectedFiles.map(async (p) => [
      p,
      createHash('sha256')
        .update(await fs.readFile(p))
        .digest('hex'),
    ]),
  );
}
const before = await hashes();
const boot = await createServer({
  root,
  configFile: false,
  server: { middlewareMode: true },
  resolve: { alias: { '@': path.join(root, 'src') } },
});
const { researchStore } = await boot.ssrLoadModule('/dev/researchStore.ts');
await boot.close();
const config = {
  root,
  configFile: false,
  plugins: [
    react(),
    tailwindcss(),
    researchStore({ dataPath, backupPath: `${temporary}/backups/` }),
  ],
  resolve: {
    alias: [
      { find: '@/data/research/imported-research.json', replacement: dataPath },
      { find: '@', replacement: path.join(root, 'src') },
    ],
  },
  server: {
    host: '127.0.0.1',
    port: 5198,
    strictPort: true,
    fs: { allow: [root, temporary] },
  },
};
process.env.INVESTULATOR_RESEARCH_WRITE = '1';
let server;
let assertions = 0;
function check(condition, message) {
  assert.ok(condition, message);
  assertions++;
}
async function start() {
  server = await createServer(config);
  await server.listen();
}
async function post(route, body, token) {
  const response = await fetch(`http://127.0.0.1:5198/__research/${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Research-Token': token },
    body: JSON.stringify(body),
  });
  return { status: response.status, ...(await response.json()) };
}
try {
  await start();
  const files = await server.ssrLoadModule('/src/lib/researchWorkbookFile.ts');
  const workbook = await server.ssrLoadModule('/src/lib/researchWorkbook.ts');
  const initial = (
    await server.ssrLoadModule('/src/services/researchBundle.ts')
  ).researchBundle;
  const bytes = await fs.readFile('public/research/sise-import-test.xlsx');
  const rows = await files.readResearchWorkbook(new Uint8Array(bytes).buffer);
  const token = (
    await (await fetch('http://127.0.0.1:5198/__research/session')).json()
  ).token;
  const preview = await post('preview', { rows }, token);
  check(
    preview.status === 200 && preview.added > 0 && preview.issues.length === 0,
    'valid preview',
  );
  check(preview.newCompanyIds.includes('watch-bist-sise'), 'new SISE');
  check(
    (await post('apply', { approval: 'wrong' }, token)).error === 'stale',
    'approval gate',
  );
  check(
    (await post('apply', { approval: preview.approval }, token)).saved,
    'persist',
  );
  const saved = workbook.parseResearchBundle(
    JSON.parse(await fs.readFile(dataPath, 'utf8')),
  );
  check(
    saved.reports.some((r) => r.presentation.symbol === 'SISE'),
    'disk persistence',
  );
  check(
    workbook.canonical(
      saved.reports.filter((r) => r.presentation.symbol === 'TUPRS'),
    ) === workbook.canonical(initial.reports),
    'TUPRS preservation',
  );
  await server.close();
  await start();
  const refreshed = (
    await server.ssrLoadModule('/src/services/researchBundle.ts')
  ).researchBundle;
  const research = await server.ssrLoadModule('/src/services/research.ts');
  const analysis = await server.ssrLoadModule('/src/services/analysis.ts');
  const ratios = await server.ssrLoadModule('/src/lib/ratioPresentation.ts');
  const report = (await research.fetchResearch('watch-bist-sise'))[0];
  check(report?.symbol === 'SISE', 'fresh server repository');
  check(report.facts.length === 3, 'presentation facts');
  check(analysis.getAnalysis(report).facts.length === 3, 'analysis repository');
  check(
    ratios.ratioPresentation(analysis.getAnalysis(report), 'revenue').value ===
      '224527000000',
    'screen metric revenue',
  );
  check(
    ratios.ratioPresentation(analysis.getAnalysis(report), 'peTtm').value ===
      undefined,
    'missing ratio',
  );
  const files2 = await server.ssrLoadModule('/src/lib/researchWorkbookFile.ts');
  const exported = await files2.exportResearchWorkbook(refreshed);
  const again = workbook.previewWorkbook(
    await files2.readResearchWorkbook(await exported.arrayBuffer()),
    refreshed,
  );
  check(
    again.issues.length === 0 && again.added + again.updated === 0,
    'export reimport',
  );
  check(
    workbook.canonical(again.bundle) === workbook.canonical(refreshed),
    'lossless',
  );
  const token2 = (
    await (await fetch('http://127.0.0.1:5198/__research/session')).json()
  ).token;
  check(
    (
      await post('preview', { rows, scope: 'watch-bist-tuprs' }, token2)
    ).issues.some((i) => i.code === 'scope'),
    'scope',
  );
  check((await post('undo', {}, token2)).saved, 'undo');
  check(
    JSON.parse(await fs.readFile(dataPath, 'utf8')).reports.length === 0,
    'undo disk',
  );
  if (process.argv.includes('--browser')) {
    await server.close();
    await start();
    await verifyBrowser(temporary, output);
    assertions++;
  }
  process.env.INVESTULATOR_RESEARCH_WRITE = '0';
  check(
    (await fetch('http://127.0.0.1:5198/__research/session')).status === 503,
    'disabled service',
  );
  assert.deepEqual(await hashes(), before);
  assertions++;
  const result = {
    assertions,
    failed: 0,
    preview: {
      added: preview.added,
      updated: preview.updated,
      unchanged: preview.unchanged,
      newCompanyIds: preview.newCompanyIds,
      issues: preview.issues,
    },
    protectedFiles: before,
    temporary,
  };
  await fs.writeFile(
    path.join(output, 'persistence-result.json'),
    JSON.stringify(result, null, 2),
  );
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} finally {
  await server?.close();
}
