// Times, as people read them.
import { t } from './i18n.svelte';

/** duration is a length: "1 h 42 min". */
export function duration(ms: number): string {
  const minutes = Math.round(ms / 60000);
  return minutes >= 60
    ? t('time.hoursMinutes', { h: Math.floor(minutes / 60), m: minutes % 60 })
    : t('time.minutes', { m: minutes });
}

/** clock is a position: "1:02:03" or "2:03". */
export function clock(ms: number): string {
  const s = Math.floor(ms / 1000);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor(s / 60) % 60;
  const ss = s % 60;
  const two = (n: number) => String(n).padStart(2, '0');
  return hh ? `${hh}:${two(mm)}:${two(ss)}` : `${mm}:${two(ss)}`;
}
