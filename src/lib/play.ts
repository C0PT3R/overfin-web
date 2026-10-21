// Where the next playback starts, when the person just chose (resume, or
// from the start). After a reload there's no choice, and the SDK resumes
// where the profile left off.
import { go } from './router.svelte';

let chosenStart: number | undefined;

export function play(itemId: string, positionMs: number) {
  chosenStart = positionMs;
  go(`/play/${itemId}`);
}

/** takeStart returns the chosen start, once. */
export function takeStart(): number | undefined {
  const start = chosenStart;
  chosenStart = undefined;
  return start;
}
