// On openui.com every request goes through the demo gateway. When the gateway itself turns a
// request away, signed out (401) or over the daily limit (429), it marks the response with this
// header and its page shell opens the sign-in or limit modal. The reply never started, so the
// planner keeps nothing of it: no entry, no trip in the address, just the message back in the input.
const GATEWAY_RESPONSE_HEADER = "x-demo-gateway";

export const gatewayTurnedAway = (response: Response) =>
  response.headers.has(GATEWAY_RESPONSE_HEADER) && (response.status === 401 || response.status === 429);
