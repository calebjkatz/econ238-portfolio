// Run after build_charts.py and build_publication.py. See ../README.md.
const {chromium} = require('playwright-core');
const {PDFDocument} = require('pdf-lib');
const {pathToFileURL} = require('node:url');
const path = require('node:path');
(async () => {
  const root = path.resolve(__dirname, '..');
  const executablePath = process.env.CHROME_EXECUTABLE || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
  const browser = await chromium.launch({executablePath, headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 1800, height: 2450}});
    await page.emulateMedia({media: 'print'});
    await page.goto(pathToFileURL(path.join(root, 'poster/poster.html')).href, {waitUntil: 'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    const valid = await page.evaluate(() => {
      const poster = document.querySelector('.poster');
      const rect = poster.getBoundingClientRect();
      const footer = document.querySelector('.poster-footer').getBoundingClientRect();
      return rect.width === 1728 && rect.height === 2304 && poster.scrollHeight <= 2304 && footer.bottom <= rect.bottom - 30 && [...document.images].every(i => i.complete && i.naturalWidth > 0);
    });
    if (!valid) throw new Error('Poster content overflows or an image is missing; PDF not exported.');
    const pdf = await page.pdf({preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, tagged: true});
    const document = await PDFDocument.load(pdf);
    const size = document.getPage(0).getSize();
    if (document.getPageCount() !== 1 || size.width !== 1296 || size.height !== 1728) throw new Error('Expected one 18 × 24 inch page.');
    require('node:fs').writeFileSync(path.join(root, 'poster/Caleb_Katz_Econ238_HW4_Poster.pdf'), pdf);
    if (process.env.POSTER_PREVIEW) await page.screenshot({path: process.env.POSTER_PREVIEW, fullPage: true});
    console.log('Verified poster: one page; 1296 × 1728 points = 18 × 24 inches.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
