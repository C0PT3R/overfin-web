// Every screen lives in the address (#/item/…), so a reload comes back to it.
export interface Route {
  /** The path's parts: #/item/123 is ["item", "123"]. */
  parts: string[];
  params: URLSearchParams;
}

function parse(): Route {
  const [path = '', query = ''] = location.hash.slice(1).split('?');
  return { parts: path.split('/').filter(Boolean), params: new URLSearchParams(query) };
}

let current = $state<Route>(parse());
window.addEventListener('hashchange', () => {
  current = parse();
});

export const router = {
  get route(): Route {
    return current;
  },
};

/** go shows another screen, adding it to the history. */
export function go(hash: string) {
  location.hash = hash;
}

/** replace changes the address without a new history entry. */
export function replace(hash: string) {
  history.replaceState(null, '', hash);
  current = parse();
}
