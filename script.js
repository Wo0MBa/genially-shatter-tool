document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("generatorForm");
  const demoArea = document.getElementById("demoArea");
  const output = document.getElementById("output");
  const iframeCode = document.getElementById("iframeCode");
  const copyBtn = document.getElementById("copyBtn");

  // При клике на форму — очищаем старое
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

    // Очистка предыдущего демо
    demoArea.innerHTML = "";

    // Создаём демо-картинку
    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = "Демо";
    img.className = "demo-img";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%)";
    demoArea.appendChild(img);

    // Обработчик клика
    img.addEventListener("click", (e) => {
      img.style.animation = "shatter 0.6s forwards";
      setTimeout(() => img.remove(), 600);

      words.forEach((word, i) => {
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 70 + Math.random() * 30;
        const x = e.clientX + Math.cos(angle) * distance;
        const y = e.clientY + Math.sin(angle) * distance;

        const wordEl = document.createElement("div");
        wordEl.classList.add("word");
        wordEl.textContent = word;
        wordEl.style.left = `${x}px`;
        wordEl.style.top = `${y}px`;
        demoArea.appendChild(wordEl);
      });
    });

    // Генерируем iframe-код
    const pageContent = generatePageContent(imgUrl, words);
    const blob = new Blob([pageContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const iframe = `<iframe src="${url}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;
    iframeCode.value = iframe;
    output.style.display = "block";
  });

  // Копировать в буфер
  copyBtn.addEventListener("click", () => {
    iframeCode.select();
    document.execCommand("copy");
    copyBtn.textContent = "Скопировано!";
    setTimeout(() => (copyBtn.textContent = "Копировать"), 2000);
  });

  // Генерация HTML-страницы для iframe
  function generatePageContent(imgUrl, words) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Shatter Image</title>
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
      width: 100px;
      height: 100px;
      cursor: pointer;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      transition: transform 0.2s;
    }
    .shatter-img:hover { transform: scale(1.05); }
    @keyframes shatter {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2) rotate(10deg); opacity: 0.6; }
      100% { transform: scale(0) rotate(45deg); opacity: 0; }
    }
    .word {
      position: absolute;
      font-size: 18px;
      font-weight: bold;
      color: #e74c3c;
      opacity: 0;
      animation: fadeIn 1s forwards;
    }
    @keyframes fadeIn { to { opacity: 1; } }
  </style>
</head>
<body>
  <div class="container">
    <img src="${imgUrl}" alt="Картинка" class="shatter-img" onclick="shatter(this, event)">
  </div>
  <script>
    function shatter(img, e) {
      img.style.animation = 'shatter 0.6s forwards';
      setTimeout(() => img.remove(), 600);
      const words = ${JSON.stringify(words)};
      words.forEach((word, i) => {
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 70 + Math.random() * 30;
        const x = e.clientX + Math.cos(angle) * distance;
        const y = e.clientY + Math.sin(angle) * distance;
        const wordEl = document.createElement('div');
        wordEl.classList.add('word');
        wordEl.textContent = word;
        wordEl.style.left = x + 'px';
        wordEl.style.top = y + 'px';
        document.body.appendChild(wordEl);
      });
    }
  <\/script>
</body>
</html>`;
  }
});
