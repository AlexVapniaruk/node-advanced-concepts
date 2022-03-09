const puppeteer = require('puppeteer');

let browser, page;

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false,
        args: [`--start-maximized`],
        defaultViewport: null
    });
});

beforeEach(async() => {
    page = await browser.newPage();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    //await page.close();
});

afterAll(async () => {
    //await browser.close();
});

test('the header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});

test('clicking login start oauth flow', async () => {
    await page.click('.right a');

    const url = await page.url();

    //console.log(url);
});

test('when signed in, shows logout button', async() => {
    const id = '61da2524583602a97800db64';

    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {
            user: id
        }
    };
    const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session=' + sessionString);

    await page.setCookie({
        name: 'session',
        value: sessionString
    });
    await page.setCookie({
        name: 'session.sig',
        value: sig
    });
    await page.goto('localhost:3000');
    await page.waitFor('a[href="/auth/logout"]');
    
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
});