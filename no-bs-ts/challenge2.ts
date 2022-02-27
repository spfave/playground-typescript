// Typesafe forEach, map, & filter using reduce

// forEach
function reduceForEach<T>(array: T[], callback: (value: T) => void): void {
  array.reduce((aVal, cVal) => {
    callback(cVal);
    return null;
  }, null);
}

reduceForEach(['a', 'b', 'd'], (v) => console.log(v.toUpperCase()));

// filter
function reduceFilter<T>(array: T[], callback: (value: T) => boolean): T[] {
  const newArray: T[] = [];
  return array.reduce(
    (aVal, cVal) => (callback(cVal) ? [...aVal, cVal] : aVal),
    newArray
  );
}

console.log(reduceFilter([-25, -7, 7, 364], (v) => v >= 0));

// map
function reduceMap<T, K>(array: T[], callback: (value: T) => K): K[] {
  const newArray: K[] = [];
  return array.reduce((aVal, cVal) => [...aVal, callback(cVal)], newArray);
}

console.log(reduceMap([1, 4, 9, 16], (v) => Math.sqrt(v).toString()));
