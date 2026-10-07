/* GJMAT 2023–2024 (Global Junior Math Aptitude Test), 3 класс — работа
   целиком. Источник: src/GJMAT_3_класс_RU.pdf (буклет Global Olympiads
   Academy с русским переводом поверх английского). Перенесена задача
   в задачу.

   Формат из инструкции буклета: 25 задач, у каждой пять вариантов (A–E),
   90 минут, штрафов нет. Три раздела: A — задачи 1–10 по 2 балла,
   B — 11–20 по 4, C — 21–25 по 8; максимум 100.

   Ключа в буклете нет — каждый ответ посчитан заново, ход решения в `ex`.
   Правок к условиям не понадобилось: в каждой задаче ровно один вариант
   верный. Две тонкости:
     №11 — длины отмеряют и суммой, и разностью палок (8 − 1 = 7),
           и сама палка 8 м — тоже длина: всего 10.
     №21 — квадрат заполняется двумя способами, но A + B + C в обоих
           одинаковое. */

(function () {

var DIR = 'img/gjmat/2024/g3/';

window.GJMAT24G3 = {
  title: 'GJMAT 2024 · 3 класс',

  rules: {
    start: 0,
    max: 100,
    sections: [
      { n: 10, ok: 2, no: 0, type: 'mcq', name: 'Раздел A',
        head: 'РАЗДЕЛ A · задачи 1–10 · понимание концепций',
        note: '+2 за верный · 0 за неверный и за пропуск. Штрафов нет — ' +
              'отвечай на всё, даже наугад.' },
      { n: 10, ok: 4, no: 0, type: 'mcq', name: 'Раздел B',
        head: 'РАЗДЕЛ B · задачи 11–20 · применение знаний',
        note: '+4 за верный · 0 за неверный и за пропуск.' },
      { ok: 8, no: 0, type: 'mcq', name: 'Раздел C',
        head: 'РАЗДЕЛ C · задачи 21–25 · решение задач',
        note: '+8 за верный · 0 за неверный. Самые дорогие задачи работы.' }
    ],
    blankNote: '⚠️ Пустых ответов осталось <b>{n}</b>. В GJMAT штрафов нет — ' +
               'отвечать нужно на все задачи, даже наугад.',
    tiers: [[85, '🥇 Уровень золота'], [70, '🥈 Уровень серебра'],
            [55, '🥉 Уровень бронзы'], [40, '🎖 Уровень похвального отзыва']]
  },

  intro: {
    title: 'GJMAT 2024, 3 класс — работа целиком',
    en: { title: 'GJMAT 2024, Grade 3 — the full paper',
          body: "<p>The GJMAT 2023–2024 paper for Grade 3: 25 problems, 90 minutes, 100 points maximum.</p><ul><li><b>Every problem is multiple choice with five options</b> (A–E).</li><li><b>No penalties.</b> A blank and a wrong answer are both worth zero — answer everything.</li><li><b>Three sections with different values:</b> problems 1–10 are worth 2 points, 11–20 are worth 4, 21–25 are worth 8. The last five problems are 40 points — leave time for them.</li></ul>" },
    body:
      '<p>Работа GJMAT 2023–2024 для третьего класса: 25 задач, 90 минут, ' +
      'максимум 100 баллов.</p>' +
      '<ul>' +
      '<li><b>Во всех задачах выбор из пяти вариантов</b> (A–E).</li>' +
      '<li><b>Штрафов нет.</b> Пустой ответ и неверный стоят одинаково — ноль. ' +
      'Отвечай на всё.</li>' +
      '<li><b>Три раздела, и задачи в них стоят по-разному:</b> 1–10 по 2 балла, ' +
      '11–20 по 4, 21–25 по 8. Последние пять задач — это 40 баллов, ' +
      'оставь на них время.</li>' +
      '</ul>'
  },

  questions: [

  /* ---------- РАЗДЕЛ A · задачи 1–10 · по 2 балла ---------- */

  { type: 'mcq', topic: 'Растущие разности',
    q: 'Рассмотрим числовую последовательность: <b>0, 2, 5, 9, 14, 20, …</b><br>' +
       'Каким будет 12-е число в этой последовательности?',
    opts: ['63', '77', '84', '59', '75'], ans: 1,
    check: 'sum(range(2, 13))',
    hint: 'Посмотри, на сколько растёт каждое следующее число: на 2, на 3, на 4…',
    ex: 'Разности растут: +2, +3, +4, +5, +6. Чтобы дойти от 1-го числа до 12-го, ' +
        'нужно 11 шагов: +2, +3, …, +12. Их сумма: 2 + 3 + … + 12 = 77. ' +
        'Первое число 0, значит 12-е — <b>77</b>. Проверка по ряду: 20, 27, 35, ' +
        '44, 54, 65, 77 ✓.',
    en: { q: 'Look at the number pattern: <b>0, 2, 5, 9, 14, 20, …</b><br>What will be the 12th number in this pattern?',
          hint: 'How much does each number grow by? By 2, then 3, then 4…',
          ex: 'The steps grow: +2, +3, +4, … From the 1st to the 12th number there are 11 steps: 2 + 3 + … + 12 = 77. Starting from 0, the 12th number is <b>77</b>.' } },

  { type: 'mcq', topic: 'Чётность',
    q: 'Рассмотрим последовательность: <b>31, 28, 25, 22, …, 7, 4, 1</b><br>' +
       'Прочитайте утверждения:<br>' +
       '1. Всего в последовательности 12 чисел.<br>' +
       '2. Всего в последовательности 11 чисел.<br>' +
       '3. Чётных чисел больше, чем нечётных.<br>' +
       '4. Нечётных чисел больше, чем чётных.<br>' +
       '5. Чётных и нечётных чисел поровну.<br>' +
       'Какие из этих утверждений ложны (неверны)?',
    opts: ['Только 2, 3 и 4', 'Только 1, 3 и 4', 'Только 1, 4 и 5',
           'Только 2, 4 и 5', 'Только 1, 3 и 5'], ans: 4,
    hint: 'Выпиши все числа ряда — их немного. Потом посчитай чётные и нечётные.',
    ex: 'Ряд целиком: 31, 28, 25, 22, 19, 16, 13, 10, 7, 4, 1 — <b>11</b> чисел. ' +
        'Нечётные: 31, 25, 19, 13, 7, 1 — шесть; чётные: 28, 22, 16, 10, 4 — пять. ' +
        'Значит, верны утверждения 2 и 4, а ложны <b>1, 3 и 5</b>. ' +
        'Чётные и нечётные чередуются, а ряд начинается и кончается нечётным — ' +
        'поэтому нечётных на одно больше.',
    en: { q: 'Look at the pattern: <b>31, 28, 25, 22, …, 7, 4, 1</b><br>Read the statements:<br>1. The pattern has 12 numbers in total.<br>2. The pattern has 11 numbers in total.<br>3. There are more even numbers than odd numbers.<br>4. There are more odd numbers than even numbers.<br>5. There are as many even numbers as odd numbers.<br>Which of the statements are false?',
          opts: ['Statements 2, 3 and 4 only', 'Statements 1, 3 and 4 only', 'Statements 1, 4 and 5 only',
                 'Statements 2, 4 and 5 only', 'Statements 1, 3 and 5 only'],
          hint: 'Write out the whole pattern — it is short. Then count even and odd numbers.',
          ex: '31, 28, 25, 22, 19, 16, 13, 10, 7, 4, 1 — 11 numbers: 6 odd and 5 even. Statements 2 and 4 are true, so the false ones are <b>1, 3 and 5</b>.' } },

  { type: 'mcq', topic: 'Пропущенный знак',
    q: 'В пропуски нужно поставить знаки «+» или «&minus;»:<br>' +
       '<b>13 __ 8 __ 5 __ 9 __ 7 = 12</b><br>' +
       'В каком порядке нужно поставить знаки, чтобы равенство стало верным?',
    opts: ['+ − + −', '− − + −', '+ + − −',
           '− + − −', '− + + −'], ans: 4,
    hint: 'Проверь варианты по очереди — каждый считается за полминуты.',
    ex: 'Считаем каждый вариант: A) 13 + 8 &minus; 5 + 9 &minus; 7 = 18; ' +
        'B) 13 &minus; 8 &minus; 5 + 9 &minus; 7 = 2; C) 13 + 8 + 5 &minus; 9 &minus; 7 = 10; ' +
        'D) 13 &minus; 8 + 5 &minus; 9 &minus; 7 = &minus;6; ' +
        'E) 13 &minus; 8 + 5 + 9 &minus; 7 = 12 ✓. Ответ — <b>&minus; + + &minus;</b>.',
    en: { q: 'Put “+” or “&minus;” in the blanks:<br><b>13 __ 8 __ 5 __ 9 __ 7 = 12</b><br>Which order of signs makes the calculation correct?',
          hint: 'Just try the options one by one.',
          ex: 'A gives 18, B gives 2, C gives 10, D gives &minus;6, E: 13 &minus; 8 + 5 + 9 &minus; 7 = 12 ✓. The answer is <b>&minus; + + &minus;</b>.' } },

  { type: 'mcq', topic: 'Криптарифмы',
    q: 'Рассмотрим числовой ребус: <b>AB &minus; BA = 7C</b>. ' +
       'Здесь AB, BA и 7C — двузначные числа, одинаковые буквы — одинаковые цифры.<br>' +
       'Найдите значение A + B + C.',
    opts: ['11', '13', '10', '12', '14'], ans: 3,
    check: 'sum(a + b + c for a in range(1, 10) for b in range(1, 10) for c in range(10) ' +
           'if 10*a + b - (10*b + a) == 70 + c)',
    hint: 'Разность «число минус перевёрнутое число» всегда делится на 9. ' +
          'Какое число от 70 до 79 делится на 9?',
    ex: 'AB &minus; BA = (10A + B) &minus; (10B + A) = 9 × (A &minus; B) — всегда кратно 9. ' +
        'Среди чисел 70…79 на 9 делится только 72, значит C = 2 и A &minus; B = 8. ' +
        'B не может быть 0 (BA — двузначное), поэтому A = 9, B = 1: 91 &minus; 19 = 72 ✓. ' +
        'A + B + C = 9 + 1 + 2 = <b>12</b>.',
    en: { q: 'Solve the cryptarithm: <b>AB &minus; BA = 7C</b>. AB, BA and 7C are 2-digit numbers; equal letters are equal digits.<br>Find the value of A + B + C.',
          hint: 'A number minus its reverse is always a multiple of 9. Which number from 70 to 79 is a multiple of 9?',
          ex: 'AB &minus; BA = 9 × (A &minus; B). Only 72 fits, so C = 2 and A &minus; B = 8; B is not 0, so A = 9, B = 1: 91 &minus; 19 = 72. A + B + C = <b>12</b>.' } },

  { type: 'mcq', topic: 'Счёт фигур',
    img: DIR + 'q05.png',
    q: 'Рассмотрим сетку из 3 × 3 точек. Сколько различных квадратов и ' +
       'прямоугольников можно построить с вершинами (углами) в любых четырёх точках?',
    opts: ['5', '8', '9', '10', '12'], ans: 3,
    check: 'binomial(3, 2)**2 + 1',
    hint: 'Сначала «ровные» прямоугольники: выбери две вертикальные линии из трёх ' +
          'и две горизонтальные. А потом поищи фигуру, которая стоит наклонно.',
    ex: 'Ровные прямоугольники задаются парой вертикальных линий (3 способа) и парой ' +
        'горизонтальных (3 способа): 3 × 3 = 9. Среди них 4 маленьких квадрата, ' +
        '1 большой и 4 прямоугольника 1 × 2. Есть ещё один наклонный квадрат — ' +
        '«ромбик» с вершинами в серединах сторон сетки. Всего 9 + 1 = <b>10</b>.',
    en: { q: 'Look at the 3 × 3 grid of dots. How many different squares and rectangles can be drawn using any four of the dots as the corners?',
          hint: 'First the upright ones: choose 2 of the 3 vertical lines and 2 of the 3 horizontal ones. Then look for a tilted one.',
          ex: 'Upright rectangles: 3 × 3 = 9 (4 small squares, 1 big square, 4 rectangles 1 × 2). Plus one tilted square through the middles of the sides: <b>10</b>.' } },

  { type: 'mcq', topic: 'Счёт фигур',
    img: DIR + 'q06.png',
    q: 'Найдите общее количество треугольников на рисунке, включая перекрывающиеся.',
    opts: ['6', '12', '16', '9', '15'], ans: 2,
    hint: 'Три линии внутри пересекаются в одной точке и делят большой треугольник ' +
          'на 6 маленьких. Считай треугольники из 1, 2, 3 … маленьких частей.',
    ex: 'Три отрезка проходят через одну точку и делят треугольник на 6 маленьких — ' +
        'это 6. Из двух маленьких: два соседних у одной стороны большого треугольника ' +
        'дают треугольник с вершиной в центре — по одному на сторону, 3. Из трёх ' +
        'маленьких: каждый отрезок делит большой треугольник на две половины — ' +
        '3 × 2 = 6. И сам большой — 1. Всего 6 + 3 + 6 + 1 = <b>16</b>.',
    en: { q: 'Find the total number of triangles in the figure, including the overlapping ones.',
          hint: 'The three inner lines meet at one point and cut the big triangle into 6 small ones. Count triangles made of 1, 2, 3 … small parts.',
          ex: '6 small ones, 3 made of two (one on each side of the big triangle, with the top at the centre), 6 made of three (each line cuts the big triangle into two halves) and the big one: <b>16</b>.' } },

  { type: 'mcq', topic: 'Фигурные последовательности',
    img: DIR + 'q07.png',
    q: 'Рассмотрим последовательность фигур: треугольник, квадрат, пятиугольник, ' +
       'шестиугольник, …<br>Найдите сумму общего количества сторон и общего ' +
       'количества вершин (углов) первых 10 фигур этой последовательности.',
    opts: ['100', '150', '160', '140', '120'], ans: 1,
    check: 'sum(2*n for n in range(3, 13))',
    hint: 'У многоугольника сторон столько же, сколько вершин. Сколько сторон у 10-й фигуры?',
    ex: 'Сторон у фигур: 3, 4, 5, …, 12 (у 10-й — 12). Сумма: 3 + 4 + … + 12 = 75. ' +
        'Вершин у каждой фигуры столько же, сколько сторон, — тоже 75. ' +
        'Всего 75 + 75 = <b>150</b>.',
    en: { q: 'Look at the pattern of shapes: triangle, square, pentagon, hexagon, …<br>Find the sum of the total number of sides and the total number of corners of the first 10 shapes.',
          hint: 'A polygon has as many corners as sides. How many sides does the 10th shape have?',
          ex: 'Sides: 3 + 4 + … + 12 = 75, corners: also 75. Total <b>150</b>.' } },

  { type: 'mcq', topic: 'Сколько времени прошло',
    img: DIR + 'q08.png',
    q: 'Вечером Боб пошёл играть с друзьями во время, показанное на настенных ' +
       'стрелочных часах. Он сыграл футбольный матч из двух таймов по 45 минут ' +
       'с перерывом 15 минут между таймами.<br>Какое время показывали его ' +
       'электронные наручные часы (24-часовой формат), когда он закончил игру?',
    opts: ['19:30', '19:00', '07:45', '19:45', '18:30'], ans: 0,
    hint: 'Какая стрелка короткая? Она стоит чуть раньше 6, а длинная — на 9. ' +
          'И не забудь, что дело было вечером.',
    ex: 'Длинная стрелка на 9 — это 45 минут, короткая чуть не дошла до 6 — ' +
        'значит, 5:45. Вечер, поэтому в 24-часовом формате это 17:45. Игра длится ' +
        '45 + 15 + 45 = 105 минут = 1 ч 45 мин. 17:45 + 1:45 = <b>19:30</b>.',
    en: { q: 'Bob went to play with his friends in the evening at the time shown on the wall clock. He played a soccer game of two 45-minute halves with a 15-minute break between them.<br>What time did his 24-hour digital watch show when he finished?',
          hint: 'Which hand is short? It is just before 6, and the long hand is on 9. And it was evening.',
          ex: 'The clock shows 5:45, in the evening that is 17:45. The game lasts 45 + 15 + 45 = 105 minutes = 1 h 45 min. 17:45 + 1:45 = <b>19:30</b>.' } },

  { type: 'mcq', topic: 'Правило умножения',
    q: 'Сколько существует различных двузначных чисел, в которых есть и чётная, ' +
       'и нечётная цифра, но нет цифры 0?',
    opts: ['50', '9', '30', '25', '40'], ans: 4,
    check: 'len([n for n in range(11, 100) if n % 10 and (n // 10 + n % 10) % 2 == 1])',
    hint: 'Без нуля нечётных цифр 5 (1, 3, 5, 7, 9), чётных — 4 (2, 4, 6, 8). ' +
          'Какая цифра стоит в десятках — чётная или нечётная?',
    ex: 'Нечётных цифр 5, чётных без нуля — 4. Если десятки нечётные, а единицы ' +
        'чётные: 5 × 4 = 20 чисел. Если десятки чётные, а единицы нечётные: ' +
        '4 × 5 = 20. Всего 20 + 20 = <b>40</b>.',
    en: { q: 'How many different 2-digit numbers have both an even and an odd digit but no zero?',
          hint: 'Without zero there are 5 odd digits and 4 even ones. Is the tens digit odd or even?',
          ex: 'Odd tens and even ones: 5 × 4 = 20. Even tens and odd ones: 4 × 5 = 20. Total <b>40</b>.' } },

  { type: 'mcq', topic: 'Периметр',
    img: DIR + 'q10.png',
    q: '5 одинаковых квадратов приложили друг к другу сторонами в ряд и получили ' +
       'прямоугольник. Периметр прямоугольника равен 36.<br>Чему был равен ' +
       'суммарный периметр 5 квадратов до того, как их соединили?',
    opts: ['80', '60', '50', '45', '48'], ans: 1,
    check: '5 * 4 * Rational(36, 12)',
    hint: 'Сколько сторон маленького квадрата лежит на границе прямоугольника?',
    ex: 'Граница прямоугольника — это 5 сторон сверху, 5 снизу и по одной слева ' +
        'и справа: 12 сторон квадрата. 12 сторон = 36, значит сторона равна 3. ' +
        'У каждого квадрата периметр 4 × 3 = 12, у пяти — 5 × 12 = <b>60</b>.',
    en: { q: '5 identical squares are joined side by side to make a rectangle with perimeter 36.<br>What was the total perimeter of the 5 squares before they were joined?',
          hint: 'How many sides of a small square lie on the rectangle’s boundary?',
          ex: 'The boundary is 12 sides of a square, so one side is 36 ÷ 12 = 3. Each square has perimeter 12, five of them — <b>60</b>.' } },

  /* ---------- РАЗДЕЛ B · задачи 11–20 · по 4 балла ---------- */

  { type: 'mcq', topic: 'Измерения',
    img: DIR + 'q11.png',
    q: 'У Майка есть 3 палки длиной 1 м, 4 м и 8 м. Сколько различных длин он ' +
       'может отмерить, используя только эти палки и никакие другие инструменты?',
    opts: ['13', '11', '9', '12', '10'], ans: 4,
    check: 'len(set(abs(x + 4*y + 8*z) for x in (-1, 0, 1) for y in (-1, 0, 1) ' +
           'for z in (-1, 0, 1)) - {0})',
    hint: 'Палки можно прикладывать друг за другом (длины складываются) и одну ' +
          'рядом с другой (длины вычитаются). Не забудь и сами палки.',
    ex: 'Одна палка: 1, 4, 8. Сумма двух: 5, 9, 12. Разность двух: 3 (4 &minus; 1), ' +
        '7 (8 &minus; 1), 4 (8 &minus; 4 — уже есть). Все три: 13 (1 + 4 + 8), ' +
        '11 (8 + 4 &minus; 1), 5 (8 + 1 &minus; 4 — уже есть), 3 (8 &minus; 4 &minus; 1 — уже есть). ' +
        'Разные длины: 1, 3, 4, 5, 7, 8, 9, 11, 12, 13 — их <b>10</b>.',
    en: { q: 'Mike has 3 sticks: 1 m, 4 m and 8 m long. How many different lengths can he measure using only these sticks?',
          hint: 'Sticks can be placed end to end (lengths add) or side by side (lengths subtract). Don’t forget the sticks themselves.',
          ex: 'Single sticks: 1, 4, 8. Sums: 5, 9, 12, 13. Differences: 3, 7, and 8 + 4 &minus; 1 = 11. Different lengths: 1, 3, 4, 5, 7, 8, 9, 11, 12, 13 — <b>10</b>.' } },

  { type: 'mcq', topic: 'Интервалы',
    img: DIR + 'q12.png',
    q: 'В ряд стоят стулья. Расстояние между соседними стульями — 2 ярда, ширина ' +
       'каждого стула — 2 фута. Расстояние от первого стула до последнего ' +
       '(как на рисунке) равно 62 футам. Сколько стульев в ряду? (1 ярд = 3 фута)',
    opts: ['6', '7', '8', '9', '10'], ans: 3,
    check: 'solve(Eq(6*(n - 1) + 2*(n - 2), 62), n)[0]',
    hint: 'Переведи ярды в футы. На рисунке 62 фута отмерены от правого края ' +
          'первого стула до левого края последнего: в них входят все промежутки ' +
          'и все стулья, кроме крайних.',
    ex: '2 ярда = 6 футов. Пусть стульев n. Промежутков между ними n &minus; 1, ' +
        'а внутри отрезка в 62 фута стоят все стулья, кроме первого и последнего, — ' +
        'n &minus; 2 стула. 6 × (n &minus; 1) + 2 × (n &minus; 2) = 62, то есть ' +
        '8n &minus; 10 = 62, n = 9. Проверка: 8 промежутков по 6 = 48 и 7 стульев ' +
        'по 2 = 14, 48 + 14 = 62 ✓. Стульев <b>9</b>.',
    en: { q: 'Chairs stand in a row. The gap between neighbouring chairs is 2 yards and each chair is 2 feet wide. The distance from the first chair to the last one (as in the picture) is 62 feet. How many chairs are there? (1 yard = 3 feet)',
          hint: 'Convert yards to feet. The 62 feet go from the right edge of the first chair to the left edge of the last: all gaps and all chairs except the two end ones.',
          ex: 'A gap is 6 feet. With n chairs: 6(n &minus; 1) + 2(n &minus; 2) = 62, so 8n = 72 and n = <b>9</b>.' } },

  { type: 'mcq', topic: 'Возраст',
    q: 'Сэм и Тим — близнецы, им обоим по 4 года. Сумма возрастов их папы и мамы — ' +
       '60 лет.<br>Через сколько лет сумма возрастов этой семьи из 4 человек будет ' +
       'равна 100 годам?',
    opts: ['8', '9', '36', '16', '12'], ans: 0,
    check: 'Rational(100 - (60 + 4 + 4), 4)',
    hint: 'Сколько лет вместе семье сейчас? И на сколько эта сумма растёт каждый год?',
    ex: 'Сейчас сумма возрастов 60 + 4 + 4 = 68. Каждый год каждый из четверых ' +
        'становится старше на 1, и сумма растёт на 4. Не хватает 100 &minus; 68 = 32, ' +
        'это 32 ÷ 4 = <b>8</b> лет.',
    en: { q: 'Sam and Tim are twins, both 4 years old. Their father’s and mother’s ages add up to 60.<br>In how many years will the ages of the 4 family members add up to 100?',
          hint: 'What is the total now, and how much does it grow each year?',
          ex: 'Now the total is 68, and it grows by 4 each year. 100 &minus; 68 = 32, and 32 ÷ 4 = <b>8</b> years.' } },

  { type: 'mcq', topic: 'Метод предположения',
    q: 'У Перл есть монеты по 5 центов и по 10 центов. Она отдала ровно 8 таких ' +
       'монет, чтобы заплатить ровно 50 центов за билет в цирк.<br>На сколько больше ' +
       'монет по 5 центов, чем монет по 10 центов, она отдала?',
    opts: ['6', '5', '4', '3', '7'], ans: 2,
    check: '(lambda s: s[f] - s[t])(solve([Eq(f + t, 8), Eq(5*f + 10*t, 50)], [f, t]))',
    hint: 'Представь, что все 8 монет — по 5 центов. Сколько не хватает до 50?',
    ex: 'Если бы все 8 монет были по 5 центов, вышло бы 40 центов — не хватает 10. ' +
        'Каждая замена пятицентовой монеты на десятицентовую добавляет 5 центов: ' +
        'нужно 2 замены. Значит, десятицентовых 2, пятицентовых 6. ' +
        'Проверка: 30 + 20 = 50 ✓. Разница 6 &minus; 2 = <b>4</b>.',
    en: { q: 'Pearl has nickels (5 cents) and dimes (10 cents). She paid exactly 50 cents for a circus ticket with exactly 8 coins.<br>How many more nickels than dimes did she use?',
          hint: 'Pretend all 8 coins are nickels. How much is missing?',
          ex: '8 nickels make 40 cents, 10 short. Each swap of a nickel for a dime adds 5 cents, so 2 swaps: 6 nickels and 2 dimes. 6 &minus; 2 = <b>4</b>.' } },

  { type: 'mcq', topic: 'Текстовые задачи',
    q: 'Кролик Банни и четыре его друга вместе съедают 5 морковок за 5 минут, ' +
       'если все начинают есть одновременно.<br>За сколько минут Банни один ' +
       'съест 2 морковки?',
    opts: ['2', '5', '20', '10', '15'], ans: 3,
    check: '5 * 2',
    hint: 'Кроликов пять и морковок пять. Сколько морковок съедает один кролик за 5 минут?',
    ex: 'Пять кроликов за 5 минут съедают 5 морковок — каждый по одной. Значит, ' +
        'Банни съедает 1 морковку за 5 минут, а 2 морковки — за 2 × 5 = <b>10</b> минут.',
    en: { q: 'Bunny the rabbit and his four friends together eat 5 carrots in 5 minutes when they all start at the same time.<br>How many minutes will Bunny alone take to eat 2 carrots?',
          hint: 'Five rabbits and five carrots. How many carrots does one rabbit eat in 5 minutes?',
          ex: 'Each rabbit eats 1 carrot in 5 minutes, so 2 carrots take <b>10</b> minutes.' } },

  { type: 'mcq', topic: 'Очередь',
    q: 'Питер с семьёй идёт в зоопарк. Всего идут 5 членов семьи, они стоят друг ' +
       'за другом в очереди у входа. Мама Питера стоит последней из всей семьи; ' +
       'за ней в очереди 16 человек, а всего в очереди в этот момент 27 человек.<br>' +
       'Если Питер стоит ровно посередине своей семьи, то после скольких человек ' +
       'он войдёт в ворота зоопарка?',
    opts: ['6', '7', '8', '9', '10'], ans: 2,
    check: '27 - 16 - 2 - 1',
    hint: 'Каким по счёту стоит мама? Семья — это пять мест подряд, и мама на последнем.',
    ex: 'За мамой 16 человек из 27, значит, она стоит 27 &minus; 16 = 11-й. Семья ' +
        'занимает места 7, 8, 9, 10, 11; середина — 9-е место. Перед Питером ' +
        '<b>8</b> человек, после них он и войдёт.',
    en: { q: 'Peter’s family of 5 stands one after another in the zoo queue. His mother is the last of the family; there are 16 people behind her and 27 people in the queue in total.<br>If Peter is exactly in the middle of his family, after how many people will he enter the zoo?',
          hint: 'What is the mother’s place in the queue? The family takes 5 places in a row, and she is on the last one.',
          ex: 'The mother is 27th &minus; 16 = 11th. The family takes places 7–11, the middle is 9th, so there are <b>8</b> people before Peter.' } },

  { type: 'mcq', topic: 'Календарь',
    q: 'В августе день рождения Люка — в четвёртую среду месяца. День рождения ' +
       'Майка — на следующий день, но это не четвёртый четверг месяца.<br>' +
       'День рождения Алисы был 18 августа того же месяца. В какой день недели ' +
       'был день рождения Алисы?',
    opts: ['Суббота', 'Воскресенье', 'Понедельник', 'Вторник', 'Пятница'], ans: 1,
    hint: 'Если четверг после четвёртой среды — не четвёртый, то он пятый. Значит, ' +
          'первый четверг месяца наступил раньше первой среды.',
    ex: 'Четверг сразу после четвёртой среды оказался пятым четвергом — значит, ' +
        'один четверг был до первой среды. Так бывает, только если 1 августа — ' +
        'четверг, а первая среда — 7 августа. Тогда четверги — 1, 8, 15, 22, 29, ' +
        'а 18 августа — через три дня после четверга 15-го: пятница, суббота, ' +
        '<b>воскресенье</b>.',
    en: { q: 'In August, Luke’s birthday is on the fourth Wednesday. Mike’s birthday is the next day, but it is not the fourth Thursday.<br>Alice’s birthday was on 18 August of the same month. Which day of the week was it?',
          opts: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Friday'],
          hint: 'If the Thursday after the fourth Wednesday is not the fourth one, it is the fifth. So the first Thursday came before the first Wednesday.',
          ex: 'That only happens if 1 August is a Thursday. Thursdays are the 1st, 8th, 15th, 22nd, 29th, and the 18th is three days after the 15th: <b>Sunday</b>.' } },

  { type: 'mcq', topic: 'Обратный ход',
    q: 'Экскурсионный автобус выезжает с начальной остановки с пассажирами. ' +
       'На 1-й остановке 1 человек выходит и никто не входит; на 2-й выходят ' +
       '2 человека и входит 1; на 3-й выходят 3 и входят 2, и так далее.<br>' +
       'Если на 10-й, последней, остановке вышли все оставшиеся 10 человек, то ' +
       'сколько человек село в автобус на начальной остановке?',
    opts: ['16', '19', '20', '17', '18'], ans: 1,
    check: '10 + 9',
    hint: 'На каждой остановке выходит на одного больше, чем входит. ' +
          'На сколько уменьшается число пассажиров за одну остановку?',
    ex: 'На остановках с 1-й по 9-ю выходит на одного человека больше, чем входит: ' +
        'каждый раз пассажиров становится на 1 меньше. После 9 остановок их стало ' +
        'на 9 меньше, и осталось 10. Значит, вначале было 10 + 9 = <b>19</b>.',
    en: { q: 'A hop-on hop-off bus starts with some passengers. At the 1st stop 1 person gets off and nobody gets on; at the 2nd stop 2 get off and 1 gets on; at the 3rd stop 3 get off and 2 get on, and so on.<br>At the 10th, last stop, the remaining 10 people get off. How many people got on at the start?',
          hint: 'At each stop one more person gets off than gets on.',
          ex: 'Stops 1–9 each take away one passenger: 9 fewer, and 10 were left. At the start there were <b>19</b>.' } },

  { type: 'mcq', topic: 'Уравнивание',
    q: 'Джимми планирует прочитать книгу за определённое число дней. Если он будет ' +
       'читать по 4 страницы в день, то по окончании этих дней ему останется ' +
       'прочитать 1 страницу. Если же он будет читать по 5 страниц в день, то ' +
       'закончит книгу на день раньше запланированного.<br>Сколько страниц в этой книге?',
    opts: ['20', '24', '16', '30', '25'], ans: 4,
    check: '4 * solve(Eq(4*n + 1, 5*(n - 1)), n)[0] + 1',
    hint: 'Проверь варианты: число страниц минус 1 должно делиться на 4, ' +
          'а само число — на 5.',
    ex: 'Пусть в плане n дней. По 4 страницы: страниц 4n + 1. По 5 страниц за ' +
        'n &minus; 1 день: 5 × (n &minus; 1). 4n + 1 = 5n &minus; 5, n = 6. ' +
        'Страниц 4 × 6 + 1 = <b>25</b>. Проверка: 5 × 5 = 25 ✓.',
    en: { q: 'Jimmy plans to read a book in a certain number of days. Reading 4 pages a day, he would have 1 page left at the end. Reading 5 pages a day, he would finish one day early.<br>How many pages does the book have?',
          hint: 'Check the options: pages minus 1 must divide by 4, and the pages must divide by 5.',
          ex: 'With n days: 4n + 1 = 5(n &minus; 1), so n = 6 and the book has <b>25</b> pages.' } },

  { type: 'mcq', topic: 'Распилы',
    q: 'Джек может распилить бревно на 5 частей за 15 минут. При этом каждый раз, ' +
       'отпилив очередную часть, он отдыхает 1 минуту, прежде чем пилить следующую.' +
       '<br>Сколько минут понадобится Джеку, чтобы так же распилить такое же ' +
       'бревно на 10 частей?',
    opts: ['30', '32', '42', '35', '40'], ans: 3,
    check: 'Rational(15 - 3, 4) * 9 + 8',
    hint: 'Сколько распилов нужно на 5 частей? А сколько между ними перерывов?',
    ex: 'На 5 частей нужно 4 распила, а отдыхов между ними — 3 (после последнего ' +
        'распила работа закончена). 15 &minus; 3 = 12 минут на 4 распила — ' +
        'по 3 минуты на распил. На 10 частей: 9 распилов и 8 отдыхов: ' +
        '9 × 3 + 8 = <b>35</b> минут.',
    en: { q: 'Jack cuts a log into 5 pieces in 15 minutes. After each cut he rests for 1 minute before the next cut.<br>How many minutes will he take to cut a similar log into 10 pieces the same way?',
          hint: 'How many cuts make 5 pieces? How many rests are between them?',
          ex: '5 pieces: 4 cuts and 3 rests, so 12 minutes of cutting — 3 minutes per cut. 10 pieces: 9 cuts and 8 rests: 27 + 8 = <b>35</b> minutes.' } },

  /* ---------- РАЗДЕЛ C · задачи 21–25 · по 8 баллов ---------- */

  { type: 'mcq', topic: 'Логика с числами',
    img: DIR + 'q21.png',
    q: 'Числа от 3 до 11 нужно вписать в магический квадрат так, чтобы суммы чисел ' +
       'в каждой строке, каждом столбце и на двух больших диагоналях были ' +
       'одинаковыми. Числа 6 и 7 уже вписаны.<br>Найдите значение A + B + C.',
    opts: ['24', '20', '22', '25', '23'], ans: 0,
    hint: 'Сумма всех чисел 3 + 4 + … + 11 = 63, строк три — значит, магическая ' +
          'сумма 21. В центре стоит 7: как C связан с 6 через центр?',
    ex: 'Сумма чисел от 3 до 11 равна 63, поэтому в каждой строке 63 ÷ 3 = 21. ' +
        'Диагональ 6, 7, C: C = 21 &minus; 13 = 8. Дальше подбираем: квадрат ' +
        '10, 3, 8 / 5, 7, 9 / 6, 11, 4 подходит (все строки, столбцы и диагонали ' +
        'дают 21), в нём B = 5, A = 11. Есть и второй — 4, 9, 8 / 11, 7, 3 / 6, 5, 10, ' +
        'там B = 11, A = 5. В обоих A + B = 16, и A + B + C = 16 + 8 = <b>24</b>.',
    en: { q: 'Numbers 3 to 11 go into a magic square so that every row, column and both long diagonals have the same sum. 6 and 7 are already filled in.<br>Find A + B + C.',
          hint: '3 + 4 + … + 11 = 63 over three rows, so each line sums to 21. 7 is in the centre: how is C linked to 6?',
          ex: 'Each line sums to 21. The diagonal 6, 7, C gives C = 8. Filling in: 10, 3, 8 / 5, 7, 9 / 6, 11, 4 (or 4, 9, 8 / 11, 7, 3 / 6, 5, 10). Either way A + B = 16, so A + B + C = <b>24</b>.' } },

  { type: 'mcq', topic: 'Площадь',
    img: DIR + 'q22.png',
    q: 'Площадь всего прямоугольника равна 40.<br>Чему равна разность площадей ' +
       'закрашенной и незакрашенной частей?',
    opts: ['8', '9', '10', '15', '16'], ans: 2,
    check: 'abs(40*Rational(3, 8) - 40*Rational(5, 8))',
    hint: 'Две диагонали делят прямоугольник на 4 треугольника равной площади. ' +
          'А вертикальный отрезок из центра режет нижний треугольник пополам.',
    ex: 'Диагонали делят прямоугольник на 4 треугольника по 40 ÷ 4 = 10. Правый ' +
        'треугольник закрашен целиком — 10. Нижний треугольник вертикальный отрезок ' +
        'делит пополам, закрашена одна половина — 5. Закрашено 10 + 5 = 15, ' +
        'не закрашено 40 &minus; 15 = 25. Разность 25 &minus; 15 = <b>10</b>.',
    en: { q: 'The area of the whole rectangle is 40.<br>What is the difference between the areas of the shaded and the unshaded parts?',
          hint: 'The two diagonals cut the rectangle into 4 triangles of equal area. The vertical segment halves the bottom one.',
          ex: 'Each of the 4 triangles has area 10. Shaded: the right triangle (10) and half of the bottom one (5) = 15. Unshaded: 25. Difference <b>10</b>.' } },

  { type: 'mcq', topic: 'Правда и ложь',
    q: '4 друга сравнивают свои возрасты.<br>' +
       'Альберт: «Я не самый старший и не самый младший, но я младше Денниса».<br>' +
       'Брюс: «Я старше Чарли».<br>' +
       'Чарли: «Я самый младший».<br>' +
       'Деннис: «Я самый старший».<br>' +
       'Ровно один из них лжёт, остальные говорят правду. Какой порядок их ' +
       'возрастов по убыванию верный? (A — Альберт, B — Брюс, C — Чарли, D — Деннис.)',
    opts: ['D > A > B > C', 'D > B > A > C', 'A > D > B > C',
           'B > D > A > C', 'B > A > C > D'], ans: 3,
    hint: 'Предположи по очереди, что лжёт каждый, и проверь, не спорят ли ' +
          'остальные три правдивых фразы между собой.',
    ex: 'Если лжёт Альберт — Деннис старший, Чарли младший, и тогда Альберт ' +
        'действительно в середине и младше Денниса: его слова правда — противоречие. ' +
        'Если лжёт Брюс — он младше Чарли, но Чарли самый младший: противоречие. ' +
        'Если лжёт Чарли — Деннис старший, Альберт в середине, значит, младший — ' +
        'Брюс, но он старше Чарли: противоречие. Остаётся Деннис: он не старший, ' +
        'Альберт тоже, Чарли младший — значит, старший Брюс. Альберт младше Денниса: ' +
        '<b>B > D > A > C</b>.',
    en: { q: '4 friends compare their ages.<br>Albert: “I am neither the eldest nor the youngest, but I am younger than Dennis.”<br>Bruce: “I am older than Charlie.”<br>Charlie: “I am the youngest.”<br>Dennis: “I am the eldest.”<br>Exactly one of them is lying. Which is the correct order of their ages from eldest to youngest? (A — Albert, B — Bruce, C — Charlie, D — Dennis.)',
          hint: 'Suppose each one in turn is the liar and check whether the other three statements fit together.',
          ex: 'Albert, Bruce or Charlie lying each leads to a contradiction. If Dennis lies, he is not the eldest; Albert isn’t either and Charlie is the youngest, so Bruce is the eldest: <b>B > D > A > C</b>.' } },

  { type: 'mcq', topic: 'Весы',
    img: DIR + 'q24.png',
    q: 'Рассмотрим соотношения масс:<br>3 яблока = 2 манго + 2 банана;<br>' +
       '1 яблоко + 3 манго = 19 бананов.<br>2 яблока весят столько же, сколько:',
    opts: ['3 манго + 1 банан', '1 манго + 3 банана', '1 манго + 4 банана',
           '1 манго + 2 банана', '2 манго + 1 банан'], ans: 1,
    hint: 'Утрой вторые весы: 3 яблока + 9 манго = 57 бананов. А 3 яблока ' +
          'заменяются по первым весам.',
    ex: 'Утроим вторые весы: 3 яблока + 9 манго = 57 бананов. Заменим 3 яблока на ' +
        '2 манго + 2 банана: 11 манго + 2 банана = 57 бананов, 11 манго = 55 бананов, ' +
        '1 манго = 5 бананов. Тогда 3 яблока = 10 + 2 = 12 бананов, 1 яблоко = 4 банана, ' +
        '2 яблока = 8 бананов = 5 + 3 = <b>1 манго + 3 банана</b>.',
    en: { q: 'Look at the weights:<br>3 apples = 2 mangoes + 2 bananas;<br>1 apple + 3 mangoes = 19 bananas.<br>2 apples weigh the same as:',
          opts: ['3 mangoes + 1 banana', '1 mango + 3 bananas', '1 mango + 4 bananas',
                 '1 mango + 2 bananas', '2 mangoes + 1 banana'],
          hint: 'Triple the second scale: 3 apples + 9 mangoes = 57 bananas, and replace the 3 apples using the first scale.',
          ex: '11 mangoes + 2 bananas = 57 bananas, so 1 mango = 5 bananas and 1 apple = 4 bananas. 2 apples = 8 bananas = <b>1 mango + 3 bananas</b>.' } },

  { type: 'mcq', topic: 'Наихудший случай',
    img: DIR + 'q25.png',
    q: 'Есть 5 красных, 6 жёлтых и 4 синих шара. У Джона завязаны глаза, он не ' +
       'видит цвет шаров, но знает, сколько шаров каждого цвета.<br>Какое ' +
       'наименьшее количество шаров ему нужно взять, чтобы наверняка получить ' +
       'хотя бы по 2 шара каждого цвета?',
    opts: ['13', '12', '10', '11', '9'], ans: 0,
    check: '6 + 5 + 2',
    hint: 'Представь самое большое невезение: какие шары будут попадаться дольше всего?',
    ex: 'Хуже всего, если сначала попадутся все 6 жёлтых и все 5 красных — 11 шаров, ' +
        'и ни одного синего. После этого остаются только синие, и ещё 2 шара дадут ' +
        'два синих. 6 + 5 + 2 = <b>13</b>. Меньше нельзя: из 12 шаров может ' +
        'оказаться только один синий.',
    en: { q: 'There are 5 red, 6 yellow and 4 blue balls. John is blindfolded but knows how many balls of each colour there are.<br>What is the least number of balls he must pick to be sure of getting at least 2 balls of each colour?',
          hint: 'Imagine the worst luck: which balls could keep coming?',
          ex: 'In the worst case he first gets all 6 yellow and all 5 red balls, then 2 more are both blue: 6 + 5 + 2 = <b>13</b>.' } }

  ]
};

})();
