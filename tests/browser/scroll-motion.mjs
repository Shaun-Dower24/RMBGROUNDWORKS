// Run with Playwright CLI after opening the target site:
// playwright-cli run-code --filename=tests/browser/scroll-motion.mjs --raw
// This inspects live animation frames, rather than only the settled screenshots.
// prettier-ignore
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
        window.scrollAudit = { frames: 0, regressions: [], earlyStarts: [], starts: 0, finished: false, peaks: new Map() };
        const nodes = [...document.querySelectorAll('[data-reveal], [data-motion]')];
        const prepared = new Set(nodes.filter(element => element.style.opacity === '0' ||
          (element.dataset.motion === 'image' && getComputedStyle(element).clipPath !== 'none') ||
          (element.dataset.motion === 'text' && element.querySelector('[aria-hidden] > [aria-hidden]'))));
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
                        line.offsetHeight,
                  )
                : 1;
            } else if (element.dataset.motion === 'image' && style.clipPath !== 'none') {
              progress = 1 - Number(style.clipPath.match(/inset\([^ ]+ ([\d.]+)%/)?.[1] || 0) / 100;
            }
            if (element.dataset.motion === 'rule') return;
            const peak = audit.peaks.get(index) || 0;
            if (peak === 0 && progress > .03 && prepared.has(element) && !element.dataset.motionDone) {
              audit.starts++;
              const visible = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
              const required = Math.min(element.offsetHeight, Math.min(Math.max(element.offsetHeight * .5, innerHeight * .3), innerHeight * .45));
              const atPageEnd = scrollY >= document.documentElement.scrollHeight - innerHeight - 3;
              if (visible < required - 20 && !atPageEnd) audit.earlyStarts.push({index, visible, required, top: rect.top});
            }
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
      let height = await page.evaluate(() => document.body.scrollHeight);
      const homepage = path === '/' ? { accordionToggled: false, galleryCards: 0, galleryFailures: [] } : null;
      const laterServiceSummary = homepage
        ? page.locator('[data-service-accordion] details').nth(3).locator('summary')
        : null;
      // Normal continuous wheel input; content must never become hidden after being seen.
      for (let y = 0; y < height; y += 200) {
        await page.mouse.wheel(0, 200);
        await page.waitForTimeout(65);
        if (homepage && !homepage.accordionToggled) {
          const summary = await laterServiceSummary.boundingBox();
          if (summary && summary.y >= 0 && summary.y + summary.height <= (width === 390 ? 844 : 1000)) {
            // Changing the open panel must refresh geometry before downstream reveals start.
            await laterServiceSummary.click();
            await page.waitForTimeout(80);
            homepage.accordionToggled = await laterServiceSummary.evaluate((element) => element.parentElement.open);
            height = await page.evaluate(() => document.body.scrollHeight);
          }
        }
      }
      await page.waitForTimeout(900);
      // Return up, then down again. Completed content must remain settled.
      for (let y = height; y > 0; y -= 700) {
        await page.mouse.wheel(0, -700);
        await page.waitForTimeout(35);
      }
      if (homepage) {
        const track = page.locator('[data-home-work-track]');
        await track.scrollIntoViewIfNeeded();
        await page.waitForTimeout(650);
        const cards = track.locator('[data-home-work-card]');
        homepage.galleryCards = await cards.count();
        for (let index = 0; index < homepage.galleryCards; index++) {
          await cards.nth(index).evaluate((card) => card.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' }));
          await page.waitForTimeout(80);
          const state = await cards.nth(index).evaluate((card) => ({
            opacity: Number(getComputedStyle(card).opacity),
            masks: card.querySelectorAll('[aria-hidden] > [aria-hidden]').length,
          }));
          if (state.opacity !== 1 || state.masks) homepage.galleryFailures.push({ index, ...state });
        }
      }
      await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
      await page.waitForTimeout(150);
      const result = await page.evaluate(() => {
        window.scrollAudit.finished = true;
        return {
          frames: window.scrollAudit.frames,
          regressions: window.scrollAudit.regressions,
          earlyStarts: window.scrollAudit.earlyStarts,
          starts: window.scrollAudit.starts,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
      results.push({ path, width, ...result, homepage });
    }
  }
  const failures = results.filter((result) => result.regressions.length || result.earlyStarts.length || result.overflow ||
    (result.homepage && (!result.homepage.accordionToggled || !result.homepage.galleryCards || result.homepage.galleryFailures.length)));
  if (failures.length || errors.length) throw new Error(JSON.stringify({ failures, errors }));
  return {
    scenarios: results.length,
    sampledFrames: results.reduce((sum, result) => sum + result.frames, 0),
    opacityOrMaskRegressions: 0,
    earlyStarts: 0,
    observedStarts: results.reduce((sum, result) => sum + result.starts, 0),
    runtimeErrors: errors,
    results: results.map(({ path, width, frames }) => ({ path, width, frames })),
  };
}
