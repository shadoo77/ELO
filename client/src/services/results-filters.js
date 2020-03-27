function searchFilter(data, searchValue, filteredKey) {
  const lowercasedFilter = searchValue.toLowerCase();
  return data.filter(item => {
    return Object.keys(item).some(
      key =>
        key === filteredKey &&
        item["isActive"] &&
        item[key].toLowerCase().includes(lowercasedFilter)
    );
  });
}

function searchByGroupName(data, searchValue, activeState) {
  const lowercasedFilter = searchValue.toLowerCase();
  return data.filter(item => {
    return Object.keys(item).some(
      key =>
        item["isActive"] === activeState &&
        item["name"].toLowerCase().includes(lowercasedFilter)
    );
  });
}

function searchAndFilter(data, searchValue, activeState, selectedKey) {
  const lowercasedFilter = searchValue.toLowerCase();
  return data.filter(item => {
    return Object.keys(item).some(
      key =>
        item[selectedKey] === activeState &&
        item["name"].toLowerCase().includes(lowercasedFilter)
    );
  });
}

function searchFilterResource(data, searchPath, searchKey, searchValue) {
  const lowercasedFilter = searchValue.toLowerCase();
  return data.filter(item => {
    return Object.keys(item[searchPath]).some(key => {
      return item[searchPath][searchKey]
        .toLowerCase()
        .includes(lowercasedFilter);
    });
  });
}

export {
  searchFilter,
  searchByGroupName,
  searchAndFilter,
  searchFilterResource
};
