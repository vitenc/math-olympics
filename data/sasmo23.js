/* SASMO 2023, Primary 3 (Grade 3) — работа целиком.
   Источник: src/G3-EN-RU-KG.pdf (трёхъязычный буклет EN / RU / KG),
   перенесена задача в задачу. Английский оригинал условия — в поле `en`.

   Счёт — правила движка по умолчанию (как у SASMO 2024 и 2025 и у пробных
   экзаменов программы): 15 баллов на старте, секция A (1–15) +2/−1,
   секция B (16–25) +4/0.

   Ответов в буклете нет — каждый посчитан заново, ход решения стоит в `ex`.
   Задача 6 помечена `skip`: это куб-пирамида в углу комнаты, нарисованная
   с небольшой перспективой, и точное число кубиков по картинке не
   восстанавливается (варианты 42, 43, 44, 45 отличаются на один кубик —
   такую точность рисунок не даёт). Условие и рисунок на месте, в счёт
   задача не идёт: максимум работы 83 балла, а не 85.

   Задачи 2, 4 и 9 — «найди такую же картинку» и «вид сверху». Варианты
   там картинки, а не текст: они подписаны буквами A–E на рисунке, а в
   списке вариантов стоят ссылки на эти подписи. В задачах 2 и 4 верный
   вариант определён точно — в буклете это буквально тот же файл
   изображения, что и в условии.                                          */

(function () {

var DIR = 'img/sasmo/2023/';

window.SASMO23 = {
  title: 'SASMO 2023 · 3 класс',

  intro: {
    title: 'SASMO 2023, 3 класс — работа целиком',
    en: { title: 'SASMO 2023, Grade 3 — the full paper',
          body: "<p>The real SASMO 2023 paper for Grade 3: 25 problems, 90 minutes. Scoring is the same as in the programme's mock exams.</p><ul><li><b>Section A — problems 1–15, five options.</b> +2 correct, <b>−1 wrong</b>, 0 blank.</li><li><b>Section B — problems 16–25, the answer is a number.</b> +4 correct, no penalty for a wrong answer, so never leave a blank.</li><li>This paper has many “look carefully” problems: a shadow, a matching picture, a view from above. They are solved by comparing part by part rather than by calculating, and they eat time easily.</li><li><b>Problem 6 is shown without an answer:</b> the exact number of cubes cannot be recovered from the picture. It does not count towards the score.</li></ul>" },
    body:
      '<p>Настоящая работа олимпиады SASMO 2023 для третьего класса: ' +
      '25 задач, 90 минут. Счёт тот же, что на пробных экзаменах программы.</p>' +
      '<ul>' +
      '<li><b>Секция A — задачи 1–15, выбор из пяти вариантов.</b> ' +
      '+2 за верный, <b>−1 за неверный</b>, 0 за пропуск.</li>' +
      '<li><b>Секция B — задачи 16–25, ответ числом.</b> +4 за верный, ' +
      'за ошибку не снимают — пустых ответов быть не должно.</li>' +
      '<li>В этой работе много задач «посмотри внимательно»: тень, ' +
      'одинаковая картинка, вид сверху. Они решаются не счётом, ' +
      'а сравнением по частям — и на них легко потерять время.</li>' +
      '<li><b>Задача 6 показана без ответа:</b> по рисунку точное число ' +
      'кубиков не восстановить. В счёт работы она не идёт.</li>' +
      '</ul>'
  },

  questions: [

  /* ---------- СЕКЦИЯ A · задачи 1–15 · выбор ответа ---------- */

  { type: 'mcq', topic: 'Быстрый счёт',
    q: 'Чему равна сумма?<br>13 × 2023 + 0 × 2023 + 7 × 2023',
    opts: ['4046', '40 460', '400 460', '44 600', 'ничего из перечисленного'], ans: 1,
    hint: 'Во всех трёх слагаемых один и тот же множитель 2023 — его можно ' +
          'вынести за скобку, а в скобке останется совсем простая сумма.',
    ex: 'Вынесем 2023: (13 + 0 + 7) × 2023 = 20 × 2023 = <b>40 460</b>.',
    en: { q: 'What is the value of the following sum?<br>' +
             '13 × 2023 + 0 × 2023 + 7 × 2023',
          opts: ['4046', '40 460', '400 460', '44 600', 'None of the above'],
          hint: 'The factor 2023 is common — take it out of the brackets.',
          ex: '(13 + 0 + 7) × 2023 = 20 × 2023 = <b>40 460</b>.' } },

  { type: 'mcq', topic: 'Внимание к деталям',
    img: DIR + 'q02.png',
    q: 'Найди правильную тень животного, показанного сверху.',
    opts: ['тень A', 'тень B', 'тень C', 'тень D', 'тень E'], ans: 3,
    hint: 'Тень повторяет контур целиком. Сравнивай по частям: уши, хвост, ' +
          'грива, копыта — где-то одна из этих деталей не на месте.',
    ex: 'У A хвост повёрнут в другую сторону, у B иначе нарисован хвост, ' +
        'у C на спине лишний вырост гривы, у E грива толще. Контур зебры ' +
        'совпадает во всём только с <b>тенью D</b>.',
    en: { q: 'Find the correct shadow of the animal shown above.',
          opts: ['shadow A', 'shadow B', 'shadow C', 'shadow D', 'shadow E'],
          hint: 'A shadow repeats the whole outline — check ears, tail, mane and hooves.',
          ex: 'Only <b>shadow D</b> matches the zebra’s outline everywhere.' } },

  { type: 'mcq', topic: 'Закономерности',
    q: 'Какое число пропущено в последовательности?<br>13, 15, 18, 22, ?, 33',
    opts: ['25', '26', '27', '28', 'ничего из перечисленного'], ans: 2,
    hint: 'Выпиши разности соседних чисел — они сами образуют простой ряд.',
    ex: 'Разности: 15 − 13 = 2, 18 − 15 = 3, 22 − 18 = 4 — каждый раз на 1 больше. ' +
        'Значит дальше +5: 22 + 5 = <b>27</b>, а потом +6: 27 + 6 = 33 ✓.',
    en: { q: 'What is the missing number in the sequence below?<br>13, 15, 18, 22, ?, 33',
          opts: ['25', '26', '27', '28', 'None of the above'],
          hint: 'Write down the differences — they form a sequence of their own.',
          ex: 'The differences are 2, 3, 4, 5, 6, so the missing term is <b>27</b>.' } },

  { type: 'mcq', topic: 'Внимание к деталям',
    img: DIR + 'q04.png',
    q: 'Какая картинка в точности такая же, как картинка сверху?',
    opts: ['картинка A', 'картинка B', 'картинка C', 'картинка D', 'картинка E'], ans: 1,
    hint: 'Не пытайся охватить картинку целиком — сравнивай её по частям, ' +
          'и начинай с мелких деталей: они меняются чаще крупных.',
    ex: 'Совпадает во всём только <b>картинка B</b> — в буклете это буквально ' +
        'то же изображение, что и в условии; в остальных вариантах какая-нибудь ' +
        'деталь другая.',
    en: { q: 'Which option is exactly the same as the picture above?',
          opts: ['picture A', 'picture B', 'picture C', 'picture D', 'picture E'],
          hint: 'Compare part by part, starting with the small details.',
          ex: 'Only <b>picture B</b> matches the original in every detail.' } },

  { type: 'mcq', topic: 'Делимость',
    q: 'Лента у Тома короче 80 см и длиннее 70 см. Её можно разрезать на 9 равных ' +
       'частей, и длина каждой части — целое число сантиметров. Какой станет лента, ' +
       'если отрезать от неё 32 см?',
    opts: ['73', '72', '40', '30', 'ничего из перечисленного'], ans: 2,
    hint: 'Сначала найди саму длину ленты: между 70 и 80 есть только одно число, ' +
          'которое делится на 9. И перечитай вопрос — спрашивают не про неё.',
    ex: 'Длина делится на 9 и лежит между 70 и 80 — это 72 (72 : 9 = 8). ' +
        'Спрашивают, какой станет лента после отрезания 32 см: ' +
        '72 − 32 = <b>40</b> см. (72 — это ловушка: так отвечают, не дочитав вопрос.)',
    en: { q: 'Tom has a ribbon which is shorter than 80 cm and longer than 70 cm. He can ' +
             'cut it into 9 equal pieces, each a whole number of cm. How long is Tom’s ' +
             'ribbon when he cuts it 32 cm shorter?',
          opts: ['73', '72', '40', '30', 'None of the above'],
          hint: 'Find the ribbon first — then read the question again.',
          ex: 'The ribbon is 72 cm, so the answer is 72 − 32 = <b>40</b> cm.' } },

  /* Задача 6. Пирамида из кубиков нарисована с перспективой: сетка позиций
     по картинке не сходится (шаги решётки в разных частях рисунка разные),
     а варианты отличаются на один кубик. Ответа не придумываем. */
  { type: 'mcq', topic: 'Кубики', skip: true,
    img: DIR + 'q06.png',
    q: 'На рисунке — одинаковые кубики, сложенные в углу комнаты. Сколько ' +
       'всего кубиков? <i>(Пол горизонтальный, две стены вертикальные; ' +
       'за видимыми кубиками нет ни пустот, ни дырок.)</i>',
    en: { q: 'The diagram shows some cubes of the same size stacked at a corner of a ' +
             'room. How many cubes are there altogether?' } },

  { type: 'mcq', topic: 'Перечисление',
    img: DIR + 'q07.png',
    q: 'Лиза шла домой и подбирала все яблоки, которые видела по дороге. ' +
       'Домой она пошла по одному из путей. Какое из чисел <b>не может</b> быть ' +
       'общим числом собранных яблок?',
    opts: ['13', '14', '15', '16', 'ничего из перечисленного'], ans: 3,
    hint: 'На каждом из трёх участков выбор всего из двух дорожек. Выпиши, ' +
          'сколько яблок на каждой, и посмотри, какие суммы вообще получаются.',
    ex: 'На первом участке 2 или 3 яблока, на втором 4 или 5, на третьем 6 или 7. ' +
        'Наименьшая сумма 2 + 4 + 6 = 12, наибольшая 3 + 5 + 7 = 15, и все числа ' +
        'между ними тоже набираются. Значит возможны 12, 13, 14 и 15, ' +
        'а <b>16</b> собрать нельзя.',
    en: { q: 'Lisa walked home and picked up all the apples that she saw along the road. ' +
             'She chose one of the paths to walk home. Which of the following numbers could ' +
             'not be the total number of apples that she picked up?',
          opts: ['13', '14', '15', '16', 'None of the above'],
          hint: 'Each of the three stretches offers a choice of two paths.',
          ex: 'Totals run from 2+4+6 = 12 to 3+5+7 = 15, so <b>16</b> is impossible.' } },

  { type: 'mcq', topic: 'Делимость',
    q: 'Сколько чисел, кратных 9, находится между 30 и 200?',
    opts: ['18', '19', '20', '170', 'ничего из перечисленного'], ans: 1,
    hint: 'Найди первое и последнее кратное 9 в этих границах, а потом посчитай, ' +
          'сколько их — не забыв прибавить единицу.',
    ex: 'Первое кратное 9 после 30 — это 36 = 9 × 4, последнее до 200 — ' +
        '198 = 9 × 22. Значит множители идут от 4 до 22: ' +
        '22 − 4 + 1 = <b>19</b> чисел.',
    en: { q: 'How many multiples of 9 are between 30 and 200?',
          opts: ['18', '19', '20', '170', 'None of the above'],
          hint: 'Find the first and the last multiple, then count — and add one.',
          ex: 'From 9 × 4 = 36 to 9 × 22 = 198: 22 − 4 + 1 = <b>19</b>.' } },

  { type: 'mcq', topic: 'Виды фигур',
    img: DIR + 'q09.png',
    q: 'Какая картинка — это вид сверху на предметы, показанные вверху?',
    opts: ['вид A', 'вид B', 'вид C', 'вид D', 'вид E'], ans: 0,
    hint: 'Сверху не видно ни толщины книг, ни того, что раскрытая книга выгнута. ' +
          'Смотри только на то, что где лежит: что левее, что правее, что под чем.',
    ex: 'На картинке синяя книга лежит снизу, раскрытая книга в красной обложке — ' +
        'на ней и правее, один карандаш идёт по левой странице раскрытой книги ' +
        'снизу-слева вверх-направо, второй лежит ниже, на синей книге, а ножницы — ' +
        'справа от корешка. Всё это сходится только на <b>виде A</b>.',
    en: { q: 'Which option is the top view of the objects in the picture above?',
          opts: ['view A', 'view B', 'view C', 'view D', 'view E'],
          hint: 'From above you only see what lies where, not how thick things are.',
          ex: 'The blue book below-left, the open red book on top of it, one pencil across ' +
              'its left page and the scissors right of the spine — only <b>view A</b> fits.' } },

  { type: 'mcq', topic: 'Делимость',
    q: 'Четырёхзначное чётное число 245A делится на 3. Чему равна цифра A?',
    opts: ['8', '7', '4', '1', 'ничего из перечисленного'], ans: 2,
    hint: 'Два условия сразу: сумма цифр должна делиться на 3, а само число — ' +
          'быть чётным.',
    ex: '2 + 4 + 5 = 11, значит 11 + A должно делиться на 3 — подходят A = 1, 4, 7. ' +
        'Но число ещё и чётное, поэтому A чётная: остаётся <b>4</b> (число 2454).',
    en: { q: 'The four-digit even number 245A is divisible by 3. Find the value of the digit A.',
          opts: ['8', '7', '4', '1', 'None of the above'],
          hint: 'Two conditions at once: digit sum divisible by 3, and the number even.',
          ex: 'A = 1, 4 or 7 by the digit sum; even leaves <b>4</b>.' } },

  { type: 'mcq', topic: 'Закономерности',
    img: DIR + 'q11.png',
    q: 'За столы на рисунке 1 садятся 8 человек, на рисунке 2 — 14, ' +
       'на рисунке 3 — 20. На каком рисунке сядут 50 человек?',
    opts: ['рисунок 5', 'рисунок 6', 'рисунок 7', 'рисунок 8',
           'ничего из перечисленного'], ans: 3,
    hint: 'Посмотри, на сколько растёт число мест с каждым новым столом. ' +
          'И заметь: торцевые места остаются всего два, сколько бы столов ни ставили.',
    ex: 'Каждый новый стол добавляет 6 мест: 8, 14, 20, … У n столов ' +
        '3n мест сверху, 3n снизу и 2 по торцам, то есть 6n + 2. ' +
        'Решаем 6n + 2 = 50: 6n = 48, n = 8. Это <b>рисунок 8</b>.',
    en: { q: 'Picture 1 can seat 8 people. Picture 2 can seat 14 people. Picture 3 can seat ' +
             '20 people. Which picture can seat 50 people?',
          opts: ['Picture 5', 'Picture 6', 'Picture 7', 'Picture 8', 'None of the above'],
          hint: 'Each extra table adds 6 seats; the two end seats never change.',
          ex: 'Seats are 6n + 2, so 6n + 2 = 50 gives n = 8 — <b>Picture 8</b>.' } },

  { type: 'mcq', topic: 'Логика',
    img: DIR + 'q12.png',
    q: 'Амелия оторвала у цветка два лепестка — с самым большим и с самым маленьким ' +
       'числом. Потом она оторвала один лепесток с чётным числом и один лепесток ' +
       'с числом, кратным 9. Чему равна сумма чисел на двух оставшихся лепестках?',
    opts: ['46', '49', '45', '41', 'ничего из перечисленного'], ans: 0,
    hint: 'Действуй по порядку и каждый раз смотри, что осталось: после первых ' +
          'двух лепестков выбор может оказаться единственным.',
    ex: 'На лепестках 25, 93, 21, 81, 24 и 17. Сначала уходят 93 (самое большое) ' +
        'и 17 (самое маленькое) — остаются 25, 21, 81, 24. Чётное среди них только ' +
        '24 — его и отрывают. Кратное 9 среди 25, 21, 81 — только 81. ' +
        'Остаются 25 и 21: 25 + 21 = <b>46</b>.',
    en: { q: 'In the flower, Amelia plucked off two petals with the largest and the smallest ' +
             'numbers. Then she plucked off one petal with an even number and one petal with ' +
             'a multiple of 9. What is the sum of the numbers on the remaining two petals?',
          opts: ['46', '49', '45', '41', 'None of the above'],
          hint: 'Work in order — after the first two petals the choice may be forced.',
          ex: 'Remove 93, 17, then 24 and 81; 25 + 21 = <b>46</b>.' } },

  { type: 'mcq', topic: 'Чётность',
    q: 'Утром Том съел одно пирожное, а Джерри — ни одного. За обедом они вместе ' +
       'съели 3 пирожных, и ни одно пирожное не делили. Какое из утверждений ' +
       '<b>не может</b> быть правдой?',
    opts: ['За утро и обед они съели одинаково',
           'Том съел на 4 пирожных больше Джерри',
           'Том съел на 1 пирожное больше Джерри',
           'Джерри съел на 2 пирожных больше Тома',
           'Том съел на 2 пирожных больше Джерри'], ans: 2,
    hint: 'Перебери, как 3 обеденных пирожных могли разделиться между ними, ' +
          'и выпиши все возможные разницы. Их всего четыре.',
    ex: 'За обедом Том мог съесть 0, 1, 2 или 3 пирожных, а Джерри — остальные. ' +
        'Тогда всего у Тома 1, 2, 3 или 4, у Джерри 3, 2, 1 или 0, ' +
        'а разница «Том минус Джерри» равна −2, 0, 2 или 4. Все разницы чётные, ' +
        'поэтому <b>«Том съел на 1 пирожное больше»</b> невозможно.',
    en: { q: 'In the morning, Tom ate one cupcake while Jerry had none. During lunch, they ' +
             'ate 3 cupcakes in total and they did not share any cupcakes. Which of the ' +
             'following sentences cannot be true?',
          opts: ['They both ate the same number of cupcakes',
                 'Tom ate 4 more cupcakes than Jerry',
                 'Tom ate 1 more cupcake than Jerry',
                 'Jerry ate 2 more cupcakes than Tom',
                 'Tom ate 2 more cupcakes than Jerry'],
          hint: 'List every way the 3 lunch cupcakes could split.',
          ex: 'The possible differences are −2, 0, 2 and 4 — all even, so ' +
              '<b>1 more</b> is impossible.' } },

  { type: 'mcq', topic: 'Логика',
    q: 'Тимофей поставил на полку 5 учебников и больше ничего: английский, ' +
       'математику, естествознание, обществознание и рисование. Математика ' +
       'и естествознание стоят рядом, а между английским и рисованием стоит ' +
       'хотя бы один учебник. Какой учебник <b>не может</b> стоять посередине полки?',
    opts: ['английский', 'математика', 'естествознание', 'обществознание',
           'рисование'], ans: 3,
    hint: 'Поставь в середину подозреваемого и посмотри, куда встанет пара ' +
          '«математика — естествознание»: мест для пары рядом остаётся мало.',
    ex: 'Если посередине обществознание, то математике с естествознанием остаются ' +
        'только места 1–2 или 4–5, а тогда английский и рисование вынужденно ' +
        'оказываются рядом — а так нельзя. Для остальных четырёх учебников ' +
        'расстановка находится: например английский посередине — рисование, ' +
        'обществознание, английский, математика, естествознание. ' +
        'Значит посередине не может стоять <b>обществознание</b>.',
    en: { q: 'Timothy put his 5 school textbooks on a single shelf: English, Maths, Science, ' +
             'Social Studies and Art. He put Maths and Science next to each other, whereas ' +
             'English and Art are separated by at least one textbook. Which textbook cannot ' +
             'be in the middle of the shelf?',
          opts: ['English', 'Maths', 'Science', 'Social Studies', 'Art'],
          hint: 'Put each candidate in the middle and see where the Maths–Science pair fits.',
          ex: 'With Social Studies in the middle, English and Art are forced to be ' +
              'adjacent — so it is <b>Social Studies</b>.' } },

  { type: 'mcq', topic: 'Календарь',
    q: 'В понедельник Деррик купил 99 наклеек, во вторник — 96. Каждый следующий ' +
       'день он покупал на 3 наклейки меньше, чем в предыдущий. В какой день недели ' +
       'Деррик купил 12 наклеек?',
    opts: ['вторник', 'среда', 'воскресенье', 'понедельник',
           'ничего из перечисленного'], ans: 0,
    hint: 'Сначала посчитай, какой это день по счёту от понедельника, а потом дели ' +
          'на 7 — дни недели повторяются через 7.',
    ex: 'В n-й день Деррик покупает 99 − 3(n − 1) наклеек. Решаем 99 − 3(n − 1) = 12: ' +
        '3(n − 1) = 87, n − 1 = 29, n = 30. Тридцатый день от понедельника: ' +
        '29 = 4 × 7 + 1, значит день 29 — снова понедельник, а день 30 — ' +
        '<b>вторник</b>.',
    en: { q: 'On Monday, Derrick bought 99 stickers. On Tuesday, he bought 96 stickers. ' +
             'Every following day he bought 3 stickers less than the previous day. On which ' +
             'day of the week did Derrick buy 12 stickers?',
          opts: ['Tuesday', 'Wednesday', 'Sunday', 'Monday', 'None of the above'],
          hint: 'Find which day it is by number, then divide by 7.',
          ex: 'Day 30 — and day 29 is a Monday, so it is a <b>Tuesday</b>.' } },

  /* ---------- СЕКЦИЯ B · задачи 16–25 · открытый ответ ---------- */

  { type: 'open', topic: 'Счёт фигур',
    img: DIR + 'q16.png',
    q: 'Сколько квадратов в надписи SASMO на рисунке?',
    ans: 81,
    hint: 'Кроме клеточек считаются и квадраты побольше — те, у которых все четыре ' +
          'стороны прочерчены. Внимательнее всего посмотри на букву O: у неё ' +
          'внутри пустой квадрат, да и сама она квадратная.',
    ex: 'Клеточек в буквах 14 + 14 + 14 + 13 + 16 = 71 — это квадраты 1×1. ' +
        'Больших квадратов десять, и все они в буквах A и O: в каждой A по два ' +
        'квадрата 2×2 и по два 3×3 (их стороны — линии верхней и средней ' +
        'перекладин и боковых стоек), а в O — один 3×3 (пустая середина), ' +
        'четыре 4×4 (каждый прижат к своему углу) и один 5×5 (вся буква). ' +
        'Итого 71 + 2 + 3 + 4 + 1 = <b>81</b>.',
    en: { q: 'How many squares are there in the SASMO figure?',
          hint: 'Count bigger squares too — any square whose four sides are drawn. ' +
                'Look hard at the letter O.',
          ex: '71 unit squares plus 10 larger ones (4 in the letters A, 6 in the O): ' +
              '<b>81</b>.' } },

  { type: 'open', topic: 'Разряды',
    img: DIR + 'q17.png',
    q: 'Бенджамин составил из карточек наименьшее трёхзначное чётное число, ' +
       'а Джордж — наибольшее трёхзначное нечётное. Ни один не использовал ' +
       'цифру дважды. Чему равна разница между числом Джорджа и числом Бенджамина?',
    ans: 601,
    hint: 'У чётного числа выбор последней цифры ограничен, у нечётного — тоже. ' +
          'Начинай с той цифры, которая обязана стоять в конце.',
    ex: 'Карточки: 6, 8, 2, 9. У Бенджамина число чётное, поэтому в конце 6 или 8; ' +
        'чтобы число было наименьшим, в сотнях ставим 2, в десятках 6, в единицах 8 — ' +
        'получается 268. У Джорджа число нечётное, значит в конце 9; дальше ставим ' +
        'наибольшие: 8 и 6 — получается 869. Разница 869 − 268 = <b>601</b>.',
    en: { q: 'Benjamin formed the smallest 3-digit even number with the number cards. ' +
             'George formed the largest 3-digit odd number with the cards. Neither used any ' +
             'digit more than once. What is the difference between George’s and Benjamin’s ' +
             'numbers?',
          hint: 'Start with the digit that has to go last.',
          ex: '869 − 268 = <b>601</b>.' } },

  { type: 'open', topic: 'Весы',
    img: DIR + 'q18.png',
    q: 'Все весы на рисунке в равновесии. Какой вес должен стоять вместо ' +
       'знака вопроса?',
    ans: 7,
    hint: 'Во вторых и третьих весах есть одна и та же пара «груша + слива». ' +
          'Подставь одно в другое, и груша со сливой исчезнут.',
    ex: 'Вторые весы: груша + слива = 1 + яблоко. Третьи весы: ' +
        'груша + слива + яблоко = 10 + 5 = 15. Подставляем первое во второе: ' +
        '(1 + яблоко) + яблоко = 15, значит 2 × яблоко = 14 и яблоко = <b>7</b>. ' +
        '(Заодно из первых весов: 3 сливы = груша, откуда слива 2, груша 6 — ' +
        'и всё сходится: 6 + 2 + 7 = 15.)',
    en: { q: 'All the scales are balanced. What weight should replace the question mark?',
          hint: 'The pear + plum pair appears on two of the scales.',
          ex: 'From (1 + apple) + apple = 15 we get the apple = <b>7</b>.' } },

  { type: 'open', topic: 'Маршруты',
    img: DIR + 'q19.png',
    q: 'Города A, B, C, D и E соединены дорогами, как на рисунке. В каждом городе ' +
       'можно побывать не больше одного раза. Сколькими разными способами можно ' +
       'добраться из города A в город E?',
    ans: 9,
    hint: 'Выпиши, с чем соединён каждый город, и перебирай маршруты по длине: ' +
          'сначала прямые, потом через один город, потом через два.',
    ex: 'Дороги: A — B, C, D; B — A, C, E; C — A, B, D, E; D — A, C, E; E — B, C, D.<br>' +
        'Прямо из A в E дороги нет. Через один город: A–B–E, A–C–E, A–D–E — 3 пути. ' +
        'Через два: A–B–C–E, A–C–B–E, A–C–D–E, A–D–C–E — 4 пути. ' +
        'Через три: A–B–C–D–E и A–D–C–B–E — 2 пути. ' +
        'Всего 3 + 4 + 2 = <b>9</b> способов.',
    en: { q: 'Towns A, B, C, D and E are connected by roads as shown. Each town can be ' +
             'visited at most once. In how many different ways can you go from Town A to ' +
             'Town E?',
          hint: 'List each town’s neighbours, then count routes by length.',
          ex: '3 routes through one town, 4 through two, 2 through three: <b>9</b>.' } },

  { type: 'open', topic: 'Логика',
    img: DIR + 'q20.png',
    q: 'В каждой строке и в каждом столбце квадрата стоят все цифры 1, 2, 3, 4 и 5 — ' +
       'по одному разу. Какое число стоит на месте звёздочки?',
    ans: 3,
    hint: 'Ищи строку или столбец, где заполнено больше всего клеток, — там выбор ' +
          'меньше всего. Начни со строки со звёздочкой: в ней уже есть 5 и 1.',
    ex: 'Квадрат восстанавливается однозначно:<br>' +
        '<pre>4 3 1 2 5\n1 2 3 5 4\n2 5 4 1 3\n5 4 2 * 1\n3 1 5 4 2</pre>' +
        'В строке со звёздочкой уже стоят 5, 4, 2 и 1, значит на её месте — ' +
        '<b>3</b>. Тот же ответ даёт и столбец: в нём есть 2, 5, 1 и 4.',
    en: { q: 'In the square, each row and column contains each of the digits 1, 2, 3, 4 and 5. ' +
             'What is the value of the starred cell?',
          hint: 'Start with the row or column that already has the most digits.',
          ex: 'The row holds 5, 4, 2 and 1, so the star is <b>3</b>.' } },

  { type: 'open', topic: 'Логика',
    q: 'Амир, Баладжи и Крис съели 13, 16 и 24 печенья — но неизвестно, кто сколько. ' +
       'Баладжи съел чётное число печений. Амир съел больше печений, чем Баладжи. ' +
       'Сколько печений съел Крис?',
    ans: 13,
    hint: 'Чётных чисел среди 13, 16 и 24 всего два. Проверь каждое: ' +
          'останется ли после него что-то большее для Амира?',
    ex: 'Баладжи съел чётное число — это 16 или 24. Если 24, то Амиру нужно больше ' +
        '24, а такого числа нет. Значит у Баладжи 16, у Амира 24, ' +
        'а Крису остаётся <b>13</b>.',
    en: { q: 'Amir, Balaji and Chris ate 13, 16 and 24 cookies, not necessarily in the given ' +
             'order. Balaji ate an even number of cookies. Amir ate more cookies than Balaji. ' +
             'How many cookies did Chris eat?',
          hint: 'Only two of the numbers are even — test each.',
          ex: 'Balaji 16, Amir 24, so Chris ate <b>13</b>.' } },

  { type: 'open', topic: 'Площадь',
    img: DIR + 'q22.png',
    q: 'Площадь большого квадрата 256 см². Чему равна площадь закрашенного ' +
       'прямоугольника (в см²)?',
    ans: 120,
    hint: 'Квадрат разбит сеткой 8 на 8 — считай по клеткам, а не по сантиметрам. ' +
          'Углы закрашенного прямоугольника попадают в узлы сетки.',
    ex: 'Сторона квадрата 16 см, в сетке 8 клеток, значит клетка 2 × 2 см ' +
        'и её площадь 4 см². Вершины закрашенного прямоугольника стоят в узлах ' +
        'сетки: сверху на 5-й клетке, справа на 3-й, снизу на 3-й, слева на 5-й. ' +
        'Его стороны — диагонали прямоугольников 3 на 3 и 5 на 5 клеток, поэтому ' +
        'площадь равна 3 × 5 × 2 = 30 клеток. В сантиметрах это ' +
        '30 × 4 = <b>120</b> см² — меньше половины квадрата (256 см²).',
    en: { q: 'If the area of the square is 256 cm², what is the area (in cm²) of the shaded ' +
             'rectangle?',
          hint: 'The square is an 8 × 8 grid — count in cells, not centimetres.',
          ex: 'One cell is 4 cm². The rectangle covers 30 cells, so ' +
              '30 × 4 = <b>120</b> cm².' } },

  { type: 'open', topic: 'Быстрый счёт',
    q: 'Чему равна сумма всех чисел последовательности?<br>11, 13, 15, …, 57, 59',
    ans: 875,
    hint: 'Сначала посчитай, сколько в ряду чисел: они идут через 2. ' +
          'Потом складывай парами — первое с последним.',
    ex: 'Чисел в ряду (59 − 11) : 2 + 1 = 25. Первое с последним дают 11 + 59 = 70, ' +
        'и таких пар 25 : 2. Сумма равна 70 × 25 : 2 = <b>875</b>.',
    en: { q: 'What is the sum of all the numbers in the sequence below?<br>' +
             '11, 13, 15, …, 57, 59',
          hint: 'Count the terms first, then pair the first with the last.',
          ex: '25 terms, 11 + 59 = 70, so the sum is 70 × 25 : 2 = <b>875</b>.' } },

  { type: 'open', topic: 'Перечисление',
    q: 'Сколько целых чисел от 100 до 300 записываются только нечётными цифрами?',
    ans: 25,
    hint: 'Цифра сотен может быть только 1 или 2 — да ещё 300 на самом краю. ' +
          'Проверь каждый случай отдельно.',
    ex: 'Цифра сотен нечётная, значит из 1 и 2 подходит только 1 — числа от 100 ' +
        'до 199. Десятки и единицы тоже нечётные: по 5 вариантов каждая, ' +
        'то есть 5 × 5 = <b>25</b> чисел. Число 300 не подходит: в нём 3, 0 и 0.',
    en: { q: 'How many whole numbers from 100 to 300 consist of only odd digits?',
          hint: 'The hundreds digit can only be 1 or 2 — plus 300 at the very end.',
          ex: 'Only 1xx works: 5 × 5 = <b>25</b> numbers.' } },

  { type: 'open', topic: 'Криптарифмы',
    q: 'Разные буквы — разные цифры. Известно, что O = 4. Чему равно трёхзначное ' +
       'число OSM?<br><pre>  S A S\n+   M O\n  -----\n  O S M</pre>',
    ans: 437,
    hint: 'Подставь O = 4 и посмотри на сотни: из S должно получиться 4, ' +
          'а перенос из десятков не больше единицы.',
    ex: 'Запишем сложение числами: SAS + MO = OSM, то есть ' +
        '(101·S + 10·A) + (10·M + 4) = 400 + 10·S + M. Переносим: ' +
        '91·S + 10·A + 9·M = 396. Больше 171 сумма 10·A + 9·M быть не может ' +
        '(это A = 9 и M = 9), поэтому S = 1 и S = 2 не дотягивают до 396, ' +
        'при S = 5 и больше уже перебор (91 × 5 = 455), а S = 4 занято буквой O. ' +
        'Остаётся S = 3: ' +
        '273 + 10·A + 9·M = 396, то есть 10·A + 9·M = 123. Последняя цифра слева ' +
        'должна быть 3, поэтому 9·M кончается на 3 — это M = 7 (63), и тогда ' +
        'A = 6. Проверка: 363 + 74 = 437. Значит OSM = <b>437</b>.',
    en: { q: 'All the different letters stand for different digits. If O = 4, then what is ' +
             'the value of the 3-digit number OSM?<br>' +
             '<pre>  S A S\n+   M O\n  -----\n  O S M</pre>',
          hint: 'Put O = 4 and look at the hundreds column.',
          ex: 'S = 3, A = 6, M = 7: 363 + 74 = 437, so OSM = <b>437</b>.' } }

  ]
};

})();
