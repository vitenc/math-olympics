/* GJMAT 2023–2024 (Global Junior Math Aptitude Test), 4 класс — работа
   целиком. Источник: src/GJMAT_4_класс_RU.pdf (буклет Global Olympiads
   Academy с русским переводом поверх английского). Перенесена задача
   в задачу.

   Формат тот же, что у 3 класса (data/gjmat24g3.js): 25 задач с пятью
   вариантами, 90 минут, штрафов нет; 1–10 по 2 балла, 11–20 по 4,
   21–25 по 8, максимум 100.

   Работа для 4 класса, но на хабе стоит в разделе 3 класса — как задачи
   «на вырост» (поле `shelf` в каталоге assets/paper.js).

   Ключа в буклете нет — каждый ответ посчитан заново, ход решения в `ex`.
   Правок к условиям не понадобилось. Тонкости:
     №4  — в буклете формулы картинками; здесь они набраны текстом.
     №12 — длина года не сказана, но ответ 31 одинаков для 365 и 366 дней.
     №23 — в буклете время «5:30 PM», в русском переводе — 17:30;
           варианты по-русски даны в 24-часовом формате. */

(function () {

var DIR = 'img/gjmat/2024/g4/';

window.GJMAT24G4 = {
  title: 'GJMAT 2024 · 4 класс',

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
    title: 'GJMAT 2024, 4 класс — работа целиком',
    en: { title: 'GJMAT 2024, Grade 4 — the full paper',
          body: "<p>The GJMAT 2023–2024 paper for Grade 4: 25 problems, 90 minutes, 100 points maximum. It is a year ahead of the Grade 3 programme — a stretch paper.</p><ul><li><b>Every problem is multiple choice with five options</b> (A–E).</li><li><b>No penalties.</b> A blank and a wrong answer are both worth zero — answer everything.</li><li><b>Three sections with different values:</b> problems 1–10 are worth 2 points, 11–20 are worth 4, 21–25 are worth 8.</li></ul>" },
    body:
      '<p>Работа GJMAT 2023–2024 для четвёртого класса: 25 задач, 90 минут, ' +
      'максимум 100 баллов. Это на год вперёд программы 3 класса — работа ' +
      '«на вырост».</p>' +
      '<ul>' +
      '<li><b>Во всех задачах выбор из пяти вариантов</b> (A–E).</li>' +
      '<li><b>Штрафов нет.</b> Пустой ответ и неверный стоят одинаково — ноль. ' +
      'Отвечай на всё.</li>' +
      '<li><b>Три раздела, и задачи в них стоят по-разному:</b> 1–10 по 2 балла, ' +
      '11–20 по 4, 21–25 по 8.</li>' +
      '</ul>'
  },

  questions: [

  /* ---------- РАЗДЕЛ A · задачи 1–10 · по 2 балла ---------- */

  { type: 'mcq', topic: 'Чётность',
    q: 'Рассмотрим ряд Фибоначчи, в котором, начиная с 3-го числа, каждое число ' +
       'равно сумме двух предыдущих: <b>1, 1, 2, 3, 5, 8, 13, 21, 34, 55, …</b><br>' +
       'Найдите разность между количеством чётных и нечётных чисел среди первых ' +
       '2023 членов ряда.',
    opts: ['676', '675', '674', '673', '671'], ans: 1,
    check: 'len([k for k in range(2023) if k % 3 != 2]) - len([k for k in range(2023) if k % 3 == 2])',
    hint: 'Не считай сами числа — следи только за чётностью: нечёт, нечёт, чёт, …',
    ex: 'Нечётное + нечётное = чётное, нечётное + чётное = нечётное, поэтому ' +
        'чётность повторяется тройками: нечёт, нечёт, чёт. 2023 = 3 × 674 + 1: ' +
        '674 полные тройки и ещё один член (нечётный). Чётных 674, нечётных ' +
        '2 × 674 + 1 = 1349. Разность 1349 &minus; 674 = <b>675</b>.',
    en: { q: 'In the Fibonacci series, from the 3rd number on, each number is the sum of the two before it: <b>1, 1, 2, 3, 5, 8, 13, 21, 34, 55, …</b><br>Find the difference between the counts of odd and even numbers among the first 2023 terms.',
          hint: 'Don’t compute the numbers — track only odd and even: odd, odd, even, …',
          ex: 'The pattern odd, odd, even repeats. 2023 = 3 × 674 + 1, so there are 674 even and 1349 odd terms. The difference is <b>675</b>.' } },

  { type: 'mcq', topic: 'Делимость',
    q: 'Сумма 4 различных простых чисел — нечётное составное (не простое) число.<br>' +
       'Найдите наименьшее возможное произведение этих 4 простых чисел.',
    opts: ['320', '270', '210', '360', '330'], ans: 4,
    check: 'min(p*q*r*s for p in list(primerange(2, 30)) for q in list(primerange(2, 30)) ' +
           'for r in list(primerange(2, 30)) for s in list(primerange(2, 30)) ' +
           'if p < q < r < s and (p + q + r + s) % 2 == 1 and not isprime(p + q + r + s))',
    hint: 'Чтобы сумма четырёх простых была нечётной, среди них должно быть число 2. ' +
          'Начни с самых маленьких простых и проверяй сумму.',
    ex: 'Все простые, кроме 2, нечётные; сумма четырёх нечётных чётна. Значит, среди ' +
        'чисел есть 2. Пробуем самые маленькие: 2 + 3 + 5 + 7 = 17 — простое, не ' +
        'годится. 2 + 3 + 5 + 11 = 21 = 3 × 7 — составное ✓. Произведение ' +
        '2 × 3 × 5 × 11 = <b>330</b>. Другие наборы дают больше: уже 2 × 3 × 7 × 11 = 462.',
    en: { q: 'The sum of 4 different prime numbers is an odd composite (non-prime) number.<br>Find the smallest possible product of these 4 primes.',
          hint: 'For the sum of four primes to be odd, one of them must be 2. Start with the smallest primes.',
          ex: '2 + 3 + 5 + 7 = 17 is prime. 2 + 3 + 5 + 11 = 21 is composite, and the product is <b>330</b>.' } },

  { type: 'mcq', topic: 'Делимость',
    q: 'Числа-палиндромы читаются одинаково слева направо и справа налево, ' +
       'например: 232, 1441, 13731.<br>Сколько существует трёхзначных ' +
       'чисел-палиндромов, которые делятся на 4?',
    opts: ['96', '20', '24', '36', '60'], ans: 1,
    check: 'len([n for n in range(100, 1000) if n // 100 == n % 10 and n % 4 == 0])',
    hint: 'Число делится на 4, если на 4 делится число из двух последних цифр. ' +
          'Последняя цифра палиндрома совпадает с первой — какой она может быть?',
    ex: 'Палиндром вида ABA делится на 4, если делится на 4 число «BA». Значит, A ' +
        'чётная и не 0: 2, 4, 6 или 8. Для A = 2 и 6 подходят B нечётные (12, 32, 52, ' +
        '72, 92 и 16, 36, …) — по 5; для A = 4 и 8 — B чётные (04, 24, … и 08, 28, …) — ' +
        'тоже по 5. Всего 4 × 5 = <b>20</b>.',
    en: { q: 'Palindromic numbers read the same both ways, for example 232, 1441, 13731.<br>How many 3-digit palindromes are divisible by 4?',
          hint: 'A number divides by 4 when its last two digits do. The last digit of a palindrome equals the first — what can it be?',
          ex: 'ABA divides by 4 when “BA” does, so A is 2, 4, 6 or 8, and for each A exactly 5 values of B work. 4 × 5 = <b>20</b>.' } },

  { type: 'mcq', topic: 'Порядок действий',
    q: 'Дано: 10 × 2 + 10 × 3 + 10 × 5 = 10 × (2 + 3 + 5) = 10 × 10 = 100.<br>' +
       'Найдите значение выражения: <b>360 ÷ 6 + 360 ÷ 12 + 360 ÷ 18</b>.',
    opts: ['110', '10', '36', '360', '120'], ans: 0,
    check: '360 // 6 + 360 // 12 + 360 // 18',
    hint: 'Деление выполняется раньше сложения. Ловушка — сложить делители: ' +
          '360 ÷ (6 + 12 + 18) — это совсем другое выражение.',
    ex: 'Сначала деления: 360 ÷ 6 = 60, 360 ÷ 12 = 30, 360 ÷ 18 = 20. ' +
        'Потом сложение: 60 + 30 + 20 = <b>110</b>. Пример про 10 × (2 + 3 + 5) — ' +
        'приманка: для деления так выносить нельзя, 360 ÷ 36 = 10 — неверно.',
    en: { q: 'Given: 10 × 2 + 10 × 3 + 10 × 5 = 10 × (2 + 3 + 5) = 10 × 10 = 100.<br>Find the value of <b>360 ÷ 6 + 360 ÷ 12 + 360 ÷ 18</b>.',
          hint: 'Division comes before addition. Adding the divisors, 360 ÷ (6 + 12 + 18), is a trap.',
          ex: '60 + 30 + 20 = <b>110</b>. The example is bait: 360 ÷ 36 = 10 is wrong.' } },

  { type: 'mcq', topic: 'Делимость',
    q: 'Сколько существует трёхзначных общих кратных чисел 8 и 12?',
    opts: ['48', '36', '43', '37', '42'], ans: 3,
    check: 'len([n for n in range(100, 1000) if n % 24 == 0])',
    hint: 'Общие кратные 8 и 12 — это кратные их наименьшего общего кратного. ' +
          'Какое оно?',
    ex: 'НОК(8, 12) = 24, общие кратные — это 24, 48, 72, … Трёхзначные: от ' +
        '24 × 5 = 120 до 24 × 41 = 984. Их 41 &minus; 5 + 1 = <b>37</b>.',
    en: { q: 'How many 3-digit numbers are common multiples of 8 and 12?',
          hint: 'Common multiples of 8 and 12 are the multiples of their least common multiple.',
          ex: 'LCM(8, 12) = 24. 3-digit multiples run from 24 × 5 = 120 to 24 × 41 = 984: <b>37</b> numbers.' } },

  { type: 'mcq', topic: 'Дроби',
    q: 'Правильная дробь A/B такова, что если к числителю прибавить 5, то значение ' +
       'дроби станет равно 2. Если же прибавить 5 к знаменателю, то значение дроби ' +
       'станет равно 1/3.<br>Найдите значение A + B.',
    opts: ['5', '6', '7', '8', '9'], ans: 2,
    check: '(lambda s: s[A] + s[B])(solve([Eq(A + 5, 2*B), Eq(3*A, B + 5)], [A, B]))',
    hint: 'Первое условие: A + 5 = 2B. Второе: B + 5 = 3A. Подбери небольшие числа.',
    ex: '(A + 5)/B = 2 значит A + 5 = 2B; A/(B + 5) = 1/3 значит B + 5 = 3A. ' +
        'Из первого A = 2B &minus; 5, подставим: B + 5 = 6B &minus; 15, 5B = 20, B = 4, ' +
        'A = 3. Дробь 3/4: (3 + 5)/4 = 2 ✓, 3/9 = 1/3 ✓. A + B = <b>7</b>.',
    en: { q: 'A proper fraction A/B becomes 2 if 5 is added to the numerator, and becomes 1/3 if 5 is added to the denominator.<br>Find A + B.',
          hint: 'The first condition says A + 5 = 2B, the second B + 5 = 3A. Try small numbers.',
          ex: 'A = 2B &minus; 5, so B + 5 = 6B &minus; 15, B = 4, A = 3. The fraction is 3/4 and A + B = <b>7</b>.' } },

  { type: 'mcq', topic: 'Делимость',
    q: 'Какой будет последняя цифра произведения всех простых чисел, меньших 100, ' +
       'кроме числа 2?',
    opts: ['2', '3', '4', '5', '0'], ans: 3,
    check: 'Mul(*list(primerange(3, 100))) % 10',
    hint: 'Есть ли среди этих простых число 5? А есть ли чётные?',
    ex: 'Среди множителей есть 5, поэтому произведение делится на 5 и кончается ' +
        'на 0 или 5. Чётных множителей нет (двойку убрали), значит, произведение ' +
        'нечётное и кончается на <b>5</b>.',
    en: { q: 'What is the last digit of the product of all prime numbers below 100 except 2?',
          hint: 'Is 5 among these primes? Are any of them even?',
          ex: '5 is a factor, so the product ends in 0 or 5; there is no even factor, so it is odd and ends in <b>5</b>.' } },

  { type: 'mcq', topic: 'Логика с числами',
    q: 'Дано пятизначное число. Сумма любых 3 его соседних цифр равна 11, ' +
       'а сумма любых 4 соседних цифр равна 15.<br>Найдите произведение цифр этого числа.',
    opts: ['768', '625', '576', '729', '640'], ans: 0,
    check: 'list(set(a*b*c*d*e for a in range(1, 10) for b in range(10) for c in range(10) ' +
           'for d in range(10) for e in range(10) ' +
           'if a + b + c == b + c + d == c + d + e == 11 and a + b + c + d == b + c + d + e == 15))[0]',
    hint: 'Сравни сумму первых четырёх цифр с суммой первых трёх: на что они отличаются?',
    ex: 'Пусть число abcde. a + b + c + d = 15 и a + b + c = 11, значит d = 4. ' +
        'b + c + d + e = 15 и b + c + d = 11, значит e = 4. Из b + c + d = c + d + e ' +
        'получаем b = e = 4, из a + b + c = b + c + d — a = d = 4. Тогда c = 11 &minus; 8 = 3. ' +
        'Число 44344, произведение 4 × 4 × 3 × 4 × 4 = <b>768</b>.',
    en: { q: 'In a 5-digit number, any 3 neighbouring digits add up to 11 and any 4 neighbouring digits add up to 15.<br>Find the product of its digits.',
          hint: 'Compare the sum of the first four digits with the sum of the first three.',
          ex: 'The 4th and 5th digits are 15 &minus; 11 = 4, and by the same shift the 1st and 2nd are 4 too, so the middle one is 3: 44344. The product is <b>768</b>.' } },

  { type: 'mcq', topic: 'Перебор с условием',
    q: 'Длины всех трёх сторон треугольника — натуральные числа. Длины двух сторон ' +
       'равны 8 и 13.<br>Чему равна разность между наибольшим и наименьшим ' +
       'возможными периметрами этого треугольника?',
    opts: ['12', '11', '13', '15', '14'], ans: 4,
    check: '(lambda L: max(L) - min(L))([x for x in range(1, 40) if x < 8 + 13 and x + 8 > 13])',
    hint: 'Каждая сторона треугольника меньше суммы двух других. Какой может быть ' +
          'третья сторона?',
    ex: 'Третья сторона x меньше 8 + 13 = 21 и больше 13 &minus; 8 = 5, то есть x от 6 ' +
        'до 20. Периметр от 8 + 13 + 6 = 27 до 8 + 13 + 20 = 41. Разность ' +
        '41 &minus; 27 = <b>14</b> — столько же, сколько 20 &minus; 6.',
    en: { q: 'All three sides of a triangle are whole numbers. Two of them are 8 and 13.<br>What is the difference between the largest and the smallest possible perimeter?',
          hint: 'Each side is shorter than the other two together. What can the third side be?',
          ex: 'The third side is from 6 to 20, so the perimeter is from 27 to 41. The difference is <b>14</b>.' } },

  { type: 'mcq', topic: 'Площадь и периметр',
    q: 'Два прямоугольника с целочисленными сторонами имеют одинаковый периметр — ' +
       '46.<br>Один из них разбивается на наибольшее возможное число единичных ' +
       'квадратов (1 × 1), а другой — на наименьшее возможное.<br>Найдите разность ' +
       'между количествами единичных квадратов в этих двух прямоугольниках.',
    opts: ['101', '110', '144', '120', '96'], ans: 1,
    check: '(lambda L: max(L) - min(L))([a*(23 - a) for a in range(1, 23)])',
    hint: 'Число единичных квадратов — это площадь. Длина + ширина = 23. Когда ' +
          'площадь наибольшая, а когда наименьшая?',
    ex: 'Полупериметр 46 ÷ 2 = 23, стороны в сумме дают 23. Площадь наибольшая, ' +
        'когда стороны почти равны: 11 × 12 = 132; наименьшая — когда самые ' +
        'разные: 1 × 22 = 22. Разность 132 &minus; 22 = <b>110</b>.',
    en: { q: 'Two rectangles with whole-number sides both have perimeter 46. One holds the greatest possible number of 1 × 1 unit squares, the other the smallest.<br>Find the difference between these numbers of unit squares.',
          hint: 'The number of unit squares is the area, and length + width = 23.',
          ex: 'Largest area 11 × 12 = 132, smallest 1 × 22 = 22. The difference is <b>110</b>.' } },

  /* ---------- РАЗДЕЛ B · задачи 11–20 · по 4 балла ---------- */

  { type: 'mcq', topic: 'Разряды',
    q: 'Учитель дал задачу: найти произведение двух двузначных чисел A и B. ' +
       'Сара ослышалась: у числа A она услышала десятки 30 вместо 20, а у числа B — ' +
       'единицы 1 вместо 9.<br>Правильный ответ — 638. Какой ответ получила Сара, ' +
       'если верно перемножила услышанные числа?',
    opts: ['564', '720', '648', '537', '672'], ans: 4,
    check: '[(a + 10)*(b - 8) for a in range(20, 30) for b in range(19, 100, 10) if a*b == 638][0]',
    hint: 'A — число из третьего десятка (20…29), B кончается на 9. Разложи 638 ' +
          'на множители.',
    ex: '638 = 2 × 11 × 29. Число от 20 до 29, на которое делится 638, — 22 или 29; ' +
        'второй множитель должен кончаться на 9, поэтому A = 22, B = 29 (22 × 29 = 638 ✓). ' +
        'Сара услышала 32 и 21: 32 × 21 = <b>672</b>.',
    en: { q: 'A teacher asked for the product of two 2-digit numbers A and B. Sarah misheard the tens of A as 30 instead of 20, and the ones of B as 1 instead of 9.<br>The correct answer was 638. What answer did Sarah get, multiplying correctly what she heard?',
          hint: 'A is in the twenties and B ends in 9. Factor 638.',
          ex: '638 = 22 × 29, so A = 22 and B = 29. Sarah multiplied 32 × 21 = <b>672</b>.' } },

  { type: 'mcq', topic: 'Календарь',
    q: 'Альберт ходит в парк каждый 2-й день, Бернард — каждый 3-й день, а Чарли — ' +
       'каждый 4-й день. 1 января все трое пришли в парк и встретились.<br>' +
       'Сколько раз за год все трое встретятся в парке, включая 1 января?',
    opts: ['30', '41', '36', '31', '24'], ans: 3,
    check: 'len(range(1, 366, lcm(lcm(2, 3), 4)))',
    hint: 'Через сколько дней все трое снова совпадут? Это наименьшее число, ' +
          'которое делится и на 2, и на 3, и на 4.',
    ex: 'Все трое снова в парке через НОК(2, 3, 4) = 12 дней. Встречи — в 1-й, 13-й, ' +
        '25-й, … день года: 1 + 12 × k. Наибольшее k, при котором день не позже 365-го: ' +
        '1 + 12 × 30 = 361. Значит, k от 0 до 30 — <b>31</b> встреча. В високосный год ' +
        'следующая была бы в 373-й день — ответ тот же.',
    en: { q: 'Albert goes to the park every 2nd day, Bernard every 3rd day and Charlie every 4th day. On 1 January all three met at the park.<br>How many times will all three meet at the park during the year, including 1 January?',
          hint: 'After how many days do all three coincide again? The smallest number divisible by 2, 3 and 4.',
          ex: 'They meet every LCM(2, 3, 4) = 12 days: on days 1, 13, …, 361 of the year — <b>31</b> times.' } },

  { type: 'mcq', topic: 'Делимость',
    q: 'Учительница принесла в класс 48 леденцов на палочке и 84 конфеты и раздала ' +
       'их все ученикам. Каждый ученик получил одинаковое количество леденцов и ' +
       'одинаковое количество конфет.<br>Какое наименьшее количество сладостей ' +
       '(леденцы + конфеты) мог получить каждый ученик?',
    opts: ['22', '11', '12', '10', '16'], ans: 1,
    check: '(48 + 84) // gcd(48, 84)',
    hint: 'Чем больше учеников, тем меньше достаётся каждому. Число учеников делит ' +
          'и 48, и 84 — каким наибольшим оно может быть?',
    ex: 'Число учеников делит и 48, и 84; наибольший общий делитель — НОД(48, 84) = 12. ' +
        'При 12 учениках каждому достаётся 48 ÷ 12 = 4 леденца и 84 ÷ 12 = 7 конфет — ' +
        'всего 4 + 7 = <b>11</b>.',
    en: { q: 'A teacher brought 48 lollipops and 84 candies and shared all of them among her students. Every student got the same number of lollipops and the same number of candies.<br>What is the least number of sweets each student could get?',
          hint: 'More students means fewer sweets each. The number of students divides both 48 and 84.',
          ex: 'GCD(48, 84) = 12 students at most, each gets 4 + 7 = <b>11</b> sweets.' } },

  { type: 'mcq', topic: 'Покупка нескольких',
    q: 'Коробка карандашей стоит 2 доллара (200 центов), в ней 10 карандашей. ' +
       'Поштучно каждый карандаш стоит дороже, чем в коробке.<br>Аарон дал продавцу ' +
       '5 долларов, купил наибольшее возможное число карандашей — 24 — и получил ' +
       '8 центов сдачи.<br>Какое наибольшее количество карандашей можно купить ' +
       'на 9 долларов 50 центов?',
    opts: ['44', '43', '42', '45', '46'], ans: 4,
    check: '4*10 + (950 - 4*200) // Rational(500 - 8 - 2*200, 4)',
    hint: 'Сначала узнай цену одного карандаша: 24 карандаша — это 2 коробки и ' +
          '4 штуки, а заплачено 500 &minus; 8 = 492 цента.',
    ex: 'Выгоднее брать коробки: 24 = 2 коробки + 4 карандаша. Заплачено ' +
        '500 &minus; 8 = 492 цента, на 4 карандаша поштучно — 492 &minus; 400 = 92, ' +
        'по 23 цента. На 950 центов: 4 коробки (800) — 40 карандашей, остаётся 150, ' +
        'на них 6 карандашей по 23 (138 центов). Всего 40 + 6 = <b>46</b>.',
    en: { q: 'A box of 10 pencils costs 2 dollars (200 cents). A single pencil costs more than one in a box.<br>Aaron paid with a 5-dollar note, bought the most pencils he could — 24 — and got 8 cents change.<br>At most, how many pencils can be bought for 9 dollars 50 cents?',
          hint: 'First find the price of one pencil: 24 pencils are 2 boxes and 4 singles, for 492 cents.',
          ex: '4 singles cost 92 cents, so 23 cents each. 950 cents: 4 boxes (40 pencils, 800 cents) and 6 singles for 138 cents — <b>46</b> pencils.' } },

  { type: 'mcq', topic: 'Текстовые задачи',
    q: 'Весы для взвешивания людей имеют ошибку нуля: при каждом взвешивании к ' +
       'показанию прибавляется или от него отнимается одно и то же значение.<br>' +
       'Джек встал на весы — они показали 45 кг. Затем на весы встала Джилл — ' +
       '39 кг. Потом они встали на весы вместе — 81 кг.<br>Каков правильный ' +
       'общий вес Джека и Джилл?',
    opts: ['84', '90', '87', '78', '81'], ans: 3,
    check: '81 - (45 + 39 - 81)',
    hint: 'Если сложить два первых показания, ошибка войдёт в сумму дважды, а в ' +
          'третьем показании — только один раз.',
    ex: 'Сумма двух показаний 45 + 39 = 84 — это вес Джека и Джилл плюс две ошибки. ' +
        'Совместное показание 81 — тот же вес плюс одна ошибка. Значит, ошибка ' +
        '84 &minus; 81 = 3 кг (весы прибавляют 3). Правильный общий вес ' +
        '81 &minus; 3 = <b>78</b> кг.',
    en: { q: 'A bathroom scale has a zero error: every reading has the same amount added or subtracted.<br>Jack’s reading was 45 kg, Jill’s 39 kg, and both together read 81 kg.<br>What is the correct total weight of Jack and Jill?',
          hint: 'Adding the two single readings counts the error twice; the joint reading counts it once.',
          ex: '84 &minus; 81 = 3, so the scale adds 3 kg. The true total is 81 &minus; 3 = <b>78</b> kg.' } },

  { type: 'mcq', topic: 'Логика',
    q: 'В теннисном турнире 90 участников. Турнир по олимпийской системе: ' +
       'победитель матча проходит дальше, проигравший выбывает. На некоторых этапах ' +
       'отдельные игроки проходят дальше без игры («бай»), потому что им нет ' +
       'соперника. В итоге остаётся один чемпион.<br>Всего сыграно A матчей, и ' +
       'B раз игрок прошёл дальше без игры. Найдите наименьшее возможное ' +
       'значение A + B.',
    opts: ['46', '91', '90', '89', '92'], ans: 4,
    check: '89 + 3',
    hint: 'В каждом матче выбывает ровно один игрок. Сколько игроков должны выбыть? ' +
          'А «бай» нужен, когда в круге нечётное число игроков.',
    ex: 'Каждый матч выбивает одного игрока, выбыть должны 89 — значит, матчей ' +
        'всегда A = 89. Бай нужен, когда в круге нечётное число игроков: ' +
        '90 → 45 (нечётно: 1 бай, 22 матча) → 23 (1 бай, 11 матчей) → 12 → 6 → 3 ' +
        '(1 бай, 1 матч) → 2 → 1. Байев B = 3, и A + B = 89 + 3 = <b>92</b>.',
    en: { q: 'A knockout tennis tournament has 90 players: the winner of each match goes on, the loser is out. At some stages a player goes on without playing (a “bye”) because there is no opponent. One champion remains.<br>A matches are played and there are B byes. Find the smallest possible A + B.',
          hint: 'Each match knocks out exactly one player. A bye is needed when a round has an odd number of players.',
          ex: '89 players must be knocked out, so A = 89. Rounds: 90 → 45 (bye) → 23 (bye) → 12 → 6 → 3 (bye) → 2 → 1, so B = 3 and A + B = <b>92</b>.' } },

  { type: 'mcq', topic: 'Метод предположения',
    q: 'У Генри 30 монет: часть по 10 центов, остальные по 25 центов. Монеты по ' +
       '25 центов вместе стоят на 50 центов больше, чем монеты по 10 центов.<br>' +
       'Сколько всего денег (в центах) у Генри?',
    opts: ['450', '400', '500', '550', '525'], ans: 0,
    check: '(lambda s: 25*s[q] + 10*s[d])(solve([Eq(q + d, 30), Eq(25*q - 10*d, 50)], [q, d]))',
    hint: 'Попробуй разделить монеты пополам — 15 и 15 — и посмотри, как меняется ' +
          'разница, если переложить одну монету.',
    ex: 'Пусть монет по 25 центов q, по 10 центов 30 &minus; q. ' +
        '25q &minus; 10 × (30 &minus; q) = 50, 35q = 350, q = 10. Значит, 10 монет по 25 ' +
        '(250 центов) и 20 по 10 (200 центов): 250 &minus; 200 = 50 ✓. ' +
        'Всего 250 + 200 = <b>450</b> центов.',
    en: { q: 'Henry has 30 coins: some dimes (10 cents) and the rest quarters (25 cents). The quarters are worth 50 cents more than the dimes.<br>How much money in cents does Henry have?',
          hint: 'Try splitting 15 and 15 and see how the difference changes when one coin is swapped.',
          ex: '25q &minus; 10(30 &minus; q) = 50 gives q = 10: 250 cents in quarters and 200 in dimes, <b>450</b> cents in all.' } },

  { type: 'mcq', topic: 'Модельный метод',
    q: 'Ученики едут на пикник. Если взять несколько 20-местных микроавтобусов, ' +
       '8 ученикам не хватит мест. Если же нанять 24-местные автобусы, понадобится ' +
       'на 1 автобус меньше, чем микроавтобусов, и все автобусы будут заполнены ' +
       'полностью.<br>Сколько учеников едет на пикник?',
    opts: ['144', '192', '168', '120', '216'], ans: 2,
    check: '(lambda v: 20*v + 8)(solve(Eq(20*v + 8, 24*(v - 1)), v)[0])',
    hint: 'Проверь варианты: число учеников делится на 24, а при делении на 20 ' +
          'даёт остаток 8.',
    ex: 'Пусть микроавтобусов v. Учеников 20v + 8 = 24 × (v &minus; 1), ' +
        'то есть 20v + 8 = 24v &minus; 24, 4v = 32, v = 8. Учеников 20 × 8 + 8 = ' +
        '<b>168</b>. Проверка: 7 автобусов по 24 = 168 ✓.',
    en: { q: 'Students go on a picnic. With some 20-seat vans, 8 students have no seat. With 24-seat buses, one bus fewer than the vans is needed and every bus is full.<br>How many students are going?',
          hint: 'Check the options: the number divides by 24 and leaves remainder 8 when divided by 20.',
          ex: '20v + 8 = 24(v &minus; 1) gives v = 8, so <b>168</b> students (7 buses × 24).' } },

  { type: 'mcq', topic: 'Скорость',
    q: 'Майк и Люк одновременно начинают бегать вокруг парка в одном направлении. ' +
       'Скорость Майка — 5 м/с, Люка — 3 м/с. Впервые они снова встречаются ровно ' +
       'через 5 минут. Сразу после встречи Майк разворачивается и бежит в обратную ' +
       'сторону со скоростью 4 м/с, а Люк бежит дальше, но тоже со скоростью 4 м/с.' +
       '<br>Через сколько секунд после первой встречи они встретятся снова?',
    opts: ['150', '175', '90', '125', '75'], ans: 4,
    check: 'Rational((5 - 3)*300, 4 + 4)',
    hint: 'Майк догнал Люка, когда обогнал его ровно на один круг. Найди длину круга.',
    ex: 'За 5 минут = 300 секунд Майк пробежал на (5 &minus; 3) × 300 = 600 м больше Люка — ' +
        'это ровно один круг. Теперь они бегут навстречу и вместе пробегают ' +
        '4 + 4 = 8 м за секунду. Круг в 600 м они «закроют» за 600 ÷ 8 = <b>75</b> секунд.',
    en: { q: 'Mike and Luke start running around a park at the same time in the same direction, Mike at 5 m/s and Luke at 3 m/s. They first meet again after exactly 5 minutes. Then Mike turns around and runs the other way at 4 m/s, while Luke keeps going at 4 m/s.<br>How many seconds after the first meeting do they meet again?',
          hint: 'Mike catches Luke when he is exactly one lap ahead. Find the length of the lap.',
          ex: 'In 300 s Mike gains 2 × 300 = 600 m — one lap. Running towards each other they close 8 m per second: 600 ÷ 8 = <b>75</b> seconds.' } },

  { type: 'mcq', topic: 'Возраст',
    q: 'Отец Лизы сейчас в 5 раз старше её. Через 6 лет Лиза будет в 3 раза ' +
       'младше отца.<br>Через сколько лет сумма их возрастов будет равна 70?',
    opts: ['17', '18', '19', '20', '16'], ans: 0,
    check: '(lambda L: Rational(70 - 6*L, 2))(solve(Eq(5*L + 6, 3*(L + 6)), L)[0])',
    hint: 'Разница в возрасте не меняется. Сейчас она — 4 «Лизиных возраста», ' +
          'а через 6 лет — 2 «Лизиных возраста».',
    ex: 'Пусть Лизе L лет, отцу 5L. Через 6 лет: 5L + 6 = 3 × (L + 6), 2L = 12, L = 6. ' +
        'Лизе 6, отцу 30, сумма 36. Каждый год сумма растёт на 2: ' +
        '(70 &minus; 36) ÷ 2 = <b>17</b> лет.',
    en: { q: 'Lisa’s father is 5 times her age now. In 6 years Lisa will be one third of his age.<br>In how many years will their ages add up to 70?',
          hint: 'The age gap never changes.',
          ex: '5L + 6 = 3(L + 6) gives L = 6, father 30, total 36. The total grows by 2 a year: (70 &minus; 36) ÷ 2 = <b>17</b> years.' } },

  /* ---------- РАЗДЕЛ C · задачи 21–25 · по 8 баллов ---------- */

  { type: 'mcq', topic: 'Перебор с условием',
    img: DIR + 'q21.png',
    q: 'На спортивный праздник принесли стулья. Из них составили сплошной ' +
       'прямоугольник из рядов и столбцов, в каждом ряду одинаковое число стульев. ' +
       'Оставшийся 21 стул уже нельзя добавить так, чтобы получился новый полный ряд ' +
       'или столбец, не трогая расставленные стулья.<br>Какое наименьшее количество ' +
       'стульев принесли, включая 21 неиспользованный?',
    opts: ['462', '505', '420', '484', '625'], ans: 1,
    check: '22*22 + 21',
    hint: 'Новый ряд нельзя добавить, если в ряду больше 21 стула. А новый столбец — ' +
          'если рядов больше 21.',
    ex: 'Чтобы из 21 стула не сложился новый ряд, в ряду должно быть больше 21 стула — ' +
        'не меньше 22. Чтобы не сложился новый столбец, рядов тоже не меньше 22. ' +
        'Наименьший прямоугольник 22 × 22 = 484 стула, и ещё 21 лишний: ' +
        '484 + 21 = <b>505</b>.',
    en: { q: 'Chairs for a sports day form a solid rectangle of rows and columns. The remaining 21 chairs cannot make a new complete row or column without moving the others.<br>What is the least number of chairs brought, including the 21 unused ones?',
          hint: 'A new row is impossible if a row has more than 21 chairs; a new column — if there are more than 21 rows.',
          ex: 'At least 22 chairs per row and at least 22 rows: 22 × 22 = 484, plus 21 = <b>505</b>.' } },

  { type: 'mcq', topic: 'Кубики',
    q: 'Большой куб сложен из одинаковых маленьких кубиков. Его окунули в краску, ' +
       'и все внешние грани окрасились. Потом куб разобрали. Всего окрашенных ' +
       'граней у маленьких кубиков — 294.<br>Найдите разность между количеством ' +
       'кубиков, у которых окрашена хотя бы одна грань, и количеством кубиков ' +
       'без окрашенных граней.',
    opts: ['98', '57', '72', '93', '112'], ans: 3,
    check: '(lambda n: n**3 - 2*(n - 2)**3)(sqrt(294 // 6))',
    hint: 'Окрашенные грани маленьких кубиков вместе составляют поверхность ' +
          'большого куба: 6 граней по n × n квадратиков.',
    ex: 'Поверхность большого куба — 6 граней по n × n: 6n² = 294, n² = 49, n = 7. ' +
        'Всего кубиков 7 × 7 × 7 = 343. Неокрашенные — внутренний куб ' +
        '5 × 5 × 5 = 125. Окрашенных 343 &minus; 125 = 218. Разность ' +
        '218 &minus; 125 = <b>93</b>.',
    en: { q: 'A large cube is built from identical small cubes, dipped in paint so all its outer faces are coloured, and taken apart. The small cubes have 294 painted faces in total.<br>Find the difference between the number of cubes with at least one painted face and the number with none.',
          hint: 'The painted faces together make up the big cube’s surface: 6 faces of n × n squares.',
          ex: '6n² = 294 gives n = 7: 343 cubes, of which 5³ = 125 are unpainted and 218 painted. 218 &minus; 125 = <b>93</b>.' } },

  { type: 'mcq', topic: 'Скорость',
    q: 'Самуэль выезжает из дома на машине в 17:30, чтобы забрать жену с вокзала. ' +
       'Его жена Бренда в то же время выходит с вокзала и идёт домой пешком. ' +
       'Они встречаются по дороге, вместе едут домой и приезжают в 17:46. Если бы ' +
       'Бренда шла от вокзала до самого дома пешком, она пришла бы в 18:10.<br>' +
       'Во сколько Самуэлю нужно было выехать из дома, чтобы приехать на вокзал ' +
       'точно к выходу Бренды (к 17:30)?',
    opts: ['17:14', '17:18', '17:20', '17:22', '17:16'], ans: 2,
    hint: 'Машина ехала до встречи и обратно одно и то же расстояние — значит, ' +
          'встреча была в 17:38. Сравни, за сколько этот же кусок дороги проходят ' +
          'пешком и проезжают на машине.',
    ex: 'Туда и обратно машина ехала 16 минут, по 8 минут в одну сторону: встреча ' +
        'в 17:38. Бренда шла 8 минут, а весь путь пешком — 40 минут, значит, от места ' +
        'встречи до дома ей оставалось бы 32 минуты пешком; машина проехала этот ' +
        'кусок за 8 минут — она в 4 раза быстрее. Свои 8 минут пешком Бренда ' +
        'прошла бы машиной за 2 минуты. Дом → вокзал на машине: 8 + 2 = 10 минут. ' +
        'Выехать нужно в 17:30 &minus; 10 мин = <b>17:20</b>.',
    en: { q: 'Samuel leaves home by car at 5:30 PM to pick up his wife at the station. At the same time his wife Brenda leaves the station on foot towards home. They meet on the way, drive home together and arrive at 5:46 PM. If Brenda had walked all the way, she would have arrived at 6:10 PM.<br>When should Samuel have left home to reach the station just as Brenda came out (at 5:30 PM)?',
          opts: ['5:14 PM', '5:18 PM', '5:20 PM', '5:22 PM', '5:16 PM'],
          hint: 'The car drove the same distance there and back, so they met at 5:38.',
          ex: 'They met at 5:38. Brenda’s remaining walk would take 32 minutes, the car did it in 8, so the car is 4 times faster. Her 8 minutes of walking is 2 minutes by car, so home → station takes 10 minutes: leave at <b>5:20 PM</b>.' } },

  { type: 'mcq', topic: 'Площадь и периметр',
    img: DIR + 'q24.png',
    q: 'Прямоугольный участок разделён на пять квадратных зон, как на рисунке: ' +
       'две одинаковые большие (Z1, Z2) и три одинаковые маленькие (Z3, Z4, Z5).<br>' +
       'Площадь всего участка — 336 км². Найдите периметр участка в километрах.',
    opts: ['56', '64', '80', '90', '72'], ans: 2,
    check: '(lambda L: 2*(L + 2*L + L/3))(sqrt(Rational(336*3, 7)))',
    hint: 'Три маленьких квадрата стоят столбиком вдоль стороны большого: сторона ' +
          'большого в 3 раза больше стороны маленького.',
    ex: 'Пусть сторона маленького квадрата s, большого — 3s. Площадь: ' +
        '2 × 9s² + 3 × s² = 21s² = 336, s² = 16, s = 4. Участок: высота 3 × 4 = 12, ' +
        'длина 12 + 12 + 4 = 28. Периметр 2 × (12 + 28) = <b>80</b> км.',
    en: { q: 'A rectangle is divided into five square zones as shown: two equal large ones (Z1, Z2) and three equal small ones (Z3, Z4, Z5).<br>The whole area is 336 km². Find the perimeter in kilometres.',
          hint: 'Three small squares stand in a column along a side of a large one, so the large side is 3 times the small side.',
          ex: '2 × 9s² + 3s² = 21s² = 336, so s = 4. The rectangle is 12 by 28, perimeter <b>80</b> km.' } },

  { type: 'mcq', topic: 'Принцип Дирихле',
    img: DIR + 'q25.png',
    q: 'На конкурсе каждый ребёнок раскрашивает одну сторону флага. Цвета — красный, ' +
       'синий и зелёный; сколько и какие использовать, каждый решает сам. Флаг ' +
       'разделён на 4 части, как на рисунке; каждая часть — одного цвета, и ' +
       'никакие две соседние части (с общей стороной) не закрашены одним цветом.' +
       '<br>Организаторы знали, что как минимум 3 флага точно окажутся абсолютно ' +
       'одинаковыми. Какое наименьшее число детей участвовало в конкурсе?',
    opts: ['25', '49', '33', '37', '41'], ans: 3,
    check: '2*((3 - 1)**4 + (3 - 1)) + 1',
    hint: 'Сначала посчитай, сколько всего разных флагов можно раскрасить. ' +
          'Части 1 и 4 не соседние, части 2 и 3 тоже.',
    ex: 'Соседи: 1–2, 1–3, 2–4, 3–4. Если части 1 и 4 одного цвета (3 способа), то ' +
        'части 2 и 3 — любой из двух других цветов каждая: 3 × 2 × 2 = 12. Если 1 и 4 ' +
        'разных цветов (3 × 2 = 6 способов), то 2 и 3 обязаны быть третьего цвета: 6. ' +
        'Всего 18 разных флагов. Чтобы три флага наверняка совпали, детей должно быть ' +
        'больше, чем 2 × 18 = 36: 36 детей могли раскрасить каждый флаг ровно дважды. ' +
        'Ответ — <b>37</b>.',
    en: { q: 'At a contest every child paints one side of a flag with red, blue and green, using any of them. The flag has 4 parts as shown; each part is one colour, and no two neighbouring parts (sharing a side) have the same colour.<br>The organisers knew that at least 3 flags would surely be exactly the same. What is the least number of children?',
          hint: 'First count all the different flags. Parts 1 and 4 are not neighbours, nor are parts 2 and 3.',
          ex: 'Parts 1 and 4 the same colour: 3 × 2 × 2 = 12 flags; different: 3 × 2 × 1 = 6. 18 flags in all. 36 children could make each flag twice, so <b>37</b>.' } }

  ]
};

})();
