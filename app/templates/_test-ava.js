import test from 'ava';
import <%= camelModuleName %> from './index';

test('should <%= camelModuleName %>', (t) =>
  t.is(<%= camelModuleName %>('unicorns'), 'unicorns'));

test('should <%= camelModuleName %> invalid input', (t) =>
  t.is(<%= camelModuleName %>(), undefined));
