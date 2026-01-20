/**
 * СТРАНИЦА КОРЗИНЫ - ЛОГИКА УПРАВЛЕНИЯ КОРЗИНОЙ И ПРОМОКОДАМИ
 * 
 * Этот файл отвечает за:
 * - Отображение товаров в корзине
 * - Изменение количества товаров
 * - Удаление товаров из корзины
 * - Применение промокодов
 * - Расчет итоговой суммы со скидкой
 * - Оформление заказа
 */

// Глобальная переменная для хранения всех промокодов
let promocodes = [];

// Глобальная переменная для хранения примененного промокода
// null - промокод не применен, объект - примененный промокод с данными о скидке
let appliedPromocode = null;

/**
 * АСИНХРОННАЯ ЗАГРУЗКА ДАННЫХ
 * 
 * Загружает JSON файл с данными о блюдах и промокодах.
 * После загрузки:
 * 1. Сохраняет данные в глобальные переменные
 * 2. Отображает корзину
 * 3. Обновляет счетчик корзины
 */
async function loadData() {
  try {
    // Данные берём из window.APP_DATA (файл `data/dishes-data.js`)
    promocodes = (window.APP_DATA && window.APP_DATA.promocodes) ? window.APP_DATA.promocodes : [];
    
    // Отображаем корзину с товарами
    displayCart();
    
    // Обновляем счетчик товаров в корзине (в шапке сайта)
    updateCartCount();
  } catch (error) {
    // В случае ошибки выводим в консоль
    console.error('Ошибка загрузки данных:', error);
  }
}

/**
 * ОТОБРАЖЕНИЕ КОРЗИНЫ НА СТРАНИЦЕ
 * 
 * Создает полную HTML разметку для страницы корзины:
 * 1. Проверяет, есть ли товары в корзине
 * 2. Если корзина пуста - показывает сообщение и ссылку на меню
 * 3. Если есть товары:
 *    - Отображает список товаров с возможностью изменения количества
 *    - Показывает секцию для ввода промокода
 *    - Рассчитывает и отображает итоговую сумму (с учетом скидки)
 *    - Добавляет кнопку оформления заказа
 * 
 * Функция полностью пересоздает HTML содержимое страницы корзины.
 */
function displayCart() {
  // Загружаем текущую корзину из localStorage
  const cart = getCart();
  
  // Получаем контейнер для содержимого корзины
  const content = document.getElementById('cartContent');
  
  // ========== ПРОВЕРКА НА ПУСТУЮ КОРЗИНУ ==========
  if (cart.length === 0) {
    // Если корзина пуста, показываем сообщение и ссылку на меню
    content.innerHTML = `
      <div class="empty-cart">
        <h2>Корзина пуста</h2>
        <p>Добавьте блюда из меню</p>
        <a href="index.html">Перейти в меню</a>
      </div>
    `;
    return;  // Прерываем выполнение функции
  }
  
  // ========== ОТОБРАЖЕНИЕ СПИСКА ТОВАРОВ ==========
  // Начинаем формировать HTML строку для списка товаров
  let html = '<div class="cart-items">';
  
  // Проходим по каждому товару в корзине
  // index нужен для идентификации товара при изменении количества или удалении
  cart.forEach((item, index) => {
    // Для каждого товара создаем карточку с информацией и элементами управления
    html += `
      <div class="cart-item">
        <!-- Изображение товара -->
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        
        <!-- Информация о товаре -->
        <div class="cart-item-info">
          <h3 class="cart-item-name">${item.name}</h3>
          <div class="cart-item-price">${item.price} ₽ за шт.</div>
        </div>
        
        <!-- Элементы управления товаром -->
        <div class="cart-item-controls">
          <!-- Блок управления количеством -->
          <div class="quantity-selector">
            <!-- Кнопка уменьшения количества (передает индекс и изменение -1) -->
            <button class="quantity-btn" onclick="updateCartQuantity(${index}, -1)">-</button>
            
            <!-- Отображение текущего количества -->
            <span style="padding: 0 1rem; font-size: 1.2rem;">${item.quantity}</span>
            
            <!-- Кнопка увеличения количества (передает индекс и изменение +1) -->
            <button class="quantity-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
          </div>
          
          <!-- Кнопка удаления товара (передает индекс для удаления) -->
          <button class="remove-item-btn" onclick="removeFromCart(${index})">Удалить</button>
        </div>
      </div>
    `;
  });
  
  // Закрываем контейнер списка товаров
  html += '</div>';
  
  // ========== СЕКЦИЯ ПРОМОКОДА ==========
  html += `
    <div class="promocode-section">
      <h3>Промокод</h3>
      <div class="promocode-input-group">
        <!-- Поле ввода промокода -->
        <input 
          type="text" 
          id="promocodeInput" 
          class="promocode-input" 
          placeholder="Введите промокод"
          value="${appliedPromocode ? appliedPromocode.code : ''}"
          ${appliedPromocode ? 'disabled' : ''}
        >
        
        <!-- Кнопка применения/удаления промокода -->
        <!-- Если промокод применен - показываем кнопку "Удалить", иначе "Применить" -->
        <button 
          class="apply-promocode-btn" 
          onclick="${appliedPromocode ? 'removePromocode()' : 'applyPromocode()'}"
        >
          ${appliedPromocode ? 'Удалить' : 'Применить'}
        </button>
      </div>
      
      <!-- Контейнер для сообщений о промокоде (успех/ошибка) -->
      <div id="promocodeMessage"></div>
    </div>
  `;
  
  // ========== РАСЧЕТ ИТОГОВОЙ СУММЫ ==========
  // Рассчитываем сумму без скидки (субтотал)
  const subtotal = calculateSubtotal();
  
  // Рассчитываем размер скидки (если промокод применен)
  // Если промокод есть - вычисляем процент от субтотала, иначе 0
  const discount = appliedPromocode ? (subtotal * appliedPromocode.discount / 100) : 0;
  
  // Рассчитываем итоговую сумму к оплате (субтотал минус скидка)
  const total = subtotal - discount;
  
  // ========== БЛОК ИТОГОВОЙ ИНФОРМАЦИИ ==========
  html += `
    <div class="cart-summary">
      <h3>Итого</h3>
      
      <!-- Строка с суммой товаров без скидки -->
      <div class="summary-row">
        <span>Товаров на сумму:</span>
        <span>${subtotal} ₽</span>
      </div>
      
      <!-- Строка со скидкой (отображается только если промокод применен) -->
      ${appliedPromocode ? `
        <div class="summary-row discount-row">
          <span>Скидка (${appliedPromocode.discount}%):</span>
          <span>-${discount.toFixed(2)} ₽</span>
        </div>
      ` : ''}
      
      <!-- Строка с итоговой суммой к оплате -->
      <div class="summary-row total">
        <span>К оплате:</span>
        <span>${total.toFixed(2)} ₽</span>
      </div>
      
      <!-- Кнопка оформления заказа -->
      <button class="checkout-btn" onclick="checkout()">Оформить заказ</button>
    </div>
  `;
  
  // Вставляем весь созданный HTML в контейнер страницы
  content.innerHTML = html;
}

/**
 * РАСЧЕТ СУММЫ БЕЗ СКИДКИ (СУБТОТАЛ)
 * 
 * Проходит по всем товарам в корзине и суммирует их стоимость.
 * Формула для каждого товара: цена × количество
 * 
 * @returns {number} Общая стоимость всех товаров в корзине
 */
function calculateSubtotal() {
  // Загружаем текущую корзину
  const cart = getCart();
  
  // Используем reduce для суммирования
  // reduce проходит по каждому элементу и накапливает сумму
  // sum - накопленная сумма, item - текущий товар
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * ОБНОВЛЕНИЕ КОЛИЧЕСТВА ТОВАРА В КОРЗИНЕ
 * 
 * Изменяет количество конкретного товара в корзине.
 * 
 * Логика:
 * 1. Загружает текущую корзину
 * 2. Изменяет количество товара по индексу
 * 3. Если количество стало <= 0, удаляет товар из корзины
 * 4. Сохраняет обновленную корзину
 * 5. Перерисовывает страницу корзины
 * 6. Обновляет счетчик в шапке
 * 
 * @param {number} index - Индекс товара в массиве корзины
 * @param {number} change - Изменение количества (+1 или -1)
 */
function updateCartQuantity(index, change) {
  // Загружаем текущую корзину из localStorage
  const cart = getCart();
  
  // Изменяем количество товара по индексу
  cart[index].quantity += change;
  
  // Если количество стало 0 или меньше, удаляем товар из корзины
  if (cart[index].quantity <= 0) {
    // splice удаляет элемент из массива по индексу
    // Первый параметр - индекс, второй - количество элементов для удаления
    cart.splice(index, 1);
  }
  
  // Сохраняем обновленную корзину в localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Перерисовываем страницу корзины (чтобы обновить суммы и отображение)
  displayCart();
  
  // Обновляем счетчик товаров в шапке сайта
  updateCartCount();
}

/**
 * УДАЛЕНИЕ ТОВАРА ИЗ КОРЗИНЫ
 * 
 * Полностью удаляет товар из корзины по его индексу.
 * 
 * Процесс:
 * 1. Загружает текущую корзину
 * 2. Удаляет товар по индексу из массива
 * 3. Сохраняет обновленную корзину
 * 4. Перерисовывает страницу корзины
 * 5. Обновляет счетчик в шапке
 * 
 * @param {number} index - Индекс товара в массиве корзины
 */
function removeFromCart(index) {
  // Загружаем текущую корзину из localStorage
  const cart = getCart();
  
  // Удаляем товар из массива по индексу
  // splice удаляет элемент из массива по индексу
  cart.splice(index, 1);
  
  // Сохраняем обновленную корзину в localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Перерисовываем страницу корзины
  displayCart();
  
  // Обновляем счетчик товаров в шапке сайта
  updateCartCount();
}

/**
 * ПРИМЕНЕНИЕ ПРОМОКОДА
 * 
 * Проверяет введенный промокод и применяет его, если он валиден.
 * 
 * Процесс:
 * 1. Получает введенный код из поля ввода
 * 2. Приводит к верхнему регистру для сравнения
 * 3. Проверяет, что код не пустой
 * 4. Ищет промокод в списке доступных промокодов
 * 5. Если найден - применяет его и сохраняет в localStorage
 * 6. Если не найден - показывает сообщение об ошибке
 * 7. Перерисовывает корзину для обновления сумм
 */
function applyPromocode() {
  // Получаем поле ввода промокода
  const input = document.getElementById('promocodeInput');
  
  // Получаем введенное значение, убираем пробелы и приводим к верхнему регистру
  const code = input.value.trim().toUpperCase();
  
  // Получаем контейнер для сообщений
  const messageDiv = document.getElementById('promocodeMessage');
  
  // Проверяем, что промокод не пустой
  if (!code) {
    // Показываем сообщение об ошибке
    messageDiv.innerHTML = '<div class="promocode-error">Введите промокод</div>';
    return;  // Прерываем выполнение
  }
  
  // Ищем промокод в списке доступных промокодов
  // find возвращает первый элемент, соответствующий условию, или undefined
  const promocode = promocodes.find(pc => pc.code === code);
  
  if (promocode) {
    // Промокод найден и валиден
    // Сохраняем примененный промокод в глобальную переменную
    appliedPromocode = promocode;
    
    // Сохраняем промокод в localStorage, чтобы он сохранился при перезагрузке страницы
    localStorage.setItem('appliedPromocode', JSON.stringify(appliedPromocode));
    
    // Показываем сообщение об успешном применении
    messageDiv.innerHTML = `<div class="promocode-success">Промокод "${code}" применен! Скидка ${promocode.discount}%</div>`;
    
    // Перерисовываем корзину, чтобы обновить итоговую сумму со скидкой
    displayCart();
  } else {
    // Промокод не найден - невалиден
    // Показываем сообщение об ошибке
    messageDiv.innerHTML = '<div class="promocode-error">Неверный промокод</div>';
  }
}

/**
 * УДАЛЕНИЕ ПРИМЕНЕННОГО ПРОМОКОДА
 * 
 * Убирает примененный промокод, сбрасывая скидку.
 * 
 * Процесс:
 * 1. Очищает глобальную переменную appliedPromocode
 * 2. Удаляет промокод из localStorage
 * 3. Перерисовывает корзину для обновления сумм без скидки
 */
function removePromocode() {
  // Очищаем глобальную переменную
  appliedPromocode = null;
  
  // Удаляем промокод из localStorage
  localStorage.removeItem('appliedPromocode');
  
  // Перерисовываем корзину, чтобы обновить итоговую сумму без скидки
  displayCart();
}

/**
 * ОФОРМЛЕНИЕ ЗАКАЗА
 * 
 * Обрабатывает финальное оформление заказа:
 * 1. Проверяет, что корзина не пуста
 * 2. Рассчитывает итоговую сумму
 * 3. Показывает сообщение с информацией о заказе
 * 4. Очищает корзину и промокод
 * 5. Перерисовывает страницу корзины
 * 
 * В реальном приложении здесь бы была отправка данных на сервер.
 */
function checkout() {
  // Загружаем текущую корзину
  const cart = getCart();
  
  // Проверяем, что корзина не пуста
  if (cart.length === 0) {
    alert('Корзина пуста!');
    return;  // Прерываем выполнение
  }
  
  // Рассчитываем суммы
  const subtotal = calculateSubtotal();
  const discount = appliedPromocode ? (subtotal * appliedPromocode.discount / 100) : 0;
  const total = subtotal - discount;
  
  // Подсчитываем общее количество товаров
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Показываем сообщение с информацией о заказе
  alert(`Заказ оформлен!\n\nТоваров: ${totalQuantity}\nСумма: ${total.toFixed(2)} ₽\n\nСпасибо за заказ!`);
  
  // ========== ОЧИСТКА ДАННЫХ ПОСЛЕ ОФОРМЛЕНИЯ ==========
  // Удаляем корзину из localStorage
  localStorage.removeItem('cart');
  
  // Удаляем примененный промокод из localStorage
  localStorage.removeItem('appliedPromocode');
  
  // Очищаем глобальную переменную
  appliedPromocode = null;
  
  // Перерисовываем страницу корзины (покажет сообщение "Корзина пуста")
  displayCart();
  
  // Обновляем счетчик товаров в шапке сайта (будет 0)
  updateCartCount();
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
 * ЗАГРУЗКА ПРИМЕНЕННОГО ПРОМОКОДА ПРИ ИНИЦИАЛИЗАЦИИ
 * 
 * Восстанавливает примененный промокод из localStorage при загрузке страницы.
 * Это позволяет сохранить промокод при перезагрузке страницы или переходе между страницами.
 */
function loadAppliedPromocode() {
  // Получаем сохраненный промокод из localStorage
  const savedPromocode = localStorage.getItem('appliedPromocode');
  
  // Если промокод был сохранен, восстанавливаем его
  if (savedPromocode) {
    // Парсим JSON строку в объект и сохраняем в глобальную переменную
    appliedPromocode = JSON.parse(savedPromocode);
  }
}

/**
 * ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
 * 
 * Событие DOMContentLoaded срабатывает, когда HTML полностью загружен и распарсен,
 * но до того, как загружены изображения и другие ресурсы.
 * 
 * Порядок инициализации:
 * 1. Загружаем примененный промокод из localStorage
 * 2. Загружаем данные о блюдах и промокодах
 * 3. Отображаем корзину
 */
document.addEventListener('DOMContentLoaded', () => {
  // Восстанавливаем примененный промокод (если был)
  loadAppliedPromocode();
  
  // Загружаем данные и отображаем корзину
  loadData();
});

// При обычном подключении через <script src="..."> функции и так глобальные.
