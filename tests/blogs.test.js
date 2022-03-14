const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    //await page.close();
});

describe('when logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a[href="/blogs/new"]');
    });

    test('when logged in, can see blog create form', async () => {        
        const label = await page.getContentsOf('form label');
        expect(label).toEqual('Blog Title');
    });

    describe('and using valid inputs', () => {
        beforeEach(async () => {
            await page.type('input[name="title"]', 'My Title');
            await page.type('input[name="content"]', 'My Content');
            await page.click('form button');
        });

        test('submiting takes user to review screen', async () => {
            const text = await page.getContentsOf('h5');

            expect(text).toEqual('Please confirm your entries');
        });

        test('submiting then saving adds blog to index page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');

            //expect(title).toEqual('My Title');
            //expect(content).toEqual('My Content');
        })
    });

    describe('and using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });

        test('the form shows an error message', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    });
});

describe('user not log in', async () => {
    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
        },
        {
            method: 'post',
            path: '/api/blogs',
            data: {
                title: 'T',
                content: 'C'
            }
        }
    ];

    test('blog related actions are prohibited', async() => {
        const results = await page.execRequests(actions);

        for(let result of results) {
            expect(result).toEqual({ error: 'You must log in!'});
        }
    });
});