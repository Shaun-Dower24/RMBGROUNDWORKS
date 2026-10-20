import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

type Reveal = {
  element: HTMLElement;
  elements: HTMLElement[];
  animation: gsap.core.Animation;
  split?: SplitText;
  trigger?: ScrollTrigger;
  complete: boolean;
};

const reveals: Reveal[] = [];
let stopped =
  (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
    ?.type === 'back_forward';

// Completion never seeks/restarts a tween while its completion callback is running.
function complete(reveal: Reveal) {
  if (reveal.complete) return;
  reveal.complete = true;
  reveal.trigger?.kill();
  reveal.animation.kill();
  reveal.split?.revert();
  reveal.elements.forEach((element) => {
    element.dataset.motionDone = 'true';
  });
}

function finish(reveal: Reveal) {
  if (reveal.complete) return;
  reveal.animation.progress(1, true);
  complete(reveal);
}

function settleAll() {
  stopped = true;
  reveals.forEach(finish);
}

// Prepare line geometry once fonts settle; content reached before then stays static.
await document.fonts.ready;
const media = gsap.matchMedia();
try {
  media.add(
    {
      desktop: '(min-width: 769px)',
      mobile: '(max-width: 768px)',
      reduce: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      if (context.conditions?.reduce || stopped) return;
      const desktop = context.conditions?.desktop;
      // Visible HTML is the fallback. Only prepare content still below the viewport.
      const targets = document.querySelectorAll<HTMLElement>('[data-motion], [data-reveal]');
      const owned = new Set<HTMLElement>();
      targets.forEach((element) => {
        if (
          document.querySelector('.contact-hero, .error-page') ||
          location.pathname.startsWith('/privacy')
        )
          return;
        const kind = element.dataset.motion || 'group';
        if (
          element.dataset.motionDone ||
          owned.has(element) ||
          (kind !== 'rule' &&
            element.closest('[data-reveal]') !==
              (element.hasAttribute('data-reveal') ? element : null))
        )
          return;
        if (element.getBoundingClientRect().top <= innerHeight || element.closest('[hidden]'))
          return;
        // A visual row is one sequence, with a bounded stagger rather than serial card waits.
        const elements =
          kind === 'group'
            ? [...(element.parentElement?.children || [])].filter(
                (sibling): sibling is HTMLElement =>
                  sibling instanceof HTMLElement &&
                  sibling.hasAttribute('data-reveal') &&
                  !sibling.dataset.motionDone &&
                  !sibling.hidden &&
                  Math.abs(
                    sibling.getBoundingClientRect().top - element.getBoundingClientRect().top,
                  ) < 8,
              )
            : [element];
        elements.forEach((target) => owned.add(target));
        const reveal = {
          element,
          elements,
          complete: false,
        } as Reveal;
        let animation: gsap.core.Animation;
        if (kind === 'text') {
          const readable = element.cloneNode(true) as HTMLElement;
          readable.querySelectorAll('br').forEach((br) => br.replaceWith(' '));
          const label = readable.textContent?.replace(/\s+/g, ' ').trim() || '';
          reveal.split = SplitText.create(element, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            aria: 'auto',
            onSplit(self) {
              element.setAttribute('aria-label', label);
              // Auto-split transfers progress on font/width changes, including a completed reveal.
              gsap.set(self.lines, {
                yPercent: 105,
                rotation: desktop ? 1.25 : 0,
                transformOrigin: 'left bottom',
              });
              const tween = gsap.to(self.lines, {
                yPercent: 0,
                rotation: 0,
                duration: desktop ? 0.72 : 0.48,
                stagger: { amount: 0.14 },
                ease: 'power3.out',
                paused: true,
                onComplete: () => complete(reveal),
              });
              reveal.animation = tween;
              return tween;
            },
          });
          animation = reveal.animation;
        } else if (kind === 'image' && desktop) {
          const image = element.querySelector('img');
          const timeline = gsap.timeline({ paused: true, onComplete: () => complete(reveal) });
          gsap.set(element, { clipPath: 'inset(0 100% 0 0)', x: 16 });
          if (image) gsap.set(image, { x: -16, scale: 1.04 });
          timeline.to(element, {
            clipPath: 'inset(0 0% 0 0)',
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'clipPath,transform',
          });
          if (image)
            timeline.to(
              image,
              { x: 0, scale: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
              0,
            );
          animation = timeline;
        } else {
          // Set the hidden state now, while offscreen. A paused from() tween can
          // otherwise defer that reset until playback, flashing already-readable content.
          gsap.set(
            elements,
            kind === 'rule'
              ? { scaleX: 0, transformOrigin: 'left center' }
              : { opacity: 0, y: kind === 'image' ? 0 : desktop ? 16 : 8 },
          );
          animation = gsap.to(elements, {
            ...(kind === 'rule' ? { scaleX: 1 } : { opacity: 1, y: 0 }),
            duration:
              kind === 'rule'
                ? desktop
                  ? 0.58
                  : 0.4
                : kind === 'image'
                  ? 0.35
                  : desktop
                    ? 0.5
                    : 0.4,
            ease: 'power2.out',
            stagger: elements.length > 1 ? { amount: 0.12 } : 0,
            paused: true,
            clearProps: 'opacity,transform',
            onComplete: () => complete(reveal),
          });
        }
        reveal.animation = animation;
        reveals.push(reveal);
        const triggerElement = kind === 'rule' ? element.parentElement! : element;
        reveal.trigger = ScrollTrigger.create({
          trigger: triggerElement,
          start: () => {
            // Let short copy fully enter and show a meaningful part of tall photos/cards.
            const inset = Math.min(
              Math.max(triggerElement.offsetHeight * 0.5, innerHeight * 0.3),
              innerHeight * 0.45,
            );
            return `clamp(top bottom-=${Math.round(inset)}px)`;
          },
          end: 'bottom top',
          onEnter: () => {
            if (!reveal.complete) reveal.animation.play();
          },
          onLeave: () => finish(reveal),
        });
      });
      return settleAll;
    },
  );
} catch {
  settleAll();
  media.revert();
}

function settleTarget(target: Element | null) {
  if (!target) return;
  reveals.forEach((reveal) => {
    if (reveal.elements.some((element) => element.contains(target) || target.contains(element)))
      finish(reveal);
  });
}
function settleHash() {
  try {
    settleTarget(document.getElementById(decodeURIComponent(location.hash.slice(1))));
  } catch {
    /* Invalid hashes keep native behaviour. */
  }
}
document.addEventListener('focusin', (event) => settleTarget(event.target as Element));
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
  if (link && link.pathname === location.pathname && link.origin === location.origin) {
    try {
      settleTarget(document.getElementById(decodeURIComponent(link.hash.slice(1))));
    } catch {
      /* Native navigation remains available. */
    }
  }
});
window.addEventListener('hashchange', settleHash);
document.addEventListener('rmb:filter', () => {
  reveals
    .filter((reveal) => reveal.elements.some((element) => element.closest('.work-card')))
    .forEach(finish);
  ScrollTrigger.refresh();
});
window.addEventListener('pagehide', settleAll);
window.addEventListener('pageshow', (event) => {
  if (event.persisted) settleAll();
});
document.fonts.ready.then(() => ScrollTrigger.refresh());
let viewportWidth = innerWidth;
window.addEventListener(
  'resize',
  () => {
    if (innerWidth !== viewportWidth) {
      viewportWidth = innerWidth;
      settleAll();
    }
  },
  { passive: true },
);
settleHash();
