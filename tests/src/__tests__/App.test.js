import puppeteer from 'puppeteer';

const timeout = 16000;

describe('Map Test', () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
  }, timeout);

  it('only render the map inside the div container', async () => {
    await page.waitForSelector('.leaflet-container');
    const html = await page.$eval('.leaflet-container', e => e.innerHTML);
    expect(html).toBeTruthy();
  }, timeout);

  it('Click on polygon display data', async () => {
    // default viewport is  { width: 800, height: 600 }
    await page.mouse.click(400, 300);
    await page.waitForSelector('#click');
    const html = await page.$eval('#click', e => e.innerHTML);
    expect(html.slice(-1)).toBe('1');
  }, timeout);

  it('Click on line display data', async () => {
    await page.mouse.click(201, 300);
    await page.waitForSelector('#click');
    const html = await page.$eval('#click', e => e.innerHTML);
    expect(html.slice(-1)).toBe('2');
  }, timeout);

  it('Draw intercept polygon display data', async () => {
    await page.mouse.click(780, 20);
    await page.waitFor(1000);
    await page.mouse.click(400, 300);
    await page.waitFor(1000);
    await page.mouse.click(500, 500);
    await page.waitFor(1000);
    await page.mouse.click(500, 400);
    await page.waitFor(1000);
    await page.mouse.click(400, 300);
    await page.waitForSelector('#draw0');
    const html = await page.$eval('#draw0', e => e.innerHTML);
    expect(html.slice(-1)).toBe('1');
  }, timeout);

  it('Delete new polygon', async () => {
    await page.waitFor(1000);
    await page.mouse.click(780, 100);
    await page.waitFor(1000);
    await page.mouse.click(450, 350);
    await page.waitFor(1000);
    await page.mouse.click(630, 100);
    const html = await page.$('#draw0');
    expect(html).toBeFalsy();
  });

  it('Draw intercept line display data', async () => {
    await page.mouse.click(780, 20);
    await page.waitFor(1000);
    await page.mouse.click(110, 300);
    await page.waitFor(1000);
    await page.mouse.click(320, 500);
    await page.waitFor(1000);
    await page.mouse.click(350, 150);
    await page.waitFor(1000);
    await page.mouse.click(110, 300);
    await page.waitForSelector('#draw0');
    const html = await page.$eval('#draw0', e => e.innerHTML);
    expect(html.slice(-1)).toBe('2');
  });

  afterAll(() => {
    browser.close();
  });
});

