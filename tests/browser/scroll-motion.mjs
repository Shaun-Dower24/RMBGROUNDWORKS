// Run with Playwright CLI after opening the target site:
// playwright-cli run-code --filename=tests/browser/scroll-motion.mjs --raw
// This inspects live animation frames, rather than only the settled screenshots.
async (page) => {
  const origin = new URL(page.url()).origin;
  const paths = [
    '/',
    '/about/',
    '/services/',
    '/services/foundations-substructure/',
    '/projects/',
    '/projects/foundation-reinforcement/',
  ];
  const results = [],
    errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [1440, 390]) {
    for (const path of paths) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.goto(origin + path);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() =>
        [...document.querySelectorAll('[data-reveal]')].some(
          (element) => element.style.opacity === '0',
        ),
      );
      await page.evaluate(() => {
        window.scrollAudit = { frames: 0, regressions: [], finished: false, peaks: new Map() };
        const nodes = [...document.querySelectorAll('[data-reveal], [data-motion]')];
        function sample() {
          const audit = window.scrollAudit;
          audit.frames++;
          nodes.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            if (rect.bottom <= 0 || rect.top >= innerHeight || element.closest('[hidden]')) return;
            const style = getComputedStyle(element);
            let progress = Number(style.opacity);
            if (element.dataset.motion === 'text') {
              const line = element.querySelector('[aria-hidden] > [aria-hidden]');
              progress = line
                ? Math.max(
                    0,
                    1 -
                      new DOMMatrix(getComputedStyle(line).transform).m42 /
                        line.getBoundingClientRect().height,
                  )
                : 1;
            } else if (element.dataset.motion === 'image' && style.clipPath !== 'none') {
              progress = 1 - Number(style.clipPath.match(/inset\([^ ]+ ([\d.]+)%/)?.[1] || 0) / 100;
            }
            if (element.dataset.motion === 'rule') return;
            const peak = audit.peaks.get(index) || 0;
            if (peak > 0.15 && progress < peak - 0.12) {
              audit.regressions.push({
                index,
                kind: element.dataset.motion || 'group',
                y: Math.round(rect.top),
                peak,
                progress,
              });
            }
            audit.peaks.set(index, Math.max(peak, progress));
          });
          if (!audit.finished) requestAnimationFrame(sample);
        }
        sample();
      });
      const height = await page.evaluate(() => document.body.scrollHeight);
      // Normal continuous wheel input; content must never become hidden after being seen.
      for (let y = 0; y < height; y += 200) {
        await page.mouse.wheel(0, 200);
        await page.waitForTimeout(65);
      }
      await page.waitForTimeout(900);
      // Return up, then down again. Completed content must remain settled.
      for (let y = height; y > 0; y -= 700) {
        await page.mouse.wheel(0, -700);
        await page.waitForTimeout(35);
      }
      await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
      await page.waitForTimeout(150);
      const result = await page.evaluate(() => {
        window.scrollAudit.finished = true;
        return {
          frames: window.scrollAudit.frames,
          regressions: window.scrollAudit.regressions,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
      results.push({ path, width, ...result });
    }
  }
  const failures = results.filter((result) => result.regressions.length || result.overflow);
  if (failures.length || errors.length) throw new Error(JSON.stringify({ failures, errors }));
  return {
    scenarios: results.length,
    sampledFrames: results.reduce((sum, result) => sum + result.frames, 0),
    opacityOrMaskRegressions: 0,
    runtimeErrors: errors,
    results: results.map(({ path, width, frames }) => ({ path, width, frames })),
  };
};
