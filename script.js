document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("generatorForm");
  const demoArea = document.getElementById("demoArea");
  const output = document.getElementById("output");
  const iframeCode = document.getElementById("iframeCode");
  const copyBtn = document.getElementById("copyBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const imgUrl = document.getElementById("imgUrl").value;
    const words = [
      document.getElementById("word1").value,
      document.getElementById("word2").value,
      document.getElementById("word3").value,
      document.getElementById("word4").value,
      document.getElementById("word5").value,
    ];

    // Очистка
    demoArea.innerHTML = "";

    // Создаём картинку
    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = "Разрушаемая картинка";
    img.className = "demo-img";
    img.style.position = "absolute";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%)";
    img.style.width = "120px";
    img.style.height = "120px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "8px";
    img.style.cursor = "pointer";
    demoArea.appendChild(img);

    // Обработчик клика
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      shatterImage(img, e, words);
    });

    // Генерация iframe
    const pageContent = generatePageContent(imgUrl, words);
    const blob = new Blob([pageContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const iframe = `<iframe src="${url}" width="100%" height="400" frameborder="0" allowfullscreen style="border:none;"></iframe>`;
    iframeCode.value = iframe;
    output.style.display = "block";
  });

  function shatterImage(img, e, words) {
    const rect = img.getBoundingClientRect();
    const w = rect.width / 10; // ширина одного кусочка
    const h = rect.height / 10;

    // Создаём 10x10 = 100 фрагментов
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const piece = document.createElement("div");
        piece.style.position = "absolute";
        piece.style.width = w + "px";
        piece.style.height = h + "px";
        piece.style.backgroundImage = `url(${img.src})`;
        piece.style.backgroundSize = `${rect.width}px ${rect.height}px`;
        piece.style.backgroundPosition = `-${col * w}px -${row * h}px`;
        piece.style.borderRadius = "2px";
        piece.style.boxSizing = "border-box";
        piece.style.filter = "drop-shadow(0 1px 2px rgba(0,0,0,0.3))";
        piece.style.left = rect.left + col * w + "px";
        piece.style.top = rect.top + row * h + "px";
        piece.style.pointerEvents = "none";

        // Случайное смещение
        const angle = Math.random() * Math.PI * 2;
        const speed = 20 + Math.random() * 50;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const rotation = -20 + Math.random() * 40;

        demoArea.appendChild(piece);

        // Анимация полёта
        setTimeout(() => {
          piece.style.transition = "all 1s cubic-bezier(0.17, 0.67, 0.2, 1)";
          piece.style.transform = `translate(${vx}px, ${vy}px) rotate(${rotation}deg) scale(0.8)`;
          piece.style.opacity = "0";
        }, 10);

        // Удаляем фрагмент
        setTimeout(() => piece.remove(), 1000);
      }
    }

    // Удаляем саму картинку
    img.style.opacity = "0";
    setTimeout(() => img.remove(), 300);

    // Показываем слова через 0.6 секунд (после взрыва)
    setTimeout(() => {
      words.forEach((word, i) => {
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 100 + Math.random() * 30;
        const x = e.clientX + Math.cos(angle) * distance;
        const y = e.clientY + Math.sin(angle) * distance;

        const wordEl = document.createElement("div");
        wordEl.classList.add("word");
        wordEl.textContent = word;
        wordEl.style.left = `${x}px`;
        wordEl.style.top = `${y}px`;
        demoArea.appendChild(wordEl);
      });
    }, 600);
  }

  // Генерация контента для iframe
  function generatePageContent(imgUrl, words) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Shattered Image</title>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
    .container {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .shatter-img {
      width: 120px;
      height: 120px;
      cursor: pointer;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .word {
      position: absolute;
      font-size: 18px;
      font-weight: bold;
      color: #e74c3c;
      opacity: 0;
      animation: fadeIn 1s forwards;
    }
    @keyframes fadeIn {
      to { opacity: 1; }
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${imgUrl}" alt="Картинка" class="shatter-img" onclick="shatter(this, event)">
  </div>
  <script>
    function shatter(img, e) {
      const rect = img.getBoundingClientRect();
      const w = rect.width / 10;
      const h = rect.height / 10;
      const container = img.closest('.container') || document.body;

      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const piece = document.createElement("div");
          piece.style.position = "absolute";
          piece.style.width = w + 'px';
          piece.style.height = h + 'px';
          piece.style.backgroundImage = 'url(${imgUrl})';
          piece.style.backgroundSize = rect.width + 'px ' + rect.height + 'px';
          piece.style.backgroundPosition = \`-\${col * w}px -\${row * h}px\`;
          piece.style.borderRadius = "2px";
          piece.style.filter = "drop-shadow(0 1px 2px rgba(0,0,0,0.3))";
          piece.style.left = (rect.left + col * w) + 'px';
          piece.style.top = (rect.top + row * h) + 'px';
          piece.style.pointerEvents = "none";

          const angle = Math.random() * Math.PI * 2;
          const speed = 20 + Math.random() * 50;
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed;
          const rotation = -20 + Math.random() * 40;

          container.appendChild(piece);

          setTimeout(() => {
            piece.style.transition = "all 1s cubic-bezier(0.17, 0.67, 0.2, 1)";
            piece.style.transform = \`translate(\${vx}px, \${vy}px) rotate(\${rotation}deg) scale(0.8)\`;
            piece.style.opacity = "0";
          }, 10);

          setTimeout(() => piece.remove(), 1000);
        }
      }

      img.style.opacity = "0";
      setTimeout(() => img.remove(), 300);

      setTimeout(() => {
        const words = ${JSON.stringify(words)};
        words.forEach((word, i) => {
          const angle = (Math.PI * 2 * i) / 5;
          const distance = 100 + Math.random() * 30;
          const x = e.clientX + Math.cos(angle) * distance;
          const y = e.clientY + Math.sin(angle) * distance;

          const wordEl = document.createElement('div');
          wordEl.classList.add('word');
          wordEl.textContent = word;
          wordEl.style.left = x + 'px';
          wordEl.style.top = y + 'px';
          container.appendChild(wordEl);
        });
      }, 600);
    }
  <\/script>
</body>
</html>`;
  }

  // Копировать
  copyBtn.addEventListener("click", () => {
    iframeCode.select();
    document.execCommand("copy");
    copyBtn.textContent = "Скопировано!";
    setTimeout(() => (copyBtn.textContent = "Копировать"), 2000);
  });
});
