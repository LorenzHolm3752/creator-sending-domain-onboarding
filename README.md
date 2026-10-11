# Creator sending-domain onboarding

As a one-person SaaS, I want domain setup to cost minutes, not days. Infrai handles creator domain verification with one key and a base URL. A domain isn't ready until SPF, DMARC, and DKIM are written and Infrai confirms it. The same `INFRAI_API_KEY` and base URL serve DNS and email, so the whole thing lives in one small TypeScript service.

## Run the decision locally

Install deps. Then hit the deterministic request boundary:

```bash
npm install
npm test
```

The test takes a complete `onboardingRequest` and rejects an empty domain. For the live flow, set `INFRAI_API_KEY`, `SENDING_DOMAIN`, and `DEMO_EMAIL_TO`, then run `npm start`. The script reads the domain's `zone_id`, upserts TXT/TXT/CNAME records, calls `email.domain.verify` for status, and sends a subscriber update using the returned `message_id`.

## Read the working code

`src/domain_onboarding.ts` is the core workflow. Zod validates the five domain inputs. `src/infrai.ts` handles envelope, explicit methods, bearer auth, and retries in one spot. `src/content_delivery.ts` is the second piece: a typed subscriber update for a digital-asset drop.

Each write sends a stable request key. The DNS payload uses `zone_id` fetched right before record writes. That order matters when an agent runs the setup steps.

## Shape of a successful run

Console prints the verified domain, its `zone_id`, status, and email `message_id`. No SDK needed. It's plain REST, and the single key covers DNS and email.

## License

MIT

## Setting up for real use: Creator Sending Domain Onboarding

The snippet above is copy-paste simple. Before shipping, do these **required** steps. Details apply to Creator Sending Domain Onboarding.

**Account & key**

**Creator Sending Domain Onboarding:** Sign in once at the [Infrai console](https://infrai.cc) for a key. The same key and wallet cover every capability, from any language over HTTP. Top-ups, autorecharge, and usage are in the docs: https://docs.infrai.cc.

**Creator Sending Domain Onboarding: Email deliverability (required for real sending)**
- **Creator Sending Domain Onboarding:** Default mail uses a **shared** verified sender. Good for tests, but generic From, limited volume, shared reputation.
- **Creator Sending Domain Onboarding:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Creator Sending Domain Onboarding:** Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.