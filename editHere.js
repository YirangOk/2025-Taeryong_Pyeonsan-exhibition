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


const originalText = `안녕하세요. 이 곳에서는 한글 글꼴
「편산」을 타이핑할 수 있습니다.
타이포그래피
typography
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz`;
const editors = document.querySelectorAll('.editableDiv');

let lastInputTime = Date.now();
let deleteInterval = null;
let monitoringInterval = null;

// 초기 입력
editors.forEach(editor => {
  editor.innerText = originalText;
});

// 입력 동기화
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

// 삭제 시작
function startDeleting() {
  clearInterval(deleteInterval);

  deleteInterval = setInterval(() => {
    const currentText = editors[0].innerText;
    if (currentText.length === 0) {
      resetToOriginalText();
      return;
    }
    const newText = currentText.slice(0, -1);
    isSyncing = true;
    editors.forEach(editor => {
      editor.innerText = newText;
    });
    isSyncing = false;
  }, 10); // 0.1초
}

// 텍스트 복원
function resetToOriginalText() {
  clearInterval(deleteInterval);
  isSyncing = true;
  editors.forEach(editor => {
    editor.innerText = originalText;
  });
  isSyncing = false;
  lastInputTime = Date.now(); // 복원되면 타이머 리셋
}

// 1분 이상 입력 없을 시 감시
monitoringInterval = setInterval(() => {
  const now = Date.now();
  if (now - lastInputTime > 60000) { // 1분 경과
    startDeleting();
  }
}, 10000);


window.onload = function () {
  // insertText();
  changetextDirection();
  syncEditableDivs();
};
