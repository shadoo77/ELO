// Searches items tree for object with specified prop with value
// @param {object} tree nodes tree with children items in nodesProp[] table, with one (object) or many (array of objects) roots
// @param {string} propNodes name of prop that holds child nodes array
// @param {string} prop name of searched node's prop
// @param {mixed} value value of searched node's  prop
// @returns {object/null} returns first object that match supplied arguments (prop: value) or null if no matching object was found
function searchTree(tree, nodesProp, prop, value) {
  let i = null; // iterator
  let f = null; // found node
  if (Array.isArray(tree)) {
    // if entry object is array objects, check each object
    for (i = 0; i < tree.length; i++) {
      f = searchTree(tree[i], nodesProp, prop, value);
      if (f) {
        // if found matching object, return it.
        return f;
      }
    }
  } else if (typeof tree === "object") {
    // standard tree node (one root)
    if (tree[prop] !== undefined && tree[prop] === value) {
      return tree; // found matching node
    }
  }
  if (
    tree[nodesProp] !== undefined &&
    tree[nodesProp].length > 0
  ) {
    // if this is not maching node, search nodes, children
    // (if prop exist and it is not empty)
    return searchTree(
      tree[nodesProp],
      nodesProp,
      prop,
      value
    );
  } else {
    return null; // node does not match and it neither have children
  }
}

/**searchs through all arrays of the tree if the for a value from a property
 * @param aTree : the tree array
 * @param fCompair : This function will receive each node. It's upon you to define which 
                     condition is necessary for the match. It must return true if the condition is matched. Example:
                        function(oNode){ if(oNode["Name"] === "AA") return true; }
 * @param bGreedy? : use true to do not stop after the first match, default is false
 * @return an array with references to the nodes for which fCompair was true; In case no node was found an empty array
 *         will be returned
*/
function searchTree2(aTree, fCompair, bGreedy) {
  var aInnerTree = []; // will contain the inner children
  var oNode; // always the current node
  var aReturnNodes = []; // the nodes array which will returned

  // 1. loop through all root nodes so we don't touch the tree structure
  for (let keysTree in aTree) {
    aInnerTree.push(aTree[keysTree]);
  }
  while (aInnerTree.length > 0) {
    oNode = aInnerTree.pop();
    // check current node
    if (fCompair(oNode)) {
      aReturnNodes.push(oNode);
      if (!bGreedy) {
        return aReturnNodes;
      }
    } else {
      // if (node.children && node.children.length) {
      // find other objects, 1. check all properties of the node if they are arrays
      for (let keysNode in oNode) {
        // true if the property is an array
        if (oNode[keysNode] instanceof Array) {
          // 2. push all array object to aInnerTree to search in those later
          for (var i = 0; i < oNode[keysNode].length; i++) {
            aInnerTree.push(oNode[keysNode][i]);
          }
        }
      }
    }
  }
  return aReturnNodes; // someone was greedy
}

function findNode(tree, id) {
  return searchTree(tree, "children", "parent", id);
}

function findChildrenOf(tree, id) {
  const nodes = searchTree2(
    tree,
    function(oNode) {
      if (oNode["parent"] === id) return true;
    },
    true
  );
  if (nodes) {
    return nodes;
  }
  return null;
}

export { searchTree, findNode, findChildrenOf };
