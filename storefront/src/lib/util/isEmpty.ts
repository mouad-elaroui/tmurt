// Kan-checkiw wach l-input howa object
export const isObject = (input: unknown): input is object => input instanceof Object

// Kan-checkiw wach l-input howa array
export const isArray = (input: unknown): input is unknown[] => Array.isArray(input)

// Kan-checkiw wach l-input khawi
export const isEmpty = (input: unknown): boolean => {
  return (
    input === null ||
    input === undefined ||
    (isObject(input) && Object.keys(input).length === 0) ||
    (isArray(input) && input.length === 0) ||
    (typeof input === "string" && input.trim().length === 0)
  )
}
