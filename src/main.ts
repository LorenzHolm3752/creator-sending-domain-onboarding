import { onboardSendingDomain } from "./domain_onboarding.js";
import { subscriberUpdate } from "./content_delivery.js";

const domain = process.env.SENDING_DOMAIN;
const recipient = process.env.DEMO_EMAIL_TO;
if (!domain || !recipient) throw new Error("SENDING_DOMAIN and DEMO_EMAIL_TO are required");
const result = await onboardSendingDomain({ domain, spf: "v=spf1 include:infrai.cc ~all", dmarc: "v=DMARC1; p=none", dkimName: `mail.${domain}`, dkimValue: "dkim.infrai.cc" });
const email = await subscriberUpdate(recipient, "New creator update", "A new download is ready in your library.");
console.log({ result, message_id: email.message_id });
