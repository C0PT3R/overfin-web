<!-- The whole site: who's here first (account setup, no access, or "Who's
     watching?"), then the screen the address names. -->
<script lang="ts">
  import { explain, isError, overfin } from './lib/client';
  import { t } from './lib/i18n.svelte';
  import { go, router } from './lib/router.svelte';
  import { picked, session } from './lib/session.svelte';
  import Dialog from './components/Dialog.svelte';
  import Header from './components/Header.svelte';
  import PageError from './components/PageError.svelte';
  import Account from './pages/Account.svelte';
  import Home from './pages/Home.svelte';
  import Item from './pages/Item.svelte';
  import Library from './pages/Library.svelte';
  import Manage from './pages/Manage.svelte';
  import Person from './pages/Person.svelte';
  import Player from './pages/Player.svelte';
  import Profiles from './pages/Profiles.svelte';
  import Setup from './pages/Setup.svelte';

  type Phase =
    | { kind: 'loading' }
    | { kind: 'setup'; claim?: 'move' | 'link' }
    | { kind: 'blocked'; title: string; message: string }
    | { kind: 'ready' };
  let phase = $state<Phase>({ kind: 'loading' });

  async function start() {
    phase = { kind: 'loading' };
    try {
      session.me = await overfin.me();
    } catch (err) {
      if (isError(err, 'account-setup-required')) phase = { kind: 'setup', claim: err.problem.claim };
      else if (isError(err, 'account-not-allowed')) phase = { kind: 'blocked', title: t('access.none'), message: explain(err) };
      else if (isError(err, 'invitation-required')) phase = { kind: 'blocked', title: t('access.invitation'), message: explain(err) };
      else phase = { kind: 'blocked', title: '', message: explain(err) };
      return;
    }
    const [libraries, profiles] = await Promise.all([overfin.libraries().catch(() => []), overfin.profiles()]);
    session.libraries = libraries;
    // "Who's watching?" once per tab, when there's a choice.
    const where = router.route.parts[0];
    if ((!session.me.activeProfile || (profiles.length > 1 && !picked())) && where !== 'play' && where !== 'profiles') {
      go('#/profiles');
    }
    phase = { kind: 'ready' };
  }
  start();

  const route = $derived(router.route);
  // Each address is a screen of its own: shown anew when it changes.
  const key = $derived(route.parts.join('/') + '?' + route.params.toString());
  const bare = $derived(route.parts[0] === 'profiles' || route.parts[0] === 'play');

  $effect(() => {
    void key;
    window.scrollTo(0, 0);
  });
</script>

{#if phase.kind === 'loading'}
  <main><p class="muted">{t('app.loading')}</p></main>
{:else if phase.kind === 'setup'}
  <main><Setup claim={phase.claim} done={start} /></main>
{:else if phase.kind === 'blocked'}
  <main>
    <div class="center">
      {#if phase.title}<h1>{phase.title}</h1>{/if}
      <p>{phase.message}</p>
    </div>
  </main>
{:else}
  {#if !bare}<Header />{/if}
  <main>
    {#key key}
      {#if route.parts.length === 0}
        <Home />
      {:else if route.parts[0] === 'library' && route.parts[1]}
        <Library id={route.parts[1]} params={route.params} />
      {:else if route.parts[0] === 'item' && route.parts[1]}
        <Item id={route.parts[1]} />
      {:else if route.parts[0] === 'person' && route.parts[1]}
        <Person id={route.parts[1]} />
      {:else if route.parts[0] === 'play' && route.parts[1]}
        <Player id={route.parts[1]} />
      {:else if route.parts[0] === 'profiles'}
        <Profiles />
      {:else if route.parts[0] === 'manage'}
        <Manage />
      {:else if route.parts[0] === 'account'}
        <Account />
      {:else}
        <PageError notFound />
      {/if}
    {/key}
  </main>
{/if}
<Dialog />
