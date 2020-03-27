import accountsReducer from "./accountsReducer";
import groupsReducer from "./groupsReducer";

const combineReducers = reducers => {
  return (state = {}, action) => {
    const keys = Object.keys(reducers);
    const nextReducers = {};
    for (const key of keys) {
      const invoke = reducers[key](state[key], action);
      nextReducers[key] = invoke;
    }
    return nextReducers;
  };
};

const rootReducer = combineReducers({
  groups: groupsReducer,
  accounts: accountsReducer
});

export default rootReducer;
