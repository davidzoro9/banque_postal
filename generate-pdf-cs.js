const { chromium } = require('playwright');
const path = require('path');

async function generatePDF() {
  console.log('Launching Playwright Chromium...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const htmlPath = path.join(__dirname, 'cv_customer_success.html');
  console.log(`Loading local HTML file: ${htmlPath}`);
  await page.goto(`file://${htmlPath}`);
  
  console.log('Waiting for web fonts and resources to load...');
  await page.evaluate(() => document.fonts.ready);
  
  const outputPath = path.join(__dirname, '..', 'Zorom_David_Customer_Success_CV.pdf');
  console.log(`Rendering PDF and saving to: ${outputPath}`);
  
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  });
  
  await browser.close();
  console.log('Success! Customer Success PDF CV generated.');
}

generatePDF().catch((err) => {
  console.error('An error occurred during PDF generation:', err);
  process.exit(1);
});
