import test from "tape"
import <%= camelModuleName %> from "../"

test('<%= camelModuleName %>', (t) => {
  t.equal(true, xample(true), 'true is ok')
  t.end()
})
