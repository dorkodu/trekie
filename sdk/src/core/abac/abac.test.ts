import { describe, expect, it } from "bun:test";
import {
  and,
  attributeEquals,
  attributeIncludes,
  between,
  CombiningAlgorithm,
  createABAC,
  custom,
  Decision,
  deny,
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
  permit,
  policy,
  request,
  startsWith,
} from "./index";

// ============================================================================
// Condition Tests
// ============================================================================

describe("ABAC Conditions", () => {
  const baseRequest = request(
    { id: "user-1", attributes: { role: "admin", level: 5, permissions: ["read", "write"] } },
    { type: "document", id: "doc-1", attributes: { ownerID: "user-1", isPrivate: false } },
    { name: "read" }
  );

  describe("equals", () => {
    it("returns true for matching values", () => {
      expect(equals("subject.attributes.role", "admin")(baseRequest)).toBe(true);
    });

    it("returns false for non-matching values", () => {
      expect(equals("subject.attributes.role", "user")(baseRequest)).toBe(false);
    });

    it("works with nested paths", () => {
      expect(equals("resource.attributes.ownerID", "user-1")(baseRequest)).toBe(true);
    });
  });

  describe("notEquals", () => {
    it("returns true for non-matching values", () => {
      expect(notEquals("subject.attributes.role", "user")(baseRequest)).toBe(true);
    });

    it("returns false for matching values", () => {
      expect(notEquals("subject.attributes.role", "admin")(baseRequest)).toBe(false);
    });
  });

  describe("isIn", () => {
    it("returns true when value is in list", () => {
      expect(isIn("subject.attributes.role", ["admin", "moderator"])(baseRequest)).toBe(true);
    });

    it("returns false when value is not in list", () => {
      expect(isIn("subject.attributes.role", ["user", "guest"])(baseRequest)).toBe(false);
    });
  });

  describe("includes", () => {
    it("returns true when array includes value", () => {
      expect(includes("subject.attributes.permissions", "read")(baseRequest)).toBe(true);
    });

    it("returns false when array does not include value", () => {
      expect(includes("subject.attributes.permissions", "delete")(baseRequest)).toBe(false);
    });
  });

  describe("numeric comparisons", () => {
    it("gt returns true when value is greater", () => {
      expect(gt("subject.attributes.level", 3)(baseRequest)).toBe(true);
    });

    it("gt returns false when value is not greater", () => {
      expect(gt("subject.attributes.level", 5)(baseRequest)).toBe(false);
    });

    it("gte returns true when value is greater or equal", () => {
      expect(gte("subject.attributes.level", 5)(baseRequest)).toBe(true);
    });

    it("lt returns true when value is less", () => {
      expect(lt("subject.attributes.level", 10)(baseRequest)).toBe(true);
    });

    it("lte returns true when value is less or equal", () => {
      expect(lte("subject.attributes.level", 5)(baseRequest)).toBe(true);
    });

    it("between returns true when value is in range", () => {
      expect(between("subject.attributes.level", 1, 10)(baseRequest)).toBe(true);
    });

    it("between returns false when value is out of range", () => {
      expect(between("subject.attributes.level", 6, 10)(baseRequest)).toBe(false);
    });
  });

  describe("string conditions", () => {
    const reqWithPath = request(
      { id: "user-1", attributes: { email: "admin@example.com" } },
      { type: "file", id: "f1", attributes: { path: "/public/images/logo.png" } },
      { name: "read" }
    );

    it("matches returns true when regex matches", () => {
      expect(matches("resource.attributes.path", /^\/public\//)(reqWithPath)).toBe(true);
    });

    it("matches returns false when regex does not match", () => {
      expect(matches("resource.attributes.path", /^\/private\//)(reqWithPath)).toBe(false);
    });

    it("startsWith works correctly", () => {
      expect(startsWith("resource.attributes.path", "/public")(reqWithPath)).toBe(true);
      expect(startsWith("resource.attributes.path", "/private")(reqWithPath)).toBe(false);
    });
  });

  describe("existence conditions", () => {
    it("exists returns true when attribute exists", () => {
      expect(exists("subject.attributes.role")(baseRequest)).toBe(true);
    });

    it("exists returns false when attribute does not exist", () => {
      expect(exists("subject.attributes.nonexistent")(baseRequest)).toBe(false);
    });

    it("notExists returns true when attribute does not exist", () => {
      expect(notExists("subject.attributes.nonexistent")(baseRequest)).toBe(true);
    });
  });

  describe("logical combinators", () => {
    it("and returns true when all conditions are true", () => {
      const condition = and(
        equals("subject.attributes.role", "admin"),
        equals("action.name", "read")
      );
      expect(condition(baseRequest)).toBe(true);
    });

    it("and returns false when any condition is false", () => {
      const condition = and(
        equals("subject.attributes.role", "admin"),
        equals("action.name", "delete")
      );
      expect(condition(baseRequest)).toBe(false);
    });

    it("or returns true when any condition is true", () => {
      const condition = or(
        equals("subject.attributes.role", "user"),
        equals("action.name", "read")
      );
      expect(condition(baseRequest)).toBe(true);
    });

    it("or returns false when all conditions are false", () => {
      const condition = or(
        equals("subject.attributes.role", "user"),
        equals("action.name", "delete")
      );
      expect(condition(baseRequest)).toBe(false);
    });

    it("not negates a condition", () => {
      expect(not(equals("subject.attributes.role", "user"))(baseRequest)).toBe(true);
      expect(not(equals("subject.attributes.role", "admin"))(baseRequest)).toBe(false);
    });
  });

  describe("attribute-to-attribute conditions", () => {
    it("attributeEquals compares two attributes", () => {
      expect(attributeEquals("subject.id", "resource.attributes.ownerID")(baseRequest)).toBe(true);
    });

    it("attributeIncludes checks if array contains other attribute", () => {
      const req = request(
        { id: "u1", attributes: { groups: ["engineering", "design"] } },
        { type: "project", id: "p1", attributes: { requiredGroup: "engineering" } },
        { name: "view" }
      );
      expect(attributeIncludes("subject.attributes.groups", "resource.attributes.requiredGroup")(req)).toBe(true);
    });
  });

  describe("custom condition", () => {
    it("allows custom logic", () => {
      const condition = custom((req) => {
        const level = req.subject.attributes.level as number;
        return level >= 5;
      });
      expect(condition(baseRequest)).toBe(true);
    });
  });
});

// ============================================================================
// Policy Tests
// ============================================================================

describe("ABAC Policy", () => {
  describe("rule targeting", () => {
    it("rule with forResourceTypes only matches specified types", () => {
      const docPolicy = policy("doc-policy")
        .addRules(
          permit("allow-all")
            .forResourceTypes("document")
            .build()
        )
        .build();

      const abac = createABAC({ policies: [docPolicy] });

      const docRequest = request(
        { id: "u1", attributes: {} },
        { type: "document", id: "d1", attributes: {} },
        { name: "read" }
      );
      const fileRequest = request(
        { id: "u1", attributes: {} },
        { type: "file", id: "f1", attributes: {} },
        { name: "read" }
      );

      expect(abac.isAllowed(docRequest)).toBe(true);
      expect(abac.isAllowed(fileRequest)).toBe(false);
    });

    it("rule with forActions only matches specified actions", () => {
      const readPolicy = policy("read-policy")
        .addRules(
          permit("allow-read")
            .forActions("read", "list")
            .build()
        )
        .build();

      const abac = createABAC({ policies: [readPolicy] });

      const readReq = request(
        { id: "u1", attributes: {} },
        { type: "doc", id: "d1", attributes: {} },
        { name: "read" }
      );
      const writeReq = request(
        { id: "u1", attributes: {} },
        { type: "doc", id: "d1", attributes: {} },
        { name: "write" }
      );

      expect(abac.isAllowed(readReq)).toBe(true);
      expect(abac.isAllowed(writeReq)).toBe(false);
    });
  });

  describe("combining algorithms", () => {
    it("DENY_OVERRIDES: deny wins over permit", () => {
      const pol = policy("test")
        .combineWith(CombiningAlgorithm.DENY_OVERRIDES)
        .addRules(
          permit("allow").when(equals("subject.id", "user-1")).build(),
          deny("block").when(equals("resource.attributes.blocked", true)).build()
        )
        .build();

      const abac = createABAC({ policies: [pol] });

      const req = request(
        { id: "user-1", attributes: {} },
        { type: "doc", id: "d1", attributes: { blocked: true } },
        { name: "read" }
      );

      expect(abac.evaluate(req).decision).toBe(Decision.DENY);
    });

    it("PERMIT_OVERRIDES: permit wins over deny", () => {
      const pol = policy("test")
        .combineWith(CombiningAlgorithm.PERMIT_OVERRIDES)
        .addRules(
          deny("block").when(equals("resource.attributes.restricted", true)).build(),
          permit("admin").when(equals("subject.attributes.role", "admin")).build()
        )
        .build();

      const abac = createABAC({ policies: [pol] });

      const req = request(
        { id: "user-1", attributes: { role: "admin" } },
        { type: "doc", id: "d1", attributes: { restricted: true } },
        { name: "read" }
      );

      expect(abac.evaluate(req).decision).toBe(Decision.ALLOW);
    });

    it("FIRST_APPLICABLE: first matching rule wins", () => {
      const pol = policy("test")
        .combineWith(CombiningAlgorithm.FIRST_APPLICABLE)
        .addRules(
          deny("deny-first").when(equals("action.name", "read")).build(),
          permit("allow-second").build()
        )
        .build();

      const abac = createABAC({ policies: [pol] });

      const readReq = request(
        { id: "u1", attributes: {} },
        { type: "doc", id: "d1", attributes: {} },
        { name: "read" }
      );
      const writeReq = request(
        { id: "u1", attributes: {} },
        { type: "doc", id: "d1", attributes: {} },
        { name: "write" }
      );

      expect(abac.evaluate(readReq).decision).toBe(Decision.DENY);
      expect(abac.evaluate(writeReq).decision).toBe(Decision.ALLOW);
    });
  });
});

// ============================================================================
// ABAC Instance Tests
// ============================================================================

describe("ABAC Instance", () => {
  it("isAllowed returns boolean", () => {
    const pol = policy("simple")
      .addRules(permit("allow-all").build())
      .build();

    const abac = createABAC({ policies: [pol] });
    const req = request(
      { id: "u1", attributes: {} },
      { type: "doc", id: "d1", attributes: {} },
      { name: "read" }
    );

    expect(abac.isAllowed(req)).toBe(true);
  });

  it("evaluate returns full result", () => {
    const pol = policy("test-policy")
      .addRules(
        permit("owner-access")
          .describe("Owners can access their resources")
          .when(attributeEquals("subject.id", "resource.attributes.ownerID"))
          .build()
      )
      .build();

    const abac = createABAC({ policies: [pol] });
    const req = request(
      { id: "user-1", attributes: {} },
      { type: "doc", id: "d1", attributes: { ownerID: "user-1" } },
      { name: "read" }
    );

    const result = abac.evaluate(req);
    expect(result.decision).toBe(Decision.ALLOW);
    expect(result.policyID).toBe("test-policy");
    expect(result.ruleID).toBe("owner-access");
  });

  it("respects defaultDecision when no policies apply", () => {
    const pol = policy("restricted")
      .forResourceTypes("secret")
      .addRules(permit("allow").build())
      .build();

    const abac = createABAC({
      policies: [pol],
      defaultDecision: Decision.DENY,
    });

    const req = request(
      { id: "u1", attributes: {} },
      { type: "document", id: "d1", attributes: {} },
      { name: "read" }
    );

    expect(abac.evaluate(req).decision).toBe(Decision.DENY);
  });

  it("can add and remove policies at runtime", () => {
    const abac = createABAC({ policies: [] });

    const pol = policy("dynamic")
      .addRules(permit("allow").build())
      .build();

    abac.addPolicies(pol);
    expect(abac.getPolicies()).toHaveLength(1);

    abac.removePolicy("dynamic");
    expect(abac.getPolicies()).toHaveLength(0);
  });
});

// ============================================================================
// Real-World Scenario Tests
// ============================================================================

describe("Real-World Scenarios", () => {
  describe("RBAC-style access control", () => {
    const rbacPolicy = policy("rbac")
      .combineWith(CombiningAlgorithm.FIRST_APPLICABLE)
      .addRules(
        permit("superadmin")
          .describe("Superadmins can do anything")
          .when(equals("subject.attributes.role", "superadmin"))
          .build(),
        permit("admin-manage")
          .describe("Admins can manage resources")
          .forActions("create", "read", "update", "delete")
          .when(equals("subject.attributes.role", "admin"))
          .build(),
        permit("user-read")
          .describe("Users can read")
          .forActions("read")
          .when(equals("subject.attributes.role", "user"))
          .build(),
        deny("default-deny")
          .describe("Deny by default")
          .build()
      )
      .build();

    const abac = createABAC({ policies: [rbacPolicy] });

    it("superadmin can do anything", () => {
      const req = request(
        { id: "sa1", attributes: { role: "superadmin" } },
        { type: "anything", id: "x", attributes: {} },
        { name: "delete" }
      );
      expect(abac.isAllowed(req)).toBe(true);
    });

    it("admin can CRUD", () => {
      const req = request(
        { id: "a1", attributes: { role: "admin" } },
        { type: "resource", id: "r1", attributes: {} },
        { name: "delete" }
      );
      expect(abac.isAllowed(req)).toBe(true);
    });

    it("user can only read", () => {
      const readReq = request(
        { id: "u1", attributes: { role: "user" } },
        { type: "resource", id: "r1", attributes: {} },
        { name: "read" }
      );
      const deleteReq = request(
        { id: "u1", attributes: { role: "user" } },
        { type: "resource", id: "r1", attributes: {} },
        { name: "delete" }
      );
      expect(abac.isAllowed(readReq)).toBe(true);
      expect(abac.isAllowed(deleteReq)).toBe(false);
    });
  });

  describe("ownership-based access", () => {
    const ownershipPolicy = policy("ownership")
      .combineWith(CombiningAlgorithm.DENY_OVERRIDES)
      .addRules(
        deny("private-non-owner")
          .describe("Private resources only accessible by owner")
          .when(
            and(
              equals("resource.attributes.visibility", "private"),
              not(attributeEquals("subject.id", "resource.attributes.ownerID"))
            )
          )
          .build(),
        permit("owner-full-access")
          .describe("Owner has full access")
          .when(attributeEquals("subject.id", "resource.attributes.ownerID"))
          .build(),
        permit("public-read")
          .describe("Anyone can read public resources")
          .forActions("read")
          .when(equals("resource.attributes.visibility", "public"))
          .build()
      )
      .build();

    const abac = createABAC({ policies: [ownershipPolicy] });

    it("owner can access private resource", () => {
      const req = request(
        { id: "user-1", attributes: {} },
        { type: "doc", id: "d1", attributes: { ownerID: "user-1", visibility: "private" } },
        { name: "edit" }
      );
      expect(abac.isAllowed(req)).toBe(true);
    });

    it("non-owner cannot access private resource", () => {
      const req = request(
        { id: "user-2", attributes: {} },
        { type: "doc", id: "d1", attributes: { ownerID: "user-1", visibility: "private" } },
        { name: "read" }
      );
      expect(abac.isAllowed(req)).toBe(false);
    });

    it("anyone can read public resource", () => {
      const req = request(
        { id: "user-2", attributes: {} },
        { type: "doc", id: "d1", attributes: { ownerID: "user-1", visibility: "public" } },
        { name: "read" }
      );
      expect(abac.isAllowed(req)).toBe(true);
    });
  });
});
