document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.transform = 'scale(1.1)';
        });

        link.addEventListener('mouseout', () => {
            link.style.transform = 'scale(1)';
        });
    });

    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        loader.style.display = 'none';
    });
});
  async function copyToClipboard(text) {
      try {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          alert("Команда скопирована в буфер обмена");
      } catch (err) {
          alert("Не удалось скопировать команду.");
      }
  }