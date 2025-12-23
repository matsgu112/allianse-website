document.addEventListener('DOMContentLoaded',function(){
  // year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  if(navToggle && siteNav){
    navToggle.addEventListener('click', function(){
      const open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // basic form handler (placeholder)
  const form = document.querySelector('.contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      alert('Takk — meldingen er klar til å sendes (demo).');
    });
  }
  
  // Header show/hide on scroll
  const header = document.querySelector('.site-header');
  let lastScrollTop = window.scrollY || document.documentElement.scrollTop || 0;
  const delta = 2; // minimal movement threshold to avoid jitter

  // Set initial state based on current scroll position
  if(header && lastScrollTop > 10){
    header.classList.add('header-hidden');
    document.body.classList.add('header-hidden-active');
  }

  // --- Debug helpers ---
  function logHeaderState(label){
    if(!header) return;
    try{
      const cs = getComputedStyle(header);
      console.log('[Header]', label, {
        classHidden: header.classList.contains('header-hidden'),
        opacity: cs.opacity,
        transform: cs.transform,
        scrollY: window.scrollY || document.documentElement.scrollTop || 0
      });
    }catch(e){/* noop */}
  }
  logHeaderState('init');
  window.headerDebug = {
    hide: ()=>{ header?.classList.add('header-hidden'); document.body.classList.add('header-hidden-active'); logHeaderState('manual hide'); },
    show: ()=>{ header?.classList.remove('header-hidden'); document.body.classList.remove('header-hidden-active'); logHeaderState('manual show'); },
    toggle: ()=>{ header?.classList.toggle('header-hidden'); document.body.classList.toggle('header-hidden-active'); logHeaderState('manual toggle'); },
    log: ()=> logHeaderState('log')
  };

  window.addEventListener('scroll', function(){
    if(!header) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;

    // Ignore tiny scroll jitter
    if(Math.abs(scrollTop - lastScrollTop) <= delta) return;

    if(scrollTop > lastScrollTop && scrollTop > 10){
      // scrolling DOWN and past 10px
      header.classList.add('header-hidden');
      document.body.classList.add('header-hidden-active');
      logHeaderState('scroll down');
    } else if(scrollTop < lastScrollTop){
      // scrolling UP
      header.classList.remove('header-hidden');
      document.body.classList.remove('header-hidden-active');
      logHeaderState('scroll up');
    }

    lastScrollTop = scrollTop;
  }, {passive: true});

  // Show header when mouse moves near the top
  document.addEventListener('mousemove', function(e){
    if(e.clientY < 80 && header?.classList.contains('header-hidden')){
      header.classList.remove('header-hidden');
      document.body.classList.remove('header-hidden-active');
      logHeaderState('mousemove near top');
    }
  });

  // close mobile nav when clicking a link
  document.querySelectorAll('.site-nav a').forEach(function(a){
    a.addEventListener('click', function(){
      if(siteNav && siteNav.classList.contains('open')){
        siteNav.classList.remove('open');
        if(navToggle) navToggle.setAttribute('aria-expanded','false');
      }
    });
  });

  // animate hero image in from the right when visible
  (function(){
    const heroMedia = document.querySelector('.hero-media');
    if(!heroMedia) return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(prefersReduced){
      heroMedia.classList.add('entered');
      return;
    }
    try{
      const io = new IntersectionObserver(function(entries){
        entries.forEach(entry => {
          if(entry.isIntersecting){
            // when entering viewport, trigger the enter animation
            heroMedia.classList.add('entered');
          } else {
            // when leaving viewport, reset so it can animate again
            heroMedia.classList.remove('entered');
          }
        });
      }, {threshold: 0.15});
      io.observe(heroMedia);
    }catch(e){
      // fallback: show immediately
      heroMedia.classList.add('entered');
    }
  })();

  // lightbox for project images
  (function(){
    const items = document.querySelectorAll('.lightbox-item');
    const lightbox = document.getElementById('lightbox');
    const img = lightbox?.querySelector('.lightbox__img');
    const caption = lightbox?.querySelector('.lightbox__caption');
    const description = lightbox?.querySelector('.lightbox__description');
    const closeEls = lightbox?.querySelectorAll('[data-lightbox-close]');

    if(!items.length || !lightbox || !img || !caption) return;

    function open(item){
      const imageEl = item.querySelector('img');
      if(!imageEl) return;
      img.src = imageEl.src;
      img.alt = imageEl.alt || '';
      caption.textContent = item.dataset.title || imageEl.alt || '';
      const descEl = item.querySelector('.project-description');
      if(description){
        description.textContent = descEl ? descEl.textContent : '';
      }
      lightbox.hidden = false;
      document.body.classList.add('modal-open');
      closeEls?.[0]?.focus();
    }

    function close(){
      lightbox.hidden = true;
      document.body.classList.remove('modal-open');
      if(description) description.textContent = '';
    }

    items.forEach(item => {
      item.addEventListener('click', () => open(item));
      item.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          open(item);
        }
      });
    });

    closeEls?.forEach(btn => btn.addEventListener('click', close));
    lightbox.addEventListener('click', e => {
      if(e.target && (e.target === lightbox || e.target.hasAttribute('data-lightbox-close'))){
        close();
      }
    });
    document.addEventListener('keydown', e => {
      if(e.key === 'Escape' && !lightbox.hidden){
        close();
      }
    });
  })();
});
