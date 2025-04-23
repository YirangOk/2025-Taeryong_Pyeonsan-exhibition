document.addEventListener('DOMContentLoaded', () => {
  /* A. 섹션 토글 ------------------------------------------------ */
  const navButtons = document.querySelectorAll('.navigation-container>div');
  const sections = {
    'functions-container': document.querySelector('.functions-container'),
    'context-container': document.querySelector('.context-container'),
    'glyph-container': document.querySelector('.glyph-container'),
    'archive-container': document.querySelector('.archive-container')
    // 'credit-container': document.querySelector('.credit-container')
  };

  function showSection(id) {
    Object.values(sections).forEach(s => {
      if (!s) return;
      s.scrollTop = 0;
      s.querySelectorAll('*').forEach(c => c.scrollTop = 0);
      s.style.visibility = 'hidden';
    });
    if (sections[id]) sections[id].style.visibility = 'visible';
    window.scrollTo({
      top: 0
    });
  }
  navButtons.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.target)));
  showSection('functions-container');

  /* B. 글꼴 토글 ---------------------------------------------- */
  const toggleButton = document.getElementById('toggleFontButton');
  if (toggleButton) {
    let swapped = false;
    toggleButton.addEventListener('click', () => {
      const ed = document.querySelectorAll('.editableDiv');
      if (ed.length < 2) return;
      if (!swapped) {
        ed[0].style.fontFamily = "'PyeonsanAA',serif";
        ed[1].style.fontFamily = "'PyeonsanBB',serif";
        toggleButton.style.cssText = 'background:#fff;color:#000;border:1px solid #000';
      } else {
        ed[0].style.fontFamily = "'PyeonsanBetaAA',serif";
        ed[1].style.fontFamily = "'PyeonsanBetaBB',serif";
        toggleButton.style.cssText = 'background:#000;color:#fff;border:1px solid #000';
      }
      swapped = !swapped;
    });
  }

  /* C. 글리프 미리보기 ---------------------------------------- */
  const preview = document.querySelector('.preview span');
  if (preview) {
    document.querySelectorAll('.glyphs-contants .glyphs-characters div').forEach(g => g.addEventListener('mouseenter', () => {
      preview.textContent = g.textContent.trim();
    }));
  }

  /* D. 갤러리 그룹화 + 중복 노드 이동 ------------------------- */
  const items = [...document.querySelectorAll('.grid-item')];
  const hiddenBox = document.getElementById('hidden-group-items');
  items.forEach(it => {
    const cap = it.querySelector('figcaption');
    if (!cap) return;
    let [, title] = cap.innerHTML.split('<br>');
    title = (title || '').replace(/<[^>]*>/g, '').trim();
    if (!title) title = cap.innerHTML.split('<br>')[0].replace(/<[^>]*>/g, '').trim();
    title = title.replace(/\s*\d+\s*$/, '').trim();
    it.dataset.group = title;
  });
  const seen = new Set();
  items.forEach(it => {
    const g = it.dataset.group;
    if (seen.has(g)) {
      hiddenBox.appendChild(it);
    } else {
      seen.add(g);
    }
  });

  /* E. 모달 내비게이션 ---------------------------------------- */
  const modal = document.getElementById('imageModal'),
    imgModal = document.getElementById('modalImage'),
    caption = document.getElementById('caption'),
    prev = document.getElementById('prev'),
    next = document.getElementById('next');
  let current = [],
    idx = 0;

  document.querySelectorAll('.gallery .grid-item').forEach(it => {
    it.addEventListener('click', () => {
      current = [...document.querySelectorAll(`.grid-item[data-group="${it.dataset.group}"]`)];
      idx = current.indexOf(it);
      open();
    });
  });

  function open() {
    const n = current[idx];
    if (!n) return;
    imgModal.src = n.querySelector('img').src;
    caption.innerHTML = n.querySelector('figcaption').innerHTML;
    modal.style.display = 'block';
    prev.style.visibility = idx ? 'visible' : 'hidden';
    next.style.visibility = idx === current.length - 1 ? 'hidden' : 'visible';
  }
  const closeModal = () => modal.style.display = 'none';
  modal.querySelector('.close').onclick = closeModal;
  window.onclick = e => {
    if (e.target === modal) closeModal();
  };
  prev.onclick = () => {
    if (idx > 0) {
      --idx;
      open();
    }
  };
  next.onclick = () => {
    if (idx < current.length - 1) {
      ++idx;
      open();
    }
  };

  /* F. Justified‑Gallery -------------------------------------- */
  function initGallery() {
    const h = window.innerWidth > 1920 ? 700 : 300,
      m = window.innerWidth > 1920 ? 20 : 10;
    $('.gallery').justifiedGallery('destroy');
    $('.gallery').justifiedGallery({
      selector: '.grid-item',
      rowHeight: h,
      maxRowHeight: h * 1.2,
      margins: m,
      captions: false,
      lastRow: 'justify'
    });
  }
  initGallery();
  window.addEventListener('resize', debounce(initGallery, 250));

  function debounce(f, d) {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => f(...a), d);
    };
  }
});