import type { Plugin } from 'vite';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

/** Opt-in, loopback-only development adapter; never installed in build/preview. */
export function researchStore(
  options: { readonly dataPath?: string; readonly backupPath?: string } = {},
): Plugin {
  const path =
    options.dataPath ??
    fileURLToPath(
      new URL('../src/data/research/imported-research.json', import.meta.url),
    );
  const backup =
    options.backupPath ??
    fileURLToPath(new URL('../data/research-backups/', import.meta.url));
  let busy = false;
  const token = randomUUID();
  let pending: { token: string; revision: string; content: string } | undefined;
  function hash(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }
  async function undoContent(current: string): Promise<string | undefined> {
    try {
      const saved: unknown = JSON.parse(
        await readFile(`${backup}undo.json`, 'utf8'),
      );
      if (typeof saved !== 'object' || saved === null) {
        return undefined;
      }
      const fields = Object.fromEntries(Object.entries(saved));
      return fields.revision === hash(current) &&
        typeof fields.previous === 'string'
        ? fields.previous
        : undefined;
    } catch {
      return undefined;
    }
  }
  return {
    name: 'investulator-local-research-store',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__research', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(
          req.socket.remoteAddress ?? '',
        );
        const host = req.headers.host ?? '';
        const origin = req.headers.origin;
        function send(status: number, data: unknown): void {
          res.statusCode = status;
          res.end(JSON.stringify(data));
        }
        if (
          !local ||
          !/^(localhost|127\.0\.0\.1|\[::1\]):\d+$/.test(host) ||
          (origin && origin !== `http://${host}`) ||
          req.headers['sec-fetch-site'] === 'cross-site'
        ) {
          send(403, { error: 'origin' });
          return;
        }
        if (process.env.INVESTULATOR_RESEARCH_WRITE !== '1') {
          send(503, { error: 'disabled' });
          return;
        }
        if (req.method === 'GET' && req.url === '/session') {
          send(200, { token });
          return;
        }
        if (
          req.method !== 'POST' ||
          req.headers['x-research-token'] !== token ||
          req.headers['content-type'] !== 'application/json'
        ) {
          send(403, { error: 'token' });
          return;
        }
        if (busy) {
          send(409, { error: 'busy' });
          return;
        }
        busy = true;
        try {
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            size += data.length;
            if (size > 24 * 1024 * 1024) {
              throw new Error('size');
            }
            chunks.push(data);
          }
          const body: unknown = JSON.parse(
            Buffer.concat(chunks).toString('utf8'),
          );
          if (typeof body !== 'object' || body === null) {
            throw new Error('schema');
          }
          const input = Object.fromEntries(Object.entries(body));
          const current = await readFile(path, 'utf8');
          if (req.url === '/preview') {
            const module = await server.ssrLoadModule(
              '/src/lib/researchWorkbook.ts',
            );
            const data = await server.ssrLoadModule(
              '/src/services/researchBundle.ts',
            );
            if (
              !Array.isArray(input.rows) ||
              input.rows.length > 100000 ||
              (input.scope !== undefined && typeof input.scope !== 'string')
            ) {
              throw new Error('schema');
            }
            for (const row of input.rows) {
              if (
                typeof row !== 'object' ||
                row === null ||
                ![
                  'assetId',
                  'companyId',
                  'market',
                  'entity',
                  'recordId',
                  'field',
                  'value',
                  'type',
                  'sheet',
                ].every(
                  (key) =>
                    typeof row[key] === 'string' && row[key].length < 30001,
                ) ||
                !Number.isSafeInteger(row.row)
              ) {
                throw new Error('schema');
              }
            }
            const result = module.previewWorkbook(
              input.rows,
              data.mergeResearchBundles(
                data.researchBundle,
                module.parseResearchBundle(JSON.parse(current)),
              ),
              input.scope,
            );
            const approval = randomUUID();
            pending =
              result.issues.length || result.added + result.updated === 0
                ? undefined
                : {
                    token: approval,
                    revision: hash(current),
                    content: JSON.stringify(result.bundle, null, 2),
                  };
            const { bundle: _bundle, ...summary } = result;
            send(200, { ...summary, approval: pending?.token });
          } else if (req.url === '/apply' || req.url === '/undo') {
            const restoring = req.url === '/undo';
            const undo = restoring ? await undoContent(current) : undefined;
            if (
              restoring
                ? !undo
                : !pending ||
                  pending.token !== input.approval ||
                  pending.revision !== hash(current)
            ) {
              throw new Error('stale');
            }
            const next = restoring ? undo : pending?.content;
            if (!next) {
              throw new Error('stale');
            }
            await mkdir(backup, { recursive: true });
            await writeFile(
              `${backup}${Date.now()}-${randomUUID()}.json`,
              current,
              { flag: 'wx' },
            );
            const temporary = `${path}.${randomUUID()}.tmp`;
            await writeFile(temporary, next, { flag: 'wx' });
            await writeFile(
              `${backup}undo.json`,
              JSON.stringify({ previous: current, revision: hash(next) }),
            );
            await rename(temporary, path);
            pending = undefined;
            send(200, { saved: true });
            server.ws.send({ type: 'full-reload' });
          } else {
            send(404, { error: 'route' });
          }
        } catch (error) {
          send(400, {
            error:
              error instanceof Error &&
              ['size', 'schema', 'stale', 'history', 'identity'].includes(
                error.message,
              )
                ? error.message
                : req.url === '/apply' || req.url === '/undo'
                  ? 'save'
                  : 'invalid',
          });
        } finally {
          busy = false;
        }
      });
    },
  };
}
