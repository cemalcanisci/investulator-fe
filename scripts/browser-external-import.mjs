import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

export async function verifyBrowser(temporary, output) {
  const executable = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const browser = spawn(
    executable,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--remote-debugging-port=9248',
      `--user-data-dir=${path.join(temporary, 'chrome')}`,
      'about:blank',
    ],
    { windowsHide: true, stdio: 'ignore' },
  );
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let socket;
  try {
    let tabs;
    for (let n = 0; n < 100; n++) {
      try {
        tabs = await (await fetch('http://127.0.0.1:9248/json')).json();
        break;
      } catch {
        await pause(100);
      }
    }
    assert.ok(tabs, 'Chrome debugging endpoint');
    socket = new WebSocket(
      tabs.find((t) => t.type === 'page').webSocketDebuggerUrl,
    );
    await new Promise((resolve, reject) => {
      socket.onopen = resolve;
      socket.onerror = reject;
    });
    let id = 0;
    let loaded;
    const pending = new Map(),
      errors = [];
    socket.onmessage = (e) => {
      const r = JSON.parse(e.data);
      if (r.method === 'Page.loadEventFired') {
        loaded?.();
      }
      if (r.method === 'Runtime.exceptionThrown') {
        errors.push(r.params.exceptionDetails);
      }
      if (r.id) {
        const p = pending.get(r.id);
        pending.delete(r.id);
        if (r.error) {
          p.reject(r.error);
        } else {
          p.resolve(r.result);
        }
      }
    };
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const key = ++id;
        pending.set(key, { resolve, reject });
        socket.send(JSON.stringify({ id: key, method, params }));
      });
    const evaluate = async (expression) => {
      const r = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (r.exceptionDetails) {
        throw new Error(JSON.stringify(r.exceptionDetails));
      }
      return r.result.value;
    };
    async function navigate(method, params = {}) {
      const loading = new Promise((resolve) => {
        loaded = resolve;
      });
      await send(method, params);
      await loading;
      loaded = undefined;
    }
    async function until(expression) {
      for (let n = 0; n < 200; n++) {
        if (await evaluate(expression)) {
          return;
        }
        await pause(100);
      }
      throw new Error(
        `Timeout: ${expression}\n${await evaluate('document.body.innerText')}`,
      );
    }
    async function clickText(text, selector = 'button') {
      const expression = `[...document.querySelectorAll(${JSON.stringify(selector)})].find(e=>e.textContent.trim()===${JSON.stringify(text)})`;
      await until(`!!(${expression})`);
      await evaluate(`${expression}.click()`);
    }
    await send('Runtime.enable');
    await send('Page.enable');
    await navigate('Page.navigate', {
      url: 'http://127.0.0.1:5198/stratejiler',
    });
    await until('document.body.innerText.includes("TUPRS")');
    const labels = await evaluate(
      `(async()=>{const {i18n}=await import('/src/i18n/index.ts'); return Object.fromEntries(['import','sourceUrl','urlLoad','apply','urlLabel'].map(k=>[k,i18n.t('researchTransfer.'+k)]));})()`,
    );
    await clickText(labels.import);
    await clickText('Excel (.xlsx)', '[role="menuitem"]');
    await clickText(labels.sourceUrl, 'label');
    await evaluate(
      `(()=>{const input=document.querySelector('input[aria-label='+JSON.stringify(${JSON.stringify(labels.urlLabel)})+']'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'/research/sise-import-test.xlsx'); input.dispatchEvent(new Event('input',{bubbles:true}));})()`,
    );
    await clickText(labels.urlLoad);
    await until(
      'document.querySelector("[role=dialog]")?.innerText.includes("watch-bist-sise")',
    );
    const preview = await evaluate(
      'document.querySelector("[role=dialog]").innerText',
    );
    assert.ok(!preview.includes('undefined'), 'no raw parser error');
    await clickText(labels.apply);
    await until('!document.querySelector("[role=dialog]")');
    await pause(1000);
    await navigate('Page.navigate', {
      url: 'http://127.0.0.1:5198/takip/watch-bist-sise',
    });
    await until(
      'document.querySelector("h1")?.innerText.includes("SISE") && document.body.innerText.includes("224,53")',
    );
    await navigate('Page.reload');
    await until(
      'document.querySelector("h1")?.innerText.includes("SISE") && document.body.innerText.includes("224,53")',
    );
    await evaluate(
      `document.querySelectorAll('details').forEach(e=>e.open=true)`,
    );
    const text = await evaluate('document.body.innerText');
    await fs.writeFile(path.join(output, 'sise-browser-text.txt'), text);
    assert.ok(
      text.includes('9,88') && text.includes('23,98'),
      'profit and EBITDA rendered',
    );
    assert.ok(
      text.includes('TAS29') &&
        text.includes('UNVERIFIED') &&
        text.includes('NEEDS_REVIEW'),
      'quality and basis visible',
    );
    const missingLabel = await evaluate(
      `(async()=>{const {i18n}=await import('/src/i18n/index.ts');return i18n.t('researchUx.trust.missing');})()`,
    );
    assert.ok(text.includes(missingLabel), 'missing inputs visible');
    const sizes = [];
    for (const width of [390, 640, 820, 1024, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 1000,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await pause(150);
      const overflow = await evaluate(
        'document.documentElement.scrollWidth>innerWidth',
      );
      sizes.push({ width, overflow });
      assert.equal(overflow, false, `overflow at ${width}`);
    }
    await evaluate(
      `localStorage.setItem('inv-theme','dark'); localStorage.setItem('inv-currency','TRY');`,
    );
    await navigate('Page.reload');
    await until('document.body.innerText.includes("224,53")');
    assert.equal(
      await evaluate('document.documentElement.dataset.theme'),
      'dark',
    );
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    await fs.writeFile(
      path.join(output, 'sise-browser.png'),
      Buffer.from(screenshot.data, 'base64'),
    );
    assert.deepEqual(errors, []);
    await fs.writeFile(
      path.join(output, 'browser-result.json'),
      JSON.stringify(
        {
          preview,
          sizes,
          errors,
          reload: true,
          financialValues: ['224,53', '9,88', '23,98'],
          requestedTheme: 'dark',
          requestedCurrency: 'TRY',
          currencyConversionVerified: false,
        },
        null,
        2,
      ),
    );
    await evaluate('localStorage.clear()');
    await send('Browser.close');
  } finally {
    socket?.close();
    browser.kill();
  }
}
