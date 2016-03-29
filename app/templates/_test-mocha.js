/* eslint-env mocha */

import { equal, throws } from 'assert';
import <%= camelModuleName %> from './index';

it('should <%= camelModuleName %>', () =>
  equal(<%= camelModuleName %>('unicorns'), 'unicorns'));

it('should throw on empty input', () => throws(() => { <%= camelModuleName %>(); }, TypeError));
it('should throw on invalid input', () => throws(() => { <%= camelModuleName %>(2); }, TypeError));
