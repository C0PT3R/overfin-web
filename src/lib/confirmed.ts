// confirmed runs an action the server may want confirmed: by a fresh login
// (the SDK sends the browser through it and back here; the person repeats
// the action after) or by a PIN (asked here, then the action runs again
// with it). It reports whether the action went through; otherwise fail
// gets the reason to show.
import { askPin } from './dialog.svelte';
import { explain, isError, overfin } from './client';
import { t } from './i18n.svelte';

export async function confirmed(
  action: (pin?: string) => Promise<unknown>,
  fail: (message: string) => void,
  pinLabel: string = t('manage.pin'),
): Promise<boolean> {
  fail('');
  try {
    await action();
    return true;
  } catch (err) {
    if (isError(err, 'step-up-required') && err.problem.stepUpUrl) {
      overfin.stepUp(err);
      return false;
    }
    if (isError(err, 'pin-required')) {
      const pin = await askPin(pinLabel);
      return pin ? confirmed(() => action(pin), fail, pinLabel) : false;
    }
    fail(explain(err));
    return false;
  }
}
