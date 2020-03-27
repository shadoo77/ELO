export const getContentByType = (items, type) => {
  const result = items.find(item => item.type === type);
  if (typeof result === "undefined") {
    throw Error(
      "No content could be found that matches criteria!"
    );
  }
  return result;
};
