/**
 * Core type definitions for Attribute-Based Access Control (ABAC).
 *
 * ABAC enables fine-grained access control by evaluating attributes of:
 * - Subjects (who is requesting access)
 * - Resources (what is being accessed)
 * - Actions (what operation is being performed)
 * - Context (environmental conditions)
 */

/** Record of attribute key-value pairs */
export type Attributes = Record<string, unknown>;

/** Entity requesting access (user, service, system, etc.) */
export interface Subject<T extends Attributes = Attributes> {
  /** Unique identifier for the subject */
  id: string;
  /** Subject attributes used in policy evaluation */
  attributes: T;
}

/** Target of the access request */
export interface Resource<T extends Attributes = Attributes> {
  /** Resource type identifier (e.g., "document", "project", "task") */
  type: string;
  /** Unique identifier for the resource */
  id: string;
  /** Resource attributes used in policy evaluation */
  attributes: T;
}

/** Operation being performed on a resource */
export interface Action<T extends Attributes = Attributes> {
  /** Action name (e.g., "read", "write", "delete", "share") */
  name: string;
  /** Optional action attributes */
  attributes?: T;
}

/** Environmental and contextual attributes */
export interface Context<T extends Attributes = Attributes> {
  /** Context attributes (time, location, device, etc.) */
  attributes: T;
}

/** Complete access request combining subject, resource, action, and context */
export interface AccessRequest<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
> {
  subject: Subject<S>;
  resource: Resource<R>;
  action: Action<A>;
  context?: Context<C>;
}

/** Access decision result */
export enum Decision {
  /** Access is explicitly allowed */
  ALLOW = "ALLOW",
  /** Access is explicitly denied */
  DENY = "DENY",
  /** No applicable policy found */
  NOT_APPLICABLE = "NOT_APPLICABLE",
}

/** Effect of a rule when conditions are met */
export enum Effect {
  PERMIT = "PERMIT",
  DENY = "DENY",
}

/** Result of policy evaluation */
export interface EvaluationResult {
  decision: Decision;
  /** Name of the policy that made the decision */
  policyID?: string;
  /** Name of the rule that made the decision */
  ruleID?: string;
  /** Reason for the decision */
  reason?: string;
}

/**
 * Condition function that evaluates an access request.
 * Returns true if the condition is satisfied, false otherwise.
 */
export type Condition<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
> = (request: AccessRequest<S, R, A, C>) => boolean;

/** Rule definition with effect and conditions */
export interface Rule<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
> {
  /** Unique identifier for the rule */
  id: string;
  /** Human-readable description */
  description?: string;
  /** Effect when all conditions are satisfied */
  effect: Effect;
  /** Conditions that must all be true for the rule to apply */
  conditions: Condition<S, R, A, C>[];
  /** Optional target constraint for quick filtering */
  target?: {
    resourceTypes?: string[];
    actionNames?: string[];
  };
}

/** Algorithm for combining multiple rule/policy decisions */
export enum CombiningAlgorithm {
  /** First PERMIT wins */
  PERMIT_OVERRIDES = "PERMIT_OVERRIDES",
  /** First DENY wins */
  DENY_OVERRIDES = "DENY_OVERRIDES",
  /** First applicable rule/policy wins */
  FIRST_APPLICABLE = "FIRST_APPLICABLE",
}

/** Policy definition containing rules */
export interface Policy<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
> {
  /** Unique identifier for the policy */
  id: string;
  /** Human-readable description */
  description?: string;
  /** Rules in this policy */
  rules: Rule<S, R, A, C>[];
  /** Algorithm for combining rule decisions */
  combiningAlgorithm: CombiningAlgorithm;
  /** Optional target constraint for quick filtering */
  target?: {
    resourceTypes?: string[];
    actionNames?: string[];
  };
}
