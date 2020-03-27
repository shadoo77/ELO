import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers/_root";
// Middleware
import thunk from "redux-thunk";
//import logger from "redux-logger";

const middlewares = process.env.NODE_ENV !== "production" ? [thunk] : [thunk];

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middlewares)
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
