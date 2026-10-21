// Who's here: the account, its active profile, and the libraries that
// profile sees (each profile its own, kids limits included).
import type { Library, Me } from './sdk/overfin.js';
import { overfin } from './client';

export const session = $state<{ me: Me | null; libraries: Library[]; discovery: boolean }>({
  me: null, libraries: [], discovery: false,
});

/** offersDiscovery asks the server whether it offers discovery (it does once
 * Seerr is connected), for profiles that may use it (not kids, for now). */
export async function offersDiscovery(): Promise<boolean> {
  if (session.me?.activeProfile?.kind === 'kids') return false;
  return overfin.discover('trending', 'movie', { limit: 1 }).then(() => true, () => false);
}

/** refresh reloads who's here, after a profile change. */
export async function refresh() {
  session.me = await overfin.me();
  session.libraries = await overfin.libraries().catch(() => []);
  session.discovery = await offersDiscovery();
}

const pickedKey = 'overfin-web-picked';

/** picked reports whether a profile was chosen in this tab. */
export function picked(): boolean {
  return sessionStorage.getItem(pickedKey) === '1';
}

export function setPicked(on: boolean) {
  if (on) sessionStorage.setItem(pickedKey, '1');
  else sessionStorage.removeItem(pickedKey);
}
