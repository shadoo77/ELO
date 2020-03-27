import { backendService } from "./backend";
// Recusive search in the tree and find the path or the value of an item
function searchInTree(tree, id, option) {
  if (typeof tree == "object" && tree._id === id) {
    return option === "path"
      ? tree.path
      : option === "value"
      ? tree.value
      : option === "depthLevel"
      ? tree.__t
      : option === "parent"
      ? tree.parent
      : option === "bridge"
      ? tree.bridgeId
      : null;
  }
  let result, child;
  if (tree.children) {
    for (child of tree.children) {
      result = searchInTree(child, id, option);
      if (result) {
        return result;
      }
    }
  }
  return result;
}

// Insert in a tree
function insertInTree(tree, newItem) {
  if (typeof tree == "object" && tree._id === newItem.parent) {
    tree.children.push(newItem);
    return tree;
  }
  let result, child;
  if (tree.children) {
    for (child of tree.children) {
      result = searchInTree(child, newItem);
      if (result) {
        return result;
      }
    }
  }
  return result;
}

// Delete from tree
function deleteFromTree(tree, itemId, parentId) {
  if (typeof tree == "object" && tree._id === parentId) {
    const removeIndex = tree.children
      .map(el => el._id.toString())
      .indexOf(itemId);
    tree.children.splice(removeIndex, 1);
    return tree;
  }
  let result, child;
  if (tree.children) {
    for (child of tree.children) {
      result = deleteFromTree(child, itemId, parentId);
      if (result) {
        return result;
      }
    }
  }
  return result;
}

// Update element in a tree updateTree
function updateInTree(tree, id, parentId, item) {
  if (typeof tree == "object" && tree._id === parentId) {
    const updateIndex = tree.children.map(el => el._id.toString()).indexOf(id);
    tree.children.splice(updateIndex, 1, item);
    return tree;
  }
  let result, child;
  if (tree.children) {
    for (child of tree.children) {
      result = searchInTree(child, id, item);
      if (result) {
        return result;
      }
    }
  }
  return result;
}

// function getArrayOfPath(data, id) {
//   const fullPath = searchInTree(data, id, "path") || "";
//   return fullPath.split("#");
// }

async function getArrayOfPath(data, id) {
  let fullPath = searchInTree(data, id, "path") || "";
  if (!fullPath) {
    const slideshows = await backendService.getSlideshows();
    let entryPoint = "";
    slideshows.forEach(sl => {
      if (sl._id === id) entryPoint = sl.entrypoint._id;
    });
    fullPath = searchInTree(data, entryPoint, "path") || "";
  }
  return fullPath.split("#");
}

async function getBreadCrumbsValues(data, id) {
  const fullPath = await getArrayOfPath(data || {}, id);
  const valuesArr = fullPath.map(e => {
    return {
      id: e,
      value: searchInTree(data || {}, e, "value")
    };
  });
  return valuesArr.filter(el => el.value !== undefined);
}

// Get children of a specifiec item
function getChildrenOfItem(tree, id) {
  if (typeof tree == "object" && tree._id === id) {
    if (tree.children && tree.children.length) {
      return tree.children.map(el => {
        // return { id: el._id, value: el.value, depthLevel: el.depthLevel };
        return el;
      });
    } else return null;
  }
  let result, child;
  if (tree.children) {
    for (child of tree.children) {
      result = getChildrenOfItem(child, id);
      if (result) {
        return result;
      }
    }
  }
  return result;
}

// Get the last child of a tree basic on token ID which means by our data (Paragraf)
function getLastNodeOfTree(tree, id) {
  const depthLevel = searchInTree(tree, id, "depthLevel");
  if (depthLevel === "paragraf") {
    return [id];
  } else if (depthLevel === "thema") {
    const paragraphs = getChildrenOfItem(tree, id);
    return paragraphs && paragraphs.length ? paragraphs.map(el => el.id) : [];
  } else if (depthLevel === "publication") {
    const themas = getChildrenOfItem(tree, id);
    let result = [];
    themas &&
      themas.length &&
      themas.forEach(thema => {
        const temp = getChildrenOfItem(tree, thema.id);
        const parafs = temp && temp.length ? temp.map(el => el.id) : [];
        result = [...result, ...parafs];
      });
    return result;
  }
  return [];
}

export {
  searchInTree,
  insertInTree,
  deleteFromTree,
  updateInTree,
  getArrayOfPath,
  getBreadCrumbsValues,
  getChildrenOfItem,
  getLastNodeOfTree
};
