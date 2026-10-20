<!-- The account: downloading one's data, deleting the account. Both need a
     fresh login, or the profile's PIN. -->
<script lang="ts">
  import { overfin } from '../lib/client';
  import { confirmed } from '../lib/confirmed';
  import { confirm, notice } from '../lib/dialog.svelte';
  import { t } from '../lib/i18n.svelte';
  import { session, setPicked } from '../lib/session.svelte';

  let message = $state('');
  const profile = $derived(session.me?.activeProfile);

  async function download() {
    await confirmed(async (pin) => {
      const data = await overfin.exportData(pin);
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'my-data.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }, (m) => (message = m));
  }

  async function remove() {
    if (!(await confirm(t('account.deleteConfirm'), true))) return;
    await confirmed(async () => {
      const out = await overfin.deleteAccount();
      setPicked(false);
      await notice(out.history === 'kept' ? t('account.deletedKept') : t('account.deleted'));
      location.href = '/';
    }, (m) => (message = m));
  }
</script>

<div class="center">
  <h1>{t('account.title')}</h1>
  {#if profile?.kind !== 'kids'}
    <div class="panel">
      <p>{profile?.owner ? t('account.dataOwner') : t('account.dataProfile')}</p>
      <button onclick={download}>{t('account.download')}</button>
    </div>
  {/if}
  {#if profile?.owner}
    <div class="panel">
      <p>{t('account.deleteText')}</p>
      <button class="danger" onclick={remove}>{t('account.delete')}</button>
    </div>
  {/if}
  {#if message}<p class="error">{message}</p>{/if}
</div>
