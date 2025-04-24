const originalText = `안녕하세요. 이 곳에서는 한글 글꼴
「편산」을 타이핑할 수 있습니다.
타이포그래피
typography
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz`;

const editors = document.querySelectorAll('.editableDiv');
let lastInputTime = Date.now();
let hasDeletedOnce = false;      // ← 추가
let typingInterval = null;

// HTML용 줄바꿈 포함 문자열
const htmlText = originalText.replace(/\n/g, '<br>');

// 초기 렌더링
editors.forEach(editor => editor.innerHTML = htmlText);

let isSyncing = false;
// 실시간 동기화

editors.forEach((editor, idx) => {
  editor.addEventListener('input', () => {
    if (isSyncing) return;                  // 동기화 중엔 무시
    isSyncing = true;
    lastInputTime = Date.now();
    hasDeletedOnce = false;

    const content = editor.innerHTML;       // innerHTML로 <br> 포함
    editors.forEach((other, j) => {
      if (j !== idx) other.innerHTML = content;
    });

    isSyncing = false;
  });
});
// 1) 부드러운 삭제 애니메이션
function startDeleting() {
  cancelAnimationFrame(startDeleting.raf);
  let prevTime = performance.now();

  function frame(now) {
    if (now - prevTime >= 10) {
      prevTime = now;
      const txt = editors[0].innerText;
      if (!txt.length) {
        immediateRestore();
        return;
      }
      const sliced = txt.slice(0, -1);
      isSyncing = true;
      editors.forEach(ed => ed.innerText = sliced);
      isSyncing = false;
    }
    startDeleting.raf = requestAnimationFrame(frame);
  }
  startDeleting.raf = requestAnimationFrame(frame);
}

// 2) 즉시 와라락 복원
function immediateRestore() {
  cancelAnimationFrame(startDeleting.raf);
  isSyncing = true;
  editors.forEach(ed => ed.innerHTML = htmlText);
  isSyncing = false;
  lastInputTime = Date.now();
}

// 3) 타이핑 애니메이션 복원
function typingRestore() {
  cancelAnimationFrame(startDeleting.raf);
  clearInterval(typingInterval);
  isSyncing = true;
  editors.forEach(ed => ed.innerText = '');
  isSyncing = false;

  let i = 0;
  typingInterval = setInterval(() => {
    if (i >= originalText.length) {
      clearInterval(typingInterval);
      lastInputTime = Date.now();
      return;
    }
    const ch = originalText[i++];
    editors.forEach(ed => ed.innerText += ch);
  }, 10);
}

const monitoringInterval = setInterval(() => {
  const idle = Date.now() - lastInputTime > 1000;
  if (idle && !hasDeletedOnce) {
    hasDeletedOnce = true;      // ← 한 번만 삭제 트리거
    startDeleting();
  }
}, 5000);
const originalFontSize = 3; 
const originalLineHeight = 1.5;

// const navButtons = document.querySelectorAll('.navigation-container>div');

/* ―― 1.  중복된 resetToOriginalText() 정의는 **아래 하나**만 남긴다 ―― */
function resetToOriginalText(){
  clearInterval(deleteInterval);
  clearInterval(typingInterval);

  editors.forEach(ed=>{
    ed.innerText = "";
    ed.style.setProperty('font-size', originalFontSize + 'vw','important');
    ed.style.setProperty('line-height', originalLineHeight,'important');
  });

  document.getElementById('fontSizeRange').value              = originalFontSize;
  document.querySelectorAll('input[type="range"]')[1].value   = originalLineHeight;

  let i = 0;
  typingInterval = setInterval(()=>{
    if(i >= originalText.length){ clearInterval(typingInterval); return; }
    const ch = originalText[i++];
    editors.forEach(ed=> ed.innerText += ch);
  },10);

  lastInputTime = Date.now();
}


currentFontSize = originalFontSize;
currentLineHeight = originalLineHeight;

window.onload = function () {
  
  changetextDirection();
  syncEditableDivs();
};
