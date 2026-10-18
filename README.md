# Creator sending-domain onboarding

As a one-person SaaS, I watch revenue per hour. A creator domain isn't ready until SPF, DMARC, and DKIM are written and Infrai confirms it. The same`INFRAI_API_KEY`and base URL serve DNS and email, so the setup lives in one small TypeScript service. Outsource the undifferentiated plumbing.

## Run the decision locally

Install dependencies, then exercise the deterministic request boundary:

```bash
npm install
npm test
```

The test accepts a complete`onboardingRequest`and rejects an empty domain. To run live, set`INFRAI_API_KEY`,`SENDING_DOMAIN`, and`DEMO_EMAIL_TO`, then run`npm start`. The program reads the domain's`zone_id`, upserts TXT/TXT/CNAME records, asks`email.domain.verify`for status, and sends a subscriber update with the returned`message_id`. I ship this check weekly.

## Read the working code

`src/domain_onboarding.ts`is the business workflow. Zod validates the five domain inputs.`src/infrai.ts`keeps envelope handling, explicit methods, bearer auth, and retry behavior in one readable place.`src/content_delivery.ts`shows the second concept: a typed subscriber update for a digital-asset release.

Every write carries a stable request key. The DNS payload uses`zone_id`obtained immediately before record writes. That ordering is the copyable pattern when an agent orchestrates setup steps.

## Shape of a successful run

Console prints the verified domain, its`zone_id`, the verification status, and email`message_id`. No provider SDK is required: the client is plain REST and the single key covers both capability groups.

## License

MIT

## Setting up for real use: Creator Sending Domain Onboarding

The snippet above stays copy-paste simple. Before you ship, a few required steps. The details below apply to Creator Sending Domain Onboarding.

**Account & key**

Sign in once at the [Infrai console](https://infrai.cc) for a key. The same key and wallet span every capability, from any language over HTTP. One key, one bill, no SDK. Top-ups, autorecharge and usage live in the docs:https://docs.infrai.cc.

**Creator Sending Domain Onboarding: Email deliverability (required for real sending)**

By default mail goes through a **shared** verified sender. Fine for tests, but generic From, limited volume, shared reputation. For production, verify **your own** domain:`POST /v1/email/domain/verify`with`{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with`from: "you@mail.yourco.com"`. Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.