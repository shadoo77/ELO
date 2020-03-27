import { combineReducers } from "redux";
import slideshowFetchReducer from "./slideshow.fetch";
import slideshowNavigateReducer from "./slideshow.navigate";
import slideshowInteractionsReducer from "./slideshow.save";

const slideshowReducer = combineReducers({
  data: slideshowFetchReducer,
  active: slideshowNavigateReducer,
  save: slideshowInteractionsReducer
});

export default slideshowReducer;
