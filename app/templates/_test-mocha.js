/* eslint-env mocha */

import { equal, throws } from 'assert';
import <%= camelModuleName %> from './index';

it('basic', () =>
  equal(<%= camelModuleName %>('unicorns'), 'unicorns'));

it('empty input', () => throws(() => { <%= camelModuleName %>(); }, TypeError));
it('invalid input', () => throws(() => { <%= camelModuleName %>(2); }, TypeError));
