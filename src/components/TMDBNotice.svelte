<!-- TMDB's attribution, which its terms require wherever its data or images
     are shown: its logo, kept less prominent than the site's own name, and
     its notice. -->
<script lang="ts">
  import { t } from '../lib/i18n.svelte';
</script>

<footer class="tmdb">
  <img src="/tmdb.svg" alt="TMDB" />
  <span>{t('tmdb.notice')}</span>
</footer>
