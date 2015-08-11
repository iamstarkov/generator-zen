import { equal } from 'assert';
import <%= camelModuleName %> from './index';

it('should <%= camelModuleName %>', () =>
  equal(<%= camelModuleName %>('unicorns'), 'unicorns'));

it('should <%= camelModuleName %> invalid input', () =>
  equal(<%= camelModuleName %>(), undefined));
