function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function charDelay(ch) {
  if (ch === ' ') return 30;
  if (ch === ',' || ch === ';') return 160;
  if (ch === '.' || ch === '!' || ch === '?') return 220;
  return 45;
}

async function typeText(el, text) {
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    const jitter = Math.floor(Math.random() * 22) - 8;
    await sleep(Math.max(18, charDelay(text[i]) + jitter));
  }
}

async function runHeroTyping() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  const lines = [...title.querySelectorAll('.title-line')];
  if (!lines.length) return;

  const targets = lines
    .map(line => ({
      line,
      target: line.querySelector('.typing-text') || line,
    }))
    .filter(item => item.target);

  if (!targets.length) return;

  const originalTexts = targets.map(item => item.target.textContent || '');

  try {
    // Avoid flash of final text: clear only after JS is running.
    targets.forEach(item => {
      item.target.textContent = '';
    });

    if (prefersReducedMotion()) {
      targets.forEach((item, i) => {
        item.target.textContent = originalTexts[i];
        item.line.classList.remove('is-typing');
        item.line.classList.add('is-done');
      });
      return;
    }

    title.setAttribute('data-typing', 'true');

    for (let i = 0; i < targets.length; i++) {
      const { line, target } = targets[i];
      line.classList.add('is-typing');
      await typeText(target, originalTexts[i]);
      line.classList.remove('is-typing');
      line.classList.add('is-done');
      await sleep(220);
    }
  } catch (err) {
    // Fail-safe: restore original text if anything goes wrong.
    targets.forEach((item, i) => {
      item.target.textContent = originalTexts[i];
      item.line.classList.remove('is-typing');
      item.line.classList.add('is-done');
    });
  } finally {
    title.removeAttribute('data-typing');
  }
}

runHeroTyping();
