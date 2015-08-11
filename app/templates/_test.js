import { equal } from 'assert';
import <%= camelModuleName %> from './index';

it('should <%= camelModuleName %>', () =>
  equal(<%= camelModuleName %>('unicorns'), 'unicorns'));

it('should <%= camelModuleName %> invalid input', () =>
  // its up to you how to handle invalid input,
  // but you definitely should handle it somehow
  equal(<%= camelModuleName %>(), undefined));
