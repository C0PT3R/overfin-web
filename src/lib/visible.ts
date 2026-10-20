// An action calling back when an element comes near the screen: for
// loading more as the person scrolls.
export function visible(node: HTMLElement, callback: () => void) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) callback();
  }, { rootMargin: '800px' });
  observer.observe(node);
  return {
    update(next: () => void) {
      callback = next;
    },
    destroy() {
      observer.disconnect();
    },
  };
}
