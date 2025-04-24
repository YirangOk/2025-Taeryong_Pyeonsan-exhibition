document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector('.research-article');
    const img = document.querySelector('.context-container-images');
    const regex = /\[그림(?:\u00A0| |\s)*(\d{1,2})\]/g;
  
    function wrapMatchedTextInSpan(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        let match;
        const fragments = [];
        let lastIndex = 0;
  
        while ((match = regex.exec(text)) !== null) {
          const number = match[1];
          const matchedText = match[0];
  
          if (match.index > lastIndex) {
            fragments.push(document.createTextNode(text.slice(lastIndex, match.index)));
          }
  
          const span = document.createElement('span');
          span.textContent = matchedText;
          span.id = 'caption' + number;
          span.dataset.target = 'image' + number;
          span.classList.add('scroll-link');
          span.style.cursor = 'pointer';
  
          fragments.push(span);
          lastIndex = match.index + matchedText.length;
        }
  
        if (lastIndex < text.length) {
          fragments.push(document.createTextNode(text.slice(lastIndex)));
        }
  
        if (fragments.length > 0) {
          const parent = node.parentNode;
          fragments.forEach(f => parent.insertBefore(f, node));
          parent.removeChild(node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
        Array.from(node.childNodes).forEach(wrapMatchedTextInSpan);
      }
    }
  
    function setupLinkClicks() {
        // 텍스트 → 이미지
        document.querySelectorAll('.scroll-link').forEach(link => {
          link.addEventListener('click', () => {
            const targetId = link.dataset.target;
            const target = document.getElementById(targetId);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              flashElement(target);  // ← 깜빡임
            }
          });
        });
      
        // 이미지 → 텍스트
        const allImgs = document.querySelectorAll('img[id^="image"]');
        allImgs.forEach(img => {
          const match = img.id.match(/image(\d+)/);
          if (match) {
            const num = match[1];
            img.addEventListener('click', () => {
              const caption = document.getElementById('caption' + num);
              if (caption) {
                caption.scrollIntoView({ behavior: 'smooth', block: 'center' });
                flashElement(caption);  // ← 깜빡임
              }
            });
          }
        });
      }
      
    wrapMatchedTextInSpan(container);
    setupLinkClicks(); // 꼭 span 생성 후에 실행해야 함
      
      
      function flashElement(el) {
        el.classList.add('flash-highlight');
        setTimeout(() => {
          el.classList.remove('flash-highlight');
        }, 2000);
      }
      
      const img14 = document.getElementById('image14');
      img14.addEventListener('mouseenter', () => {
          img14.src = 'imgs/context/image_15.gif';
      });
      img14.addEventListener('mouseleave', () => {
          img14.src = 'imgs/context/image_14.gif';
      });

      const img15 = document.getElementById('image15');
      img15.addEventListener('mouseenter', () => {
          img15.src = 'imgs/context/image_17.gif';
      });
      img15.addEventListener('mouseleave', () => {
          img15.src = 'imgs/context/image_16.gif';
      });

  });