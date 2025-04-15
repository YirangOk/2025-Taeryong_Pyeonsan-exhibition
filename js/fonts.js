let currentFontSize = 30;
let currentLineHeight = 1.5;

for (let i = 0; i < fonts.length; i++) {
  const font = fonts[i];

  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(`
    @font-face {
      font-family: '${font.name}';
      src: url('${font.url}') format('woff');
    }
  `)
  );
  document.head.appendChild(style);

  const option = document.createElement("option");
  option.text = font.name;
  select.appendChild(option);
}

select.selectedIndex = 0;
changeFontFamily();

function changeFontFamily() {
  const font = select.options[select.selectedIndex].text;
  document.querySelectorAll(".editableDiv").forEach(div => {
    div.style.fontFamily = font;
  });
}

document.querySelectorAll(".editableDiv").forEach(div => {
  div.addEventListener("paste", function (e) {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, pastedText);
  });
});

function isKorean(text) {
  const koreanPattern = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
  return koreanPattern.test(text);
}

function saveSelection(element) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rangeClone = range.cloneRange();

  return {
    range: rangeClone,
    offsetStart: range.startOffset,
    offsetEnd: range.endOffset,
  };
}

function restoreSelection(element, savedSelection) {
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(savedSelection.range);
  selection.collapse(
    savedSelection.range.startContainer,
    savedSelection.offsetStart
  );
  if (savedSelection.offsetStart !== savedSelection.offsetEnd) {
    selection.extend(
      savedSelection.range.startContainer,
      savedSelection.offsetEnd
    );
  }
}

function applyTextStyles() {
  const pxSize = currentFontSize + "vw";
  const pxLineHeight = currentFontSize * currentLineHeight + "vw";

  const divs = document.querySelectorAll(".editableDiv");

  console.log("적용 div 개수:", divs.length);

  divs.forEach(div => {
    div.style.fontSize = pxSize;
    div.style.lineHeight = pxLineHeight;
    div.style.setProperty('font-size', pxSize, 'important');
    div.style.setProperty('line-height', pxLineHeight, 'important');
  });
}

function changeFontSize(sizeValue) {
  console.log("폰트크기:", sizeValue);
  currentFontSize = parseFloat(sizeValue);
  applyTextStyles();
}

function changeLineHeight(heightValue) {
  console.log("라인높이:", heightValue);
  currentLineHeight = parseFloat(heightValue);
  applyTextStyles();
}


function showValueHeight(heightValue) {
  currentLineHeight = parseFloat(heightValue);
  applyTextStyles();
}

window.onload = function () {
  applyTextStyles();
  changeFontFamily();
};