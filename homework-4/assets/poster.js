// Keep both download links unavailable until the real PDF is present.
const posterLinks = [...document.querySelectorAll('.poster-download')];
for (const link of posterLinks) {
  link.addEventListener('click', event => {
    if (link.getAttribute('aria-disabled') === 'true') event.preventDefault();
  });
}
async function checkPoster() {
  if (!posterLinks.length) return;
  try {
    const response = await fetch(posterLinks[0].href, { method: 'HEAD', cache: 'no-store' });
    if (!response.ok || !response.headers.get('content-type')?.toLowerCase().includes('application/pdf')) return;
    for (const link of posterLinks) {
      link.removeAttribute('aria-disabled');
      link.removeAttribute('tabindex');
      const note = document.getElementById(link.getAttribute('aria-describedby'));
      if (note) note.textContent = 'PDF · 18 × 24 inches';
    }
  } catch {
    // Offline or unavailable: retain the explicit pending state.
  }
}
checkPoster();
