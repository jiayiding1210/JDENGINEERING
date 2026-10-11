const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
}

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
