/* eslint-disable func-names */
var R = require('ramda');

// rejectNil :: Object -> Object
var rejectNil = R.reject(R.isNil);

// isStored :: Object -> Boolean
var isStored = R.propEq('store', true);

// isList :: Object -> Boolean
var isList = R.propEq('type', 'list');

// getListDefault :: Object -> String
var getListDefault = R.converge(R.nth, [R.prop('default'), R.prop('choices')]);

// getDefault :: Object -> String
var getDefault = R.ifElse(isList, getListDefault, R.prop('default'));

// nameAndDefaultArr :: Object -> [String]
var nameAndDefaultArr = R.unapply(R.ap([R.prop('name'), getDefault]));

// storedDefaultsObj :: Object -> Object
var storedDefaultsObj = R.pipe(nameAndDefaultArr, R.unapply(R.fromPairs), rejectNil);

var reduceStoreDefaults = function (state, item) {
  if (isStored(item)) {
    return R.merge(state, storedDefaultsObj(item));
  }
  return state;
};

// getStoredDefaults :: [Object] -> Object
var storedDefaults = R.reduce(reduceStoreDefaults, {});

module.exports = {
  storedDefaults: storedDefaults,
  isList: isList,
  storedDefaultsObj: storedDefaultsObj,
  getListDefault: getListDefault,
  getDefault: getDefault,
};
