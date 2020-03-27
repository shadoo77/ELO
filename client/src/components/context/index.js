import React, { createContext, useReducer } from "react";
import rootReducers from "./reducers/root";

const RootContext = createContext();

const initialAccountsState = {
  hasFailed: false,
  isLoading: false,
  accounts: [],
  errormessage: ""
};

const initialGroupsState = {
  hasFailed: false,
  isLoading: false,
  groups: [],
  errormessage: ""
};

const initState = {
  accounts: initialAccountsState,
  groups: initialGroupsState
};

const RootContextProvider = props => {
  const [state, dispatch] = useReducer(rootReducers, initState);
  return (
    <RootContext.Provider value={{ state, dispatch }}>
      {props.children}
    </RootContext.Provider>
  );
};

export { RootContext, RootContextProvider };
