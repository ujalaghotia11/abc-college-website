
  /* mobile menu */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const overlay = document.getElementById('overlay');

  function closeMenu(){
    mainNav.classList.remove('open');
    menuToggle.classList.remove('open');
    overlay.classList.remove('show');
    document.querySelectorAll('.has-mega.open').forEach(el => el.classList.remove('open'));
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    overlay.classList.toggle('show', isOpen);
  });
  overlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.has-mega').forEach(item => {
    const link = item.querySelector('a.nav-link');
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 1020) { e.preventDefault(); item.classList.toggle('open'); }
    });
  });
  document.querySelectorAll('.main-nav > a.nav-link').forEach(link=>{
    link.addEventListener('click', () => { if (window.innerWidth <= 1020) closeMenu(); });
  });

  /* ---- hero illustration carousel ---- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots button');
  const captionEl = document.getElementById('heroCaption');
  const captions = [
    'The Grand Reading Hall, University Library',
    'The Founders\' Building, Est. 1978',
    'Convocation Day, Class of 2026',
    'Centre for Global Research & Studies'
  ];
  let current = 0;
  let timer;

  function goTo(index){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    captionEl.textContent = captions[current];
    resetTimer();
  }

  function next(){ goTo(current + 1); }

  function resetTimer(){
    clearInterval(timer);
    timer = setInterval(next, 4500);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index)));
  });

  resetTimer();

  /* ---- animated count-up stats (runs once, when scrolled into view) ---- */
  function formatNumber(num, useComma){
    return useComma ? num.toLocaleString('en-IN') : String(num);
  }

  function animateCount(el){
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const useComma = el.dataset.comma === 'true';
    const duration = 1800;
    const startTime = performance.now();

    function tick(now){
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out for a smooth deceleration into the final number
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = formatNumber(current, useComma) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const countEls = document.querySelectorAll('.count-up');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  countEls.forEach(el => countObserver.observe(el));

  /* ---- courses: search + tab filter + "show more" pagination ---- */
  const tabs = document.querySelectorAll('.course-tab');
  const cards = Array.from(document.querySelectorAll('.course-card'));
  const searchInput = document.getElementById('courseSearch');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const noResults = document.getElementById('noResults');
  const courseCount = document.getElementById('courseCount');

  const PAGE_SIZE = 6;
  let activeFilter = 'all';
  let searchTerm = '';
  let visibleCount = PAGE_SIZE;

  function getMatches(){
    return cards.filter(card => {
      const matchesFilter = activeFilter === 'all' || card.dataset.cat === activeFilter;
      const matchesSearch = searchTerm === '' || (card.dataset.name || '').includes(searchTerm);
      return matchesFilter && matchesSearch;
    });
  }

  function render(){
    const matches = getMatches();

    cards.forEach(card => card.classList.add('js-hidden'));
    matches.slice(0, visibleCount).forEach(card => card.classList.remove('js-hidden'));

    noResults.style.display = matches.length === 0 ? 'block' : 'none';

    const remaining = matches.length - visibleCount;
    if (remaining > 0){
      loadMoreBtn.classList.remove('js-hidden');
      loadMoreBtn.textContent = `Show More Programs (${remaining} more)`;
    } else {
      loadMoreBtn.classList.add('js-hidden');
    }

    courseCount.textContent = matches.length > 0
      ? `Showing ${Math.min(visibleCount, matches.length)} of ${matches.length} program${matches.length === 1 ? '' : 's'}`
      : '';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      visibleCount = PAGE_SIZE;
      render();
    });
  });

  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    visibleCount = PAGE_SIZE;
    render();
  });

  loadMoreBtn.addEventListener('click', () => {
    visibleCount += PAGE_SIZE;
    render();
  });

  render();

  /* ---- welcome greeting modal ---- */
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalExploreBtn = document.getElementById('modalExploreBtn');
  const modalApplyBtn = document.getElementById('modalApplyBtn');

  function openWelcomeModal(){
    welcomeOverlay.classList.add('show');
  }
  function closeWelcomeModal(){
    welcomeOverlay.classList.remove('show');
  }

  window.addEventListener('load', () => {
    setTimeout(openWelcomeModal, 600);
  });

  modalClose.addEventListener('click', closeWelcomeModal);
  modalExploreBtn.addEventListener('click', closeWelcomeModal);
  modalApplyBtn.addEventListener('click', closeWelcomeModal);
  welcomeOverlay.addEventListener('click', (e) => {
    if (e.target === welcomeOverlay) closeWelcomeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeWelcomeModal();
  });

  /* ---- application form (client-side demo submission) ---- */
  const applicationForm = document.getElementById('applicationForm');
  const applySuccess = document.getElementById('applySuccess');

  applicationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    applicationForm.style.display = 'none';
    applySuccess.classList.add('show');
    // In production, send form data to your server or admissions API here.
  });
