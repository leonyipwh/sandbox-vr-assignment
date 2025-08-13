// Compare two arrays for strict equality (element-wise)
export const arraysEqual = (arr1, arr2) => {
  return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}