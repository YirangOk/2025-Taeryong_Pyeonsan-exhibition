// 1. name: 웹 페이지에 표시될 폰트의 이름입니다. 이 이름은 사용자 인터페이스에 직접 보여지며,
//    사용자가 폰트를 선택할 때 표시되는 이름입니다.
// 2. url: 폰트 파일이 저장된 위치의 URL입니다. 이 URL은 웹 페이지에서 해당 폰트를
//    불러오기 위해 사용됩니다. 폰트 파일은 서버의 해당 경로에 저장되어 있어야 합니다.
//    기존에 저장된 위치는 fonts woff가 저장되어 있습니다.
// 3. textDirectionSelect.value: 화면 로드시 세로쓰기를 먼저 마주하고싶을 때 '1' 작성
// 4. text: 미리보기에 보여질 본문입니다.

const fonts = [{
    name: '노토산스 Regular',
    url: 'fonts/NotoSans-Regular.woff'
  }, {
    name: '노토산스 Medium',
    url: 'fonts/NotoSans-Medium.woff'
  }, {
    name: '노토산스 Bold',
    url: 'fonts/NotoSans-Bold.woff'
  }];


const originalText = 
`안녕하세요. 이 곳에서는 한글 글꼴
「편산」을 타이핑할 수 있습니다.
타이포그래피
typography
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz`;
const editors = document.querySelectorAll('.editableDiv');

let lastInputTime = Date.now();
let deleteInterval = null;
let monitoringInterval = null;


const htmlText = originalText.replace(/\n/g, "<br>");
editors.forEach(editor => {
  editor.innerHTML = htmlText;
});


let isSyncing = false;
editors.forEach((editor, index) => {
  editor.addEventListener('input', () => {
    if (isSyncing) return;
    isSyncing = true;
    const content = editor.innerText;
    lastInputTime = Date.now();

    editors.forEach((otherEditor, i) => {
      if (i !== index) {
        otherEditor.innerText = content;
      }
    });

    isSyncing = false;
  });
});

function startDeleting () {
  cancelAnimationFrame(startDeleting.raf);
  let last = performance.now();

  function frame (now) {
    if (now - last >= 10) {            // 0.01 s 간격
      last = now;
      const txt = editors[0].innerText;
      if (!txt.length) { resetToOriginalText(); return; }

      const newTxt = txt.slice(0, -1);
      isSyncing = true;
      editors.forEach(ed => ed.innerText = newTxt);
      isSyncing = false;
    }
    startDeleting.raf = requestAnimationFrame(frame);
  }
  startDeleting.raf = requestAnimationFrame(frame);
}


function resetToOriginalText() {
  clearInterval(deleteInterval);
  isSyncing = true;
  editors.forEach(editor => {
    editor.innerText = originalText;
  });
  isSyncing = false;
  lastInputTime = Date.now(); 
}


monitoringInterval = setInterval(() => {
  const now = Date.now();
  if (now - lastInputTime > 60000) { 
    startDeleting();
  }
}, 5000);

const originalFontSize = 3; 
const originalLineHeight = 1.5;
let typingInterval = null;

const navButtons = document.querySelectorAll('.navigation-container>div');

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

/* ―― 2.  네비게이션을 누를 때마다 텍스트를 초기 상태로 되돌린다 ―― */
navButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const target = btn.getAttribute('data-target');

    /* glyph-container를 떠날 때에만 초기화하려면 ↓ 조건 주석 해제
       if(target !== 'glyph-container') resetToOriginalText();
    */
    resetToOriginalText();             // 모든 탭 전환에 대해 초기화
  });
});

currentFontSize = originalFontSize;
currentLineHeight = originalLineHeight;

// window.onload = function () {
  
//   changetextDirection();
//   syncEditableDivs();
// };
