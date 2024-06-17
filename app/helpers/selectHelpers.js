export function getEmptyOrValue(item) {
  return item === "all" ? "" : item;
}

export function getEmptyOrValueForAvailability(item) {
  if (item === "all") return "";
  else if (item === "available") return true;
  return false;
}
