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

    // Скрытие загрузчика после загрузки страницы
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        loader.style.display = 'none';
    });
});
  async function copyToClipboard(text) {
      try {
          // Создаем временный элемент для копирования текста
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy'); // Используем execCommand для совместимости
          document.body.removeChild(textarea); // Удаляем временный элемент
          // Уведомление об успешном копировании
          alert("Команда скопирована в буфер обмена!");
      } catch (err) {
          // Если произошла ошибка, выводим сообщение
          alert("Не удалось скопировать команду.");
      }
  }