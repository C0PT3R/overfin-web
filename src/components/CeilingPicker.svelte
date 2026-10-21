<!-- A kids profile's limits: the highest rating allowed for films and for
     series, on the server's ratings country's scales. -->
<script lang="ts">
  import type { Ratings } from '../lib/sdk/overfin.js';
  import { t } from '../lib/i18n.svelte';

  let { ratings, movie = $bindable(), series = $bindable() }: { ratings: Ratings; movie: string; series: string } = $props();
</script>

{#if ratings.movie.length && ratings.series.length}
  <label>
    {t('ceilings.movie')}
    <select bind:value={movie}>
      {#each ratings.movie as r (r.name)}<option value={r.name} title={r.meaning}>{r.name}</option>{/each}
    </select>
  </label>
  <label>
    {t('ceilings.series')}
    <select bind:value={series}>
      {#each ratings.series as r (r.name)}<option value={r.name} title={r.meaning}>{r.name}</option>{/each}
    </select>
  </label>
{:else}
  <span class="muted">{t('ceilings.unavailable')}</span>
{/if}
