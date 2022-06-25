/**
 * Merge two objects preferring the non-null properties.
 * @param left The left object.
 * @param right The right object.
 * @returns A new object with the properties from the left and right objects.
 */
// deno-lint-ignore ban-types
export function merge<T extends object>(left: T, right: T): T {
  const obj: Record<string, unknown> = {};

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

  return obj as T;
}
