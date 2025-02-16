// @FIXME DELET THIS
import * as fs from 'fs';
import * as pdf from 'html-pdf';

export const pdfrender = (async () => {
  const options = { format: 'Letter' };

  pdf.create("<h1>Hallo world v55</h1>", options).toFile('./public/businesscard.pdf', (err, res) => {
    if (err) return console.log(err);
    console.log(res);
  });
});
