import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  const url = 'https://rubinot.com.br/?subtopic=characters&name=Ulezovisk';

  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const content = await page.content();

    const isOk = content.includes('Character Information') || content.includes('Ulezovisk');

    res.status(200).json({
      success: true,
      result: isOk ? '✅ Conteúdo carregado com sucesso.' : '⚠️ Conteúdo esperado não encontrado.'
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (browser) await browser.close();
  }
}