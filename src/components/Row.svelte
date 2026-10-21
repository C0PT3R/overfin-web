<!-- A titled row of titles, shown only when there's something in it. -->
<script lang="ts">
  import type { ItemSummary } from '../lib/sdk/overfin.js';
  import Card from './Card.svelte';

  let { title, items, wide = false, remove }: {
    title: string; items: ItemSummary[]; wide?: boolean; remove?: (item: ItemSummary) => void;
  } = $props();
</script>

{#if items.length}
  <h2>{title}</h2>
  <div class="row">
    {#each items as item (item.id)}
      <Card {item} {wide} remove={remove && (() => remove(item))} />
    {/each}
  </div>
{/if}
