/* eslint-env mocha */

import { equal, throws } from 'assert';
import { <%= camelModuleName %>, <%= camelModuleName %>Async } from './index';

it('basic', () =>
  equal(<%= camelModuleName %>('unicorns'), 'unicorns'));

it('empty input', () => throws(() => { <%= camelModuleName %>(); }, TypeError));
it('invalid input', () => throws(() => { <%= camelModuleName %>(2); }, TypeError));

it('async :: basic', done => {
  <%= camelModuleName %>Async('unicorns').then(result => {
    equal(result, 'unicorns')
    done();
  });
});

it('async :: empty input', done => {
  <%= camelModuleName %>Async().catch(result => {
    equal(result instanceof TypeError, true)
    done();
  });
});

it('async :: invalid input', done => {
  <%= camelModuleName %>Async(2).catch(result => {
    equal(result instanceof TypeError, true)
    done();
  });
});
