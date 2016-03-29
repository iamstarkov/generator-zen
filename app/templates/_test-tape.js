import test from 'tape';
import j from './index';

test('j', ({ equal, throws, end }) => {
  equal(j('unicorns'), 'unicorns', 'basic')

  throws(() => { j(); }, TypeError, 'empty input');
  throws(() => { j(2); }, TypeError, 'invalid input');
  end();
});
