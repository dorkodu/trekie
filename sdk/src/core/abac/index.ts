/**
 * Attribute-Based Access Control (ABAC) Library
 *
 * A zero-dependency TypeScript library for fine-grained access control
 * based on attributes of subjects, resources, actions, and context.
 *
 * @example
 * import { createABAC, policy, permit, deny, equals, attributeEquals } from "./abac";
 *
 * // Define a policy
 * const documentPolicy = policy("document-access")
 *   .forResourceTypes("document")
 *   .combineWith(CombiningAlgorithm.DENY_OVERRIDES)
 *   .addRules(
 *     permit("owner-access")
 *       .when(attributeEquals("subject.id", "resource.attributes.ownerID"))
 *       .build(),
 *     permit("admin-access")
 *       .when(equals("subject.attributes.role", "admin"))
 *       .build(),
 *     deny("private-docs")
 *       .when(equals("resource.attributes.isPrivate", true))
 *       .build()
 *   )
 *   .build();
 *
 * // Create ABAC instance
 * const abac = createABAC({ policies: [documentPolicy] });
 *
 * // Check access
 * const allowed = abac.isAllowed({
 *   subject: { id: "user-1", attributes: { role: "admin" } },
 *   resource: { type: "document", id: "doc-1", attributes: { ownerID: "user-2" } },
 *   action: { name: "read" }
 * });
 */

// Types
export {
  CombiningAlgorithm,
  Decision,
  Effect, type AccessRequest,
  type Action,
  type Attributes,
  type Condition,
  type Context,
  type EvaluationResult,
  type Policy,
  type Resource,
  type Rule,
  type Subject
} from "./types";

// Conditions
export {
  and,
  attributeEquals,
  attributeIncludes,
  between,
  custom,
  endsWith,
  equals,
  exists,
  gt,
  gte,
  includes,
  isIn,
  lt,
  lte,
  matches,
  not,
  notEquals,
  notExists,
  or,
  startsWith
} from "./conditions";

// Policy builders
export { deny, evaluatePolicy, evaluateRule, permit, policy } from "./policy";

// ABAC enforcer
export { createABAC, request, type ABAC, type ABACConfig } from "./abac";
