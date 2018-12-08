import * as $ from 'jquery';
import * as _ from 'lodash';
import * as path from 'path';
import * as pptr from 'puppeteer';
import { TEST_FIXTURE } from './constants';
const slash = require('slash');

test('Request a Web Page', done => {
  expect.assertions(1);
  pptr.launch().then(browser => {
    return browser.newPage().then(
      page => {
        return page.goto('http://www.google.com')
          .then(() => page.title())
          .then(title => expect(title).toBe('Google'))
          .then(() => browser.close())
          .then(done);
      });
  });
});

test('Request a Local Page', async () => {
  expect.assertions(2);
  const browser = await pptr.launch();
  const page = await browser.newPage();
  const response = await page.goto(
    'file:///' + path.join(TEST_FIXTURE, './ipsum-in-template.html'),
  );
  expect(response).not.toBeNull();
  await page.addScriptTag({ url: 'file:///' + slash(require.resolve('jquery')) });
  expect(await page.evaluate(() => $('h1').html())).toBe('A First Level Header');

  await browser.close();
});
