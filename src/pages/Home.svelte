<!-- Home: what to continue, what's next, the watchlist, and what's new in
     each library. -->
<script lang="ts">
  import { overfin } from '../lib/client';
  import { t } from '../lib/i18n.svelte';
  import { session } from '../lib/session.svelte';
  import PageError from '../components/PageError.svelte';
  import Row from '../components/Row.svelte';

  async function load() {
    const [resume, nextUp, watchlist, latest] = await Promise.all([
      overfin.resume(12),
      overfin.nextUp(12),
      overfin.watchlist().catch(() => []), // the server may not offer it
      Promise.all(session.libraries.map(async (library) => ({ library, items: await overfin.latest(library.id, 16) }))),
    ]);
    return { resume, nextUp, watchlist, latest };
  }

  // Titles taken out of Continue Watching here, hidden at once.
  let removed = $state<string[]>([]);
  async function forget(item: { id: string }) {
    removed = [...removed, item.id];
    await overfin.forgetProgress(item.id).catch(() => (removed = removed.filter((id) => id !== item.id)));
  }
</script>

{#await load()}
  <p class="muted">{t('app.loading')}</p>
{:then home}
  {@const empty = !home.resume.length && !home.nextUp.length && !home.watchlist.length && home.latest.every((l) => !l.items.length)}
  {#if empty}
    <p class="muted">{t('common.nothingYet')}</p>
  {/if}
  <Row title={t('home.continue')} items={home.resume.filter((i) => !removed.includes(i.id))} wide remove={forget} />
  <Row title={t('home.nextUp')} items={home.nextUp} wide />
  <Row title={t('home.watchlist')} items={home.watchlist} />
  {#each home.latest as { library, items } (library.id)}
    <Row title={t('home.latest', { library: library.name })} {items} />
  {/each}
{:catch error}
  <PageError {error} />
{/await}
