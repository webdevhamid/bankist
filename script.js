'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth scrolling
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation
// It will copy each funtion for each link

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Instead doing this:
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (id === '#') return;
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// DOM Traversing
// Going Downwards: child
/*
const h1 = document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = '#fff';
h1.lastElementChild.style.color = 'orangered';

// Going Upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-primary)';
h1.closest('h1').style.background = 'var(--gradient-secondary)';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.style.transform = 'scale(.5)';
  }
});
*/

///////////////////////////////////////
// Tabbed Container

/*
  1. Activate tab
        => select the button tabs element dynamically
        => deleting all active classes from the tab
        => adding new active class to the selected one
  2. Activate content
        => select the current tabs content element dynamically
        => removing the active classes from all contents
        => showing/adding the content based on their tabs
*/

tabsContainer.addEventListener('click', function (e) {
  // selecting the button tabs element dynamically
  const getTab = e.target.closest('.operations__tab');
  const getContent = document.querySelector(
    `.operations__content--${getTab?.dataset.tab}`
  );

  // Guard clause
  if (!getTab) return;

  // deleting all active classes from the tabs and contents
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Active the selected tab and content
  getTab.classList.add('operations__tab--active');
  getContent.classList.add('operations__content--active');
});

////////////////////////
////////// Menu fade animation
const menuAnimation = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    // const siblings = document.querySelectorAll('.nav__link');
    // const logo = document.querySelector('.nav__logo');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function (e) {
//   menuAnimation(e, 0.5);
// });

// Passing "argument" into menuAnimation
nav.addEventListener('mouseover', menuAnimation.bind(0.5));

nav.addEventListener('mouseout', menuAnimation.bind(1));

////////////////////////
/////// Sticky menu bar

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (this.scrollY >= initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// The intersection observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };
// const obsOptions = {
//   // Root element is the targeted element
//   // Other word this is called "Viewport"
//   root: null,
//   // Threshold is the percentage of intersection
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // rootMargin: '-90px',
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Revealing Sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  // Safe Guard
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/////////// Images lazy loads //////////////

const imageTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // We can listen the load event from the entry.target
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imageTargets.forEach(function (image) {
  imgObserver.observe(image);
});

// Building slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide='${i}'></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // 0%, 100%, 200%, 300%
  const changeSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}% )`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide) curSlide = 0;
    else curSlide++;

    changeSlide(curSlide);
    activeDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide;
    else curSlide--;
    changeSlide(curSlide);
    activeDot(curSlide);
  };

  const init = function () {
    changeSlide(0);
    createDots();
    activeDot(0);
  };
  init();
  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  // -100%, 0%, 100%, 200%

  btnLeft.addEventListener('click', prevSlide);
  // curSlide = 200%, 100%, 0%, -100%

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
      activeDot(curSlide);
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      activeDot(curSlide);
    }
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      changeSlide(slide);
      activeDot(slide);
    }
  });
};
slider();

window.addEventListener('load', function (e) {
  console.log('Page fully loaded: ', e);
});

// window.addEventListener('beforeunload', function (e) {
//   // e.preventDefault();
//   e.returnValue = 'Assalamualikum!';
// });

/*
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const getTab = e.target.closest('.operations__tab');
  const getContent = document.querySelector(
    `.operations__content--${getTab.dataset.tab}`
  );

  // Guard Clause
  if (!getTab) return;

  // Removing all active classes from the tab and content elements
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Adding an active class to the new tab button and its content element
  getTab.classList.add('operations__tab--active');
  getContent.classList.add('operations__content--active');
});
*/

///////////////////////////////////////
// HTML DOM
// Selecting Elements
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');

const allSections = document.querySelectorAll('.section');
console.log(allSections);

const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementById('section--1'));

// Creating and Deleting HTML Elements
const cookie = document.createElement('div');
cookie.innerHTML =
  'We use cookies for improving our functionality and anlytics. <button class="btn btn-close-cookie">Got It!</button>';
cookie.classList.add('cookie-message');
header.append(cookie);
// header.append(cookie);
// header.append(cookie.cloneNode(true));

// header.before(cookie);
// header.after(cookie.cloneNode(true));

// Deleting an HTML Element
document
  .querySelector('.btn-close-cookie')
  .addEventListener('click', () => cookie.remove());

// Syles
cookie.style.backgroundColor = '#37383d';
cookie.style.width = '120%';
console.log(getComputedStyle(cookie).height);
cookie.style.height = '60px!important';
cookie.style.padding = '10px 0';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const navLogo = document.querySelector('.nav__logo');
console.log(navLogo);
console.log(navLogo.alt);
console.log(navLogo.className);

// Non-standard
console.log(navLogo.programmer);

console.log(navLogo.getAttribute('programmer'));

console.log(navLogo.setAttribute('company', 'Bankist'));
navLogo.alt = 'Beautiful Logo';
console.log(navLogo.alt);

console.log(navLogo.src);
console.log(navLogo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes
// It's basically used for storing UI's data into DOM
console.log(navLogo.dataset.currentVersion);

// Classes
navLogo.classList.add('test');
navLogo.classList.remove('test');
navLogo.classList.toggle('test');
const checkClassName = navLogo.classList.contains('test')
  ? 'Test class exist'
  : 'Test class does not exist';

console.log(checkClassName);
console.log(navLogo);

navLogo.addEventListener('click', function (e) {
  e.preventDefault();
  navLogo.classList.toggle('toggle_class');
});

// Smooth scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());

  // console.log('Current scroll X/Y', window.pageXOffset, window.pageYOffset);

  // Window Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// document.querySelector('body').addEventListener('click', function (e) {
//   e.preventDefault();

//   console.log(window.pageXOffset, window.pageYOffset);
//   console.log(
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );
// });

// Other Events
/*
const h1 = document.querySelector('h1');
const alerth1 = function (e) {
  e.preventDefault();
  alert('Assalamualikum!');
};

h1.addEventListener('mouseenter', alerth1);

setTimeout(
  () =>
    // Prevent this event
    h1.removeEventListener('mouseenter', alerth1),
  3000
);
*/

// const alertOnclick = function (e) {
//   alert('Clicked!');
// };
// h1.onmouseenter = function (e) {
//   e.preventDefault();
//   alert('Assalamualikum!');
// };

// Event Bubbling
// How to generate a random number
// EXP: rgb(255,255,255);
/*
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// Generating a random color
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  // e.currentTarget = this
  console.log('LINK', e.target, e.currentTarget);

  // Stop event propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Container', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});
*/

console.log('HELLO WORLD');
