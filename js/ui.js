const navButtons = document.querySelectorAll(".navigation-container > div");
const sections = {
  "functions-container": document.querySelector(".functions-container"),
  "context-container": document.querySelector(".context-container"),
  "glyph-container": document.querySelector(".glyph-container"),
  "archive-container": document.querySelector(".archive-container")
};

navButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-target");

    // 모든 섹션 숨기기
    Object.values(sections).forEach(sec => {
      sec.style.visibility = "hidden";
    });

    // 해당 섹션만 보여주기
    if (sections[target]) {
      sections[target].style.visibility = "visible";
    }
  });
});

window.onload = () => {
  sections["functions-container"].style.visibility = "visibility";
};


const toggleButton = document.getElementById("toggleFontButton");
let fontSwitched = false;

toggleButton.addEventListener("click", () => {
  const editableDivs = document.querySelectorAll(".editableDiv");

  if (!fontSwitched) {
    editableDivs[0].style.fontFamily = "'PyeonsanAA', serif";
    editableDivs[1].style.fontFamily = "'PyeonsanBB', serif";
  } else {
    editableDivs[0].style.fontFamily = "'PyeonsanBetaAA', serif";
    editableDivs[1].style.fontFamily = "'PyeonsanBetaBB', serif";
  }

  fontSwitched = !fontSwitched;
});

  const previewTarget = document.querySelector(".preview span"); // 보여줄 곳
  const glyphDivs = document.querySelectorAll(".glyphs-contants .hangle div, .latin-A div, .latin-B div, .numberandcharacter div");

  glyphDivs.forEach(glyph => {
    glyph.addEventListener("click", () => {
      const clickedChar = glyph.textContent.trim();
      previewTarget.textContent = clickedChar;
    });
  });

  // document.querySelectorAll('.gallery img').forEach(img => {
  //   const applySpan = () => {
  //     const containerCols = 12;
  //     const baseColWidth = 1; // 1단위
  //     const baseRowHeight = 1; // 1vw = 1단위
  
  //     const w = img.naturalWidth;
  //     const h = img.naturalHeight;
  //     const aspect = w / h;
  
  //     // 고정된 컬럼 span 기준 (비율에 따라 너비 조절)
  //     let colSpan;
  //     if (aspect > 2.5) colSpan = 8;
  //     else if (aspect > 1.7) colSpan = 6;
  //     else if (aspect > 1.2) colSpan = 5;
  //     else if (aspect > 1.0) colSpan = 4;
  //     else colSpan = 3;
  
  //     // 그에 따라 height span 계산
  //     const ratio = h / w;
  //     const rowSpan = Math.ceil(colSpan * ratio * (baseColWidth / baseRowHeight));
  
  //     img.style.gridColumn = `span ${colSpan}`;
  //     img.style.gridRow = `span ${rowSpan}`;
  //   };
  
  //   if (img.complete) applySpan();
  //   else img.onload = applySpan;
  // });
  
  document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => {
      const modal = document.getElementById('imageModal');
      const modalImg = document.getElementById('modalImage');
      const caption = document.getElementById('caption');
  
      modal.style.display = 'block';
      modalImg.src = img.src;
      caption.textContent = img.nextElementSibling?.textContent || '';
    });
  });
  
  document.querySelector('.modal .close').addEventListener('click', () => {
    document.getElementById('imageModal').style.display = 'none';
  });
  
  document.getElementById('imageModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      e.currentTarget.style.display = 'none';
    }
  });
  