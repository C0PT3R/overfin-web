<!-- The dialog on screen, if any (see lib/dialog.svelte.ts). -->
<script lang="ts">
  import { dialog } from '../lib/dialog.svelte';
  import { t } from '../lib/i18n.svelte';

  let element = $state<HTMLDialogElement>();
  let pin = $state('');
  const pinPattern = '[0-9]{4,8}';

  $effect(() => {
    if (dialog.current && element && !element.open) {
      pin = '';
      element.showModal();
    }
  });

  function close(value: string | boolean | null) {
    const request = dialog.current;
    dialog.current = null;
    element?.close();
    request?.resolve(value);
  }
</script>

<dialog bind:this={element} oncancel={() => close(null)}>
  {#if dialog.current}
    {@const request = dialog.current}
    <form method="dialog" onsubmit={(event) => { event.preventDefault(); close(request.kind === 'pin' ? pin : true); }}>
      <p>{request.message}</p>
      {#if request.kind === 'pin'}
        <!-- svelte-ignore a11y_autofocus -->
        <input bind:value={pin} inputmode="numeric" autocomplete="off" pattern={pinPattern} maxlength="8" required autofocus aria-label={request.message} />
      {/if}
      <div class="actions">
        <button type="submit" class={request.danger ? 'danger' : 'primary'}>{t('common.ok')}</button>
        {#if request.kind !== 'notice'}
          <button type="button" onclick={() => close(null)}>{t('common.cancel')}</button>
        {/if}
      </div>
    </form>
  {/if}
</dialog>
