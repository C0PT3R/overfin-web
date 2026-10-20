<!-- A titled row of titles, shown only when there's something in it. -->
<script lang="ts">
  import type { ItemSummary } from '../lib/sdk/overfin.js';
  import Card from './Card.svelte';

  let { title, items, wide = false }: { title: string; items: ItemSummary[]; wide?: boolean } = $props();
</script>

{#if items.length}
  <h2>{title}</h2>
  <div class="row">
    {#each items as item (item.id)}
      <Card {item} {wide} />
    {/each}
  </div>
{/if}
