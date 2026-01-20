/**
 * ДАННЫЕ О БЛЮДАХ И ПРОМОКОДАХ (обычный script, без ES import)
 *
 * Зачем:
 * - При открытии через file:// ES-модули (type="module" + import) часто ловят CORS.
 * - Обычные <script src="..."> работают локально без сервера.
 *
 * Как использовать:
 * - Подключить этот файл ДО page-скриптов (main.js / dish.js / cart.js)
 * - Данные доступны как window.APP_DATA.dishes и window.APP_DATA.promocodes
 */

window.APP_DATA = {
  dishes: [
    {
      id: 1,
      name: 'Филадельфия',
      description: 'Классический ролл с лососем, сливочным сыром и свежим огурцом в нори, идеально сбалансированный по вкусу и текстуре.',
      price: 450,
      image:
        'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=600&h=400&fit=crop',
      category: 'Роллы',
      ingredients: ['Лосось', 'Сливочный сыр', 'Огурец', 'Нори', 'Рис'],
    },
    {
      id: 2,
      name: 'Калифорния',
      description: 'Легендарный ролл с нежным крабом, спелым авокадо и икрой тобико, покрытый рисом и хрустящими семенами.',
      price: 380,
      image:
        'https://www.foodland.ru/upload/iblock/a82/a82c720dfe8ffb750dd545ee43b59e22.jpg',
      category: 'Роллы',
      ingredients: ['Краб', 'Авокадо', 'Икра тобико', 'Нори', 'Рис'],
    },
    {
      id: 3,
      name: 'Дракон',
      description: 'Запечённый ролл с сочным угрём, огурцом и фирменным соусом унаги, украшенный кунжутом.',
      price: 520,
      image:
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop',
      category: 'Роллы',
      ingredients: ['Угорь', 'Огурец', 'Соус унаги', 'Нори', 'Рис'],
    },
    {
      id: 4,
      name: 'Нигири с лососем',
      description: 'Традиционное нигири с ломтиком свежего лосося на тёплом рисе с лёгкой ноткой васаби.',
      price: 180,
      image: 'https://img.povar.ru/mobile/8c/42/ef/ca/nigiri_s_lososem-776739.JPG',
      category: 'Суши',
      ingredients: ['Лосось', 'Рис', 'Васаби', 'Соевый соус'],
    },
    {
      id: 5,
      name: 'Нигири с тунцом',
      description: 'Классическое нигири с тунцом: плотное филе тунца на воздушном рисе, подаётся с соевым соусом.',
      price: 200,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVs4J_2axyHvC967Xa6d9Z2dW9GXeRek7nkA&s',
      category: 'Суши',
      ingredients: ['Тунец', 'Рис', 'Васаби', 'Соевый соус'],
    },
    {
      id: 6,
      name: 'Сашими ассорти',
      description: 'Ассорти из свежей рыбы: ломтики лосося, тунца и морского окуня, подающиеся с васаби и маринованным имбирём.',
      price: 650,
      image: 'https://sushiwok.ru/img/75c90ab8534683dac9ac388f7f6e74bd',
      category: 'Суши',
      ingredients: ['Лосось', 'Тунец', 'Морской окунь', 'Васаби', 'Имбирь'],
    },
    {
      id: 7,
      name: 'Мисо суп',
      description: 'Традиционный японский суп на основе пасты мисо с нежным тофу, водорослями вакаме и зелёным луком.',
      price: 220,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4jJkl_XNGmu-xjv-2q-zf1zyPikbqE7A_EQ&s',
      category: 'Супы',
      ingredients: ['Паста мисо', 'Тофу', 'Водоросли вакаме', 'Зеленый лук'],
    },
    {
      id: 8,
      name: 'Рамен с курицей',
      description: 'Сытный рамен с куриным бульоном, пшеничной лапшой, курицей, маринованным яйцом и нори.',
      price: 350,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEe1ARWnM-bGmqnQHUQF8EmSRFAtd-1RlScg&s',
      category: 'Супы',
      ingredients: ['Лапша рамен', 'Курица', 'Яйцо', 'Бульон', 'Нори'],
    },
    {
      id: 9,
      name: 'Суп удон',
      description: 'Ароматный суп с лапшой удон, сезонными овощами и лёгким бульоном, украшенный зелёным луком.',
      price: 320,
      image:
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop',
      category: 'Супы',
      ingredients: ['Лапша удон', 'Овощи', 'Бульон', 'Зеленый лук'],
    },
    {
      id: 10,
      name: 'Салат чука',
      description: 'Лёгкий салат из водорослей чука с кунжутной заправкой, семенами кунжута и лёгкой кисло-сладкой ноткой.',
      price: 280,
      image:
        'https://images.gastronom.ru/72MfFLKJl5k4a8pLnjNaX4ixVVq4DrXspEmGKwTxLF0/pr:article-preview-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzRmOWZiZGYxLTgwYmMtNDBhMi1iZmRiLTgzNTQwMTE3N2IyMS5qcGc.webp',
      category: 'Салаты',
      ingredients: ['Водоросли чука', 'Кунжут', 'Соевый соус', 'Имбирь'],
    },
    {
      id: 11,
      name: 'Салат с лососем',
      description: 'Салат со слайсами лосося, спелым авокадо, хрустящими овощами и нежным авторским соусом.',
      price: 420,
      image: 'https://www.sostra.ru/upload/iblock/fb0/salat_s_lososem_v_souse_unagi.jpg',
      category: 'Салаты',
      ingredients: ['Лосось', 'Авокадо', 'Салат', 'Огурец', 'Соус'],
    },
    {
      id: 12,
      name: 'Морской салат',
      description: 'Салат-ассорти из креветок, кальмаров и свежих овощей в лёгком цитрусовом соусе.',
      price: 380,
      image:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
      category: 'Салаты',
      ingredients: ['Креветки', 'Кальмары', 'Овощи', 'Соус'],
    },
    {
      id: 13,
      name: 'Зеленый чай',
      description: 'Традиционный японский зелёный чай с мягким травянистым вкусом и лёгкой горчинкой.',
      price: 150,
      image:
        'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop',
      category: 'Напитки',
      ingredients: ['Зеленый чай'],
    },
    {
      id: 14,
      name: 'Саке',
      description: 'Классическое японское рисовое вино с мягким согревающим послевкусием.',
      price: 450,
      image: 'https://dobro.wine/upload/iblock/a4f/a4f75fccab10eb69d011c4cb296154d2.jpg',
      category: 'Напитки',
      ingredients: ['Саке'],
    },
    {
      id: 15,
      name: 'Апельсиновый сок',
      description: 'Освежающий натуральный апельсиновый сок с ярким цитрусовым вкусом.',
      price: 180,
      image:
        'https://чичико.рф/upload/iblock/0f1/6ap1lq179lqzeti6aa124cegof2bcr3j/svezhevyzhatyy_apelsinovyy_sok.jpg',
      category: 'Напитки',
      ingredients: ['Сок апельсиновый'],
    },
    {
      id: 16,
      name: 'Моти',
      description: 'Мягкие рисовые пирожные моти с нежной начинкой, подаются охлаждёнными.',
      price: 250,
      image: 'https://korfood.ru/upload/disk/d51/y2lis3tc6ul62pss83pbn5tnrwt83reo',
      category: 'Десерты',
      ingredients: ['Рисовая мука', 'Начинка'],
    },
    {
      id: 17,
      name: 'Вагаси',
      description: 'Изысканные традиционные японские сладости вагаси с тонким вкусом и деликатной сладостью.',
      price: 300,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrtWteAgh1w99Uux62CYiIZ7usDRvcJDjSLA&s',
      category: 'Десерты',
      ingredients: ['Бобовая паста', 'Сахар'],
    },
    {
      id: 18,
      name: 'Мороженое с зеленым чаем',
      description: 'Кремовое мороженое со вкусом матча с лёгкой горчинкой зелёного чая.',
      price: 220,
      image: 'https://posudamart.ru/collection/58/99/079958.jpg',
      category: 'Десерты',
      ingredients: ['Матча', 'Молоко', 'Сахар'],
    },
  ],
  promocodes: [
    { code: 'WELCOME10', discount: 10 },
    { code: 'SAKURA15', discount: 15 },
    { code: 'SUSHI20', discount: 20 },
  ],
};

