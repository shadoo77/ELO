import { combineReducers } from "redux";
import treeReducer from "./tree";
import groupsReducer from "./groups";
import slideshowsReducer from "./slideshows";
import slideshowReducer from "./slideshow._";
import groupsSlideshows from "./groups.slideshows";

const rootReducer = combineReducers({
  tree: treeReducer,
  groups: groupsReducer,
  slideshows: slideshowsReducer,
  slideshow: slideshowReducer,
  groupsSlideshows: groupsSlideshows
});

export default rootReducer;
