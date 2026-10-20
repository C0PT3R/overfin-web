<!-- "Who's watching?": choosing a profile (with its PIN, if it has one),
     and, for the owner, adding one. -->
<script lang="ts">
  import type { Profile } from '../lib/sdk/overfin.js';
  import { explain, isError, overfin } from '../lib/client';
  import { askPin } from '../lib/dialog.svelte';
  import { t } from '../lib/i18n.svelte';
  import { go } from '../lib/router.svelte';
  import { refresh, session, setPicked } from '../lib/session.svelte';
  import PageError from '../components/PageError.svelte';

  let message = $state('');
  let reload = $state(0);
  const profiles = $derived.by(() => {
    void reload;
    return overfin.profiles();
  });

  async function choose(p: Profile, pin?: string) {
    message = '';
    if (p.hasPin && pin === undefined) {
      const entered = await askPin(t('profiles.pinFor', { name: p.name }));
      if (entered === null) return;
      pin = entered;
    }
    try {
      await overfin.activateProfile(p.id, pin);
      setPicked(true);
      await refresh();
      go('#/');
    } catch (err) {
      if (isError(err, 'pin-required')) return choose(p);
      message = explain(err);
    }
  }

  // Adding a profile, for the owner.
  let adding = $state(false);
  let name = $state('');
  let kids = $state(false);
  let ceiling = $state('');
  let ratings = $state<string[]>([]);

  async function startAdding() {
    message = '';
    ratings = await overfin.ratings();
    ceiling = ratings[0] ?? '';
    name = '';
    kids = false;
    adding = true;
  }

  async function add(event: SubmitEvent) {
    event.preventDefault();
    message = '';
    try {
      await overfin.createProfile(kids ? { name, kind: 'kids', ratingCeiling: ceiling } : { name });
      adding = false;
      reload++;
    } catch (err) {
      message = explain(err);
    }
  }
</script>

{#if adding}
  <div class="center">
    <h1>{t('profiles.new')}</h1>
    <form class="stack panel" onsubmit={add}>
      <label>{t('manage.name')} <input bind:value={name} maxlength="32" required /></label>
      <label>
        <input type="checkbox" bind:checked={kids} /> {t('manage.kidsProfile')}
        <select bind:value={ceiling} aria-label={t('manage.kidsProfile')}>
          {#each ratings as rating (rating)}<option value={rating}>{rating}</option>{/each}
        </select>
      </label>
      <button class="primary" type="submit">{t('common.create')}</button>
      <button type="button" onclick={() => (adding = false)}>{t('common.cancel')}</button>
    </form>
    {#if message}<p class="error">{message}</p>{/if}
  </div>
{:else}
  <h1 class="center">{t('profiles.who')}</h1>
  {#await profiles}
    <p class="center muted">{t('app.loading')}</p>
  {:then list}
    <div class="profiles">
      {#each list as p (p.id)}
        <button class="profile" onclick={() => choose(p)}>
          <div class="avatar">{p.name.slice(0, 1).toUpperCase()}</div>
          {p.name}
          <div class="badge">
            {[p.kind === 'kids' ? t('profiles.kids', { rating: p.ratingCeiling ?? '' }) : '', p.hasPin ? '🔒' : ''].filter(Boolean).join(' ')}
          </div>
        </button>
      {/each}
      {#if session.me?.activeProfile?.owner}
        <button class="profile" onclick={startAdding}><div class="avatar">+</div>{t('profiles.add')}</button>
      {/if}
    </div>
    {#if message}<p class="center error">{message}</p>{/if}
    <!-- Managing needs a profile: shown once one is active. -->
    {#if session.me?.activeProfile}
      <p class="center">
        <a href="#/manage">{session.me.activeProfile.owner ? t('profiles.manage') : t('profiles.mine')}</a>
      </p>
    {/if}
  {:catch error}
    <PageError {error} />
  {/await}
{/if}
