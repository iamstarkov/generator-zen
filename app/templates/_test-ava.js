import test from 'ava';
import { <%= camelModuleName %>, <%= camelModuleName %>Async } from './index';

test('basic', t => t.is(
  <%= camelModuleName %>('unicorns'),
  'unicorns'
));

test('empty input', t => t.throws(() => { <%= camelModuleName %>(); }, TypeError));
test('invalid input', t => t.throws(() => { <%= camelModuleName %>(2); }, TypeError));

test('async :: basic', async t => t.is(
  await <%= camelModuleName %>Async('unicorns'),
  'unicorns'
));

test('async :: empty input', t => t.throws(<%= camelModuleName %>Async(), TypeError));
test('async :: invalid input', t => t.throws(<%= camelModuleName %>Async(2), TypeError));
