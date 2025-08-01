document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("generatorForm");
  const output = document.getElementById("output");
  const iframeCode = document.getElementById("iframeCode");
  const copyBtn = document.getElementById("copyBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const imgUrl = document.getElementById("imgUrl").value;
    const wordsInput = document.getElementById("wordsInput").value.trim();
    const words = wordsInput.split(/\s+/).filter(w => w);

    if (words.length !== 5) {
      alert("Введите ровно 5 слов через пробел!");
      return;
    }

    // Формируем HTML-страницу как строку
    const pageContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Shatter Effect</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: transparent;
      font-family: Arial, sans-serif;
    }
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
      transition: transform 0.2s ease;
    }
    .shatter-img:hover {
      transform: scale(1.05);
    }
    .piece {
      position: absolute;
      border-radius: 2px;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
      pointer-events: none;
    }
    .word {
      position: absolute;
      font-size: 20px;
      font-weight: bold;
      color: #e74c3c;
      opacity: 0;
      animation: fadeIn 1s forwards;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
      z-index: 10;
    }
    @keyframes fadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <img 
      src="${imgUrl}" 
      alt="Кликни на меня" 
      class="shatter-img" 
      id="shatterImg"
    >
  </div>

  <script>
    document.getElementById("shatterImg").addEventListener("click", function(e) {
      const img = this;
      const rect = img.getBoundingClientRect();
      const container = img.closest('.container');
      const words = ["${words.join('","')}"];

      const pieceW = 12;
      const pieceH = 12;

      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const piece = document.createElement('div');
          piece.classList.add('piece');
          piece.style.width = pieceW + 'px';
          piece.style.height = pieceH + 'px';
          piece.style.backgroundImage = 'url(\\"' + img.src + '\\")';
          piece.style.backgroundSize = rect.width + 'px ' + rect.height + 'px';
          piece.style.backgroundPosition = '-' + (col * pieceW) + 'px -' + (row * pieceH) + 'px';
          piece.style.left = (rect.left + col * pieceW) + 'px';
          piece.style.top = (rect.top + row * pieceH) + 'px';

          const angle = Math.random() * Math.PI * 2;
          const speed = 20 + Math.random() * 50;
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed;
          const rotation = -20 + Math.random() * 40;

          container.appendChild(piece);

          setTimeout(() => {
            piece.style.transition = 'all 1s cubic-bezier(0.17, 0.67, 0.2, 1)';
            piece.style.transform = 'translate(' + vx + 'px, ' + vy + 'px) rotate(' + rotation + 'deg) scale(0.85)';
            piece.style.opacity = '0';
          }, 10);

          setTimeout(() => piece.remove(), 1000);
        }
      }

      img.style.opacity = '0';
      setTimeout(() => img.remove(), 300);

      setTimeout(() => {
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
    });
  <\/script>
</body>
</html>`;

    // 🔥 Ключевое исправление: правильно экранируем кавычки и символы
    const escapedContent = pageContent
      .replace(/"/g, '&quot;')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/&/g, '&amp;')
      .replace(/\//g, '&#x2F;');

    // Генерируем iframe
    const iframe = `<iframe srcdoc="${escapedContent}" style="border:none;" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;
    
    iframeCode.value = iframe;
    output.style.display = "block";
  });

  // Копирование
  copyBtn.addEventListener("click", () => {
    iframeCode.select();
    document.execCommand("copy");
    copyBtn.textContent = "Скопировано!";
    setTimeout(() => (copyBtn.textContent = "Копировать"), 2000);
  });
});
