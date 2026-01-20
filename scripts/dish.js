/**
 * СТРАНИЦА БЛЮДА - ЛОГИКА ДЕТАЛЬНОГО ПРОСМОТРА И ДОБАВЛЕНИЯ В КОРЗИНУ
 * 
 * Этот файл отвечает за:
 * - Загрузку данных о конкретном блюде по ID из URL
 * - Отображение детальной информации о блюде
 * - Управление количеством товара
 * - Добавление товара в корзину со страницы блюда
 */

// Глобальная переменная для хранения всех данных о блюдах
let dishesData = [];

// Глобальная переменная для хранения текущего отображаемого блюда
let currentDish = null;

/**
 * АСИНХРОННАЯ ЗАГРУЗКА ДАННЫХ О БЛЮДАХ
 * 
 * Загружает JSON файл с данными о всех блюдах.
 * После загрузки вызывает функцию для отображения конкретного блюда.
 * 
 * Порядок выполнения:
 * 1. Загрузка данных из JSON
 * 2. Сохранение данных в глобальную переменную
 * 3. Загрузка и отображение конкретного блюда (по ID из URL)
 * 4. Обновление счетчика корзины
 */
async function loadDishes() {
  try {
    // Данные берём из window.APP_DATA (файл `data/dishes-data.js`)
    dishesData = (window.APP_DATA && window.APP_DATA.dishes) ? window.APP_DATA.dishes : [];
    
    // Загружаем и отображаем конкретное блюдо (по ID из URL)
    loadDishDetail();
    
    // Обновляем счетчик товаров в корзине
    updateCartCount();
  } catch (error) {
    // В случае ошибки выводим в консоль (на странице уже есть обработка ошибок)
    console.error('Ошибка загрузки данных:', error);
  }
}

/**
 * ЗАГРУЗКА ДЕТАЛЬНОЙ ИНФОРМАЦИИ О БЛЮДЕ
 * 
 * Извлекает ID блюда из параметров URL (например, dish.html?id=5)
 * и находит соответствующее блюдо в массиве данных.
 * 
 * Процесс:
 * 1. Парсит URL параметры для получения ID
 * 2. Преобразует ID в число
 * 3. Ищет блюдо с таким ID в массиве dishesData
 * 4. Сохраняет найденное блюдо в currentDish
 * 5. Вызывает отображение детальной информации
 * 
 * Если блюдо не найдено, показывает сообщение об ошибке.
 */
function loadDishDetail() {
  // Создаем объект для работы с параметрами URL
  // Например, для dish.html?id=5 получим объект с параметром id="5"
  const urlParams = new URLSearchParams(window.location.search);
  
  // Извлекаем параметр 'id' и преобразуем в число
  const dishId = parseInt(urlParams.get('id'));
  
  // Если ID не передан или не является числом
  if (!dishId) {
    // Показываем сообщение об ошибке
    document.getElementById('dishContent').innerHTML = 
      '<p style="text-align: center; padding: 2rem;">Блюдо не найдено.</p>';
    return;  // Прерываем выполнение функции
  }
  
  // Ищем блюдо в массиве по ID
  // find возвращает первый элемент, соответствующий условию, или undefined
  currentDish = dishesData.find(dish => dish.id === dishId);
  
  // Если блюдо не найдено
  if (!currentDish) {
    // Показываем сообщение об ошибке
    document.getElementById('dishContent').innerHTML = 
      '<p style="text-align: center; padding: 2rem;">Блюдо не найдено.</p>';
    return;  // Прерываем выполнение функции
  }
  
  // Если блюдо найдено - отображаем его детальную информацию
  displayDishDetail();
}

/**
 * ОТОБРАЖЕНИЕ ДЕТАЛЬНОЙ ИНФОРМАЦИИ О БЛЮДЕ
 * 
 * Создает HTML разметку для отображения полной информации о блюде:
 * - Изображение блюда
 * - Название и цена
 * - Описание
 * - Список ингредиентов (в виде тегов)
 * - Блок управления количеством
 * - Кнопка добавления в корзину
 * 
 * Также обновляет хлебные крошки (breadcrumbs) для навигации.
 */
function displayDishDetail() {
  // Получаем элементы DOM для вставки контента
  const content = document.getElementById('dishContent');
  const breadcrumbCategory = document.getElementById('breadcrumbCategory');
  const breadcrumbName = document.getElementById('breadcrumbName');
  
  // Обновляем хлебные крошки (навигационная цепочка)
  breadcrumbCategory.textContent = currentDish.category;
  breadcrumbName.textContent = currentDish.name;
  
  // Преобразуем массив ингредиентов в HTML теги
  // map создает новый массив, где каждый ингредиент обернут в <span>
  // join объединяет все элементы массива в одну строку
  const ingredientsHTML = currentDish.ingredients
    .map(ingredient => `<span class="ingredient-tag">${ingredient}</span>`)
    .join('');
  
  // Создаем HTML разметку для детальной информации о блюде
  content.innerHTML = `
    <div class="dish-detail-content">
      <!-- Изображение блюда -->
      <img src="${currentDish.image}" alt="${currentDish.name}" class="dish-detail-image">
      
      <!-- Информация о блюде -->
      <div class="dish-detail-info">
        <!-- Название блюда -->
        <h1>${currentDish.name}</h1>
        
        <!-- Цена -->
        <div class="dish-detail-price">${currentDish.price} ₽</div>
        
        <!-- Описание -->
        <p class="dish-detail-description">${currentDish.description}</p>
        
        <!-- Секция с ингредиентами -->
        <div class="ingredients">
          <h3>Состав:</h3>
          <div class="ingredients-list">
            ${ingredientsHTML}
          </div>
        </div>
        
        <!-- Блок управления количеством и добавлением в корзину -->
        <div class="add-to-cart-section">
          <div class="quantity-selector">
            <!-- Кнопка уменьшения количества -->
            <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
            
            <!-- Поле ввода количества -->
            <input type="number" id="quantityInput" class="quantity-input" value="1" min="1" max="99">
            
            <!-- Кнопка увеличения количества -->
            <button class="quantity-btn" onclick="increaseQuantity()">+</button>
          </div>
          
          <!-- Кнопка добавления в корзину -->
          <button class="add-to-cart-btn" onclick="addToCart()">Добавить</button>
        </div>
      </div>
    </div>
  `;

  // После основного блюда рендерим похожие
  renderSimilarDishes();
}

/**
 * ОТОБРАЖЕНИЕ ПОХОЖИХ БЛЮД
 * 
 * Берём блюда из той же категории, исключаем текущее блюдо,
 * ограничиваем 3–4 позициями и показываем карточки снизу.
 */
function renderSimilarDishes() {
  const similarContainer = document.getElementById('similarDishes');
  if (!similarContainer || !currentDish || !Array.isArray(dishesData)) return;

  // Фильтруем по категории и исключаем текущее блюдо
  const sameCategory = dishesData.filter(
    dish => dish.category === currentDish.category && dish.id !== currentDish.id
  );

  // Если нет похожих - скрываем секцию
  const section = document.querySelector('.similar-section');
  if (!sameCategory.length) {
    if (section) section.style.display = 'none';
    return;
  }

  // Берём максимум 4 блюда
  const itemsToShow = sameCategory.slice(0, 4);

  similarContainer.innerHTML = itemsToShow
    .map(dish => `
      <div class="dish-card">
        <a href="dish.html?id=${dish.id}" class="dish-card-link">
          <img src="${dish.image}" alt="${dish.name}" class="dish-image">
          <div class="dish-info">
            <h3 class="dish-name">${dish.name}</h3>
            <p class="dish-description">${dish.description}</p>
            <div class="dish-price">${dish.price} ₽</div>
          </div>
        </a>
        <div class="dish-card-controls">
          <div class="dish-card-quantity">
            <button class="dish-card-quantity-btn" onclick="decreaseSimilarCardQuantity(${dish.id})">-</button>
            <input
              type="number"
              class="dish-card-quantity-input"
              id="similar-quantity-${dish.id}"
              value="1"
              min="1"
              max="99"
              onclick="event.preventDefault(); event.stopPropagation();"
            />
            <button class="dish-card-quantity-btn" onclick="increaseSimilarCardQuantity(${dish.id})">+</button>
          </div>
          <button
            class="dish-card-add-btn"
            type="button"
            onclick="addToCartFromSimilarCard(${dish.id})"
          >
            В корзину
          </button>
        </div>
      </div>
    `)
    .join('');
}

/**
 * Увеличение количества в карточке похожего товара
 */
function increaseSimilarCardQuantity(dishId) {
  const input = document.getElementById(`similar-quantity-${dishId}`);
  if (!input) return;
  const currentValue = parseInt(input.value) || 1;
  if (currentValue < 99) {
    input.value = currentValue + 1;
  }
}

/**
 * Уменьшение количества в карточке похожего товара
 */
function decreaseSimilarCardQuantity(dishId) {
  const input = document.getElementById(`similar-quantity-${dishId}`);
  if (!input) return;
  const currentValue = parseInt(input.value) || 1;
  if (currentValue > 1) {
    input.value = currentValue - 1;
  }
}

/**
 * Добавление в корзину из карточки похожего товара
 */
function addToCartFromSimilarCard(dishId) {
  const dish = dishesData.find(item => item.id === dishId);
  if (!dish) return;

  const quantityInput = document.getElementById(`similar-quantity-${dishId}`);
  const quantity = parseInt(quantityInput?.value || '1');
  if (!quantity || quantity < 1) return;

  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.dishId === dish.id);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: quantity,
      image: dish.image,
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification('Товар добавлен в корзину!');

  quantityInput.value = '1';
}

/**
 * УВЕЛИЧЕНИЕ КОЛИЧЕСТВА ТОВАРА
 * 
 * Находит поле ввода количества на странице и увеличивает его значение на 1.
 * Максимальное значение ограничено 99.
 * 
 * Используется глобальный ID "quantityInput", так как на странице только одно поле.
 */
function increaseQuantity() {
  // Находим поле ввода количества
  const input = document.getElementById('quantityInput');
  
  // Получаем текущее значение и преобразуем в число
  const currentValue = parseInt(input.value);
  
  // Если значение меньше максимума, увеличиваем на 1
  if (currentValue < 99) {
    input.value = currentValue + 1;
  }
}

/**
 * УМЕНЬШЕНИЕ КОЛИЧЕСТВА ТОВАРА
 * 
 * Находит поле ввода количества на странице и уменьшает его значение на 1.
 * Минимальное значение ограничено 1.
 * 
 * Используется глобальный ID "quantityInput", так как на странице только одно поле.
 */
function decreaseQuantity() {
  // Находим поле ввода количества
  const input = document.getElementById('quantityInput');
  
  // Получаем текущее значение и преобразуем в число
  const currentValue = parseInt(input.value);
  
  // Если значение больше минимума, уменьшаем на 1
  if (currentValue > 1) {
    input.value = currentValue - 1;
  }
}

/**
 * ДОБАВЛЕНИЕ ТОВАРА В КОРЗИНУ СО СТРАНИЦЫ БЛЮДА
 * 
 * Основная логика добавления товара в корзину:
 * 1. Проверяет, что текущее блюдо загружено
 * 2. Получает выбранное количество из поля ввода
 * 3. Загружает текущую корзину из localStorage
 * 4. Проверяет, есть ли уже это блюдо в корзине
 * 5. Если есть - увеличивает количество, если нет - добавляет новый товар
 * 6. Сохраняет обновленную корзину в localStorage
 * 7. Обновляет счетчик корзины в шапке
 * 8. Показывает уведомление об успешном добавлении
 * 
 * Использует глобальную переменную currentDish для получения данных о блюде.
 */
function addToCart() {
  // Проверяем, что блюдо загружено (защита от ошибок)
  if (!currentDish) return;
  
  // Получаем значение количества из поля ввода и преобразуем в число
  const quantity = parseInt(document.getElementById('quantityInput').value);
  
  // Загружаем текущую корзину из localStorage
  const cart = getCart();
  
  // Ищем индекс блюда в корзине (если оно уже там есть)
  // findIndex возвращает индекс элемента или -1, если не найдено
  const existingItemIndex = cart.findIndex(item => item.dishId === currentDish.id);
  
  if (existingItemIndex !== -1) {
    // Блюдо уже есть в корзине - увеличиваем его количество
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Блюда нет в корзине - добавляем новый элемент
    cart.push({
      dishId: currentDish.id,        // ID для идентификации блюда
      name: currentDish.name,        // Название для отображения
      price: currentDish.price,      // Цена за единицу
      quantity: quantity,             // Количество
      image: currentDish.image        // Изображение для корзины
    });
  }
  
  // Сохраняем обновленную корзину в localStorage
  // JSON.stringify преобразует объект в строку для хранения
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Обновляем счетчик товаров в корзине (в шапке сайта)
  updateCartCount();
  
  // Показываем уведомление об успешном добавлении
  showNotification('Товар добавлен в корзину!');
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
 * ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
 * 
 * Событие DOMContentLoaded срабатывает, когда HTML полностью загружен и распарсен,
 * но до того, как загружены изображения и другие ресурсы.
 * 
 * Это идеальное время для начала загрузки данных и инициализации приложения.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Загружаем данные о блюдах и отображаем конкретное блюдо
  loadDishes();
});

// При обычном подключении через <script src="..."> функции и так глобальные.
