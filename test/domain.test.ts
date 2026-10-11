import assert from "node:assert/strict";
import { onboardingRequest } from "../src/domain_onboarding.js";

const parsed = onboardingRequest.safeParse({ domain: "studio.example", spf: "v=spf1 ~all", dmarc: "v=DMARC1; p=none", dkimName: "mail", dkimValue: "target" });
assert.equal(parsed.success, true);
assert.equal(onboardingRequest.safeParse({ domain: "", spf: "x", dmarc: "x", dkimName: "x", dkimValue: "x" }).success, false);
console.log("domain input decision: valid records pass, empty domain is rejected");
