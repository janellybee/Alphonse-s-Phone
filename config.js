/* Load local story features after the phone's inline UI initializes. */
document.addEventListener('DOMContentLoaded', () => {
  ['story-engine.js', 'phone-enhancer.js'].forEach((file) => {
    const script = document.createElement('script');
    script.src = `./${file}`;
    document.body.appendChild(script);
  });
}, { once: true });
