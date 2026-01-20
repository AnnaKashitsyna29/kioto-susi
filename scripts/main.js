/**
 * ГЛАВНАЯ СТРАНИЦА - ЛОГИКА ОТОБРАЖЕНИЯ МЕНЮ
 * 
 * Этот файл отвечает за:
 * - Загрузку данных о блюдах из JSON файла
 * - Группировку блюд по категориям
 * - Отображение карточек блюд на главной странице
 * - Добавление товаров в корзину прямо с карточек
 * - Управление количеством товаров в карточках
 */

// Глобальная переменная для хранения всех данных о блюдах
// Заполняется при загрузке страницы из JSON файла
let dishesData = [];

/**
 * АСИНХРОННАЯ ЗАГРУЗКА ДАННЫХ О БЛЮДАХ
 * 
 * Использует Fetch API для получения данных из JSON файла.
 * После успешной загрузки:
 * 1. Сохраняет данные в глобальную переменную dishesData
 * 2. Вызывает функцию отображения блюд
 * 3. Обновляет счетчик корзины в шапке сайта
 * 
 * При ошибке загрузки показывает сообщение пользователю
 */
async function loadDishes() {
  try {
    // В режиме file:// fetch() к JSON часто блокируется CORS.
    // Поэтому данные берём из обычного script-файла `data/dishes-data.js`,
    // который создает window.APP_DATA.
    dishesData = (window.APP_DATA && window.APP_DATA.dishes) ? window.APP_DATA.dishes : [];
    
    // Отображаем блюда на странице
    displayDishes();
    
    // Обновляем счетчик товаров в корзине (в шапке сайта)
    updateCartCount();
  } catch (error) {
    // Если произошла ошибка (файл не найден, проблемы с сетью и т.д.)
    console.error('Ошибка загрузки данных:', error);
    
    // Показываем сообщение об ошибке пользователю
    document.getElementById('dishesContainer').innerHTML = 
      '<p style="text-align: center; padding: 2rem;">Ошибка загрузки меню. Пожалуйста, обновите страницу.</p>';
  }
}

/**
 * ГРУППИРОВКА БЛЮД ПО КАТЕГОРИЯМ
 * 
 * Преобразует плоский массив блюд в объект, где ключи - это категории,
 * а значения - массивы блюд этой категории.
 * 
 * Пример результата:
 * {
 *   "Суши": [блюдо1, блюдо2, ...],
 *   "Роллы": [блюдо3, блюдо4, ...],
 *   ...
 * }
 * 
 * @returns {Object} Объект с категориями и массивами блюд
 */
function groupDishesByCategory() {
  // Создаем пустой объект для группировки
  const grouped = {};
  
  // Проходим по каждому блюду в массиве
  dishesData.forEach(dish => {
    // Если категории еще нет в объекте, создаем пустой массив для нее
    if (!grouped[dish.category]) {
      grouped[dish.category] = [];
    }
    
    // Добавляем текущее блюдо в массив его категории
    grouped[dish.category].push(dish);
  });
  
  return grouped;
}

/**
 * ОТОБРАЖЕНИЕ БЛЮД ПО КАТЕГОРИЯМ НА СТРАНИЦЕ
 * 
 * Создает структуру HTML для отображения блюд:
 * 1. Очищает контейнер от предыдущего содержимого
 * 2. Группирует блюда по категориям
 * 3. Для каждой категории создает секцию с заголовком
 * 4. Внутри секции создает сетку карточек блюд
 * 5. Добавляет все в DOM дерево
 * 
 * Категории отображаются в определенном порядке для единообразия
 */
function displayDishes() {
  // Получаем контейнер, куда будем вставлять блюда
  const container = document.getElementById('dishesContainer');
  
  // Группируем блюда по категориям
  const grouped = groupDishesByCategory();
  
  // Очищаем контейнер от предыдущего содержимого
  container.innerHTML = '';
  
  // Определяем порядок отображения категорий
  // Это гарантирует, что категории всегда будут в одном порядке
  const categoryOrder = ['Суши', 'Роллы', 'Супы', 'Салаты', 'Напитки', 'Десерты'];
  
  // Проходим по каждой категории в заданном порядке
  categoryOrder.forEach(category => {
    // Проверяем, есть ли блюда в этой категории
    if (grouped[category]) {
      // Создаем секцию для категории
      const section = document.createElement('section');
      section.className = 'category-section';
      
      // Создаем заголовок категории
      const title = document.createElement('h2');
      title.className = 'category-title';
      title.textContent = category;
      
      // Создаем сетку для карточек блюд
      const grid = document.createElement('div');
      grid.className = 'dishes-grid';
      
      // Для каждого блюда в категории создаем карточку
      grouped[category].forEach(dish => {
        const card = createDishCard(dish);
        grid.appendChild(card);
      });
      
      // Добавляем заголовок и сетку в секцию
      section.appendChild(title);
      section.appendChild(grid);
      
      // Добавляем секцию в основной контейнер
      container.appendChild(section);
    }
  });
}

/**
 * СОЗДАНИЕ КАРТОЧКИ БЛЮДА
 * 
 * Создает DOM элемент карточки блюда со следующей структурой:
 * - Изображение и информация о блюде (кликабельные, ведут на страницу блюда)
 * - Блок управления количеством (кнопки +/- и поле ввода)
 * - Кнопка "В корзину"
 * 
 * Важно: блок управления находится ВНЕ ссылки, чтобы клик по кнопкам
 * не вызывал переход на другую страницу.
 * 
 * @param {Object} dish - Объект с данными о блюде (id, name, price, image и т.д.)
 * @returns {HTMLElement} Готовая карточка блюда
 */
function createDishCard(dish) {
  // Создаем основной контейнер карточки
  const card = document.createElement('div');
  card.className = 'dish-card';
  
  // Создаем ссылку на страницу блюда
  // Клик по изображению/названию будет вести на детальную страницу
  const imageLink = document.createElement('a');
  imageLink.href = `dish.html?id=${dish.id}`;
  imageLink.className = 'dish-card-link';
  
  // Заполняем ссылку HTML содержимым: изображение, название, описание, цена
  imageLink.innerHTML = `
    <img src="${dish.image}" alt="${dish.name}" class="dish-image">
    <div class="dish-info">
      <h3 class="dish-name">${dish.name}</h3>
      <p class="dish-description">${dish.description}</p>
      <div class="dish-price">${dish.price} ₽</div>
    </div>
  `;
  
  // Добавляем ссылку в карточку
  card.appendChild(imageLink);
  
  // ========== БЛОК УПРАВЛЕНИЯ КОЛИЧЕСТВОМ И ДОБАВЛЕНИЕМ ==========
  // Этот блок находится ВНЕ ссылки, чтобы клики по кнопкам не вызывали переход
  
  // Создаем контейнер для всех элементов управления
  const controls = document.createElement('div');
  controls.className = 'dish-card-controls';
  
  // Создаем контейнер для управления количеством
  const quantityDiv = document.createElement('div');
  quantityDiv.className = 'dish-card-quantity';
  
  // ========== КНОПКА УМЕНЬШЕНИЯ КОЛИЧЕСТВА ==========
  const decreaseBtn = document.createElement('button');
  decreaseBtn.className = 'dish-card-quantity-btn';
  decreaseBtn.textContent = '-';
  // Обработчик клика: предотвращаем всплытие события и переход по ссылке
  decreaseBtn.onclick = (e) => {
    e.preventDefault();      // Отменяем стандартное поведение
    e.stopPropagation();     // Останавливаем всплытие события
    decreaseCardQuantity(dish.id);  // Вызываем функцию уменьшения
  };
  
  // ========== ПОЛЕ ВВОДА КОЛИЧЕСТВА ==========
  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.className = 'dish-card-quantity-input';
  quantityInput.value = '1';        // Начальное значение
  quantityInput.min = '1';          // Минимальное значение
  quantityInput.max = '99';          // Максимальное значение
  quantityInput.id = `quantity-${dish.id}`;  // Уникальный ID для каждого блюда
  // При клике на поле также предотвращаем всплытие
  quantityInput.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // ========== КНОПКА УВЕЛИЧЕНИЯ КОЛИЧЕСТВА ==========
  const increaseBtn = document.createElement('button');
  increaseBtn.className = 'dish-card-quantity-btn';
  increaseBtn.textContent = '+';
  increaseBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    increaseCardQuantity(dish.id);  // Вызываем функцию увеличения
  };
  
  // Собираем элементы управления количеством вместе
  quantityDiv.appendChild(decreaseBtn);
  quantityDiv.appendChild(quantityInput);
  quantityDiv.appendChild(increaseBtn);
  
  // ========== КНОПКА ДОБАВЛЕНИЯ В КОРЗИНУ ==========
  const addBtn = document.createElement('button');
  addBtn.className = 'dish-card-add-btn';
  addBtn.textContent = 'В корзину';
  addBtn.type = 'button';  // Важно: type="button" предотвращает отправку формы
  addBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartFromCard(dish);  // Вызываем функцию добавления в корзину
  };
  
  // Собираем все элементы управления вместе
  controls.appendChild(quantityDiv);
  controls.appendChild(addBtn);
  
  // Добавляем блок управления в карточку (ВНЕ ссылки!)
  card.appendChild(controls);
  
  return card;
}

/**
 * УВЕЛИЧЕНИЕ КОЛИЧЕСТВА ТОВАРА В КАРТОЧКЕ
 * 
 * Находит поле ввода количества для конкретного блюда и увеличивает значение на 1.
 * Максимальное значение ограничено 99.
 * 
 * @param {number} dishId - ID блюда, для которого нужно увеличить количество
 */
function increaseCardQuantity(dishId) {
  // Находим поле ввода по уникальному ID
  const input = document.getElementById(`quantity-${dishId}`);
  
  // Получаем текущее значение и преобразуем в число
  const currentValue = parseInt(input.value);
  
  // Если значение меньше максимума, увеличиваем на 1
  if (currentValue < 99) {
    input.value = currentValue + 1;
  }
}

/**
 * УМЕНЬШЕНИЕ КОЛИЧЕСТВА ТОВАРА В КАРТОЧКЕ
 * 
 * Находит поле ввода количества для конкретного блюда и уменьшает значение на 1.
 * Минимальное значение ограничено 1.
 * 
 * @param {number} dishId - ID блюда, для которого нужно уменьшить количество
 */
function decreaseCardQuantity(dishId) {
  // Находим поле ввода по уникальному ID
  const input = document.getElementById(`quantity-${dishId}`);
  
  // Получаем текущее значение и преобразуем в число
  const currentValue = parseInt(input.value);
  
  // Если значение больше минимума, уменьшаем на 1
  if (currentValue > 1) {
    input.value = currentValue - 1;
  }
}

/**
 * ДОБАВЛЕНИЕ ТОВАРА В КОРЗИНУ ИЗ КАРТОЧКИ
 * 
 * Основная логика добавления товара в корзину:
 * 1. Получает выбранное количество из поля ввода
 * 2. Загружает текущую корзину из localStorage
 * 3. Проверяет, есть ли уже это блюдо в корзине
 * 4. Если есть - увеличивает количество, если нет - добавляет новый товар
 * 5. Сохраняет обновленную корзину в localStorage
 * 6. Обновляет счетчик корзины в шапке
 * 7. Показывает уведомление об успешном добавлении
 * 8. Сбрасывает количество обратно на 1
 * 
 * @param {Object} dish - Объект с данными о блюде
 */
function addToCartFromCard(dish) {
  // Находим поле ввода количества для этого блюда
  const quantityInput = document.getElementById(`quantity-${dish.id}`);
  
  // Получаем значение количества и преобразуем в число
  const quantity = parseInt(quantityInput.value);
  
  // Загружаем текущую корзину из localStorage
  const cart = getCart();
  
  // Ищем индекс блюда в корзине (если оно уже там есть)
  // findIndex возвращает индекс элемента или -1, если не найдено
  const existingItemIndex = cart.findIndex(item => item.dishId === dish.id);
  
  if (existingItemIndex !== -1) {
    // Блюдо уже есть в корзине - увеличиваем его количество
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Блюда нет в корзине - добавляем новый элемент
    cart.push({
      dishId: dish.id,        // ID для идентификации блюда
      name: dish.name,        // Название для отображения
      price: dish.price,      // Цена за единицу
      quantity: quantity,     // Количество
      image: dish.image       // Изображение для корзины
    });
  }
  
  // Сохраняем обновленную корзину в localStorage
  // JSON.stringify преобразует объект в строку для хранения
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Обновляем счетчик товаров в корзине (в шапке сайта)
  updateCartCount();
  
  // Показываем уведомление об успешном добавлении
  showNotification('Товар добавлен в корзину!');
  
  // Сбрасываем количество обратно на 1 для следующего добавления
  quantityInput.value = '1';
}

/**
 * ОБНОВЛЕНИЕ СЧЕТЧИКА КОРЗИНЫ В ШАПКЕ САЙТА
 * 
 * Подсчитывает общее количество товаров в корзине (суммируя quantity каждого товара)
 * и обновляет отображение счетчика в шапке сайта.
 * 
 * Вызывается после каждого изменения корзины (добавление, удаление, изменение количества).
 */
function updateCartCount() {
  // Загружаем текущую корзину
  const cart = getCart();
  
  // Подсчитываем общее количество товаров
  // reduce проходит по всем элементам и суммирует их quantity
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Находим элемент счетчика в DOM
  const cartCountElement = document.getElementById('cartCount');
  
  // Если элемент существует (есть на странице), обновляем его текст
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

/**
 * ПОЛУЧЕНИЕ КОРЗИНЫ ИЗ LOCALSTORAGE
 * 
 * Загружает данные корзины из локального хранилища браузера.
 * Если корзины нет (первый визит), возвращает пустой массив.
 * 
 * Формат данных в localStorage: JSON строка
 * Формат возвращаемого значения: массив объектов с товарами
 * 
 * @returns {Array} Массив товаров в корзине
 */
function getCart() {
  // Получаем строку JSON из localStorage
  const cartJson = localStorage.getItem('cart');
  
  // Если данные есть - парсим JSON в объект, иначе возвращаем пустой массив
  return cartJson ? JSON.parse(cartJson) : [];
}

/**
 * ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
 * 
 * Событие DOMContentLoaded срабатывает, когда HTML полностью загружен и распарсен,
 * но до того, как загружены изображения и другие ресурсы.
 * 
 * Это идеальное время для начала загрузки данных и инициализации приложения.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Загружаем данные о блюдах и отображаем их
  loadDishes();
});
