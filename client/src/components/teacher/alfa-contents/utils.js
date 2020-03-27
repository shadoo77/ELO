// Services
import {
  alfaContentTypes,
  alfaContentLevels,
  routeUrls
} from "services/config";
import { searchInTree } from "services/searchInTree";

function getCategoryDepthLevel(type) {
  return type === alfaContentTypes.FILMPJE
    ? alfaContentLevels.PAR_VID_CATEGORY
    : type === alfaContentTypes.TAALBEAT
    ? alfaContentLevels.PAR_TAALBEAT_CATEGORY
    : type === alfaContentTypes.LIEDJE
    ? alfaContentLevels.PAR_LIEDJE_CATEGORY
    : alfaContentLevels.PAR_AUDFR_CATEGORY;
}

function collectFragmentenByParagraphId(category) {
  let resArr = [];
  category.forEach(item => {
    const i = resArr.findIndex(x => x._id === item.paragraphId);
    if (i <= -1) {
      resArr.push({
        _id: item.paragraphId,
        value: item.paragrafRef,
        depthLevel: getCategoryDepthLevel(item.type),
        type: item.type,
        children: [item]
      });
    } else {
      resArr[i].children = [...resArr[i].children, item];
    }
  });
  resArr.forEach(el => (el._id = `${el._id}-${el.type}`));
  return resArr;
}

function makeTreeViewData(content) {
  const videos = content.audioFragment.filter(
    el => el.type === alfaContentTypes.FILMPJE
  );
  const taalbeats = content.audioFragment.filter(
    el => el.type === alfaContentTypes.TAALBEAT
  );
  const liedjes = content.audioFragment.filter(
    el => el.type === alfaContentTypes.LIEDJE
  );
  const audioFragmenten = content.audioFragment.filter(
    el => el.type === alfaContentTypes.AUDIO_FRAGMENT
  );
  const fragmenten = [
    {
      _id: "CONTENT_FILMPJES",
      value: "Filmpjes",
      depthLevel: alfaContentLevels.VIDEO_CATEGORY,
      children: collectFragmentenByParagraphId(videos)
    },
    {
      _id: "CONTENT_TAALBEATS",
      value: "Taalbeats",
      depthLevel: alfaContentLevels.TAALBEAT_CATEGORY,
      children: collectFragmentenByParagraphId(taalbeats)
    },
    {
      _id: "CONTENT_LIEDJES",
      value: "Liedjes",
      depthLevel: alfaContentLevels.LIEDJE_CATEGORY,
      children: collectFragmentenByParagraphId(liedjes)
    },
    {
      _id: "CONTENT_AUDIOFRAGMENTEN",
      value: "Audio fragmenten",
      depthLevel: alfaContentLevels.AUDIOFRAGMENT_CATEGORY,
      children: collectFragmentenByParagraphId(audioFragmenten)
    }
  ];
  return [...content.themes, ...fragmenten];
}

function getItemFromTree(tree, parId) {
  if (typeof tree == "object" && tree._id === parId) {
    return tree;
  }
  let result, child;
  if (tree.children) {
    for (child of tree.children) {
      result = getItemFromTree(child, parId);
      if (result) {
        return result;
      }
    }
  }
  return result;
}

function getPathOfTreeItem(tree, itemId, depthLevel) {
  const itemPath = searchInTree(tree, itemId, "path");
  let itemPathArray = itemPath && itemPath.split("#");
  if (itemPathArray && itemPathArray.length) {
    const resArr = [tree._id, ...itemPathArray];
    return [...new Set(resArr)];
  } else {
    if (
      depthLevel === alfaContentLevels.PAR_VID_CATEGORY ||
      depthLevel === alfaContentLevels.PAR_TAALBEAT_CATEGORY ||
      depthLevel === alfaContentLevels.PAR_LIEDJE_CATEGORY ||
      depthLevel === alfaContentLevels.PAR_AUDFR_CATEGORY
    ) {
      const categoryId =
        depthLevel === alfaContentLevels.PAR_VID_CATEGORY
          ? "CONTENT_FILMPJES"
          : depthLevel === alfaContentLevels.PAR_TAALBEAT_CATEGORY
          ? "CONTENT_TAALBEATS"
          : depthLevel === alfaContentLevels.PAR_LIEDJE_CATEGORY
          ? "CONTENT_LIEDJES"
          : "CONTENT_AUDIOFRAGMENTEN";
      const resArr = [tree._id, categoryId, itemId];
      return [...new Set(resArr)];
    }
  }
  const resArr = [tree._id, itemId];
  return [...new Set(resArr)];
}

function createBreadcrumbData(pathArray, tree) {
  return pathArray.map(el => {
    const item = getItemFromTree(tree, el);
    return (
      item && {
        _id: el,
        value: item.value || item.paragrafRef,
        depth: item.depthLevel,
        url: `${routeUrls.teacher.alfaContents}/branch/${el}/depthLevel/${item.depthLevel}`
      }
    );
  });
}

export {
  getCategoryDepthLevel,
  makeTreeViewData,
  getItemFromTree,
  getPathOfTreeItem,
  createBreadcrumbData
};
