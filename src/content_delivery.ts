import { infrai } from "./infrai.js";

export function subscriberUpdate(to: string, title: string, text: string) {
  return infrai.email.send({ to, subject: title, body: text }, `subscriber-${to}-${title}`);
}
