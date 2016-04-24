import test from 'ava';
import <%= camelModuleName %> from './index';

test('basic', t =>
  t.is(<%= camelModuleName %>('unicorns'), 'unicorns'));

test('empty input', t => t.throws(() => { <%= camelModuleName %>(); }, TypeError));
test('invalid input', t => t.throws(() => { <%= camelModuleName %>(2); }, TypeError));
