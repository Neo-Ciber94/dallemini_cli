/**
 * Merge two objects preferring the non-null properties.
 * @param left The left object.
 * @param right The right object.
 * @returns A new object with the properties from the left and right objects.
 */
export function merge<T extends object>(left: T, right: T): T {
  const obj: any = {};

  for (const [key, value] of Object.entries(left)) {
    if (value != null) {
      obj[key] = value;
    }
  }

  for (const [key, value] of Object.entries(right)) {
    if (value != null) {
      obj[key] = value;
    }
  }

  return obj;
}
