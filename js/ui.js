function toggleRange(event) {
  const clickedName = event.currentTarget;
  const targetBox = clickedName.nextElementSibling;

  document.querySelectorAll(".range-box").forEach(box => {
    if (box !== targetBox) {
      box.classList.remove("active");
    }
  });

  if (targetBox && targetBox.classList.contains("range-box")) {
    targetBox.classList.toggle("active");
  }
}

document.querySelectorAll(".range-name").forEach(name => {
  name.addEventListener("click", toggleRange);
});
const navButtons = document.querySelectorAll(".navigation-container > div");
const sections = {
  "functions-container": document.querySelector(".functions-container"),
  "context-container": document.querySelector(".context-container"),
  "credit-container": document.querySelector(".credit-container"),
};

navButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-target");

    // 모든 섹션 숨기기
    Object.values(sections).forEach(sec => {
      sec.style.display = "none";
    });

    // 해당 섹션만 보여주기
    if (sections[target]) {
      sections[target].style.display = "flex";
    }
  });
});

// 초기 로드시 functions-container 보이게 하기 (선택사항)
window.onload = () => {
  sections["functions-container"].style.display = "flex";
};