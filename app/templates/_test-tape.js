import test from 'tape';
import <%= camelModuleName %> from './index';

test('<%= camelModuleName %>', ({ equal, end }) => {
  equal(<%= camelModuleName %>('unicorns'), 'unicorns', 'basic')
  equal(<%= camelModuleName %>(), undefined, 'invalid input');
  end();
});
