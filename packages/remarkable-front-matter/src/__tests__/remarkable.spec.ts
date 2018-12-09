import { readFixture } from '@fixtures';
import * as Remarkable from 'remarkable';
import frontMatter from '..';

const remarkable = new Remarkable();
remarkable.use(frontMatter);

test('front-matter-plugin', () => {
  expect(remarkable.render(readFixture('ipsum.md')))
    .toMatchSnapshot();
  const env = { frontMatter: undefined };
  expect(remarkable.render(readFixture('markdown-cases/front-matter-case.md'), env))
    .toMatchSnapshot();
  expect(env.frontMatter).toMatchSnapshot();
});
