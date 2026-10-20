// Playwright CLI: open the target origin, then run-code --filename=tests/browser/homepage-ui.mjs --raw
// prettier-ignore
async (page) => {
  const origin = new URL(page.url()).origin;
  const checks = [], layouts = [], accessibility = [], errors = [];
  const assert = (condition, name) => { if (!condition) throw new Error(name); checks.push(name); };
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 600, 768, 1024, 1440]) {
    await page.setViewportSize({width, height: width < 700 ? 844 : 1000});
    await page.goto(origin + '/');
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => {
      const track = document.querySelector('[data-home-work-track]');
      const bounds = track.getBoundingClientRect();
      const cards = [...document.querySelectorAll('[data-home-work-card]')];
      const arrows = [...document.querySelectorAll('.home-work__arrow')];
      return { width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
        completeCards:cards.filter(card => { const r=card.getBoundingClientRect();return r.left>=bounds.left-1&&r.right<=bounds.right+1; }).length,
        nextEdge:cards[1].getBoundingClientRect().left < bounds.right,
        clippedArrows:arrows.some(arrow=>{const a=arrow.getBoundingClientRect(),c=arrow.closest('li').getBoundingClientRect();return a.right>c.right||a.left<c.left;}),
        h1:document.querySelectorAll('h1').length, stages:document.querySelectorAll('.home-process__step').length,
        accordion:document.querySelectorAll('[data-service-accordion] summary').length };
    });
    assert(layout.scrollWidth <= width + 1 && !layout.clippedArrows, `no page overflow or clipped gallery arrows at ${width}px`);
    assert(layout.h1 === 1 && layout.stages === 5 && layout.accordion === 5, `homepage content hierarchy at ${width}px`);
    if(width === 1440) assert(layout.completeCards === 3, 'three complete gallery cards on desktop');
    if(width <= 600) assert(layout.completeCards === 1 && layout.nextEdge, `next gallery card edge visible at ${width}px`);
    layouts.push(layout);
  }
  const track = page.locator('[data-home-work-track]');
  const prev = page.locator('[data-home-work-prev]'), next = page.locator('[data-home-work-next]');
  await track.scrollIntoViewIfNeeded();
  assert(await prev.isDisabled() && await next.isEnabled(), 'gallery initial boundary controls');
  await next.click();
  await page.waitForFunction(() => document.querySelector('[data-home-work-next]').disabled);
  assert(await prev.isEnabled() && (await page.locator('[data-home-work-count]').textContent()).includes('02–04'), 'manual gallery next reaches last collection');
  await prev.click();
  await page.waitForFunction(() => document.querySelector('[data-home-work-prev]').disabled);
  await page.setViewportSize({width:390,height:844});
  await track.focus();
  await page.keyboard.press('End');
  await page.waitForFunction(() => document.querySelector('[data-home-work-next]').disabled);
  assert((await page.locator('[data-home-work-count]').textContent()).includes('04'), 'End key reaches fourth card');
  await page.keyboard.press('Home');
  await page.waitForFunction(() => document.querySelector('[data-home-work-prev]').disabled);
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelector('[data-home-work-track]').scrollLeft > 20);
  await page.waitForFunction(() => document.querySelector('[data-home-work-count]').textContent.startsWith('02'));
  assert((await page.locator('[data-home-work-count]').textContent()).startsWith('02'), 'arrow key advances horizontal track');
  await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(() => document.querySelector('[data-home-work-prev]').disabled);
  await track.hover();
  await page.mouse.wheel(600,0);
  await page.waitForTimeout(300);
  assert(await track.evaluate(el=>el.scrollLeft>20), 'native horizontal wheel moves gallery without vertical interception');
  await page.locator('[data-home-work-card] a').last().focus();
  assert(await page.locator('[data-home-work-card] a').last().evaluate(el=>{const r=el.getBoundingClientRect(),t=el.closest('ul').getBoundingClientRect();return r.left>=t.left-2&&r.right<=t.right+2;}), 'focusing offscreen collection brings its link into view');
  const details = page.locator('[data-service-accordion] details');
  assert(await details.first().evaluate(el=>el.open), 'first service panel initially open');
  for (let index=0;index<5;index++) {
    const item=details.nth(index), summary=item.locator('summary');
    await summary.focus();
    if(!await item.evaluate(el=>el.open)) await page.keyboard.press(index%2?'Space':'Enter');
    assert(await item.evaluate(el=>el.open) && await page.locator('[data-service-accordion] details[open]').count()===1, `native keyboard accordion panel ${index+1}`);
    assert(await item.locator('a').isVisible() && await item.locator('img').getAttribute('alt'), `service ${index+1} exposes its real link and image alt`);
    await page.keyboard.press('Enter');
    assert(!await item.evaluate(el=>el.open), `service panel ${index+1} can close`);
  }
  await details.first().locator('summary').click();
  assert(await page.locator('.contact-band--prominent a[href="/contact/"]').count()===1 && await page.locator('.contact-band--prominent a[href="tel:+447864692868"]').count()===1, 'homepage enquiry and telephone actions');
  for (const width of [320,390,1440]) {
    await page.setViewportSize({width,height:1000});
    await page.addScriptTag({path:'C:/Users/shaun/Documents/Codex/2026-10-20/new-chat/work/RMBGROUNDWORKS/node_modules/axe-core/axe.min.js'});
    const result=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)};});
    accessibility.push({width,...result});
    assert(!result.violations.length, `automated homepage accessibility at ${width}px: ${JSON.stringify(result.violations)}`);
  }
  const context=await page.context().browser().newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const fallback=await context.newPage();
  await fallback.goto(origin+'/');
  assert(await fallback.locator('[data-home-work-controls]').isHidden(), 'no-JavaScript gallery hides enhancement controls');
  assert(await fallback.locator('[data-home-work-card] a').count()===4, 'no-JavaScript retains all collection links');
  await fallback.locator('[data-service-accordion] summary').nth(4).click();
  assert(await fallback.locator('[data-service-accordion] details').nth(4).evaluate(el=>el.open), 'service accordion works without JavaScript');
  assert(!await fallback.locator('.session-intro').isVisible(), 'no-JavaScript content remains uncovered');
  await context.close();
  assert(!errors.length, `no browser runtime errors: ${errors.join(', ')}`);
  return {checks:checks.length,layouts,accessibility,runtimeErrors:errors};
}
