
const menuBtn = document.getElementById('menuBtn') || document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

function initGenericSlider(root) {
  const slides = [...root.querySelectorAll('[data-slider-slide]')];
  if (!slides.length) return;
  const dots = [...root.querySelectorAll('[data-slider-dot]')];
  const prev = root.querySelector('[data-slider-prev]');
  const next = root.querySelector('[data-slider-next]');
  const controls = root.querySelector('.conference-slider-controls');
  let index = 0;
  let timer = null;
  let touchStartX = 0;
  let touchEndX = 0;
  const autoplay = root.dataset.autoplay !== 'false';
  const delay = Number(root.dataset.delay || 7000);

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, n) => {
      const active = n === index;
      slide.hidden = !active;
      slide.classList.toggle('active', active);
    });
    dots.forEach((dot, n) => dot.classList.toggle('active', n === index));
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    if (autoplay && slides.length > 1) {
      timer = setInterval(() => show(index + 1), delay);
    }
  }

  function goPrev() { show(index - 1); resetTimer(); }
  function goNext() { show(index + 1); resetTimer(); }

  if (slides.length <= 1 && controls) controls.style.display = 'none';

  prev?.addEventListener('click', goPrev);
  next?.addEventListener('click', goNext);
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); resetTimer(); }));

  root.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});
  root.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) goPrev();
      else goNext();
    }
  }, {passive: true});

  show(0);
  resetTimer();
}

document.querySelectorAll('[data-slider]').forEach(initGenericSlider);

// Legacy conference slider support used on existing pages.
const conferenceSlides = [...document.querySelectorAll('[data-conference-slide]')];
const conferenceDots = [...document.querySelectorAll('[data-conference-dot]')];
const conferencePrev = document.querySelector('[data-conference-prev]');
const conferenceNext = document.querySelector('[data-conference-next]');
let conferenceIndex = 0;
let conferenceTimer;

function showConference(index) {
  if (!conferenceSlides.length) return;
  conferenceIndex = (index + conferenceSlides.length) % conferenceSlides.length;
  conferenceSlides.forEach((slide, i) => {
    const active = i === conferenceIndex;
    slide.hidden = !active;
    slide.classList.toggle('active', active);
  });
  conferenceDots.forEach((dot, i) => dot.classList.toggle('active', i === conferenceIndex));
}

function resetConferenceTimer() {
  if (conferenceTimer) clearInterval(conferenceTimer);
  if (conferenceSlides.length > 1) {
    conferenceTimer = setInterval(() => showConference(conferenceIndex + 1), 7000);
  }
}

if (conferenceSlides.length) {
  showConference(0);
  conferencePrev?.addEventListener('click', () => { showConference(conferenceIndex - 1); resetConferenceTimer(); });
  conferenceNext?.addEventListener('click', () => { showConference(conferenceIndex + 1); resetConferenceTimer(); });
  conferenceDots.forEach((dot, i) => dot.addEventListener('click', () => { showConference(i); resetConferenceTimer(); }));
  resetConferenceTimer();
}





// Self-contained interactive project map on resume page.
(() => {
  const mapEl = document.getElementById('resumeProjectMap');
  const detail = document.getElementById('resumeProjectMapDetail');
  if (!mapEl || !detail) return;

  const locationGroups = [
    { location:'Orlando, Florida', projects:['CFX SR 414 Expressway Extension'] },
    { location:'Clear Creek County, Colorado', projects:['I-70 Floyd Hill'] },
    { location:'Broward County, Florida', projects:['Sonovoid Bridge Rehabilitation Program','Fort Lauderdale-Hollywood International Airport Terminal 5'] },
    { location:'Stuart, Florida', projects:['Roosevelt Bridge Emergency Repair'] },
    { location:'Miami, Florida', projects:['I-395 Signature Bridge'] },
    { location:'Toronto, Ontario', projects:['Don Valley Crossing'] },
    { location:'New York City', projects:['Queensboro & Throgs Neck Bridges'] }
  ];

  const pins = [...mapEl.querySelectorAll('.project-map-pin')];

  function selectLocation(i) {
    const group = locationGroups[i];
    if (!group) return;
    pins.forEach((pin,n) => pin.classList.toggle('active', n === i));
    const projectMarkup = group.projects.map(name => `<h4>${name}</h4>`).join('');
    detail.innerHTML = `<p class="eyebrow">${group.projects.length > 1 ? 'SELECTED PROJECTS' : 'SELECTED PROJECT'}</p><div class="project-map-detail-projects">${projectMarkup}</div><p class="project-map-detail-location">${group.location}</p>`;
  }

  pins.forEach((pin,i) => {
    pin.addEventListener('click', () => selectLocation(i));
    pin.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectLocation(i);
      }
    });
  });

  selectLocation(0);
})();
