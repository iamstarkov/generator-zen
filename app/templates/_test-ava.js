import test from 'ava';
import <%= camelModuleName %> from './index';

test('should <%= camelModuleName %>', (t) =>
  t.is(<%= camelModuleName %>('unicorns'), 'unicorns'));

test('should throw on empty input', t => t.throws(() => { <%= camelModuleName %>(); }, TypeError));
test('should throw on invalid input', t => t.throws(() => { <%= camelModuleName %>(2); }, TypeError));
