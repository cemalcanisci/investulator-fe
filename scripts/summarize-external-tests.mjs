import fs from 'node:fs/promises';
const output = '../outputs/sise-integration-20261026';
for (const name of ['full-tests', 'baseline-tests']) {
  try {
    const result = JSON.parse(
      await fs.readFile(`${output}/${name}.json`, 'utf8'),
    );
    process.stdout.write(
      `${JSON.stringify({ name, total: result.numTotalTests, passed: result.numPassedTests, failed: result.numFailedTests, failures: result.testResults.flatMap((file) => file.assertionResults.filter((t) => t.status === 'failed').map((t) => ({ file: file.name, test: t.fullName, message: t.failureMessages.map((m) => m.slice(0, 700)) }))) }, null, 2)}\n`,
    );
  } catch (error) {
    process.stdout.write(`${name}: ${error.message}\n`);
  }
}
try {
  const summary = JSON.parse(
    await fs.readFile('coverage/coverage-summary.json', 'utf8'),
  );
  process.stdout.write(
    `${JSON.stringify({ coverage: summary.total, changed: Object.entries(summary).filter(([key]) => /researchWorkbook|financialPeriodSelection|ResearchTransfer/.test(key)) }, null, 2)}\n`,
  );
} catch (error) {
  process.stdout.write(`${error.message}\n`);
}
const text = await fs.readFile(`${output}/sise-browser-text.txt`, 'utf8');
process.stdout.write(
  `${JSON.stringify({ browserTextLength: text.length, values: text.split('\n').filter((l) => /9,88|23,98|224,53|ebitda|externalResearch/.test(l)) }, null, 2)}\n`,
);
