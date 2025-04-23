const navButtons = document.querySelectorAll(".navigation-container > div");
const sections = {
  "functions-container": document.querySelector(".functions-container"),
  "context-container": document.querySelector(".context-container"),
  "glyph-container": document.querySelector(".glyph-container"),
  "archive-container": document.querySelector(".archive-container"),
  "credit-container": document.querySelector(".credit-container")
};

navButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-target");


    Object.values(sections).forEach(sec => {
      sec.style.visibility = "hidden";
    });


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

    toggleButton.style.backgroundColor = "#ffffff";
    toggleButton.style.color = "#000000";
    toggleButton.style.border = "1px solid #000000";
  } else {
    editableDivs[0].style.fontFamily = "'PyeonsanBetaAA', serif";
    editableDivs[1].style.fontFamily = "'PyeonsanBetaBB', serif";

    toggleButton.style.backgroundColor = "#000000";
    toggleButton.style.color = "#ffffff";
    toggleButton.style.border = "1px solid #000000";
  }

  fontSwitched = !fontSwitched;
});

const previewTarget = document.querySelector(".preview span");
const glyphDivs = document.querySelectorAll(".glyphs-contants .glyphs-characters div");

glyphDivs.forEach(glyph => {
  glyph.addEventListener("mouseenter", () => {
    const hoveredChar = glyph.textContent.trim();
    previewTarget.textContent = hoveredChar;
  });
});

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


navButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-target");


    Object.values(sections).forEach(sec => {
      const computedStyle = window.getComputedStyle(sec);
      if (computedStyle.overflowY === "scroll" || computedStyle.overflowY === "auto") {
        sec.scrollTop = 0;
      }

      sec.querySelectorAll("*").forEach(child => {
        const childStyle = window.getComputedStyle(child);
        if (childStyle.overflowY === "scroll" || childStyle.overflowY === "auto") {
          child.scrollTop = 0;
        }
      });
    });


    Object.values(sections).forEach(sec => {
      sec.style.visibility = "hidden";
    });


    if (sections[target]) {
      sections[target].style.visibility = "visible";
    }


    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });

function initGallery() {
  const rowH = window.innerWidth > 1920 ? 700 : 300;   // 1920 px 초과면 500
  const margin = window.innerWidth > 1920 ? 20 : 10;

  $('.gallery').justifiedGallery('destroy');           // 이전 인스턴스 제거
  $('.gallery').justifiedGallery({
    selector      : 'figure',
    rowHeight     : rowH,
    maxRowHeight  : rowH * 1.2,                       // 필요 시 비례 조정
    margins       : margin,
    captions      : false,
    lastRow       : 'justify'
  });
}

window.addEventListener('load', initGallery);
window.addEventListener('resize', debounce(initGallery, 250));

/* 간단한 디바운스 함수 */
function debounce(fn, delay){
  let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), delay); };
}

});