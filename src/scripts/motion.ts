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
  accent: boolean;
  complete: boolean;
};

const reveals: Reveal[] = [];
const queue: Reveal[] = [];
const active = new Set<Reveal>();
let stopped =
  (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
    ?.type === 'back_forward';

function finish(reveal: Reveal) {
  if (reveal.complete) return;
  reveal.complete = true;
  reveal.trigger?.kill();
  reveal.animation.progress(1).kill();
  reveal.split?.revert();
  reveal.elements.forEach((element) => {
    element.dataset.motionDone = 'true';
  });
  active.delete(reveal);
  const index = queue.indexOf(reveal);
  if (index >= 0) queue.splice(index, 1);
  drain();
}

function drain() {
  if (stopped) return;
  for (const reveal of [...queue]) {
    if (reveal.element.getBoundingClientRect().bottom < 0) {
      finish(reveal);
    } else if (![...active].some((item) => item.accent === reveal.accent)) {
      queue.splice(queue.indexOf(reveal), 1);
      active.add(reveal);
      reveal.animation.play();
    }
  }
}

function settleAll() {
  stopped = true;
  reveals.forEach(finish);
}

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
          accent: kind === 'rule' || kind === 'image',
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
              const tween = gsap.from(self.lines, {
                yPercent: 105,
                rotation: desktop ? 1.25 : 0,
                transformOrigin: 'left bottom',
                duration: desktop ? 0.72 : 0.48,
                stagger: { amount: 0.14 },
                ease: 'power3.out',
                paused: true,
                onComplete: () => finish(reveal),
              });
              reveal.animation = tween;
              return tween;
            },
          });
          animation = reveal.animation;
        } else if (kind === 'image' && desktop) {
          const image = element.querySelector('img');
          const timeline = gsap.timeline({ paused: true, onComplete: () => finish(reveal) });
          timeline.from(element, {
            clipPath: 'inset(0 100% 0 0)',
            x: 16,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'clipPath,transform',
          });
          if (image)
            timeline.from(
              image,
              { x: -16, scale: 1.04, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
              0,
            );
          animation = timeline;
        } else {
          animation = gsap.from(elements, {
            ...(kind === 'rule'
              ? { scaleX: 0, transformOrigin: 'left center' }
              : { opacity: 0, y: kind === 'image' ? 0 : desktop ? 16 : 8 }),
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
            onComplete: () => finish(reveal),
          });
        }
        reveal.animation = animation;
        reveals.push(reveal);
        reveal.trigger = ScrollTrigger.create({
          trigger: element,
          start: 'top 85%',
          end: 'bottom top',
          onEnter: () => {
            if (!reveal.complete && !queue.includes(reveal)) {
              queue.push(reveal);
              drain();
            }
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
