// Smooth-scroll helpers that account for the fixed header height so that
// section headings aren't hidden underneath the navbar after a jump.

const HEADER_OFFSET = 80; // matches header height (h-20 on desktop)

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return false;
  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  return true;
};

// Scrolls to the element referenced by a "#section" hash. Retries a couple of
// times because the target section may still be mounting (e.g. right after a
// route change from a sub-page back to the home page).
export const scrollToHash = (hash: string) => {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  if (scrollToId(id)) return;
  let attempts = 0;
  const tick = () => {
    if (scrollToId(id) || attempts++ > 10) return;
    setTimeout(tick, 100);
  };
  setTimeout(tick, 100);
};
