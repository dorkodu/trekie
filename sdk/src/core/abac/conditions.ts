/**
 * Built-in condition factories for ABAC policy evaluation.
 *
 * These functions create reusable conditions that can be combined
 * to form complex access control rules.
 */

import type { AccessRequest, Attributes, Condition } from "./types";

/** Path to access nested attributes (e.g., "subject.attributes.role") */
type AttributePath =
  | `subject.id`
  | `subject.attributes.${string}`
  | `resource.type`
  | `resource.id`
  | `resource.attributes.${string}`
  | `action.name`
  | `action.attributes.${string}`
  | `context.attributes.${string}`;

/**
 * Gets a value from the access request using a dot-notation path.
 */
function getValueByPath(request: AccessRequest, path: AttributePath): unknown {
  const parts = path.split(".");
  let current: unknown = request;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

// ============================================================================
// Comparison Conditions
// ============================================================================

/**
 * Creates a condition that checks if an attribute equals a specific value.
 *
 * @example
 * equals("subject.attributes.role", "admin")
 */
export function equals<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, value: unknown): Condition<S, R, A, C> {
  return (request) => getValueByPath(request, path) === value;
}

/**
 * Creates a condition that checks if an attribute does not equal a value.
 *
 * @example
 * notEquals("subject.attributes.status", "suspended")
 */
export function notEquals<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, value: unknown): Condition<S, R, A, C> {
  return (request) => getValueByPath(request, path) !== value;
}

/**
 * Creates a condition that checks if an attribute is in a list of values.
 *
 * @example
 * isIn("subject.attributes.role", ["admin", "moderator"])
 */
export function isIn<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, values: unknown[]): Condition<S, R, A, C> {
  return (request) => values.includes(getValueByPath(request, path));
}

/**
 * Creates a condition that checks if an array attribute includes a value.
 *
 * @example
 * includes("subject.attributes.permissions", "write")
 */
export function includes<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, value: unknown): Condition<S, R, A, C> {
  return (request) => {
    const arr = getValueByPath(request, path);
    return Array.isArray(arr) && arr.includes(value);
  };
}

// ============================================================================
// Numeric Conditions
// ============================================================================

/**
 * Creates a condition that checks if an attribute is greater than a value.
 */
export function gt<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, value: number): Condition<S, R, A, C> {
  return (request) => {
    const v = getValueByPath(request, path);
    return typeof v === "number" && v > value;
  };
}

/**
 * Creates a condition that checks if an attribute is greater than or equal.
 */
export function gte<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, value: number): Condition<S, R, A, C> {
  return (request) => {
    const v = getValueByPath(request, path);
    return typeof v === "number" && v >= value;
  };
}

/**
 * Creates a condition that checks if an attribute is less than a value.
 */
export function lt<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, value: number): Condition<S, R, A, C> {
  return (request) => {
    const v = getValueByPath(request, path);
    return typeof v === "number" && v < value;
  };
}

/**
 * Creates a condition that checks if an attribute is less than or equal.
 */
export function lte<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, value: number): Condition<S, R, A, C> {
  return (request) => {
    const v = getValueByPath(request, path);
    return typeof v === "number" && v <= value;
  };
}

/**
 * Creates a condition that checks if an attribute is between two values (inclusive).
 */
export function between<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, min: number, max: number): Condition<S, R, A, C> {
  return (request) => {
    const v = getValueByPath(request, path);
    return typeof v === "number" && v >= min && v <= max;
  };
}

// ============================================================================
// String Conditions
// ============================================================================

/**
 * Creates a condition that checks if a string attribute matches a regex.
 *
 * @example
 * matches("resource.attributes.path", /^\/public\//)
 */
export function matches<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, pattern: RegExp): Condition<S, R, A, C> {
  return (request) => {
    const v = getValueByPath(request, path);
    return typeof v === "string" && pattern.test(v);
  };
}

/**
 * Creates a condition that checks if a string starts with a prefix.
 */
export function startsWith<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, prefix: string): Condition<S, R, A, C> {
  return (request) => {
    const v = getValueByPath(request, path);
    return typeof v === "string" && v.startsWith(prefix);
  };
}

/**
 * Creates a condition that checks if a string ends with a suffix.
 */
export function endsWith<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath, suffix: string): Condition<S, R, A, C> {
  return (request) => {
    const v = getValueByPath(request, path);
    return typeof v === "string" && v.endsWith(suffix);
  };
}

// ============================================================================
// Existence Conditions
// ============================================================================

/**
 * Creates a condition that checks if an attribute exists and is not undefined.
 */
export function exists<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath): Condition<S, R, A, C> {
  return (request) => getValueByPath(request, path) !== undefined;
}

/**
 * Creates a condition that checks if an attribute is null or undefined.
 */
export function notExists<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path: AttributePath): Condition<S, R, A, C> {
  return (request) => {
    const v = getValueByPath(request, path);
    return v === undefined || v === null;
  };
}

// ============================================================================
// Logical Combinators
// ============================================================================

/**
 * Creates a condition that is true if ALL conditions are true.
 *
 * @example
 * and(
 *   equals("subject.attributes.role", "admin"),
 *   equals("action.name", "delete")
 * )
 */
export function and<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(...conditions: Condition<S, R, A, C>[]): Condition<S, R, A, C> {
  return (request) => conditions.every((c) => c(request));
}

/**
 * Creates a condition that is true if ANY condition is true.
 *
 * @example
 * or(
 *   equals("subject.attributes.role", "admin"),
 *   equals("subject.attributes.role", "superadmin")
 * )
 */
export function or<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(...conditions: Condition<S, R, A, C>[]): Condition<S, R, A, C> {
  return (request) => conditions.some((c) => c(request));
}

/**
 * Creates a condition that negates another condition.
 *
 * @example
 * not(equals("subject.attributes.status", "banned"))
 */
export function not<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(condition: Condition<S, R, A, C>): Condition<S, R, A, C> {
  return (request) => !condition(request);
}

// ============================================================================
// Attribute-to-Attribute Conditions
// ============================================================================

/**
 * Creates a condition that compares two attribute values for equality.
 *
 * @example
 * // Check if user owns the resource
 * attributeEquals("subject.id", "resource.attributes.ownerID")
 */
export function attributeEquals<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(path1: AttributePath, path2: AttributePath): Condition<S, R, A, C> {
  return (request) => getValueByPath(request, path1) === getValueByPath(request, path2);
}

/**
 * Creates a condition that checks if an array attribute contains another attribute's value.
 *
 * @example
 * // Check if user's groups include the resource's required group
 * attributeIncludes("subject.attributes.groups", "resource.attributes.requiredGroup")
 */
export function attributeIncludes<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(arrayPath: AttributePath, valuePath: AttributePath): Condition<S, R, A, C> {
  return (request) => {
    const arr = getValueByPath(request, arrayPath);
    const val = getValueByPath(request, valuePath);
    return Array.isArray(arr) && arr.includes(val);
  };
}

// ============================================================================
// Custom Condition
// ============================================================================

/**
 * Creates a custom condition from a function.
 * Use this for complex conditions that can't be expressed with built-in helpers.
 *
 * @example
 * custom((req) => req.subject.attributes.level >= req.resource.attributes.minLevel)
 */
export function custom<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(fn: (request: AccessRequest<S, R, A, C>) => boolean): Condition<S, R, A, C> {
  return fn;
}
