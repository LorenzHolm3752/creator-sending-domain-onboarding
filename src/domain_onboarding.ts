import { z } from "zod";
import { infrai } from "./infrai.js";

export const onboardingRequest = z.object({ domain: z.string().min(3), spf: z.string().min(1), dmarc: z.string().min(1), dkimName: z.string().min(1), dkimValue: z.string().min(1) });
export type OnboardingRequest = z.infer<typeof onboardingRequest>;

export async function onboardSendingDomain(input: OnboardingRequest) {
  const request = onboardingRequest.parse(input);
  const zone = await infrai.dns.domain.get(request.domain);
  const records = [
    { record_type: "TXT", name: request.domain, content: request.spf },
    { record_type: "TXT", name: request.domain, content: request.dmarc },
    { record_type: "CNAME", name: request.dkimName, content: request.dkimValue },
  ];
  for (const record of records) await infrai.dns.record.upsert({ zone_id: zone.zone_id, ...record });
  const verification = await infrai.email.domain.verify(request.domain);
  return { domain: request.domain, zone_id: zone.zone_id, verification: verification.verification.status };
}
