import puppeteer from 'puppeteer';
import { tmpdir } from 'os';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { randomBytes } from 'crypto';

export const renderPdf = async (vars: any) => {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_BIN,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--disable-web-security",
      "--single-process",
      "--no-zygote",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
    timeout: 5 * 60_000,
    headless: true,
  });


  const page = await browser.newPage();

  const sourceFile = `${process.cwd()}/backend/assets/ticket.html`;

  let template = (await readFile(sourceFile)).toString();

  Object.entries(vars).map(([k, v]: any) => {
    template = template.replace(`{${k}}`, () => v);
  })

  const dir = tmpdir();

  const htmlOut = `${dir}/${randomBytes(8).toString('hex')}.html`;
  const pdfOut = `/var/attachments/${randomBytes(8).toString('hex')}.pdf`;

  await copyFile(
    `${process.cwd()}/backend/assets/qr.svg`,
    `${dir}/qr.svg`
  )

  await writeFile(htmlOut, template)


  await page.goto(`file://${htmlOut}`, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: pdfOut,
    format: 'A4',
  });

  await browser.close();

  return pdfOut;
}
