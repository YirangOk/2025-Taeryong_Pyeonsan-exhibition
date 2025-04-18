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
  } else {
    editableDivs[0].style.fontFamily = "'PyeonsanBetaAA', serif";
    editableDivs[1].style.fontFamily = "'PyeonsanBetaBB', serif";
  }

  fontSwitched = !fontSwitched;
});

  const previewTarget = document.querySelector(".preview span"); 
  const glyphDivs = document.querySelectorAll(".glyphs-contants .hangle div, .latin-A div, .latin-B div, .numberandcharacter div");
  
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
  });
  