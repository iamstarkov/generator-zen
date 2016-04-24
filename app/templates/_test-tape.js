import test from 'tape';
import { <%= camelModuleName %>, <%= camelModuleName %>Async } from './index';

test('<%= camelModuleName %>', ({ equal, throws, end }) => {
  equal(<%= camelModuleName %>('unicorns'), 'unicorns', 'basic');

  throws(() => { <%= camelModuleName %>(); }, TypeError, 'empty input');
  throws(() => { <%= camelModuleName %>(2); }, TypeError, 'invalid input');
  end();
});

test('async :: basic', ({ equal, end }) => {
  <%= camelModuleName %>Async('unicorns').then(result => {
    equal(result, 'unicorns');
    end();
  });
});

test('async :: empty input', ({ equal, end }) => {
  <%= camelModuleName %>Async().catch(result => {
    equal(result instanceof TypeError, true);
    end();
  });
});

test('async :: invalid input', ({ equal, end }) => {
  <%= camelModuleName %>Async(2).catch(result => {
    equal(result instanceof TypeError, true);
    end();
  });
});
