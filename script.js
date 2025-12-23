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
  
  // Header show/hide on scroll, reveal on hover or mouse near top
  const header = document.querySelector('.site-header');
  let lastY = window.scrollY || 0;
  let ticking = false;

  function showHeader(){
    if(header) header.classList.remove('header-hidden');
  }
  function hideHeader(){
    if(header) header.classList.add('header-hidden');
  }

  window.addEventListener('scroll', function(){
    if(!ticking){
      window.requestAnimationFrame(function(){
        const y = window.scrollY || 0;
        if(y > lastY + 10){
          hideHeader();
        } else if(y < lastY - 10){
          showHeader();
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, {passive: true});

  // reveal header when mouse enters top area
  document.addEventListener('mousemove', function(e){
    if(e.clientY < 80) showHeader();
  });

  // ensure header is visible when hovering over it
  if(header){
    header.addEventListener('mouseenter', showHeader);
    header.addEventListener('mouseleave', function(){
      // if user has scrolled down, hide after leaving header
      if(window.scrollY > 80) hideHeader();
    });
  }

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
