import * as phantom from 'phantom';
const phantom_path = require('phantomjs-prebuilt').path;
import * as path from 'path';
const slash = require('slash');
import * as $ from 'jquery';

test('Request a Web Page', async () => {
  const phantom_instance = await phantom.create([], {
    phantomPath: phantom_path,
  });
  const page = await phantom_instance.createPage();
  await page.open('http://www.google.com', {
    operation: 'GET',
    encoding: 'utf8',
  });

  expect((await page.property('title'))).toEqual(expect.stringContaining('Google'));

  return phantom_instance.exit();
});

test('Request a Local Page', () => {
  return phantom.create([], {
    phantomPath: phantom_path,
  }).then(phantom => phantom.createPage())
    .then(page => {
      return page.open('file:///' + path.join(__dirname, './fixtures/ipsum-in-template.html'), {
        operation: 'GET',
        encoding: 'utf8',
      }).then((status) => {
        if (status != 'success') {
          throw status;
        }

        return page.includeJs(
          'file:///' + slash(path.join(__dirname, '../node_modules/jquery/dist/jquery.min.js')),
        ).then(() => {
          return page.evaluate(function () {
            return $('h1').get(0).innerHTML;
          });
        });
      });
    }).then(content => {
      expect(content).toBe('A First Level Header');

      return;
    });
});
