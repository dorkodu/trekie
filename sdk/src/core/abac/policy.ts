/**
 * Policy and rule builders with evaluation logic for ABAC.
 */

import {
  CombiningAlgorithm,
  Decision,
  Effect,
  type AccessRequest,
  type Attributes,
  type Condition,
  type EvaluationResult,
  type Policy,
  type Rule,
} from "./types";

// ============================================================================
// Rule Builder
// ============================================================================

interface RuleBuilder<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
> {
  /** Set the rule description */
  describe(description: string): RuleBuilder<S, R, A, C>;
  /** Set which resource types this rule applies to */
  forResourceTypes(...types: string[]): RuleBuilder<S, R, A, C>;
  /** Set which actions this rule applies to */
  forActions(...actions: string[]): RuleBuilder<S, R, A, C>;
  /** Add conditions that must all be true */
  when(...conditions: Condition<S, R, A, C>[]): RuleBuilder<S, R, A, C>;
  /** Build the rule */
  build(): Rule<S, R, A, C>;
}

/**
 * Creates a rule builder that results in PERMIT when conditions match.
 *
 * @example
 * permit("admin-access")
 *   .describe("Admins can do anything")
 *   .when(equals("subject.attributes.role", "admin"))
 *   .build()
 */
export function permit<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(id: string): RuleBuilder<S, R, A, C> {
  return createRuleBuilder<S, R, A, C>(id, Effect.PERMIT);
}

/**
 * Creates a rule builder that results in DENY when conditions match.
 *
 * @example
 * deny("banned-users")
 *   .describe("Banned users cannot access anything")
 *   .when(equals("subject.attributes.status", "banned"))
 *   .build()
 */
export function deny<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(id: string): RuleBuilder<S, R, A, C> {
  return createRuleBuilder<S, R, A, C>(id, Effect.DENY);
}

function createRuleBuilder<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(id: string, effect: Effect): RuleBuilder<S, R, A, C> {
  const rule: Rule<S, R, A, C> = {
    id,
    effect,
    conditions: [],
    target: {},
  };

  const builder: RuleBuilder<S, R, A, C> = {
    describe(description: string) {
      rule.description = description;
      return builder;
    },
    forResourceTypes(...types: string[]) {
      rule.target = rule.target ?? {};
      rule.target.resourceTypes = types;
      return builder;
    },
    forActions(...actions: string[]) {
      rule.target = rule.target ?? {};
      rule.target.actionNames = actions;
      return builder;
    },
    when(...conditions: Condition<S, R, A, C>[]) {
      rule.conditions.push(...conditions);
      return builder;
    },
    build() {
      return rule;
    },
  };

  return builder;
}

// ============================================================================
// Policy Builder
// ============================================================================

interface PolicyBuilder<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
> {
  /** Set the policy description */
  describe(description: string): PolicyBuilder<S, R, A, C>;
  /** Set which resource types this policy applies to */
  forResourceTypes(...types: string[]): PolicyBuilder<S, R, A, C>;
  /** Set which actions this policy applies to */
  forActions(...actions: string[]): PolicyBuilder<S, R, A, C>;
  /** Set the combining algorithm */
  combineWith(algorithm: CombiningAlgorithm): PolicyBuilder<S, R, A, C>;
  /** Add rules to this policy */
  addRules(...rules: Rule<S, R, A, C>[]): PolicyBuilder<S, R, A, C>;
  /** Build the policy */
  build(): Policy<S, R, A, C>;
}

/**
 * Creates a policy builder.
 *
 * @example
 * policy("document-policy")
 *   .describe("Controls access to documents")
 *   .forResourceTypes("document")
 *   .combineWith(CombiningAlgorithm.DENY_OVERRIDES)
 *   .addRules(
 *     permit("owner").when(attributeEquals("subject.id", "resource.attributes.ownerID")).build(),
 *     deny("private").when(equals("resource.attributes.isPrivate", true)).build()
 *   )
 *   .build()
 */
export function policy<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(id: string): PolicyBuilder<S, R, A, C> {
  const pol: Policy<S, R, A, C> = {
    id,
    rules: [],
    combiningAlgorithm: CombiningAlgorithm.DENY_OVERRIDES,
    target: {},
  };

  const builder: PolicyBuilder<S, R, A, C> = {
    describe(description: string) {
      pol.description = description;
      return builder;
    },
    forResourceTypes(...types: string[]) {
      pol.target = pol.target ?? {};
      pol.target.resourceTypes = types;
      return builder;
    },
    forActions(...actions: string[]) {
      pol.target = pol.target ?? {};
      pol.target.actionNames = actions;
      return builder;
    },
    combineWith(algorithm: CombiningAlgorithm) {
      pol.combiningAlgorithm = algorithm;
      return builder;
    },
    addRules(...rules: Rule<S, R, A, C>[]) {
      pol.rules.push(...rules);
      return builder;
    },
    build() {
      return pol;
    },
  };

  return builder;
}

// ============================================================================
// Evaluation Logic
// ============================================================================

/**
 * Checks if a rule's target matches the request.
 */
function matchesTarget(
  target: { resourceTypes?: string[]; actionNames?: string[] } | undefined,
  request: AccessRequest
): boolean {
  if (!target) return true;

  if (target.resourceTypes && target.resourceTypes.length > 0) {
    if (!target.resourceTypes.includes(request.resource.type)) {
      return false;
    }
  }

  if (target.actionNames && target.actionNames.length > 0) {
    if (!target.actionNames.includes(request.action.name)) {
      return false;
    }
  }

  return true;
}

/**
 * Evaluates a single rule against an access request.
 */
export function evaluateRule<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(rule: Rule<S, R, A, C>, request: AccessRequest<S, R, A, C>): Decision {
  // Check target first
  if (!matchesTarget(rule.target, request)) {
    return Decision.NOT_APPLICABLE;
  }

  // If no conditions, rule applies based on target match
  if (rule.conditions.length === 0) {
    return rule.effect === Effect.PERMIT ? Decision.ALLOW : Decision.DENY;
  }

  // All conditions must be true
  const allConditionsMet = rule.conditions.every((condition) => condition(request));

  if (allConditionsMet) {
    return rule.effect === Effect.PERMIT ? Decision.ALLOW : Decision.DENY;
  }

  return Decision.NOT_APPLICABLE;
}

/**
 * Evaluates a policy against an access request.
 */
export function evaluatePolicy<
  S extends Attributes = Attributes,
  R extends Attributes = Attributes,
  A extends Attributes = Attributes,
  C extends Attributes = Attributes,
>(pol: Policy<S, R, A, C>, request: AccessRequest<S, R, A, C>): EvaluationResult {
  // Check policy target first
  if (!matchesTarget(pol.target, request)) {
    return {
      decision: Decision.NOT_APPLICABLE,
      policyID: pol.id,
      reason: "Policy target does not match request",
    };
  }

  const ruleResults: Array<{ rule: Rule<S, R, A, C>; decision: Decision }> = [];

  for (const rule of pol.rules) {
    const decision = evaluateRule(rule, request);
    ruleResults.push({ rule, decision });
  }

  // Apply combining algorithm
  switch (pol.combiningAlgorithm) {
    case CombiningAlgorithm.PERMIT_OVERRIDES: {
      // First PERMIT wins
      for (const { rule, decision } of ruleResults) {
        if (decision === Decision.ALLOW) {
          return {
            decision: Decision.ALLOW,
            policyID: pol.id,
            ruleID: rule.id,
            reason: rule.description ?? `Rule ${rule.id} permitted access`,
          };
        }
      }
      // If any DENY, return DENY
      for (const { rule, decision } of ruleResults) {
        if (decision === Decision.DENY) {
          return {
            decision: Decision.DENY,
            policyID: pol.id,
            ruleID: rule.id,
            reason: rule.description ?? `Rule ${rule.id} denied access`,
          };
        }
      }
      break;
    }

    case CombiningAlgorithm.DENY_OVERRIDES: {
      // First DENY wins
      for (const { rule, decision } of ruleResults) {
        if (decision === Decision.DENY) {
          return {
            decision: Decision.DENY,
            policyID: pol.id,
            ruleID: rule.id,
            reason: rule.description ?? `Rule ${rule.id} denied access`,
          };
        }
      }
      // If any PERMIT, return PERMIT
      for (const { rule, decision } of ruleResults) {
        if (decision === Decision.ALLOW) {
          return {
            decision: Decision.ALLOW,
            policyID: pol.id,
            ruleID: rule.id,
            reason: rule.description ?? `Rule ${rule.id} permitted access`,
          };
        }
      }
      break;
    }

    case CombiningAlgorithm.FIRST_APPLICABLE: {
      // First applicable rule wins
      for (const { rule, decision } of ruleResults) {
        if (decision !== Decision.NOT_APPLICABLE) {
          return {
            decision,
            policyID: pol.id,
            ruleID: rule.id,
            reason: rule.description ?? `Rule ${rule.id} was first applicable`,
          };
        }
      }
      break;
    }
  }

  return {
    decision: Decision.NOT_APPLICABLE,
    policyID: pol.id,
    reason: "No applicable rules found",
  };
}
