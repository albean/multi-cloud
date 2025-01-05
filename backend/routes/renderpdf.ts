import puppeteer from 'puppeteer';

export const pdfrender = (async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent('<h1>Hello World!</h1>');
  await page.pdf({ path: 'output.pdf', format: 'A4' });

  await browser.close();
});
