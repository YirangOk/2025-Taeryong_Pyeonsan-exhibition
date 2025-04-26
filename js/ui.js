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
    document.querySelectorAll('.glyphs-contants .glyphs-characters div').forEach(g => {
      g.addEventListener('mouseenter', () => {
        preview.textContent = g.textContent.trim();
  
        const parentClassList = g.parentElement.classList;
        if (parentClassList.contains('PyeonsanAA')) {
          preview.style.fontFamily = 'a';
        } else if (parentClassList.contains('latin-B')) {
          preview.style.fontFamily = 'PyeonsanBB';
        }
      });
    });
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
    title = title.replace(/\s*\s*$/, '').trim();
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
  
    const thumb = n.querySelector('img');
  
    /* 1. 썸네일이 아직 lazy 상태면 즉시 로드 */
    if (thumb.dataset.src) {
      thumb.src = thumb.dataset.src;    // 진짜 이미지 fetch
      delete thumb.dataset.src;
    }
  
    /* 2. onload 이후 모달에 표시 (캐시에 있으면 곧바로 실행) */
    thumb.onload = () => {
      imgModal.src = thumb.src;
    };
    if (thumb.complete) imgModal.src = thumb.src;   // 이미 캐시돼 있으면 바로
  
    /* 3. 캡션 & 내비게이션 처리는 그대로 */
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
  /* F. IntersectionObserver (lazy-load) ─────────── */
  const io = new IntersectionObserver((entries, ob) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
  
      const img = entry.target;
      img.src = img.dataset.src;          // ① 실제 로드
      ob.unobserve(img);
  
      img.onload = () => {                // ② 다 받았을 때만 제거
        delete img.dataset.src;
        $('.gallery').justifiedGallery('norewind');
      };
    });
  });
  /* G. 갤러리 레이아웃 ──────────────────────────── */
  function initGallery() {
    const h = window.innerWidth > 1920 ? 700 : 300,
      m = window.innerWidth > 1920 ? 20 : 10;

    // 기존 인스턴스 제거
    $('.gallery').justifiedGallery('destroy');

    $('.gallery')
      .justifiedGallery({
        selector: 'figure.grid-item',  // 항목을 figure 요소로 지정
        imgSelector: '> img',           // 썸네일 이미지를 명확히 지정
        rowHeight: h,
        maxRowHeight: h * 1.2,
        margins: m,
        captions: false, 
        lastRow: 'nojustify',
        waitThumbnailsLoad: true
      }).on('jg.complete', function(){
        const $gallery = $(this);
    
        // 1. 각 엔트리마다 이미지 높이만큼 figcaption의 padding-top 설정
        $gallery.find('.jg-entry').each(function(){
          const $entry   = $(this);
          const $img     = $entry.find('img');
          const imgH     = $img.height();
          const $figure  = $img.closest('figure.grid-item');
          const $caption = $figure.find('figcaption');
    
          $caption.css('padding-top', imgH + 'px');  
          // CSS padding-top으로 이미지 높이만큼 텍스트를 아래로 위치시킴
        });
    
        // 2. 각 .jg-row의 최대 엔트리 높이를 계산해 해당 높이로 통일
        $gallery.find('.jg-row').each(function(){
          let maxH = 0;
          const $row = $(this);
    
          $row.find('.jg-entry').each(function(){
            const h = $(this).outerHeight(true);
            if (h > maxH) maxH = h;
          });
    
          $row.find('.jg-entry').css({
            height: maxH + 'px',
            overflow: 'visible'
          });
        });
      });
    /* 최초 한 번 관찰 시작 */
    document
      .querySelectorAll('img.lazy[data-src]')
      .forEach(img => io.observe(img));
  }

  initGallery();
  window.addEventListener('resize', debounce(initGallery, 250));

  /* ── debounce 헬퍼 ─────────────────────────────── */
  function debounce(fn, delay) {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), delay);
    };
  }

});