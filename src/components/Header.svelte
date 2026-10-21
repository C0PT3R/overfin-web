<!-- The bar on top of every screen except the profile picker, account setup
     and the player: home, the libraries, who's watching, the language. -->
<script lang="ts">
  import { overfin } from '../lib/client';
  import { i18n, locales, t, type Locale } from '../lib/i18n.svelte';
  import { router } from '../lib/router.svelte';
  import { session, setPicked } from '../lib/session.svelte';

  const here = $derived(router.route.parts);

  async function logout() {
    setPicked(false);
    const out = await overfin.logout().catch(() => ({ logoutUrl: undefined }));
    location.href = out.logoutUrl || '/';
  }
</script>

<header>
  <a class="brand" href="/">Overfin</a>
  <nav>
    <a href="/" class:active={here.length === 0}>{t('nav.home')}</a>
    {#each session.libraries as library (library.id)}
      <a href="/library/{library.id}" class:active={here[0] === 'library' && here[1] === library.id}>{library.name}</a>
    {/each}
  </nav>
  <a class="link" href="/profiles">{session.me?.activeProfile?.name ?? t('nav.chooseProfile')}</a>
  <a class="link" href="/manage">{t('nav.profiles')}</a>
  <a class="link" href="/account">{t('nav.account')}</a>
  <select aria-label={t('app.language')} value={i18n.locale}
    onchange={(event) => i18n.set(event.currentTarget.value as Locale)}>
    {#each locales as locale (locale.code)}
      <option value={locale.code}>{locale.name}</option>
    {/each}
  </select>
  <button class="link" type="button" onclick={logout}>{t('nav.logout')}</button>
</header>
