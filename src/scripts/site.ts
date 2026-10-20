const header = document.querySelector<HTMLElement>('[data-header]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const menuToggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 40);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

function closeMenu(restoreFocus = true) {
  menu?.classList.remove('is-open');
  if (menu) menu.inert = true;
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('menu-open');
  document.querySelectorAll<HTMLElement>('main,.site-footer').forEach((element) => {
    element.inert = false;
  });
  if (restoreFocus) menuToggle?.focus();
}
menuToggle?.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  if (!opening) return closeMenu();
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close menu');
  if (menu) menu.inert = false;
  menu?.classList.add('is-open');
  document.body.classList.add('menu-open');
  document.querySelectorAll<HTMLElement>('main,.site-footer').forEach((element) => {
    element.inert = true;
  });
  menuToggle.focus();
});
menu
  ?.querySelectorAll('a')
  .forEach((link) => link.addEventListener('click', () => closeMenu(false)));
document.addEventListener('keydown', (event) => {
  if (!menu?.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeMenu();
  if (event.key !== 'Tab') return;
  const items = [menuToggle!, ...menu.querySelectorAll<HTMLElement>('a,button')].filter(Boolean);
  const first = items[0],
    last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});
window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu(false);
});

const slides = [...document.querySelectorAll<HTMLElement>('[data-hero-slide]')];
let currentSlide = 0;
function showSlide(index: number) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === currentSlide);
    slide.setAttribute('aria-hidden', String(i !== currentSlide));
  });
  const caption = document.querySelector('[data-hero-caption]');
  const count = document.querySelector('[data-hero-count]');
  if (caption) caption.textContent = slides[currentSlide].dataset.caption || '';
  if (count) count.textContent = `0${currentSlide + 1} / 0${slides.length}`;
}
document
  .querySelector('[data-hero-prev]')
  ?.addEventListener('click', () => showSlide(currentSlide - 1));
document
  .querySelector('[data-hero-next]')
  ?.addEventListener('click', () => showSlide(currentSlide + 1));

const filterBar = document.querySelector<HTMLElement>('[data-filters]');
if (filterBar) {
  filterBar.hidden = false;
  const buttons = [...filterBar.querySelectorAll<HTMLButtonElement>('button[data-filter]')];
  const cards = [...document.querySelectorAll<HTMLElement>('.work-card[data-category]')];
  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      cards.forEach((card) => {
        card.hidden = category !== 'All' && card.dataset.category !== category;
        if (!card.hidden) count++;
      });
      const status = document.querySelector('[data-filter-count]');
      if (status)
        status.textContent = `${String(count).padStart(2, '0')} work collection${count === 1 ? '' : 's'}`;
    }),
  );
}

const lightbox = document.querySelector<HTMLDialogElement>('[data-lightbox]');
const galleryButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-lightbox-src]')];
let galleryIndex = 0;
let sourceButton: HTMLButtonElement | undefined;
function updateLightbox(index: number) {
  galleryIndex = (index + galleryButtons.length) % galleryButtons.length;
  const button = galleryButtons[galleryIndex];
  const image = document.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const caption = document.querySelector('[data-lightbox-caption]');
  const count = document.querySelector('[data-lightbox-count]');
  if (image) {
    image.src = button.dataset.lightboxSrc!;
    image.alt = button.dataset.caption || '';
  }
  if (caption) caption.textContent = button.dataset.caption || '';
  if (count)
    count.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(galleryButtons.length).padStart(2, '0')}`;
}
galleryButtons.forEach((button, index) =>
  button.addEventListener('click', () => {
    sourceButton = button;
    updateLightbox(index);
    lightbox?.showModal();
    document.body.classList.add('lightbox-open');
    document.querySelector<HTMLButtonElement>('[data-lightbox-close]')?.focus();
  }),
);
document.querySelector('[data-lightbox-close]')?.addEventListener('click', () => lightbox?.close());
document
  .querySelector('[data-lightbox-prev]')
  ?.addEventListener('click', () => updateLightbox(galleryIndex - 1));
document
  .querySelector('[data-lightbox-next]')
  ?.addEventListener('click', () => updateLightbox(galleryIndex + 1));
lightbox?.addEventListener('close', () => {
  document.body.classList.remove('lightbox-open');
  sourceButton?.focus();
});
lightbox?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    updateLightbox(galleryIndex - 1);
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    updateLightbox(galleryIndex + 1);
  }
});

const revealElements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
let revealObserver: IntersectionObserver | undefined;
function showAll() {
  revealObserver?.disconnect();
  revealElements.forEach((element) => {
    element.classList.remove('is-waiting');
    element.classList.add('is-visible');
  });
}
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-ready');
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-waiting');
          entry.target.classList.add('is-visible');
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  revealElements.forEach((element) => {
    if (element.getBoundingClientRect().top > window.innerHeight * 0.95) {
      element.classList.add('is-waiting');
      revealObserver?.observe(element);
    }
  });
}
reducedMotion.addEventListener('change', (event) => {
  if (event.matches) showAll();
});

const form = document.querySelector<HTMLFormElement>('[data-enquiry-form]');
if (form) {
  const params = new URLSearchParams(window.location.search);
  for (const name of ['intent', 'service']) {
    const select = form.elements.namedItem(name);
    const value = params.get(name);
    if (
      select instanceof HTMLSelectElement &&
      value &&
      [...select.options].some((option) => option.value === value)
    )
      select.value = value;
  }
  const feedback = form.querySelector<HTMLElement>('[data-form-feedback]')!;
  const submit = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const setFeedback = (message: string, state: string) => {
    feedback.textContent = message;
    feedback.dataset.state = state;
    feedback.hidden = false;
  };
  function clearErrors() {
    form!.querySelectorAll<HTMLElement>('[data-field-error]').forEach((element) => {
      element.textContent = '';
    });
    form!
      .querySelectorAll('[aria-invalid]')
      .forEach((element) => element.removeAttribute('aria-invalid'));
    feedback.hidden = true;
  }
  function setFieldError(name: string, message: string) {
    const field = form!.elements.namedItem(name);
    if (field instanceof HTMLElement) field.setAttribute('aria-invalid', 'true');
    const error = form!.querySelector<HTMLElement>(`[data-field-error="${name}"]`);
    if (error) error.textContent = message;
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (!String(data.email || '').trim() && !String(data.phone || '').trim()) {
      setFieldError('email', 'Please provide an email address or phone number.');
      setFieldError('phone', 'Please provide an email address or phone number.');
      (form.elements.namedItem('email') as HTMLInputElement)?.focus();
      return;
    }
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    const label = submit.querySelector('[data-submit-label]')!;
    label.textContent = 'Sending your enquiry…';
    let serverError = '';
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        if (result?.fields)
          Object.entries(result.fields).forEach(([name, message]) =>
            setFieldError(name, String(message)),
          );
        serverError =
          result?.error ||
          'Your enquiry could not be sent. Please call or email us using the details on this page.';
        throw new Error('Enquiry was not accepted');
      }
      form.hidden = true;
      const success = document.querySelector<HTMLElement>('[data-form-success]');
      if (success) {
        success.hidden = false;
        success.focus();
      }
    } catch {
      setFeedback(
        serverError ||
          'Your enquiry has not been confirmed. Please try again, email info@rmbgroundworks.co.uk or call 07864 692868.',
        'error',
      );
      feedback.focus();
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      label.textContent = 'Send your enquiry';
    }
  });
}
