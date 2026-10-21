// Every screen has a real address (/item/123, /library/abc?sort=name), so a
// reload, a bookmark or a shared link comes back to it, through the login if
// need be. Links to the site's own pages change the address without
// reloading; the gateway answers those paths with this app.
export interface Route {
  /** The path's parts: /item/123 is ["item", "123"]. */
  parts: string[];
  params: URLSearchParams;
}

function parse(): Route {
  return {
    parts: location.pathname.split('/').filter(Boolean).map((part) => decodeURIComponent(part)),
    params: new URLSearchParams(location.search),
  };
}

let current = $state<Route>(parse());
window.addEventListener('popstate', () => {
  current = parse();
});

export const router = {
  get route(): Route {
    return current;
  },
};

/** go shows another screen, adding it to the history. */
export function go(path: string) {
  if (path === location.pathname + location.search) return;
  history.pushState(null, '', path);
  current = parse();
}

/** replace changes the address without a new history entry. */
export function replace(path: string) {
  history.replaceState(null, '', path);
  current = parse();
}

// Clicks on links to the site's own pages stay in the app. Anything else (a
// new tab, a download, another site, the API) is left to the browser.
document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element | null)?.closest?.('a');
  if (!link || link.target || link.hasAttribute('download')) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || url.pathname === '/api' || url.pathname.startsWith('/api/')) return;
  event.preventDefault();
  go(url.pathname + url.search);
});
