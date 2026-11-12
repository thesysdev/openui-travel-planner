// On openui.com the planner sits behind a host that asks visitors to sign in and caps how much
// each can ask in a day. When it turns a request away it answers instead of the planner's route,
// marks the response with this header, and shows its own sign-in or limit dialog over the page.
const HOST_HEADER = "x-demo-gateway";

/** The host turned this request away and is already telling the visitor why. The message counts
 *  as not sent: nothing is written into the trip, and the words go back into the input. */
export const turnedAway = (response: Response) =>
  (response.status === 401 || response.status === 429) && response.headers.has(HOST_HEADER);

/** A JSON error as words: the planner's routes send a string, the host sends { message }. */
export const errorWords = (error: unknown) =>
  typeof error === "string" ? error : ((error as { message?: unknown } | null)?.message as string | undefined) || "";

/** Why a request failed, in words: the route's JSON error when it sent one, never a raw parse
 *  error (a crash or a restart mid-request answers with an empty or HTML body). */
export async function failure(response: Response) {
  const text = await response.text().catch(() => "");
  try {
    const words = errorWords((JSON.parse(text) as { error?: unknown }).error);
    if (words) return words;
  } catch {}
  return response.status >= 500 ? "The planner hit a snag on our side." : "";
}
