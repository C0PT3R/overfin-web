<!-- Discover: what's trending, popular and upcoming, films and series, with
     what the library has and what it doesn't. -->
<script lang="ts">
  import type { CatalogTitle } from '../lib/sdk/overfin.js';
  import { overfin } from '../lib/client';
  import { t, type Key } from '../lib/i18n.svelte';
  import { replace } from '../lib/router.svelte';
  import CatalogCard from '../components/CatalogCard.svelte';
  import PageError from '../components/PageError.svelte';

  let { params }: { params: URLSearchParams } = $props();

  type Show = 'all' | 'library' | 'missing';
  const shows: Show[] = ['all', 'library', 'missing'];
  const showKeys: Record<Show, Key> = { all: 'discover.show.all', library: 'discover.show.library', missing: 'discover.show.missing' };
  const show = $derived<Show>(shows.includes(params.get('show') as Show) ? (params.get('show') as Show) : 'all');

  const rows = [
    { list: 'trending', kind: 'movie', key: 'discover.trendingMovies' },
    { list: 'trending', kind: 'series', key: 'discover.trendingSeries' },
    { list: 'popular', kind: 'movie', key: 'discover.popularMovies' },
    { list: 'popular', kind: 'series', key: 'discover.popularSeries' },
    { list: 'upcoming', kind: 'movie', key: 'discover.upcomingMovies' },
    { list: 'upcoming', kind: 'series', key: 'discover.upcomingSeries' },
  ] as const;

  async function load(show: Show) {
    return Promise.all(rows.map(async (row) => ({
      ...row,
      items: (await overfin.discover(row.list, row.kind, { availability: show, limit: 20 })).items as CatalogTitle[],
    })));
  }
</script>

<div class="toolbar">
  <h1>{t('discover.title')}</h1>
  <div class="tabs" role="tablist">
    {#each shows as s (s)}
      <button type="button" role="tab" aria-selected={show === s} class:active={show === s}
        onclick={() => replace(s === 'all' ? '/discover' : `/discover?show=${s}`)}>{t(showKeys[s])}</button>
    {/each}
  </div>
</div>

{#await load(show)}
  <p class="muted">{t('app.loading')}</p>
{:then result}
  {#if result.every((row) => !row.items.length)}
    <p class="muted">{t('common.nothingYet')}</p>
  {/if}
  {#each result as row (row.key)}
    {#if row.items.length}
      <h2>{t(row.key)}</h2>
      <div class="row">
        {#each row.items as title (title.mediaKind + title.tmdbId)}
          <CatalogCard {title} />
        {/each}
      </div>
    {/if}
  {/each}
{:catch error}
  <PageError {error} />
{/await}
