/**
 * Main ABAC enforcer for access control decisions.
 */

import { evaluatePolicy } from "./policy";
import {
  CombiningAlgorithm,
  Decision,
  type AccessRequest,
  type Attributes,
  type EvaluationResult,
  type Policy,
} from "./types";

/** Configuration for creating an ABAC instance */
export interface ABACConfig<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
> {
  /** Policies to use for access control */
  policies: Policy<S, R, A, C>[];
  /** Algorithm for combining policy decisions (default: DENY_OVERRIDES) */
  combiningAlgorithm?: CombiningAlgorithm;
  /** Default decision when no policies apply (default: DENY) */
  defaultDecision?: Decision;
}

/** ABAC instance for making access control decisions */
export interface ABAC<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
> {
  /** Check if the access request is allowed */
  isAllowed(request: AccessRequest<S, R, A, C>): boolean;
  /** Get the full evaluation result with decision details */
  evaluate(request: AccessRequest<S, R, A, C>): EvaluationResult;
  /** Add policies at runtime */
  addPolicies(...policies: Policy<S, R, A, C>[]): void;
  /** Remove a policy by ID */
  removePolicy(policyID: string): boolean;
  /** Get all registered policies */
  getPolicies(): Policy<S, R, A, C>[];
}

/**
 * Creates an ABAC instance for access control decisions.
 *
 * @example
 * const abac = createABAC({
 *   policies: [documentPolicy, projectPolicy],
 *   combiningAlgorithm: CombiningAlgorithm.DENY_OVERRIDES,
 *   defaultDecision: Decision.DENY
 * });
 *
 * if (abac.isAllowed({ subject, resource, action })) {
 *   // Access granted
 * }
 */
export function createABAC<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(config: ABACConfig<S, R, A, C>): ABAC<S, R, A, C> {
  const policies = [...config.policies];
  const combiningAlgorithm = config.combiningAlgorithm ?? CombiningAlgorithm.DENY_OVERRIDES;
  const defaultDecision = config.defaultDecision ?? Decision.DENY;

  function evaluate(request: AccessRequest<S, R, A, C>): EvaluationResult {
    const policyResults: Array<{ policy: Policy<S, R, A, C>; result: EvaluationResult }> = [];

    for (const pol of policies) {
      const result = evaluatePolicy(pol, request);
      policyResults.push({ policy: pol, result });
    }

    // Apply combining algorithm across policies
    switch (combiningAlgorithm) {
      case CombiningAlgorithm.PERMIT_OVERRIDES: {
        for (const { result } of policyResults) {
          if (result.decision === Decision.ALLOW) {
            return result;
          }
        }
        for (const { result } of policyResults) {
          if (result.decision === Decision.DENY) {
            return result;
          }
        }
        break;
      }

      case CombiningAlgorithm.DENY_OVERRIDES: {
        for (const { result } of policyResults) {
          if (result.decision === Decision.DENY) {
            return result;
          }
        }
        for (const { result } of policyResults) {
          if (result.decision === Decision.ALLOW) {
            return result;
          }
        }
        break;
      }

      case CombiningAlgorithm.FIRST_APPLICABLE: {
        for (const { result } of policyResults) {
          if (result.decision !== Decision.NOT_APPLICABLE) {
            return result;
          }
        }
        break;
      }
    }

    return {
      decision: defaultDecision,
      reason: "No applicable policies found",
    };
  }

  function isAllowed(request: AccessRequest<S, R, A, C>): boolean {
    return evaluate(request).decision === Decision.ALLOW;
  }

  function addPolicies(...newPolicies: Policy<S, R, A, C>[]): void {
    policies.push(...newPolicies);
  }

  function removePolicy(policyID: string): boolean {
    const index = policies.findIndex((p) => p.id === policyID);
    if (index !== -1) {
      policies.splice(index, 1);
      return true;
    }
    return false;
  }

  function getPolicies(): Policy<S, R, A, C>[] {
    return [...policies];
  }

  return {
    isAllowed,
    evaluate,
    addPolicies,
    removePolicy,
    getPolicies,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates an access request object.
 * Convenience function for building access requests.
 */
export function request<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(
  subject: { id: string; attributes: S },
  resource: { type: string; id: string; attributes: R },
  action: { name: string; attributes?: A },
  context?: { attributes: C }
): AccessRequest<S, R, A, C> {
  return { subject, resource, action, context };
}
