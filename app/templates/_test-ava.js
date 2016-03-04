import test from 'ava';
import <%= camelModuleName %> from './index';

test('should <%= camelModuleName %>', (t) =>
  t.same(<%= camelModuleName %>('unicorns'), 'unicorns'));

test('should <%= camelModuleName %> invalid input', (t) =>
  t.same(<%= camelModuleName %>(), undefined));
