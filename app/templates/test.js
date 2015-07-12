import { equal } from 'assert';
import <%= camelModuleName %> from './';

it('should <%= camelModuleName %>', () => {
  equal(<%= camelModuleName %>('unicorns'), 'unicorns');
});
