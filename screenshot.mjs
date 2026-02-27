import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url = process.argv[2];
const label = process.argv[3];

if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label]');
  process.exit(1);
}

const screenshotsDir = './temporary screenshots';

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Find next available auto-incremented filename
let n = 1;
let filepath;
while (true) {
  const filename = label
    ? `screenshot-${n}-${label}.png`
    : `screenshot-${n}.png`;
  filepath = path.join(screenshotsDir, filename);
  if (!fs.existsSync(filepath)) break;
  n++;
}

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/xokul/.cache/puppeteer/chrome/win64-145.0.7632.77/chrome-win64/chrome.exe',
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2' });
await page.screenshot({ path: filepath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${filepath}`);
