/* ==========================================================================
   Теория к задачам — кнопка «🤔 Мне непонятно — объясни».

   Подсказка говорит, с чего начать именно эту задачу. Теория объясняет
   сам приём: главная идея, шаги, разобранный пример на других числах
   (ответ текущей задачи не выдаётся) и частая ошибка.

   Задача находит свою теорию по полю `topic`. Если тема задачи шире приёма
   (например, в «Уравнивании» есть задачи на суммы пар), в задаче можно
   указать приём явно: `theory: 'pairsums'`.

   build/check.js проверяет, что у каждой задачи теория находится.

   API:
     SASMO_THEORY.keyFor(q)        — ключ приёма или null
     SASMO_THEORY.html(key, lang)  — готовая разметка блока
     SASMO_THEORY.forQuestion(q, lang)
     SASMO_THEORY.label(lang)      — надпись на кнопке
   ========================================================================== */

(function () {
  'use strict';

  var LIB = {};
  var TOPIC = {};

  /* Приём: ключ, темы задач, которые он объясняет, и текст на двух языках.
     Поля текста: t — название, idea — главная идея, steps — как действовать,
     ex — пример { q — условие, s — шаги решения, a — ответ }, trap — частая ошибка. */
  function T(key, topics, ru, en) {
    LIB[key] = { ru: ru, en: en };
    topics.forEach(function (tp) { TOPIC[tp] = key; });
  }

  /* ---------------- числа и действия ---------------- */

  T('place', ['Разряды', 'Сравнение чисел', 'Соседние числа'], {
    t: 'Разряды: что значит место цифры',
    idea: 'Одна и та же цифра значит разное — смотря где стоит. В числе 4 728 семёрка — это не 7, а 7 сотен, то есть 700. Разряды считают справа налево: единицы, десятки, сотни, тысячи.',
    steps: [
      'Подпиши над цифрами буквы разрядов справа налево: Е, Д, С, Т.',
      '«Сколько всего десятков в числе» — закрой пальцем последнюю цифру: в 480 всего 48 десятков.',
      'Сравнивая числа, сначала посмотри, у кого больше цифр. Если поровну — сравнивай слева направо, пока не найдёшь разные цифры.',
      'Самое большое число из данных цифр — цифры по убыванию, самое маленькое — по возрастанию. Но ноль первым стоять не может.'
    ],
    ex: { q: 'Какое число больше: 5 381 или 5 318?',
          s: ['Тысячи: 5 и 5 — поровну.', 'Сотни: 3 и 3 — поровну.', 'Десятки: 8 и 1 — у первого больше. Дальше можно не смотреть.'],
          a: '5 381' },
    trap: 'Путать «цифру десятков» и «сколько всего десятков». В числе 250 цифра десятков — 5, а всего десятков — 25.'
  }, {
    t: 'Place value: what a digit’s position means',
    idea: 'The same digit means different things depending on where it stands. In 4,728 the 7 is not seven — it is 7 hundreds, that is 700. Places are counted from the right: ones, tens, hundreds, thousands.',
    steps: [
      'Write the place letters above the digits from the right: O, T, H, Th.',
      '“How many tens are in the number” — cover the last digit with a finger: 480 has 48 tens in total.',
      'To compare numbers, first see which has more digits. If the same — compare from the left until the digits differ.',
      'Biggest number from given digits — digits in decreasing order; smallest — increasing order. But 0 can’t go first.'
    ],
    ex: { q: 'Which is bigger: 5,381 or 5,318?',
          s: ['Thousands: 5 and 5 — equal.', 'Hundreds: 3 and 3 — equal.', 'Tens: 8 and 1 — the first is bigger. No need to look further.'],
          a: '5,381' },
    trap: 'Mixing up “the tens digit” and “how many tens in all”. In 250 the tens digit is 5, but there are 25 tens in all.'
  });

  T('add', ['Сложение', 'Вычитание'], {
    t: 'Сложение и вычитание по частям',
    idea: 'Большие числа удобно складывать по частям: десятки с десятками, единицы с единицами. Вычитать тоже можно по частям.',
    steps: [
      'Разбей числа на десятки и единицы: 57 = 50 + 7.',
      'Сложи десятки, потом единицы, потом сложи результаты.',
      'Если единицы дали больше 9 — появился лишний десяток, не потеряй его.',
      'Вычитай по частям: 70 − 34 = 70 − 30 − 4.',
      'Проверь вычитание сложением: 36 + 34 = 70.'
    ],
    ex: { q: '57 + 36 = ?',
          s: ['Десятки: 50 + 30 = 80.', 'Единицы: 7 + 6 = 13.', 'Вместе: 80 + 13 = 93.'],
          a: '93' },
    trap: 'Потерять десяток при переходе: 7 + 6 — это 13, а не 3.'
  }, {
    t: 'Adding and subtracting in parts',
    idea: 'Big numbers are easy to add in parts: tens with tens, ones with ones. Subtracting works in parts too.',
    steps: [
      'Split the numbers into tens and ones: 57 = 50 + 7.',
      'Add the tens, then the ones, then add the results.',
      'If the ones make more than 9, you get an extra ten — don’t lose it.',
      'Subtract in parts: 70 − 34 = 70 − 30 − 4.',
      'Check a subtraction by adding: 36 + 34 = 70.'
    ],
    ex: { q: '57 + 36 = ?',
          s: ['Tens: 50 + 30 = 80.', 'Ones: 7 + 6 = 13.', 'Together: 80 + 13 = 93.'],
          a: '93' },
    trap: 'Losing the ten when you carry: 7 + 6 is 13, not 3.'
  });

  T('mul', ['Умножение', 'Таблица умножения', 'Умножение на 2', 'Умножение на 3', 'Умножение на 4',
            'Умножение на 5', 'Умножение на 10', 'Степени', 'Сравнение'], {
    t: 'Умножение',
    idea: 'Умножение — это сложение одинаковых чисел: 4 × 3 = 4 + 4 + 4. Множители можно менять местами: 3 × 7 = 7 × 3.',
    steps: [
      '«По 5 взяли 7 раз» — это 5 × 7.',
      'Не помнишь ответ — считай шагами: 7, 14, 21, …',
      'Помогают соседние примеры: 7 × 9 = 7 × 10 − 7.',
      '× 2 — удвой; × 4 — удвой два раза; × 10 — припиши ноль; × 5 — половина от × 10.',
      'Степень 3⁴ — это 3 × 3 × 3 × 3. Умножай по одному множителю.'
    ],
    ex: { q: '6 × 8 = ?',
          s: ['6 × 4 = 24.', '× 8 — это × 4 и ещё раз × 2: 24 × 2 = 48.'],
          a: '48' },
    trap: 'Путать степень с умножением: 3⁴ = 81, а 3 × 4 = 12.'
  }, {
    t: 'Multiplication',
    idea: 'Multiplication is adding equal numbers: 4 × 3 = 4 + 4 + 4. You can swap the factors: 3 × 7 = 7 × 3.',
    steps: [
      '“5 taken 7 times” is 5 × 7.',
      'Don’t remember the answer — count in steps: 7, 14, 21, …',
      'Use a neighbour fact: 7 × 9 = 7 × 10 − 7.',
      '× 2 — double; × 4 — double twice; × 10 — add a zero; × 5 — half of × 10.',
      'The power 3⁴ means 3 × 3 × 3 × 3. Multiply one factor at a time.'
    ],
    ex: { q: '6 × 8 = ?',
          s: ['6 × 4 = 24.', '× 8 is × 4 and then × 2 again: 24 × 2 = 48.'],
          a: '48' },
    trap: 'Mixing up a power and a product: 3⁴ = 81, but 3 × 4 = 12.'
  });

  T('div', ['Деление', 'Поровну', 'Сколько монет', 'Сколько штук'], {
    t: 'Деление',
    idea: 'Деление отвечает на два вопроса: «разделили поровну — сколько в каждой части?» и «сколько раз одно число помещается в другом?». Деление — обратное умножению.',
    steps: [
      'Ищи ответ в таблице умножения: 36 ÷ 4 — какое число, умноженное на 4, даёт 36?',
      '«Сколько карандашей по 9 рублей купишь на 45 рублей» — сколько раз 9 помещается в 45.',
      'Сначала учти всё, что меняет количество (потеряли, добавили), и только потом дели.',
      '«Поровну на двоих» — пополам, то есть деление на 2.'
    ],
    ex: { q: 'Было 72 шарика, 12 потерялись, остальные разложили поровну в 12 коробок. Сколько в каждой?',
          s: ['Осталось: 72 − 12 = 60.', 'Делим: 60 ÷ 12 = 5.'],
          a: 'по 5 шариков' },
    trap: 'Делить сразу, пока не учтены все изменения.'
  }, {
    t: 'Division',
    idea: 'Division answers two questions: “shared equally — how many in each part?” and “how many times does one number fit into another?”. Division undoes multiplication.',
    steps: [
      'Look for the answer in the times table: 36 ÷ 4 — which number times 4 makes 36?',
      '“How many $9 pencils can you buy with $45” — how many times 9 fits into 45.',
      'First take every change into account (lost, added), only then divide.',
      '“Shared equally by two” — halve it, that is divide by 2.'
    ],
    ex: { q: 'There were 72 marbles, 12 got lost, the rest were shared equally among 12 boxes. How many in each?',
          s: ['Left: 72 − 12 = 60.', 'Divide: 60 ÷ 12 = 5.'],
          a: '5 marbles each' },
    trap: 'Dividing straight away, before all the changes are counted.'
  });

  T('order', ['Порядок действий', 'Пропущенный знак'], {
    t: 'Порядок действий',
    idea: 'Сначала — скобки. Потом умножение и деление. В самом конце — сложение и вычитание, слева направо.',
    steps: [
      'Есть скобки — посчитай их первыми.',
      'Подчеркни все × и ÷ и выполни их.',
      'Остались только + и − — считай слева направо.',
      'Если пропущен знак — попробуй по очереди +, −, ×, ÷ и проверь, какой подходит.'
    ],
    ex: { q: '20 − 3 × 4 + 6 = ?',
          s: ['Сначала умножение: 3 × 4 = 12.', '20 − 12 = 8.', '8 + 6 = 14.'],
          a: '14' },
    trap: 'Считать просто слева направо: (20 − 3) × 4 — это другой пример.'
  }, {
    t: 'Order of operations',
    idea: 'Brackets first. Then multiplication and division. Last of all — addition and subtraction, from left to right.',
    steps: [
      'If there are brackets, work them out first.',
      'Underline every × and ÷ and do them.',
      'Only + and − are left — go from left to right.',
      'If a sign is missing, try +, −, ×, ÷ one by one and check which fits.'
    ],
    ex: { q: '20 − 3 × 4 + 6 = ?',
          s: ['Multiplication first: 3 × 4 = 12.', '20 − 12 = 8.', '8 + 6 = 14.'],
          a: '14' },
    trap: 'Simply going left to right: (20 − 3) × 4 is a different problem.'
  });

  T('steps', ['Два действия', 'Текстовые задачи', 'Деньги', 'Сколько денег', 'Сдача', 'Покупка',
              'Покупка нескольких', 'Сравнение покупок', 'Обмен', 'Уроки и перемены'], {
    t: 'Задачи в несколько действий',
    idea: 'Сложная задача — это цепочка простых. Найди, что можно узнать прямо сейчас, и иди шаг за шагом к вопросу.',
    steps: [
      'Прочитай вопрос: что именно нужно найти?',
      'Выпиши, что известно.',
      'Спроси себя: что можно узнать сразу из двух известных чисел?',
      'Записывай каждый шаг с пояснением: «тетради стоят…», «всего потратила…».',
      'В конце проверь: последнее число отвечает на вопрос задачи?'
    ],
    ex: { q: 'У Тани 100 рублей. Она купила 3 тетради по 18 рублей и ручку за 25. Сколько осталось?',
          s: ['Тетради: 3 × 18 = 54.', 'Вся покупка: 54 + 25 = 79.', 'Осталось: 100 − 79 = 21.'],
          a: '21 рубль' },
    trap: 'Ответить промежуточным числом: 79 — это стоимость покупки, а спрашивали, сколько осталось.'
  }, {
    t: 'Problems with several steps',
    idea: 'A hard problem is a chain of easy ones. Find what you can work out right now, and walk step by step towards the question.',
    steps: [
      'Read the question: what exactly do we need to find?',
      'Write down what is known.',
      'Ask yourself: what can I find straight away from two known numbers?',
      'Write each step with a label: “the notebooks cost…”, “she spent in all…”.',
      'At the end check: does the last number answer the question?'
    ],
    ex: { q: 'Tanya has $100. She buys 3 notebooks at $18 each and a pen for $25. How much is left?',
          s: ['Notebooks: 3 × 18 = 54.', 'Whole purchase: 54 + 25 = 79.', 'Left: 100 − 79 = 21.'],
          a: '$21' },
    trap: 'Answering with an in-between number: 79 is the cost, but the question asks what is left.'
  });

  T('missing', ['Пропущенное число', 'Пропущенная цифра', 'Числовые ребусы', 'Буквы вместо цифр', 'Обратная задача'], {
    t: 'Неизвестное число: отменяем действия',
    idea: 'Каждое действие можно отменить обратным: сложение — вычитанием, умножение — делением. Так и находят неизвестное.',
    steps: [
      'Замени квадратик или букву словами «какое-то число».',
      'Посмотри, что с этим числом сделали.',
      'Отменяй действия с конца: сначала последнее, потом предыдущее.',
      'Если пропущена цифра — сначала найди всё число, потом посмотри на нужную цифру.',
      'Подставь ответ и проверь.'
    ],
    ex: { q: '7 × □ − 14 = 35. Какое число в квадратике?',
          s: ['Последним вычли 14 — вернём их: 35 + 14 = 49.', 'Значит 7 × □ = 49.', 'Отменяем умножение: 49 ÷ 7 = 7.', 'Проверка: 7 × 7 − 14 = 35 ✓'],
          a: '7' },
    trap: 'Отменять действия с начала, а не с конца.'
  }, {
    t: 'Unknown number: undo the operations',
    idea: 'Every operation can be undone by its opposite: addition by subtraction, multiplication by division. That is how you find the unknown.',
    steps: [
      'Replace the box or letter with the words “some number”.',
      'Look at what was done to that number.',
      'Undo from the end: the last operation first, then the one before.',
      'If a digit is missing, find the whole number first, then read the digit.',
      'Put your answer back in and check.'
    ],
    ex: { q: '7 × □ − 14 = 35. What number is in the box?',
          s: ['14 was subtracted last — add it back: 35 + 14 = 49.', 'So 7 × □ = 49.', 'Undo the multiplication: 49 ÷ 7 = 7.', 'Check: 7 × 7 − 14 = 35 ✓'],
          a: '7' },
    trap: 'Undoing from the start instead of from the end.'
  });

  T('fast', ['Быстрый счёт', 'Удобные пары', 'Лесенки'], {
    t: 'Быстрый счёт: ищем удобное',
    idea: 'Не считай подряд. Сначала посмотри, нет ли пар, которые дают круглые числа, или одинаковых сумм.',
    steps: [
      'Ищи пары до круглого: 27 + 13 = 40, 25 × 4 = 100, 5 × 2 = 10.',
      'Переставляй слагаемые и множители — ответ от этого не меняется.',
      'Сумма чисел подряд (1 + 2 + … + 20): складывай парами с краёв — каждая пара одинаковая. Умножь пару на число пар.',
      'Одинаковый множитель выносят за скобку: 13 × 7 + 7 × 7 = (13 + 7) × 7 = 140.'
    ],
    ex: { q: '1 + 2 + 3 + … + 20 = ?',
          s: ['Пары с краёв: 1 + 20 = 21, 2 + 19 = 21, …', 'Чисел 20, значит пар 10.', '21 × 10 = 210.'],
          a: '210' },
    trap: 'Неправильно посчитать пары: если чисел 20, то пар 10, а не 20.'
  }, {
    t: 'Quick counting: look for the easy way',
    idea: 'Don’t just add in order. First look for pairs that make round numbers, or for equal sums.',
    steps: [
      'Look for pairs that make round numbers: 27 + 13 = 40, 25 × 4 = 100, 5 × 2 = 10.',
      'Reorder terms and factors — the answer does not change.',
      'A sum of numbers in a row (1 + 2 + … + 20): add in pairs from both ends — every pair is the same. Multiply a pair by the number of pairs.',
      'A common factor comes out of brackets: 13 × 7 + 7 × 7 = (13 + 7) × 7 = 140.'
    ],
    ex: { q: '1 + 2 + 3 + … + 20 = ?',
          s: ['Pairs from the ends: 1 + 20 = 21, 2 + 19 = 21, …', '20 numbers make 10 pairs.', '21 × 10 = 210.'],
          a: '210' },
    trap: 'Miscounting the pairs: 20 numbers give 10 pairs, not 20.'
  });

  /* ---------------- ряды и узоры ---------------- */

  T('seq', ['Закономерности', 'Patterns', 'Убывающие ряды', 'Растущие разности', 'Хитрые ряды',
            'Умножение в ряду', 'Далёкий член ряда'], {
    t: 'Числовые закономерности',
    idea: 'У ряда есть правило, по которому из одного числа получается следующее. Найти правило — и ряд продолжается сам.',
    steps: [
      'Выпиши под рядом разности соседних чисел.',
      'Разности одинаковые — каждый раз прибавляется одно и то же.',
      'Разности растут (1, 2, 3, …) — продолжи ряд разностей.',
      'Разности не помогают — проверь, во сколько раз меняются числа.',
      'Проверь хитрые правила: следующее = сумма двух предыдущих; два ряда чередуются через одно число.',
      'Далёкий член: от 1-го числа до 10-го — 9 шагов. Значит 10-е = первое + шаг × 9.'
    ],
    ex: { q: 'Продолжи ряд: 2, 5, 9, 14, ?',
          s: ['Разности: 3, 4, 5 — растут на 1.', 'Следующая разность — 6.', '14 + 6 = 20.'],
          a: '20' },
    trap: 'Для далёкого члена брать шагов столько же, сколько номер. Шагов на один меньше.'
  }, {
    t: 'Number patterns',
    idea: 'A sequence has a rule that turns each number into the next one. Find the rule and the sequence continues by itself.',
    steps: [
      'Write the differences between neighbours under the sequence.',
      'Equal differences — the same number is added each time.',
      'Growing differences (1, 2, 3, …) — continue the row of differences.',
      'Differences don’t help — check how many times the numbers grow.',
      'Check tricky rules: next = sum of the two before; two sequences alternating.',
      'A far term: from the 1st number to the 10th there are 9 steps. So the 10th = first + step × 9.'
    ],
    ex: { q: 'Continue: 2, 5, 9, 14, ?',
          s: ['Differences: 3, 4, 5 — they grow by 1.', 'The next difference is 6.', '14 + 6 = 20.'],
          a: '20' },
    trap: 'For a far term, taking as many steps as the position number. There is one step fewer.'
  });

  T('cycle', ['Повторяющийся узор', 'Календарь', 'Дни недели'], {
    t: 'Повторяющийся узор и дни недели',
    idea: 'Если что-то повторяется по кругу, целые круги можно отбросить — важен только остаток.',
    steps: [
      'Найди длину повтора: узор из трёх бусин — 3, неделя — 7 дней.',
      'Раздели номер (или число дней) на длину повтора.',
      'Остаток показывает место внутри повтора. Остаток 0 — это последний элемент повтора.',
      'Для дней недели: отбрось целые недели и досчитай оставшиеся дни.'
    ],
    ex: { q: 'Сегодня среда. Какой день недели будет через 30 дней?',
          s: ['30 = 4 недели (28 дней) + 2 дня.', 'Через 4 недели снова среда.', 'Ещё 2 дня: четверг, пятница.'],
          a: 'пятница' },
    trap: 'Думать, что остаток 0 — это первый элемент узора. Это последний.'
  }, {
    t: 'Repeating patterns and days of the week',
    idea: 'If something repeats in a cycle, whole cycles can be thrown away — only the remainder matters.',
    steps: [
      'Find the length of the repeat: a pattern of three beads — 3, a week — 7 days.',
      'Divide the position (or number of days) by the length of the repeat.',
      'The remainder is the place inside the repeat. Remainder 0 means the last element of the repeat.',
      'For days of the week: drop whole weeks and count the leftover days.'
    ],
    ex: { q: 'Today is Wednesday. What day will it be in 30 days?',
          s: ['30 = 4 weeks (28 days) + 2 days.', 'After 4 weeks it is Wednesday again.', '2 more days: Thursday, Friday.'],
          a: 'Friday' },
    trap: 'Thinking remainder 0 is the first element of the pattern. It is the last one.'
  });

  T('figseq', ['Фигурные последовательности', 'Фигурные ряды', 'Треугольные числа', 'Точечные фигуры'], {
    t: 'Растущие фигуры',
    idea: 'Посчитай первые фигуры и найди, на сколько растёт каждая следующая — или какое особое число получается: квадрат (1, 4, 9, …) или треугольное число (1, 3, 6, …).',
    steps: [
      'Посчитай элементы в фигурах 1, 2, 3 и запиши табличкой.',
      'Прирост одинаковый — фигура N = первая + прирост × (N − 1).',
      '1, 4, 9, 16 — это квадраты: в фигуре N будет N × N.',
      '1, 3, 6, 10 — треугольные числа: 1 + 2 + … + N.',
      'Проверь своё правило на третьей фигуре.'
    ],
    ex: { q: 'Из спичек выкладывают квадраты в ряд: 1 квадрат — 4 спички, каждый следующий добавляет 3. Сколько спичек на 5 квадратов?',
          s: ['Первый квадрат — 4 спички.', 'Ещё 4 квадрата по 3 спички: 4 × 3 = 12.', '4 + 12 = 16.'],
          a: '16 спичек' },
    trap: 'Умножать прирост на номер фигуры. Первая фигура уже посчитана — добавок на одну меньше.'
  }, {
    t: 'Growing figures',
    idea: 'Count the first figures and see how much each next one grows — or which special numbers appear: squares (1, 4, 9, …) or triangular numbers (1, 3, 6, …).',
    steps: [
      'Count the pieces in figures 1, 2, 3 and write a small table.',
      'Same growth each time — figure N = first + growth × (N − 1).',
      '1, 4, 9, 16 are squares: figure N has N × N.',
      '1, 3, 6, 10 are triangular numbers: 1 + 2 + … + N.',
      'Check your rule on the third figure.'
    ],
    ex: { q: 'Matchstick squares in a row: 1 square takes 4 matches, each next square adds 3. How many matches for 5 squares?',
          s: ['The first square: 4 matches.', '4 more squares at 3 matches: 4 × 3 = 12.', '4 + 12 = 16.'],
          a: '16 matches' },
    trap: 'Multiplying the growth by the figure number. The first figure is already counted — there is one addition fewer.'
  });

  /* ---------------- геометрия ---------------- */

  T('countfig', ['Счёт фигур'], {
    t: 'Считаем фигуры на рисунке',
    idea: 'Глаз легко сбивается. Поэтому считают по порядку: сначала самые маленькие фигуры, потом составленные из двух, из трёх, … и в конце самую большую.',
    steps: [
      'Пронумеруй маленькие части рисунка.',
      'Посчитай фигуры из одной части.',
      'Потом из двух частей, из трёх и так далее. Записывай номерами: 1+2, 2+3, …',
      'Сложи все группы.',
      'Квадраты в сетке 3 × 3: маленьких 9, размером 2 × 2 — 4, большой — 1.'
    ],
    ex: { q: 'Сколько всего квадратов в сетке 3 на 3 клетки?',
          s: ['1 × 1: 9 штук.', '2 × 2: 4 штуки.', '3 × 3: 1 штука.', '9 + 4 + 1 = 14.'],
          a: '14' },
    trap: 'Забыть большие фигуры, которые составлены из нескольких маленьких.'
  }, {
    t: 'Counting shapes in a picture',
    idea: 'The eye gets lost easily. So count in order: first the smallest shapes, then those made of two pieces, of three, … and finally the biggest one.',
    steps: [
      'Number the small pieces of the picture.',
      'Count the shapes made of one piece.',
      'Then of two pieces, three pieces and so on. Write them with numbers: 1+2, 2+3, …',
      'Add all the groups.',
      'Squares in a 3 × 3 grid: 9 small, 4 of size 2 × 2, 1 big.'
    ],
    ex: { q: 'How many squares are in a 3 by 3 grid?',
          s: ['1 × 1: 9.', '2 × 2: 4.', '3 × 3: 1.', '9 + 4 + 1 = 14.'],
          a: '14' },
    trap: 'Forgetting the big shapes made of several small ones.'
  });

  T('line', ['Отрезки'], {
    t: 'Точки на прямой',
    idea: 'Нарисуй прямую и отметь точки по порядку. Все расстояния удобно считать от одной точки — от самой первой.',
    steps: [
      'Нарисуй линию и отметь точки в нужном порядке.',
      'Подпиши известные расстояния дугами.',
      'Переведи всё в «сколько от первой точки».',
      'Нужное расстояние — разность двух таких чисел.',
      'Сколько отрезков между точками: от первой точки к остальным, от второй — к следующим и т. д. Для 4 точек: 3 + 2 + 1 = 6.'
    ],
    ex: { q: 'Дома A, B, C, D стоят по порядку. AD = 12 км, AC = 6 км, DB = 8 км. Сколько от B до C?',
          s: ['От A: D на 12, C на 6.', 'B на 12 − 8 = 4 от A.', 'BC = 6 − 4 = 2.'],
          a: '2 км' },
    trap: 'Складывать расстояния, которые накладываются друг на друга.'
  }, {
    t: 'Points on a line',
    idea: 'Draw a line and mark the points in order. It is easiest to measure every distance from one point — the very first.',
    steps: [
      'Draw a line and mark the points in the right order.',
      'Label the known distances with arcs.',
      'Turn everything into “how far from the first point”.',
      'The distance you need is the difference of two such numbers.',
      'How many segments between points: from the first point to all others, from the second to the ones after it, and so on. For 4 points: 3 + 2 + 1 = 6.'
    ],
    ex: { q: 'Houses A, B, C, D stand in order. AD = 12 km, AC = 6 km, DB = 8 km. How far is B from C?',
          s: ['From A: D is 12, C is 6.', 'B is 12 − 8 = 4 from A.', 'BC = 6 − 4 = 2.'],
          a: '2 km' },
    trap: 'Adding distances that overlap.'
  });

  T('area', ['Площадь', 'Площадь и периметр'], {
    t: 'Площадь',
    idea: 'Площадь — это сколько единичных квадратиков помещается внутри фигуры. У прямоугольника площадь = длина × ширина.',
    steps: [
      'Прямоугольник: длина × ширина. Квадрат: сторона × сторона.',
      'Сложную фигуру разрежь на прямоугольники — или дострой до большого прямоугольника и вычти лишнее.',
      'Треугольник на клетчатой сетке — это половина прямоугольника. Или: прямоугольник вокруг минус уголки.',
      'Если известны площадь и одна сторона — вторая сторона = площадь ÷ сторона.'
    ],
    ex: { q: 'Площадь прямоугольника 36 см², одна сторона 4 см. Чему равен периметр?',
          s: ['Вторая сторона: 36 ÷ 4 = 9 см.', 'Периметр: 2 × (4 + 9) = 26 см.'],
          a: '26 см' },
    trap: 'Путать площадь (квадратные сантиметры, «внутри») и периметр (сантиметры, «вокруг»).'
  }, {
    t: 'Area',
    idea: 'Area is how many unit squares fit inside a shape. For a rectangle, area = length × width.',
    steps: [
      'Rectangle: length × width. Square: side × side.',
      'Cut a complex shape into rectangles — or complete it to a big rectangle and subtract the extra.',
      'A triangle on a grid is half a rectangle. Or: the surrounding rectangle minus the corners.',
      'If you know the area and one side — the other side = area ÷ side.'
    ],
    ex: { q: 'A rectangle has area 36 cm² and one side 4 cm. What is its perimeter?',
          s: ['Other side: 36 ÷ 4 = 9 cm.', 'Perimeter: 2 × (4 + 9) = 26 cm.'],
          a: '26 cm' },
    trap: 'Mixing up area (square centimetres, “inside”) and perimeter (centimetres, “around”).'
  });

  T('perim', ['Периметр', 'Ступенчатые фигуры'], {
    t: 'Периметр',
    idea: 'Периметр — это длина забора вокруг фигуры, то есть сумма длин всех сторон.',
    steps: [
      'Обойди фигуру пальцем и сложи все стороны.',
      'Прямоугольник: 2 × (длина + ширина). Квадрат: 4 × сторона.',
      'Ступенчатая фигура: мысленно сдвинь все ступеньки наружу — получится прямоугольник с тем же периметром.',
      'Неизвестную сторону обозначь буквой и вырази через неё остальные — часто буква потом сокращается.'
    ],
    ex: { q: 'Ступенчатая фигура с прямыми углами точно вписывается в прямоугольник 12 см × 8 см. Каков её периметр?',
          s: ['Сдвигаем ступеньки наружу — получаем прямоугольник 12 × 8.', '2 × (12 + 8) = 40.'],
          a: '40 см' },
    trap: 'Пропустить короткую сторону, когда обходишь фигуру.'
  }, {
    t: 'Perimeter',
    idea: 'The perimeter is the length of a fence around a shape — the sum of all its sides.',
    steps: [
      'Trace around the shape with a finger and add up all the sides.',
      'Rectangle: 2 × (length + width). Square: 4 × side.',
      'A staircase shape: push all the steps outwards in your mind — you get a rectangle with the same perimeter.',
      'Call an unknown side a letter and write the other sides with it — the letter often cancels out later.'
    ],
    ex: { q: 'A staircase shape with right angles fits exactly into a 12 cm × 8 cm rectangle. What is its perimeter?',
          s: ['Push the steps outwards — you get a 12 × 8 rectangle.', '2 × (12 + 8) = 40.'],
          a: '40 cm' },
    trap: 'Missing a short side when you go around the shape.'
  });

  T('cubes', ['Кубики', 'Куб', 'Объём', 'Пространственное мышление'], {
    t: 'Кубики и объём',
    idea: 'Кубики считают слоями: сколько кубиков в одном слое × сколько слоёв.',
    steps: [
      'Коробка: длина × ширина × высота.',
      'Башня из разных слоёв — посчитай каждый слой отдельно и сложи.',
      'Не забывай кубики, которых не видно: снизу, сзади, внутри.',
      'У куба 6 граней, 12 рёбер и 8 вершин.',
      'Покрашенный снаружи куб 3 × 3 × 3: у 8 угловых кубиков окрашено 3 грани, у 12 на рёбрах — 2, у 6 в центрах граней — 1, внутри 1 не окрашен.'
    ],
    ex: { q: 'Кубики уложили в коробку: 3 в длину, 2 в ширину, 2 в высоту. Сколько кубиков?',
          s: ['Один слой: 3 × 2 = 6.', 'Слоёв 2: 6 × 2 = 12.'],
          a: '12' },
    trap: 'Считать только видимые кубики.'
  }, {
    t: 'Cubes and volume',
    idea: 'Count cubes in layers: cubes in one layer × number of layers.',
    steps: [
      'A box: length × width × height.',
      'A tower of different layers — count each layer separately and add.',
      'Don’t forget the hidden cubes: underneath, behind, inside.',
      'A cube has 6 faces, 12 edges and 8 corners.',
      'A 3 × 3 × 3 cube painted outside: 8 corner cubes have 3 painted faces, 12 edge cubes have 2, 6 face-centre cubes have 1, and 1 inside is unpainted.'
    ],
    ex: { q: 'Cubes are packed in a box: 3 long, 2 wide, 2 high. How many cubes?',
          s: ['One layer: 3 × 2 = 6.', '2 layers: 6 × 2 = 12.'],
          a: '12' },
    trap: 'Counting only the cubes you can see.'
  });

  T('shapes', ['Фигуры', 'Стороны и углы'], {
    t: 'Многоугольники: стороны и углы',
    idea: 'У многоугольника сторон столько же, сколько углов. Название подсказывает число: треугольник — 3, четырёхугольник — 4, пятиугольник — 5, шестиугольник — 6.',
    steps: [
      'Прочитай название фигуры: число спрятано в начале слова.',
      'Не уверен — обведи фигуру и посчитай углы.',
      'Сторон столько же, сколько углов.',
      'У круга нет ни сторон, ни углов.'
    ],
    ex: { q: 'Сколько сторон у пятиугольника и шестиугольника вместе?',
          s: ['Пятиугольник — 5 сторон.', 'Шестиугольник — 6 сторон.', '5 + 6 = 11.'],
          a: '11' },
    trap: 'Считать круг многоугольником.'
  }, {
    t: 'Polygons: sides and corners',
    idea: 'A polygon has as many sides as corners. The name tells you the number: triangle — 3, quadrilateral — 4, pentagon — 5, hexagon — 6.',
    steps: [
      'Read the name of the shape: the number is hidden at the start of the word.',
      'Not sure — trace the shape and count the corners.',
      'There are as many sides as corners.',
      'A circle has no sides and no corners.'
    ],
    ex: { q: 'How many sides do a pentagon and a hexagon have together?',
          s: ['Pentagon — 5 sides.', 'Hexagon — 6 sides.', '5 + 6 = 11.'],
          a: '11' },
    trap: 'Treating a circle as a polygon.'
  });

  T('symmetry', ['Симметрия'], {
    t: 'Симметрия',
    idea: 'Ось симметрии — это линия, по которой фигуру можно сложить пополам так, чтобы половинки точно совпали.',
    steps: [
      'Мысленно сложи фигуру по вертикали, потом по горизонтали, потом по диагоналям.',
      'Половинки совпали — это ось.',
      'Запомни: у квадрата 4 оси, у прямоугольника 2, у равностороннего треугольника 3, у круга — бесконечно много.',
      'В зеркале левое становится правым, а верх остаётся верхом.'
    ],
    ex: { q: 'Сколько осей симметрии у буквы Н?',
          s: ['Сложим по вертикали — палочки совпадут.', 'Сложим по горизонтали — перекладина посередине, тоже совпадёт.', 'По диагонали — не совпадёт.'],
          a: '2 оси' },
    trap: 'Думать, что прямоугольник складывается по диагонали. Не складывается: уголки не совпадут.'
  }, {
    t: 'Symmetry',
    idea: 'A line of symmetry is a line along which you can fold a shape in half so the halves match exactly.',
    steps: [
      'In your mind fold the shape vertically, then horizontally, then along the diagonals.',
      'The halves match — that is a line of symmetry.',
      'Remember: a square has 4 lines, a rectangle 2, an equilateral triangle 3, a circle — infinitely many.',
      'In a mirror left becomes right, but top stays top.'
    ],
    ex: { q: 'How many lines of symmetry does the letter H have?',
          s: ['Fold vertically — the two sticks match.', 'Fold horizontally — the crossbar is in the middle, so it matches too.', 'Diagonally — no match.'],
          a: '2 lines' },
    trap: 'Thinking a rectangle folds along its diagonal. It doesn’t: the corners won’t match.'
  });

  T('look', ['Внимание к деталям', 'Виды фигур'], {
    t: 'Внимание к деталям',
    idea: 'Не пытайся сравнить картинку целиком — сравнивай по одной детали, как детектив.',
    steps: [
      'Выбери одну деталь: ухо, хвост, окно, полоску.',
      'Проверь эту деталь во всех вариантах и вычеркни те, где она другая.',
      'Возьми следующую деталь и проверь оставшиеся варианты.',
      'Вид сверху: видно только верх предметов. Толщину и то, что под ними, сверху не видно.'
    ],
    ex: { q: 'Какой из четырёх домиков такой же, как образец?',
          s: ['Сначала окна: у образца два окна — вариант с одним окном вычёркиваем.', 'Потом дверь: у образца она справа — вычёркиваем вариант с дверью слева.', 'Потом труба: остался один вариант с трубой слева, как у образца.'],
          a: 'тот, что прошёл все проверки' },
    trap: 'Выбрать то, что «похоже в целом», не проверив мелкие детали.'
  }, {
    t: 'Attention to detail',
    idea: 'Don’t try to compare the whole picture at once — compare one detail at a time, like a detective.',
    steps: [
      'Pick one detail: an ear, a tail, a window, a stripe.',
      'Check that detail in every option and cross out those where it differs.',
      'Take the next detail and check the remaining options.',
      'A top view shows only the tops of things. Thickness and what is underneath can’t be seen from above.'
    ],
    ex: { q: 'Which of four houses is the same as the sample?',
          s: ['Windows first: the sample has two — cross out the option with one window.', 'Then the door: the sample’s is on the right — cross out the one with the door on the left.', 'Then the chimney: one option is left with the chimney on the left, like the sample.'],
          a: 'the one that passed every check' },
    trap: 'Picking what “looks similar overall” without checking small details.'
  });

  /* ---------------- промежутки и места ---------------- */

  T('intervals', ['Интервалы', 'Распилы', 'Столбы', 'Этажи', 'Бой часов', 'Удары часов', 'По кругу', 'Интервалы по кругу'], {
    t: 'Столбы и промежутки',
    idea: 'Считай не предметы, а промежутки между ними. На прямой предметов на один больше, чем промежутков. По кругу — поровну.',
    steps: [
      'Число промежутков = длина ÷ шаг.',
      'Столбы вдоль дороги от начала до конца: промежутки + 1.',
      'Разрезы и распилы: на один меньше, чем кусков.',
      'Этажи: с 1-го на 4-й — это 3 пролёта лестницы.',
      'Бой часов: время уходит на промежутки между ударами, а не на сами удары.',
      'По кругу нет начала и конца: промежутков столько же, сколько предметов.'
    ],
    ex: { q: 'Часы бьют 4 раза за 6 секунд. За сколько секунд они пробьют 7 раз?',
          s: ['4 удара — 3 промежутка.', 'Один промежуток: 6 ÷ 3 = 2 секунды.', '7 ударов — 6 промежутков: 6 × 2 = 12.'],
          a: '12 секунд' },
    trap: 'Делить время на число ударов (или столбов), а не промежутков.'
  }, {
    t: 'Posts and gaps',
    idea: 'Count the gaps, not the objects. On a straight line there is one more object than gaps. Around a circle — the same number.',
    steps: [
      'Number of gaps = length ÷ step.',
      'Posts along a road from start to end: gaps + 1.',
      'Cuts: one fewer than pieces.',
      'Floors: from the 1st to the 4th floor is 3 flights of stairs.',
      'A clock striking: time is spent on the gaps between strikes, not on the strikes.',
      'A circle has no start or end: there are as many gaps as objects.'
    ],
    ex: { q: 'A clock strikes 4 times in 6 seconds. How long does it take to strike 7 times?',
          s: ['4 strikes — 3 gaps.', 'One gap: 6 ÷ 3 = 2 seconds.', '7 strikes — 6 gaps: 6 × 2 = 12.'],
          a: '12 seconds' },
    trap: 'Dividing the time by the number of strikes (or posts) instead of gaps.'
  });

  T('queue', ['Очередь', 'Логика с числами'], {
    t: 'Места в ряду',
    idea: 'Нарисуй ряд кружочками — и место каждого станет видно.',
    steps: [
      'Нарисуй всех по порядку кружочками.',
      '«Третий слева» — отсчитай три кружка слева.',
      'Место справа = всего − место слева + 1.',
      '«Между ними 4 человека» — сами эти двое сюда не входят.',
      'Если нужно найти число по условиям — выпиши все подходящие числа и проверь каждое.'
    ],
    ex: { q: 'В ряду 5 детей. Ваня третий слева. Какой он по счёту справа?',
          s: ['Рисуем: ○ ○ ● ○ ○.', 'Справа от Вани 2 человека, значит он третий.', 'Или по формуле: 5 − 3 + 1 = 3.'],
          a: 'третий' },
    trap: 'Считать крайних людей вместе с теми, кто стоит «между».'
  }, {
    t: 'Places in a row',
    idea: 'Draw the row as circles — and everyone’s place becomes visible.',
    steps: [
      'Draw everyone in order as circles.',
      '“Third from the left” — count three circles from the left.',
      'Place from the right = total − place from the left + 1.',
      '“4 people between them” — the two people themselves are not counted.',
      'If you need a number that fits some rules — list all candidates and check each.'
    ],
    ex: { q: '5 children stand in a row. Vanya is third from the left. What is his place from the right?',
          s: ['Draw: ○ ○ ● ○ ○.', '2 people are to his right, so he is third.', 'Or: 5 − 3 + 1 = 3.'],
          a: 'third' },
    trap: 'Counting the two end people together with those “between” them.'
  });

  /* ---------------- текстовые задачи ---------------- */

  T('backwards', ['Обратный ход', 'Доли и обратный ход'], {
    t: 'Обратный ход',
    idea: 'Если известно, чем всё закончилось, а спрашивают, что было в начале, — иди с конца и делай всё наоборот.',
    steps: [
      'Выпиши действия по порядку, как в задаче.',
      'Начни с последнего числа.',
      'Отменяй действия с конца: + меняй на −, × на ÷, и наоборот.',
      '«Потратил треть» — значит осталось две трети. Найди одну треть через остаток.',
      'Проверь: пройди задачу вперёд со своим ответом.'
    ],
    ex: { q: 'Задумали число, прибавили 7, результат умножили на 3 и получили 30. Какое число задумали?',
          s: ['Последним было × 3 — отменяем: 30 ÷ 3 = 10.', 'Перед этим + 7 — отменяем: 10 − 7 = 3.', 'Проверка: (3 + 7) × 3 = 30 ✓'],
          a: '3' },
    trap: 'Отменять действия с начала, а не с конца.'
  }, {
    t: 'Working backwards',
    idea: 'If you know how it ended and are asked how it started — go from the end and do everything in reverse.',
    steps: [
      'Write the steps in order, as in the problem.',
      'Start from the last number.',
      'Undo from the end: + becomes −, × becomes ÷, and the other way round.',
      '“Spent a third” means two thirds are left. Find one third from what is left.',
      'Check: go forwards through the problem with your answer.'
    ],
    ex: { q: 'A number was increased by 7, then multiplied by 3, giving 30. What was the number?',
          s: ['The last step was × 3 — undo it: 30 ÷ 3 = 10.', 'Before that + 7 — undo it: 10 − 7 = 3.', 'Check: (3 + 7) × 3 = 30 ✓'],
          a: '3' },
    trap: 'Undoing from the start instead of from the end.'
  });

  T('bardiff', ['Модельный метод', 'Часть и целое', 'Разностное сравнение', 'На сколько больше'], {
    t: 'Модельный метод: полоски',
    idea: 'Нарисуй каждое количество полоской. Одинаковые полоски — одинаковые части, а разница видна как «хвостик».',
    steps: [
      'Нарисуй полоску того, у кого меньше.',
      'Под ней — полоску того, у кого больше: такая же плюс хвостик (разница).',
      'Сумму покажи скобкой справа от обеих полосок.',
      'Убери хвостик из суммы — останутся две одинаковые полоски.',
      'Раздели пополам — это меньшее. Прибавь разницу — это большее.',
      '«На сколько больше» — вычитание; «на 5 больше» — прибавь 5.'
    ],
    ex: { q: 'У Маши на 8 конфет больше, чем у Пети. Вместе у них 24. Сколько у Пети?',
          s: ['Убираем хвостик: 24 − 8 = 16.', 'Две одинаковые полоски: 16 ÷ 2 = 8 — это Петя.', 'Маша: 8 + 8 = 16. Проверка: 8 + 16 = 24 ✓'],
          a: '8 конфет' },
    trap: 'Делить сумму пополам, забыв сначала убрать разницу.'
  }, {
    t: 'Bar models',
    idea: 'Draw each amount as a bar. Equal bars mean equal parts, and the difference shows up as a “tail”.',
    steps: [
      'Draw a bar for the smaller amount.',
      'Under it, a bar for the bigger amount: the same length plus a tail (the difference).',
      'Show the total with a bracket to the right of both bars.',
      'Take the tail away from the total — two equal bars remain.',
      'Halve it — that is the smaller amount. Add the difference — that is the bigger one.',
      '“How many more” — subtract; “5 more” — add 5.'
    ],
    ex: { q: 'Masha has 8 more sweets than Petya. Together they have 24. How many does Petya have?',
          s: ['Remove the tail: 24 − 8 = 16.', 'Two equal bars: 16 ÷ 2 = 8 — Petya.', 'Masha: 8 + 8 = 16. Check: 8 + 16 = 24 ✓'],
          a: '8 sweets' },
    trap: 'Halving the total without removing the difference first.'
  });

  T('bartimes', ['Кратное сравнение', 'Во сколько раз больше'], {
    t: 'Во сколько раз: доли',
    idea: '«В 3 раза больше» — нарисуй меньшее одной долей-полоской, а большее — тремя такими же долями.',
    steps: [
      'Меньшее — 1 доля.',
      'Большее — столько долей, во сколько раз оно больше.',
      'Посчитай все доли вместе.',
      'Сумма ÷ число долей = одна доля.',
      '«Во сколько раз одно больше другого» — раздели большее на меньшее.'
    ],
    ex: { q: 'У Оли в 3 раза больше наклеек, чем у Кати. Вместе 24. Сколько у Кати?',
          s: ['Катя — 1 доля, Оля — 3 доли. Всего 4 доли.', 'Одна доля: 24 ÷ 4 = 6 — это Катя.', 'Оля: 6 × 3 = 18. Проверка: 6 + 18 = 24 ✓'],
          a: '6 наклеек' },
    trap: 'Делить сумму на 3, а не на 4 — забыть долю того, у кого меньше.'
  }, {
    t: 'Times as many: equal parts',
    idea: '“3 times as many” — draw the smaller amount as one part and the bigger one as three such parts.',
    steps: [
      'The smaller amount is 1 part.',
      'The bigger amount is as many parts as “times”.',
      'Count all the parts together.',
      'Total ÷ number of parts = one part.',
      '“How many times bigger” — divide the bigger by the smaller.'
    ],
    ex: { q: 'Olya has 3 times as many stickers as Katya. Together they have 24. How many does Katya have?',
          s: ['Katya — 1 part, Olya — 3 parts. 4 parts in all.', 'One part: 24 ÷ 4 = 6 — Katya.', 'Olya: 6 × 3 = 18. Check: 6 + 18 = 24 ✓'],
          a: '6 stickers' },
    trap: 'Dividing the total by 3 instead of 4 — forgetting the smaller person’s part.'
  });

  T('equalize', ['Уравнивание', 'Передача'], {
    t: 'Уравнивание и передача',
    idea: 'Когда один отдаёт другому, у одного становится меньше, а у другого — больше. Поэтому разница между ними меняется на удвоенное отданное число. А общая сумма не меняется.',
    steps: [
      'Чтобы стало поровну, надо отдать половину разницы.',
      'Если после передачи стало поровну — у каждого сумма ÷ 2.',
      'Верни переданное: у отдавшего было на это число больше, у получившего — меньше.',
      'Проверь: сумма до и после одинаковая.'
    ],
    ex: { q: 'У Саши и Димы вместе 46 наклеек. Если Саша отдаст Диме 5, станет поровну. Сколько у Саши?',
          s: ['После передачи у каждого: 46 ÷ 2 = 23.', 'Саша отдал 5 — было 23 + 5 = 28.', 'Дима: 23 − 5 = 18. Проверка: 28 + 18 = 46 ✓'],
          a: '28 наклеек' },
    trap: 'Думать, что разница изменилась на 5. Она меняется на 10: у одного −5, у другого +5.'
  }, {
    t: 'Evening out and giving away',
    idea: 'When one person gives to another, one has less and the other has more. So the difference changes by twice the amount given. The total stays the same.',
    steps: [
      'To make it equal, give away half of the difference.',
      'If it is equal after the gift — each has total ÷ 2.',
      'Undo the gift: the giver had that much more, the receiver that much less.',
      'Check: the total before and after is the same.'
    ],
    ex: { q: 'Sasha and Dima have 46 stickers together. If Sasha gives Dima 5, they will have the same. How many does Sasha have?',
          s: ['After the gift each has 46 ÷ 2 = 23.', 'Sasha gave 5 away — he had 23 + 5 = 28.', 'Dima: 23 − 5 = 18. Check: 28 + 18 = 46 ✓'],
          a: '28 stickers' },
    trap: 'Thinking the difference changed by 5. It changes by 10: one has −5, the other +5.'
  });

  T('pairsums', [], {
    t: 'Суммы пар',
    idea: 'Если известны суммы пар A + B, B + C и A + C, сложи их все сразу: каждое число войдёт в итог ровно два раза.',
    steps: [
      'Сложи все три суммы.',
      'Раздели пополам — получишь A + B + C.',
      'Вычти сумму любой пары — останется третье число.'
    ],
    ex: { q: 'A + B = 15, B + C = 23, A + C = 18. Чему равно C?',
          s: ['Все суммы: 15 + 23 + 18 = 56.', 'A + B + C = 56 ÷ 2 = 28.', 'C = 28 − (A + B) = 28 − 15 = 13.'],
          a: '13' },
    trap: 'Забыть разделить на 2: в сумме всех пар каждое число посчитано дважды.'
  }, {
    t: 'Sums of pairs',
    idea: 'If you know the pair sums A + B, B + C and A + C, add them all at once: each number goes into the total exactly twice.',
    steps: [
      'Add all three sums.',
      'Halve it — you get A + B + C.',
      'Subtract any pair sum — the third number is left.'
    ],
    ex: { q: 'A + B = 15, B + C = 23, A + C = 18. What is C?',
          s: ['All sums: 15 + 23 + 18 = 56.', 'A + B + C = 56 ÷ 2 = 28.', 'C = 28 − (A + B) = 28 − 15 = 13.'],
          a: '13' },
    trap: 'Forgetting to halve: in the sum of all pairs each number is counted twice.'
  });

  T('beforeafter', ['Было — стало'], {
    t: 'Было — стало',
    idea: 'Нарисуй две картинки: «было» и «стало». Смотри, что изменилось, а что осталось прежним.',
    steps: [
      'Запиши, что было и что с этим сделали.',
      'Найди то, что не изменилось: вес пустой кружки, общая сумма, разница.',
      'Разница между «было» и «стало» — это ровно то, что убрали или добавили.',
      'Если известен только конец — иди обратным ходом.'
    ],
    ex: { q: 'Полная кружка кофе весит 690 г, а с половиной кофе — 465 г. Сколько весит пустая кружка?',
          s: ['Разница — это половина кофе: 690 − 465 = 225 г.', 'Весь кофе: 225 × 2 = 450 г.', 'Кружка: 690 − 450 = 240 г.'],
          a: '240 г' },
    trap: 'Решить, что 465 г — это вес кофе. В нём ещё и кружка.'
  }, {
    t: 'Before and after',
    idea: 'Draw two pictures: “before” and “after”. Look at what changed and what stayed the same.',
    steps: [
      'Write down what there was and what was done to it.',
      'Find what did not change: the empty mug, the total, the difference.',
      'The difference between “before” and “after” is exactly what was taken away or added.',
      'If only the end is known — work backwards.'
    ],
    ex: { q: 'A full mug of coffee weighs 690 g, with half the coffee — 465 g. How much does the empty mug weigh?',
          s: ['The difference is half the coffee: 690 − 465 = 225 g.', 'All the coffee: 225 × 2 = 450 g.', 'Mug: 690 − 450 = 240 g.'],
          a: '240 g' },
    trap: 'Deciding that 465 g is the coffee. The mug is in there too.'
  });

  T('age', ['Возраст'], {
    t: 'Задачи на возраст',
    idea: 'Разница в возрасте никогда не меняется: через 10 лет оба станут старше на 10 лет.',
    steps: [
      'Найди разницу в возрасте.',
      '«Втрое старше» — нарисуй: младший 1 доля, старший 3 доли. Разница — это 2 доли.',
      'Разница ÷ (число долей − 1) = возраст младшего в тот момент.',
      'Сравни с сегодняшним возрастом: через сколько лет (или сколько лет назад)?'
    ],
    ex: { q: 'Маме 32 года, дочке 8. Через сколько лет мама будет втрое старше дочки?',
          s: ['Разница: 32 − 8 = 24 года, и она не изменится.', 'Втрое старше: разница — это 2 доли. Доля: 24 ÷ 2 = 12.', 'Дочке будет 12, маме 36. Это через 12 − 8 = 4 года.', 'Проверка: 36 = 3 × 12 ✓'],
          a: 'через 4 года' },
    trap: 'Прибавлять годы только одному человеку. Время идёт для всех.'
  }, {
    t: 'Age problems',
    idea: 'The age difference never changes: in 10 years both will be 10 years older.',
    steps: [
      'Find the age difference.',
      '“Three times as old” — draw it: the younger is 1 part, the older 3 parts. The difference is 2 parts.',
      'Difference ÷ (parts − 1) = the younger one’s age at that moment.',
      'Compare with today’s age: in how many years (or how many years ago)?'
    ],
    ex: { q: 'Mum is 32, her daughter is 8. In how many years will Mum be three times as old?',
          s: ['Difference: 32 − 8 = 24 years, and it won’t change.', 'Three times as old: the difference is 2 parts. One part: 24 ÷ 2 = 12.', 'The daughter will be 12, Mum 36. That is in 12 − 8 = 4 years.', 'Check: 36 = 3 × 12 ✓'],
          a: 'in 4 years' },
    trap: 'Adding years to only one person. Time passes for everyone.'
  });

  T('scales', ['Весы'], {
    t: 'Весы',
    idea: 'Весы в равновесии — значит обе чаши весят одинаково. Одинаковое можно снять с обеих чаш, и равновесие останется.',
    steps: [
      'Сними одинаковые предметы с обеих чаш.',
      'Узнай, сколько весит один предмет через другие: 2 яблока = 6 слив → 1 яблоко = 3 сливы.',
      'Если есть общее звено (дыня), перепиши всё через него.',
      'Посчитай нужное количество.'
    ],
    ex: { q: 'На одной чаше 3 кубика и гиря 200 г, на другой — 5 таких же кубиков. Сколько весит кубик?',
          s: ['Снимаем по 3 кубика с каждой чаши.', 'Осталось: 200 г = 2 кубика.', 'Один кубик: 200 ÷ 2 = 100 г.'],
          a: '100 г' },
    trap: 'Сразу делить 200 на 5, не сняв одинаковые кубики.'
  }, {
    t: 'Balance scales',
    idea: 'Balanced scales mean both pans weigh the same. You can remove the same things from both pans and it stays balanced.',
    steps: [
      'Remove the same objects from both pans.',
      'Find how much one object weighs in terms of others: 2 apples = 6 plums → 1 apple = 3 plums.',
      'If there is a common link (a melon), rewrite everything through it.',
      'Count the amount you need.'
    ],
    ex: { q: 'One pan has 3 blocks and a 200 g weight, the other has 5 of the same blocks. How much does a block weigh?',
          s: ['Take 3 blocks off each pan.', 'Left: 200 g = 2 blocks.', 'One block: 200 ÷ 2 = 100 g.'],
          a: '100 g' },
    trap: 'Dividing 200 by 5 straight away without removing the equal blocks.'
  });

  T('weighings', ['Взвешивания'], {
    t: 'Поиск лёгкой монеты взвешиваниями',
    idea: 'У чашечных весов три исхода: легче левая, легче правая или равны. Поэтому предметы делят не пополам, а на три кучки.',
    steps: [
      'Раздели предметы на 3 равные кучки.',
      'Положи две кучки на весы.',
      'Равны — лёгкая в третьей кучке. Не равны — в той, что легче.',
      'Повтори с этой кучкой.',
      'Каждое взвешивание уменьшает число подозреваемых в 3 раза: 3 монеты — 1 взвешивание, 9 — 2, 27 — 3.'
    ],
    ex: { q: 'Из 9 монет одна легче. Сколько взвешиваний нужно, чтобы наверняка её найти?',
          s: ['Делим на 3 + 3 + 3. Сравниваем две тройки — узнаём, в какой тройке лёгкая.', 'Из тройки кладём по одной монете на чаши — узнаём лёгкую.'],
          a: '2 взвешивания' },
    trap: 'Делить пополам — так понадобится больше взвешиваний.'
  }, {
    t: 'Finding the light coin by weighing',
    idea: 'A balance has three outcomes: left lighter, right lighter, or equal. So divide the objects into three piles, not two.',
    steps: [
      'Divide the objects into 3 equal piles.',
      'Put two piles on the scales.',
      'Equal — the light one is in the third pile. Not equal — it is in the lighter pile.',
      'Repeat with that pile.',
      'Each weighing cuts the suspects by 3 times: 3 coins — 1 weighing, 9 — 2, 27 — 3.'
    ],
    ex: { q: 'One of 9 coins is lighter. How many weighings are needed to find it for sure?',
          s: ['Split into 3 + 3 + 3. Compare two groups — find the group with the light coin.', 'From that group put one coin on each pan — find the light one.'],
          a: '2 weighings' },
    trap: 'Splitting in half — that needs more weighings.'
  });

  T('assume', ['Метод предположения'], {
    t: 'Метод предположения',
    idea: 'Предположи, что все одинаковые (например, все — куры), посчитай и посмотри, сколько не хватает. Каждая замена исправляет нехватку на одно и то же число.',
    steps: [
      'Предположи: все — первого вида.',
      'Посчитай, что тогда получилось бы (ноги, деньги).',
      'Найди разницу с тем, что есть на самом деле.',
      'Узнай, насколько меняет итог одна замена (кролик вместо курицы — +2 ноги).',
      'Разница ÷ изменение от одной замены = сколько предметов второго вида.'
    ],
    ex: { q: 'В клетке куры и кролики: 10 голов и 28 ног. Сколько кроликов?',
          s: ['Пусть все 10 — куры: 10 × 2 = 20 ног.', 'Не хватает: 28 − 20 = 8 ног.', 'Кролик вместо курицы даёт +2 ноги: 8 ÷ 2 = 4.', 'Проверка: 4 кролика × 4 + 6 кур × 2 = 16 + 12 = 28 ✓'],
          a: '4 кролика' },
    trap: 'Перепутать, кого нашли: число замен — это число предметов второго вида.'
  }, {
    t: 'Guess all the same',
    idea: 'Suppose everything is of one kind (say, all chickens), count, and see what is missing. Each swap fixes the shortfall by the same amount.',
    steps: [
      'Suppose everything is of the first kind.',
      'Count what you would get (legs, money).',
      'Find the difference from the real total.',
      'Find how much one swap changes the total (a rabbit instead of a chicken — +2 legs).',
      'Difference ÷ change per swap = how many of the second kind.'
    ],
    ex: { q: 'Chickens and rabbits: 10 heads and 28 legs. How many rabbits?',
          s: ['Suppose all 10 are chickens: 10 × 2 = 20 legs.', 'Missing: 28 − 20 = 8 legs.', 'A rabbit instead of a chicken gives +2 legs: 8 ÷ 2 = 4.', 'Check: 4 rabbits × 4 + 6 chickens × 2 = 16 + 12 = 28 ✓'],
          a: '4 rabbits' },
    trap: 'Mixing up what you found: the number of swaps is the number of the second kind.'
  });

  T('worst', ['Наихудший случай', 'Наверняка', 'Принцип Дирихле'], {
    t: 'Наверняка: самый неудачный случай',
    idea: '«Наверняка» значит «даже при самом большом невезении». Представь, что тебе попадается всё самое неудачное, и найди момент, когда удача уже неизбежна.',
    steps: [
      'Пойми, что нужно получить: пару одного цвета, шар каждого цвета…',
      'Посчитай, сколько можно вытащить, ещё не получив нужного, — при самом большом невезении.',
      'Прибавь один: следующий уже обязательно подойдёт.',
      'Похожая идея: 13 человек, а месяцев 12 — значит двое точно родились в одном месяце.'
    ],
    ex: { q: 'В ящике 10 красных, 10 синих и 10 зелёных шаров. Сколько вынуть не глядя, чтобы наверняка было два одного цвета?',
          s: ['Самое невезучее: по одному шару каждого цвета — 3 шара, а пары нет.', 'Четвёртый шар обязательно совпадёт по цвету с одним из них.'],
          a: '4 шара' },
    trap: 'Думать про удачный случай («вытащу два красных сразу») — он не даёт гарантии.'
  }, {
    t: 'For sure: the unluckiest case',
    idea: '“For sure” means “even with the worst luck”. Imagine you get the unluckiest items every time, and find the moment when success can no longer be avoided.',
    steps: [
      'Decide what you need: a pair of one colour, one ball of each colour…',
      'Count how many you can draw without getting it — with the worst luck.',
      'Add one: the next one must fit.',
      'Same idea: 13 people but 12 months — two of them were surely born in the same month.'
    ],
    ex: { q: 'A box has 10 red, 10 blue and 10 green balls. How many must you take without looking to be sure of two of the same colour?',
          s: ['Worst luck: one ball of each colour — 3 balls, no pair.', 'The 4th ball must match one of them.'],
          a: '4 balls' },
    trap: 'Thinking about the lucky case (“I’ll get two reds at once”) — it guarantees nothing.'
  });

  T('combo', ['Комбинаторика', 'Правило умножения', 'Перебор', 'Перебор с условием'], {
    t: 'Сколько вариантов',
    idea: 'Если к каждому выбору первого подходят одни и те же варианты второго, число вариантов умножают.',
    steps: [
      'Разбей выбор на шаги: первая цифра, вторая цифра; футболка, шорты.',
      'Посчитай варианты на каждом шаге.',
      'Перемножь.',
      'Учитывай условия: цифры не повторяются — на следующем шаге выбор меньше; ноль не бывает первой цифрой.',
      'Начинай с самого строгого условия: если число нечётное — сначала выбери последнюю цифру.',
      'Сомневаешься — выпиши все варианты по порядку, ничего не пропуская.'
    ],
    ex: { q: 'Сколько двузначных чисел можно составить из цифр 1, 2, 3, 4 без повторов?',
          s: ['Первая цифра — любая из 4.', 'Вторая — любая из 3 оставшихся.', '4 × 3 = 12.'],
          a: '12' },
    trap: 'Складывать варианты вместо того, чтобы умножать.'
  }, {
    t: 'How many ways',
    idea: 'If every choice of the first thing goes with the same options for the second, multiply the numbers of options.',
    steps: [
      'Split the choice into steps: first digit, second digit; T-shirt, shorts.',
      'Count the options at each step.',
      'Multiply.',
      'Watch the conditions: no repeated digits — fewer options at the next step; 0 can’t be the first digit.',
      'Start with the strictest condition: if the number must be odd, choose the last digit first.',
      'Not sure — list all the options in order, missing nothing.'
    ],
    ex: { q: 'How many two-digit numbers can be made from 1, 2, 3, 4 without repeats?',
          s: ['First digit — any of 4.', 'Second — any of the 3 left.', '4 × 3 = 12.'],
          a: '12' },
    trap: 'Adding the options instead of multiplying.'
  });

  T('routes', ['Маршруты'], {
    t: 'Маршруты по сетке',
    idea: 'Если можно ходить только вправо и вниз, в каждый узел попадают либо сверху, либо слева. Значит, путей в узел — сумма путей в верхний и в левый узлы.',
    steps: [
      'Нарисуй узлы сетки.',
      'В верхнем ряду и левом столбце пиши 1 — туда один путь.',
      'Каждый следующий узел = число сверху + число слева.',
      'Число в конечном узле — это ответ.'
    ],
    ex: { q: 'Сколько путей из левого верхнего в правый нижний угол сетки 2 × 2 клетки (ходим вправо и вниз)?',
          s: ['Узлов 3 × 3. Верхний ряд: 1, 1, 1.', 'Второй ряд: 1, 2, 3.', 'Третий ряд: 1, 3, 6.'],
          a: '6 путей' },
    trap: 'Путать клетки и узлы: у сетки 2 × 2 клетки — 3 × 3 узла.'
  }, {
    t: 'Routes on a grid',
    idea: 'If you can only move right and down, you reach each point either from above or from the left. So the number of routes to a point is the sum of the routes to the point above and to the point on the left.',
    steps: [
      'Draw the grid points.',
      'Write 1 along the top row and the left column — there is only one way there.',
      'Each next point = number above + number on the left.',
      'The number at the end point is the answer.'
    ],
    ex: { q: 'How many routes go from the top-left to the bottom-right corner of a 2 × 2 grid of squares (moving right and down)?',
          s: ['There are 3 × 3 points. Top row: 1, 1, 1.', 'Second row: 1, 2, 3.', 'Third row: 1, 3, 6.'],
          a: '6 routes' },
    trap: 'Mixing up squares and points: a 2 × 2 grid of squares has 3 × 3 points.'
  });

  T('handshakes', ['Рукопожатия'], {
    t: 'Каждый с каждым',
    idea: 'Каждый жмёт руку всем остальным. Но если сложить у всех, каждое рукопожатие посчитано дважды — оба его участника.',
    steps: [
      'Сколько людей? Пусть их N.',
      'Каждый жмёт руку N − 1 человеку.',
      'N × (N − 1) — столько, если считать у каждого.',
      'Раздели на 2 — каждое рукопожатие посчитано дважды.'
    ],
    ex: { q: '6 человек пожали руки каждый с каждым. Сколько рукопожатий?',
          s: ['Каждый — с 5 другими: 6 × 5 = 30.', 'Каждое посчитано дважды: 30 ÷ 2 = 15.'],
          a: '15' },
    trap: 'Забыть поделить на 2.'
  }, {
    t: 'Everyone with everyone',
    idea: 'Everyone shakes hands with all the others. But if you add up everyone’s handshakes, each one is counted twice — once for each person in it.',
    steps: [
      'How many people? Say N.',
      'Each shakes hands with N − 1 people.',
      'N × (N − 1) — that is counting for every person.',
      'Divide by 2 — each handshake was counted twice.'
    ],
    ex: { q: '6 people each shake hands with everyone else. How many handshakes?',
          s: ['Each with 5 others: 6 × 5 = 30.', 'Each counted twice: 30 ÷ 2 = 15.'],
          a: '15' },
    trap: 'Forgetting to divide by 2.'
  });

  T('search', ['Перечисление', 'Наименьшая стоимость'], {
    t: 'Перебор с условиями',
    idea: 'Когда ищем наибольшее или наименьшее, остальные числа делаем как можно меньше (или больше), но так, чтобы все условия выполнялись. А когда считаем числа с условием — перебираем по порядку, без пропусков.',
    steps: [
      'Выпиши все условия задачи.',
      'Реши, что должно быть маленьким, чтобы нужное число выросло (или наоборот).',
      'Возьми самые маленькие допустимые значения.',
      'Проверь каждое условие: «разные», «строго меньше», «целые».',
      'Подсчёт чисел с условием: перебирай по разрядам — сначала сотни, потом десятки, потом единицы.'
    ],
    ex: { q: 'A < B < C, A + B + C = 25, A = 2. Какое наибольшее C?',
          s: ['Чтобы C было больше, B должно быть меньше.', 'B больше A, значит самое маленькое B = 3.', 'C = 25 − 2 − 3 = 20.'],
          a: '20' },
    trap: 'Забыть условие «строго меньше» или «все разные».'
  }, {
    t: 'Searching with conditions',
    idea: 'To make something as big (or small) as possible, make the other numbers as small (or big) as possible — while keeping every condition. To count numbers with a condition, go through them in order without gaps.',
    steps: [
      'Write down every condition.',
      'Decide what must be small so the number you want grows (or the other way round).',
      'Take the smallest allowed values.',
      'Check each condition: “different”, “strictly less”, “whole numbers”.',
      'Counting numbers with a condition: go place by place — hundreds first, then tens, then ones.'
    ],
    ex: { q: 'A < B < C, A + B + C = 25, A = 2. What is the greatest possible C?',
          s: ['For C to be big, B must be small.', 'B is bigger than A, so the smallest B is 3.', 'C = 25 − 2 − 3 = 20.'],
          a: '20' },
    trap: 'Forgetting “strictly less” or “all different”.'
  });

  /* ---------------- числа: делимость, чётность ---------------- */

  T('crypt', ['Криптарифмы'], {
    t: 'Криптарифмы: буквы вместо цифр',
    idea: 'Одинаковые буквы — одинаковые цифры, разные — разные. Начинай с самого «узкого» места: последней цифры, первой цифры или переноса в следующий разряд.',
    steps: [
      'Посмотри на единицы: какая цифра при сложении или умножении даёт такую последнюю цифру?',
      'Посмотри на первую цифру: если ответ стал длиннее, был перенос.',
      'Выпиши, какие цифры ещё возможны, и проверяй их по очереди.',
      'Первая цифра числа не может быть нулём.',
      'Подставь найденные цифры и проверь весь пример.'
    ],
    ex: { q: 'А + А + А = БА. Найди А и Б.',
          s: ['3 × А оканчивается на А. Подходят только А = 0 и А = 5.', 'А = 0 даёт 0 — это не двузначное число.', 'А = 5: 5 + 5 + 5 = 15. Значит Б = 1.'],
          a: 'А = 5, Б = 1' },
    trap: 'Забыть про перенос единицы в следующий разряд.'
  }, {
    t: 'Cryptarithms: letters for digits',
    idea: 'Equal letters are equal digits, different letters are different digits. Start from the “narrowest” place: the last digit, the first digit, or a carry.',
    steps: [
      'Look at the ones: which digit gives this last digit when added or multiplied?',
      'Look at the first digit: if the answer got longer, there was a carry.',
      'List the digits still possible and test them one by one.',
      'The first digit of a number can’t be zero.',
      'Put the digits in and check the whole sum.'
    ],
    ex: { q: 'A + A + A = BA. Find A and B.',
          s: ['3 × A ends in A. Only A = 0 or A = 5 work.', 'A = 0 gives 0 — not a two-digit number.', 'A = 5: 5 + 5 + 5 = 15. So B = 1.'],
          a: 'A = 5, B = 1' },
    trap: 'Forgetting to carry the one into the next place.'
  });

  T('divis', ['Делимость'], {
    t: 'Признаки делимости',
    idea: 'Чтобы узнать, делится ли число, не обязательно делить — хватит посмотреть на его цифры.',
    steps: [
      'На 2 — последняя цифра чётная. На 5 — последняя 0 или 5. На 10 — последняя 0.',
      'На 3 — сумма цифр делится на 3. На 9 — сумма цифр делится на 9.',
      'На 4 — две последние цифры образуют число, которое делится на 4.',
      'На 6 — делится и на 2, и на 3 одновременно.',
      'Сколько чисел от 1 до N делится на k: раздели N на k и возьми целую часть.'
    ],
    ex: { q: 'Какую цифру поставить в 4□2, чтобы число делилось на 9?',
          s: ['Сумма цифр: 4 + □ + 2 = 6 + □.', 'Она должна делиться на 9: 6 + □ = 9.', '□ = 3. Проверка: 432 ÷ 9 = 48 ✓'],
          a: '3' },
    trap: 'Проверять делимость на 4 только по последней цифре. Нужны две последние.'
  }, {
    t: 'Divisibility rules',
    idea: 'To tell whether a number divides, you don’t have to divide — just look at its digits.',
    steps: [
      'By 2 — the last digit is even. By 5 — the last digit is 0 or 5. By 10 — the last digit is 0.',
      'By 3 — the digit sum divides by 3. By 9 — the digit sum divides by 9.',
      'By 4 — the last two digits make a number that divides by 4.',
      'By 6 — divides by both 2 and 3.',
      'How many numbers from 1 to N divide by k: divide N by k and take the whole part.'
    ],
    ex: { q: 'Which digit goes in 4□2 so the number divides by 9?',
          s: ['Digit sum: 4 + □ + 2 = 6 + □.', 'It must divide by 9: 6 + □ = 9.', '□ = 3. Check: 432 ÷ 9 = 48 ✓'],
          a: '3' },
    trap: 'Checking divisibility by 4 with only the last digit. You need the last two.'
  });

  T('remain', ['Остатки', 'Деление с остатком'], {
    t: 'Деление с остатком',
    idea: 'Остаток — это то, что не поместилось в целые группы. Он всегда меньше делителя.',
    steps: [
      'Найди наибольшее число, которое не больше данного и делится нацело.',
      'Остаток = данное число − это число.',
      'Делимое = делитель × частное + остаток.',
      'Если остаток получился больше делителя — частное взято слишком маленьким.'
    ],
    ex: { q: 'Какой остаток даёт 100 при делении на 7?',
          s: ['Ближайшее снизу кратное 7: 7 × 14 = 98.', '100 − 98 = 2.'],
          a: '2' },
    trap: 'Получить остаток больше делителя и не заметить ошибку.'
  }, {
    t: 'Division with remainder',
    idea: 'The remainder is what does not fit into whole groups. It is always smaller than the divisor.',
    steps: [
      'Find the biggest number not above the given one that divides exactly.',
      'Remainder = given number − that number.',
      'Dividend = divisor × quotient + remainder.',
      'If the remainder is bigger than the divisor, the quotient is too small.'
    ],
    ex: { q: 'What is the remainder when 100 is divided by 7?',
          s: ['The nearest multiple of 7 below: 7 × 14 = 98.', '100 − 98 = 2.'],
          a: '2' },
    trap: 'Getting a remainder bigger than the divisor and not noticing the mistake.'
  });

  T('parity', ['Чётность'], {
    t: 'Чётность',
    idea: 'Чётное + чётное = чётное. Нечётное + нечётное = чётное. Чётное + нечётное = нечётное. Иногда это решает задачу без всяких вычислений.',
    steps: [
      'Замени числа буквами: Ч — чётное, Н — нечётное.',
      'В сумме считай только «Н»: если их чётное количество, сумма чётная.',
      'Произведение чётное, если есть хотя бы один чётный множитель.',
      'Чётные и нечётные числа идут через одно, поэтому от 1 до 20 их поровну — по 10.'
    ],
    ex: { q: 'Может ли сумма пяти нечётных чисел равняться 20?',
          s: ['Пять «Н» — нечётное количество нечётных.', 'Значит сумма нечётная.', '20 — чётное.'],
          a: 'нет, не может' },
    trap: 'Проверить пару примеров и решить, что «всегда так». Чётность даёт ответ наверняка.'
  }, {
    t: 'Odd and even',
    idea: 'Even + even = even. Odd + odd = even. Even + odd = odd. Sometimes this solves a problem with no calculation at all.',
    steps: [
      'Replace the numbers with letters: E — even, O — odd.',
      'In a sum count only the Os: an even number of them makes the sum even.',
      'A product is even if at least one factor is even.',
      'Even and odd numbers alternate, so from 1 to 20 there are 10 of each.'
    ],
    ex: { q: 'Can the sum of five odd numbers be 20?',
          s: ['Five Os is an odd number of odd numbers.', 'So the sum is odd.', '20 is even.'],
          a: 'no, it can’t' },
    trap: 'Trying a couple of examples and deciding “it is always so”. Parity gives a sure answer.'
  });

  /* ---------------- логика ---------------- */

  T('logic', ['Логика', 'Соответствия', 'Упорядочивание'], {
    t: 'Логические задачи: таблица и цепочка',
    idea: 'Не держи всё в голове. Когда нужно сопоставить людей и предметы — начерти таблицу и ставь ✗ и ✓. Когда нужно расставить по порядку — выстрой цепочку.',
    steps: [
      'Таблица: строки — люди, столбцы — предметы.',
      'Каждое «не…» из условия — крестик ✗ в клетке.',
      'Если в строке осталась одна пустая клетка — там ✓, а во всём этом столбце у остальных ✗.',
      'Порядок («выше», «раньше»): нарисуй линию и расставляй имена по одному условию.',
      'Числовые загадки: выпиши все числа, которые подходят под первое условие, и вычёркивай по остальным.'
    ],
    ex: { q: 'У Ани, Бори и Веры кот, собака и попугай. У Ани не кот и не собака. У Бори не собака. У кого собака?',
          s: ['Аня: ✗ кот, ✗ собака → ✓ попугай.', 'Боря: ✗ собака, попугай занят → ✓ кот.', 'Вере остаётся собака.'],
          a: 'у Веры' },
    trap: 'Решать в уме и забыть одно из условий.'
  }, {
    t: 'Logic problems: a table and a chain',
    idea: 'Don’t keep it all in your head. To match people and things, draw a table with ✗ and ✓. To put things in order, build a chain.',
    steps: [
      'Table: rows — people, columns — things.',
      'Every “not …” in the problem is a ✗ in a cell.',
      'If a row has one empty cell left, put ✓ there and ✗ for everyone else in that column.',
      'Order (“taller”, “earlier”): draw a line and place the names one condition at a time.',
      'Number riddles: list all the numbers that fit the first condition and cross out using the others.'
    ],
    ex: { q: 'Anya, Borya and Vera have a cat, a dog and a parrot. Anya’s is not the cat or the dog. Borya’s is not the dog. Who has the dog?',
          s: ['Anya: ✗ cat, ✗ dog → ✓ parrot.', 'Borya: ✗ dog, parrot taken → ✓ cat.', 'Vera gets the dog.'],
          a: 'Vera' },
    trap: 'Solving in your head and forgetting one condition.'
  });

  T('truth', ['Правда и ложь'], {
    t: 'Правда и ложь',
    idea: 'Не знаешь, кто говорит правду, — проверь варианты по очереди. Предположи ответ и посчитай, сколько высказываний стали верными.',
    steps: [
      'Выпиши все возможные ответы (кто взял, где приз).',
      'Для каждого варианта отметь, какие фразы верны, а какие нет.',
      'Оставь тот вариант, где верных фраз ровно столько, сколько сказано в условии.',
      'Проверь ещё раз именно этот вариант.'
    ],
    ex: { q: 'Кто-то один взял конфету. Аня: «Я не брала». Боря: «Взяла Аня». Вера: «Я не брала». Правду сказал ровно один. Кто взял?',
          s: ['Если Аня: Аня лжёт, Боря прав, Вера права — 2 правды. Не подходит.', 'Если Боря: Аня права, Боря лжёт, Вера права — 2 правды. Не подходит.', 'Если Вера: Аня права, Боря лжёт, Вера лжёт — 1 правда. Подходит.'],
          a: 'Вера' },
    trap: 'Поверить первой фразе и строить всё на ней.'
  }, {
    t: 'Truth and lies',
    idea: 'If you don’t know who tells the truth, test the options one by one. Assume an answer and count how many statements become true.',
    steps: [
      'List all possible answers (who took it, where the prize is).',
      'For each option mark which statements are true and which are false.',
      'Keep the option with exactly as many true statements as the problem says.',
      'Check that option once more.'
    ],
    ex: { q: 'One child took a sweet. Anya: “Not me.” Borya: “Anya did.” Vera: “Not me.” Exactly one told the truth. Who took it?',
          s: ['If Anya: Anya lies, Borya true, Vera true — 2 truths. No.', 'If Borya: Anya true, Borya lies, Vera true — 2 truths. No.', 'If Vera: Anya true, Borya lies, Vera lies — 1 truth. Yes.'],
          a: 'Vera' },
    trap: 'Believing the first statement and building everything on it.'
  });

  /* ---------------- время, меры, доли ---------------- */

  T('time', ['Время', 'Часы и минуты', 'Сколько времени прошло'], {
    t: 'Время',
    idea: 'В часе 60 минут, а не 100. Поэтому время удобно считать шагами — до ближайшего круглого часа, потом целыми часами, потом остаток.',
    steps: [
      'От начала дойди до ближайшего круглого часа.',
      'Добавь целые часы.',
      'Добавь оставшиеся минуты.',
      'Время после полудня: 3 часа дня — это 15:00.',
      'Переводы: 1 час = 60 минут, сутки = 24 часа.'
    ],
    ex: { q: 'Сколько минут от 10:15 до 12:30?',
          s: ['До 11:00 — 45 минут.', 'От 11:00 до 12:00 — 60 минут.', 'От 12:00 до 12:30 — 30 минут.', '45 + 60 + 30 = 135.'],
          a: '135 минут' },
    trap: 'Вычитать время как обычные числа: 1230 − 1015 = 215 — неверно.'
  }, {
    t: 'Time',
    idea: 'An hour has 60 minutes, not 100. So count time in steps — up to the next whole hour, then whole hours, then the rest.',
    steps: [
      'From the start, go up to the next whole hour.',
      'Add the whole hours.',
      'Add the leftover minutes.',
      'Afternoon times: 3 p.m. is 15:00.',
      'Conversions: 1 hour = 60 minutes, a day = 24 hours.'
    ],
    ex: { q: 'How many minutes from 10:15 to 12:30?',
          s: ['To 11:00 — 45 minutes.', '11:00 to 12:00 — 60 minutes.', '12:00 to 12:30 — 30 minutes.', '45 + 60 + 30 = 135.'],
          a: '135 minutes' },
    trap: 'Subtracting times like ordinary numbers: 1230 − 1015 = 215 is wrong.'
  });

  T('units', ['Измерения', 'Длина', 'Масса'], {
    t: 'Единицы измерения',
    idea: 'Прежде чем сравнивать или складывать, переведи всё в одинаковые единицы.',
    steps: [
      '1 м = 100 см, 1 см = 10 мм, 1 км = 1000 м.',
      '1 кг = 1000 г, 1 л = 1000 мл.',
      'Из крупных в мелкие — умножай, из мелких в крупные — дели.',
      'Составные величины: 3 м 5 см = 300 см + 5 см = 305 см.',
      'Длина по линейке: где кончается − где начинается.'
    ],
    ex: { q: 'Что тяжелее: 3 кг или 2 500 г?',
          s: ['Переводим: 3 кг = 3 000 г.', '3 000 г больше 2 500 г.'],
          a: '3 кг' },
    trap: 'Написать 3 м 5 см = 35 см или 350 см. Правильно — 305 см.'
  }, {
    t: 'Units of measure',
    idea: 'Before comparing or adding, turn everything into the same units.',
    steps: [
      '1 m = 100 cm, 1 cm = 10 mm, 1 km = 1000 m.',
      '1 kg = 1000 g, 1 L = 1000 mL.',
      'From big units to small — multiply; from small to big — divide.',
      'Mixed amounts: 3 m 5 cm = 300 cm + 5 cm = 305 cm.',
      'Length on a ruler: where it ends − where it starts.'
    ],
    ex: { q: 'Which is heavier: 3 kg or 2,500 g?',
          s: ['Convert: 3 kg = 3,000 g.', '3,000 g is more than 2,500 g.'],
          a: '3 kg' },
    trap: 'Writing 3 m 5 cm = 35 cm or 350 cm. It is 305 cm.'
  });

  T('rate', ['Скорость'], {
    t: 'Сколько за одну единицу',
    idea: 'Узнай, сколько приходится на одну единицу — на одну минуту, на один предмет, — и тогда легко посчитать для любого количества.',
    steps: [
      'Найди значение на одну единицу — делением.',
      'Если нужно, переведи единицы: часы в минуты.',
      'Умножь на нужное количество.'
    ],
    ex: { q: 'Женя за 45 минут прошёл 2 700 м. Сколько он пройдёт за 2 часа?',
          s: ['За 1 минуту: 2 700 ÷ 45 = 60 м.', '2 часа = 120 минут.', '60 × 120 = 7 200 м.'],
          a: '7 200 м' },
    trap: 'Забыть перевести часы в минуты.'
  }, {
    t: 'How much for one',
    idea: 'Find how much there is per one unit — per minute, per item — and then it is easy to work out any amount.',
    steps: [
      'Find the amount for one unit — by dividing.',
      'If needed, convert units: hours to minutes.',
      'Multiply by the amount you need.'
    ],
    ex: { q: 'Zhenya walked 2,700 m in 45 minutes. How far will he walk in 2 hours?',
          s: ['In 1 minute: 2,700 ÷ 45 = 60 m.', '2 hours = 120 minutes.', '60 × 120 = 7,200 m.'],
          a: '7,200 m' },
    trap: 'Forgetting to convert hours to minutes.'
  });

  T('fractions', ['Доли', 'Дроби', 'Половина', 'Четверть', 'Доли отрезка'], {
    t: 'Доли и дроби',
    idea: 'Доля — одна из равных частей целого. Четверть — это целое, разделённое на 4 равные части.',
    steps: [
      'Доля от числа: раздели на число частей. ¼ от 20 = 20 ÷ 4 = 5.',
      'Несколько долей: ¾ от 20 = 5 × 3 = 15.',
      'Число по его доле: если ¼ числа = 7, всё число = 7 × 4 = 28.',
      'Сколько осталось: целое минус известные доли. Приводи доли к одинаковым частям: ½ = 3⁄6.',
      'При одинаковом знаменателе больше та дробь, у которой больше числитель.'
    ],
    ex: { q: 'Половина марок синие, шестая часть — оранжевые, остальные 30 — серые. Сколько синих?',
          s: ['Всё — это 6⁄6. Синие ½ = 3⁄6, оранжевые 1⁄6.', 'Серые: 6⁄6 − 3⁄6 − 1⁄6 = 2⁄6 = ⅓.', '⅓ — это 30, значит всего 90 марок.', 'Синих: 90 ÷ 2 = 45.'],
          a: '45 марок' },
    trap: 'Путать «найти долю от числа» (делим) и «найти число по доле» (умножаем).'
  }, {
    t: 'Parts and fractions',
    idea: 'A fraction is one of the equal parts of a whole. A quarter is the whole split into 4 equal parts.',
    steps: [
      'A fraction of a number: divide by the number of parts. ¼ of 20 = 20 ÷ 4 = 5.',
      'Several parts: ¾ of 20 = 5 × 3 = 15.',
      'A number from its fraction: if ¼ of it is 7, the whole is 7 × 4 = 28.',
      'What is left: the whole minus the known parts. Use equal parts: ½ = 3⁄6.',
      'With the same denominator, the fraction with the bigger numerator is bigger.'
    ],
    ex: { q: 'Half the stamps are blue, a sixth are orange, the other 30 are grey. How many are blue?',
          s: ['The whole is 6⁄6. Blue ½ = 3⁄6, orange 1⁄6.', 'Grey: 6⁄6 − 3⁄6 − 1⁄6 = 2⁄6 = ⅓.', '⅓ is 30, so there are 90 stamps.', 'Blue: 90 ÷ 2 = 45.'],
          a: '45 stamps' },
    trap: 'Mixing up “a fraction of a number” (divide) and “a number from its fraction” (multiply).'
  });

  T('average', ['Среднее'], {
    t: 'Среднее',
    idea: 'Среднее — это сколько было бы у каждого, если всё разделить поровну. Среднее × количество = общая сумма.',
    steps: [
      'Общая сумма = среднее × количество.',
      'Среднее = общая сумма ÷ количество.',
      'Если что-то изменилось — сравни общие суммы до и после.',
      'Середина между двумя числами — это их полусумма: (3 + 11) ÷ 2 = 7.'
    ],
    ex: { q: 'У 5 друзей в среднем по 25 рублей. Одному дали денег, и стало в среднем по 30. Сколько дали?',
          s: ['Было всего: 25 × 5 = 125.', 'Стало всего: 30 × 5 = 150.', 'Дали: 150 − 125 = 25.'],
          a: '25 рублей' },
    trap: 'Вычесть средние: 30 − 25 = 5. Средние сравнивать нельзя — сравнивай суммы.'
  }, {
    t: 'Average',
    idea: 'The average is how much each would have if everything were shared equally. Average × count = total.',
    steps: [
      'Total = average × count.',
      'Average = total ÷ count.',
      'If something changed — compare the totals before and after.',
      'The middle of two numbers is half their sum: (3 + 11) ÷ 2 = 7.'
    ],
    ex: { q: '5 friends have $25 each on average. One gets some money and the average becomes $30. How much was given?',
          s: ['Total before: 25 × 5 = 125.', 'Total after: 30 × 5 = 150.', 'Given: 150 − 125 = 25.'],
          a: '$25' },
    trap: 'Subtracting the averages: 30 − 25 = 5. Compare totals, not averages.'
  });

  T('sets', ['Множества'], {
    t: 'Два кружка',
    idea: 'Нарисуй два пересекающихся круга — по одному на каждую группу. Общая часть — это те, кто в обеих группах сразу.',
    steps: [
      'Нарисуй два круга, которые заходят друг на друга.',
      'Первым впиши число в общую часть.',
      'Только в первой группе = вся первая − общая часть. Так же для второй.',
      'Всего в кругах = первая + вторая − общая.',
      'Вне кругов = все − те, кто в кругах.'
    ],
    ex: { q: 'В классе 25 детей. Футбол — 15, плавание — 12, и то и другое — 5. Сколько детей ничем не занимаются?',
          s: ['В кругах: 15 + 12 − 5 = 22.', 'Вне кругов: 25 − 22 = 3.'],
          a: '3' },
    trap: 'Просто сложить 15 и 12 — тогда тех, кто в обеих группах, посчитаешь дважды.'
  }, {
    t: 'Two circles',
    idea: 'Draw two overlapping circles — one for each group. The shared part is those who are in both groups.',
    steps: [
      'Draw two circles that overlap.',
      'Write the number in the shared part first.',
      'Only in the first group = whole first group − shared part. Same for the second.',
      'Inside the circles = first + second − shared.',
      'Outside = everyone − those inside.'
    ],
    ex: { q: 'A class has 25 children. 15 play football, 12 swim, 5 do both. How many do neither?',
          s: ['Inside the circles: 15 + 12 − 5 = 22.', 'Outside: 25 − 22 = 3.'],
          a: '3' },
    trap: 'Just adding 15 and 12 — then the children in both groups are counted twice.'
  });

  T('charts', ['Диаграммы', 'Таблицы и диаграммы'], {
    t: 'Диаграммы и таблицы',
    idea: 'Сначала разберись, что значит один значок или одно деление шкалы, — и только потом считай.',
    steps: [
      'Прочитай подписи и пояснение: «● = 3 игрушки».',
      'Аккуратно посчитай значки или найди высоту каждого столбика.',
      'Переведи всё в числа.',
      'Ответь на вопрос: сумма, разность или доля (часть ÷ всё).'
    ],
    ex: { q: '● = 3 игрушки. Кошек ●●●, собак ●●. На сколько больше кошек?',
          s: ['Кошек: 3 × 3 = 9.', 'Собак: 2 × 3 = 6.', '9 − 6 = 3.'],
          a: 'на 3' },
    trap: 'Посчитать значки и забыть умножить на то, сколько стоит один значок.'
  }, {
    t: 'Charts and tables',
    idea: 'First work out what one symbol or one scale step means — only then count.',
    steps: [
      'Read the labels and the key: “● = 3 toys”.',
      'Carefully count the symbols or read the height of each bar.',
      'Turn everything into numbers.',
      'Answer the question: a sum, a difference, or a fraction (part ÷ whole).'
    ],
    ex: { q: '● = 3 toys. Cats ●●●, dogs ●●. How many more cats?',
          s: ['Cats: 3 × 3 = 9.', 'Dogs: 2 × 3 = 6.', '9 − 6 = 3.'],
          a: '3 more' },
    trap: 'Counting symbols and forgetting to multiply by what one symbol is worth.'
  });

  /* ---------------- картинки ----------------
     Наглядная часть: у каждого приёма, где это помогает, есть рисунок —
     клетки площади, пицца для долей, полоски модельного метода и т. д.
     Рисунки — встроенный SVG: работают без сети, в одном файле и в Android.
     PIC[key](en) возвращает список [svg, подпись]. */

  var PIC = {};

  function svg(w, h, inner) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" aria-hidden="true">' + inner + '</svg>';
  }
  function R(x, y, w, h, c) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" class="' + (c || 'ln') + '"/>'; }
  function L(x1, y1, x2, y2, c) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (c || 'ln') + '"/>'; }
  function C(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="' + (c || 'ln') + '"/>'; }
  function X(x, y, s, c) { return '<text x="' + x + '" y="' + y + '" class="' + (c || '') + '">' + s + '</text>'; }
  function P(pts, c) { return '<polygon points="' + pts + '" class="' + (c || 'ln') + '"/>'; }
  function arrow(x1, y, x2, c) {
    var d = x2 > x1 ? -7 : 7;
    return L(x1, y, x2, y, c || 'ln') + P(x2 + ',' + y + ' ' + (x2 + d) + ',' + (y - 4) + ' ' + (x2 + d) + ',' + (y + 4), 'solid');
  }
  function grid(x, y, cols, rows, s, c) {
    var h = '';
    for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) h += R(x + i * s, y + j * s, s, s, c || 'f1');
    return h;
  }
  function arc(x1, x2, y, lift) {
    var m = (x1 + x2) / 2;
    return '<path d="M' + x1 + ' ' + y + ' Q' + m + ' ' + (y - lift) + ' ' + x2 + ' ' + y + '" class="ln thin"/>';
  }
  function wedge(cx, cy, r, i, n, c) {
    var a0 = (-90 + 360 * i / n) * Math.PI / 180, a1 = (-90 + 360 * (i + 1) / n) * Math.PI / 180;
    var x0 = (cx + r * Math.cos(a0)).toFixed(1), y0 = (cy + r * Math.sin(a0)).toFixed(1);
    var x1 = (cx + r * Math.cos(a1)).toFixed(1), y1 = (cy + r * Math.sin(a1)).toFixed(1);
    return '<path d="M' + cx + ' ' + cy + ' L' + x0 + ' ' + y0 + ' A' + r + ' ' + r + ' 0 ' + (360 / n > 180 ? 1 : 0) +
           ' 1 ' + x1 + ' ' + y1 + ' Z" class="' + c + '"/>';
  }
  function pizza(n, k) {
    var h = '';
    for (var i = 0; i < n; i++) h += wedge(45, 45, 36, i, n, i < k ? 'sauce' : 'dough');
    for (i = 0; i < k; i++) {                                   // кружочки колбасы на взятых кусках
      var a = (-90 + 360 * (i + 0.5) / n) * Math.PI / 180;
      h += C((45 + 21 * Math.cos(a)).toFixed(1), (45 + 21 * Math.sin(a)).toFixed(1), 4.5, 'pep');
    }
    return svg(90, 90, h + C(45, 45, 37, 'crust'));
  }
  function bracket(x, y1, y2, label) {
    return L(x, y1, x, y2) + L(x - 5, y1, x, y1) + L(x - 5, y2, x, y2) + X(x + 8, (y1 + y2) / 2 + 5, label, 'b');
  }

  PIC.area = function (en) {
    var g = R(10, 10, 96, 72, 'none');
    var hair = '';
    for (var i = 1; i < 4; i++) hair += L(10 + i * 24, 10, 10 + i * 24, 82, 'hair');
    for (i = 1; i < 3; i++) hair += L(10, 10 + i * 24, 106, 10 + i * 24, 'hair');
    return [
      [svg(116, 92, grid(10, 10, 4, 3, 24)),
        en ? '4 × 3 = 12 squares — that is the area' : '4 × 3 = 12 клеток — это и есть площадь'],
      [svg(116, 92, P('10,10 10,82 106,82', 'f2') + hair + g + L(10, 10, 106, 82)),
        en ? 'A right triangle is half the rectangle: 12 ÷ 2 = 6' : 'Прямоугольный треугольник — половина прямоугольника: 12 ÷ 2 = 6'],
      [svg(116, 92, P('10,82 58,10 106,82', 'f2') + g + L(58, 10, 58, 82, 'dash') + L(10, 82, 58, 10) + L(58, 10, 106, 82)),
        en ? 'Any triangle is half the rectangle around it: each piece is half of its own part' : 'Любой треугольник — половина прямоугольника вокруг: каждая часть — половина своего кусочка']
    ];
  };

  PIC.perim = function (en) {
    return [[svg(150, 104, grid(25, 22, 5, 3, 20, 'f1 faint') + R(25, 22, 100, 60, 'fence') +
        X(75, 15, '5', 'b mid') + X(75, 99, '5', 'b mid') + X(12, 57, '3', 'b mid') + X(138, 57, '3', 'b mid')),
      en ? 'The perimeter is a fence around: 5 + 3 + 5 + 3 = 16. The area is the squares inside: 5 × 3 = 15'
         : 'Периметр — забор вокруг: 5 + 3 + 5 + 3 = 16. Площадь — клетки внутри: 5 × 3 = 15']];
  };

  PIC.fractions = function (en) {
    return [
      [pizza(2, 1), en ? '½ — 1 slice of 2' : '½ — 1 кусок из 2'],
      [pizza(4, 1), en ? '¼ — 1 slice of 4' : '¼ — 1 кусок из 4'],
      [pizza(4, 2), en ? '2⁄4 = ½ — the same amount of pizza' : '2⁄4 = ½ — пиццы столько же'],
      [pizza(8, 3), en ? '3⁄8 — 3 slices of 8' : '3⁄8 — 3 куска из 8']
    ];
  };

  PIC.bardiff = function (en) {
    return [[svg(270, 95,
        X(8, 36, en ? 'Petya' : 'Петя') + R(62, 20, 100, 24, 'f1') + X(112, 37, '?', 'b mid') +
        X(8, 71, en ? 'Masha' : 'Маша') + R(62, 55, 100, 24, 'f1') + X(112, 72, '?', 'b mid') +
        R(162, 55, 42, 24, 'f2') + X(183, 72, '8', 'b mid') +
        bracket(222, 20, 79, '24')),
      en ? 'Remove the tail: 24 − 8 = 16 — that is two equal bars, 8 each'
         : 'Убери хвостик: 24 − 8 = 16 — это две одинаковые полоски, по 8']];
  };

  PIC.bartimes = function (en) {
    return [[svg(270, 95,
        X(8, 36, en ? 'Katya' : 'Катя') + R(62, 20, 50, 24, 'f1') + X(87, 37, '?', 'b mid') +
        X(8, 71, en ? 'Olya' : 'Оля') + R(62, 55, 50, 24, 'f2') + R(112, 55, 50, 24, 'f2') + R(162, 55, 50, 24, 'f2') +
        X(87, 72, '?', 'b mid') + X(137, 72, '?', 'b mid') + X(187, 72, '?', 'b mid') +
        bracket(230, 20, 79, '24')),
      en ? '4 equal parts in all: 24 ÷ 4 = 6' : 'Всего 4 одинаковые доли: 24 ÷ 4 = 6']];
  };

  PIC.intervals = function (en) {
    var h = L(12, 62, 248, 62), i;
    for (i = 0; i < 5; i++) h += R(16 + i * 55, 28, 8, 34, 'f2');
    for (i = 0; i < 4; i++) h += X(47 + i * 55, 80, String(i + 1), 'b mid accent');
    var c = C(45, 45, 32, 'dash'), k;
    for (k = 0; k < 6; k++) {
      var a = (-90 + 60 * k) * Math.PI / 180;
      c += C((45 + 32 * Math.cos(a)).toFixed(1), (45 + 32 * Math.sin(a)).toFixed(1), 6, 'f2');
    }
    return [
      [svg(260, 88, h), en ? '5 posts in a row — only 4 gaps' : '5 столбов в ряд — промежутков всего 4'],
      [svg(90, 90, c), en ? 'Around a circle: 6 posts — 6 gaps' : 'По кругу: 6 столбов — 6 промежутков']
    ];
  };

  PIC.cubes = function (en) {
    var h = R(20, 40, 60, 40, 'f1') + L(40, 40, 40, 80) + L(60, 40, 60, 80) + L(20, 60, 80, 60) +
      P('20,40 80,40 104,20 44,20', 'f3') + L(32, 30, 92, 30) + L(40, 40, 64, 20) + L(60, 40, 84, 20) +
      P('80,40 104,20 104,60 80,80', 'f2') + L(92, 30, 92, 70) + L(80, 60, 104, 40);
    return [[svg(125, 92, h), en ? 'A layer is 3 × 2 = 6 cubes, 2 layers: 6 × 2 = 12' : 'В слое 3 × 2 = 6 кубиков, слоёв 2: 6 × 2 = 12']];
  };

  PIC.countfig = function (en) {
    function g(sel) { return svg(60, 60, grid(6, 6, 3, 3, 16, 'none') + sel + R(6, 6, 48, 48, 'none')); }
    return [
      [g(R(6, 6, 16, 16, 'f2')), en ? '1 × 1: 9 of them' : '1 × 1: таких 9'],
      [g(R(6, 6, 32, 32, 'f2')), en ? '2 × 2: 4 of them' : '2 × 2: таких 4'],
      [g(R(6, 6, 48, 48, 'f2')), en ? '3 × 3: just 1' : '3 × 3: один']
    ];
  };

  PIC.sets = function (en) {
    return [[svg(240, 132,
        R(5, 22, 230, 106, 'none') + C(95, 75, 46, 'f1 see') + C(145, 75, 46, 'f2 see') +
        X(62, 15, en ? 'football 15' : 'футбол 15', 'sm mid') + X(178, 15, en ? 'swimming 12' : 'плавание 12', 'sm mid') +
        X(70, 81, '10', 'b mid') + X(120, 81, '5', 'b mid') + X(170, 81, '7', 'b mid') + X(222, 122, '3', 'b mid accent')),
      en ? 'In the circles: 15 + 12 − 5 = 22. Outside: 25 − 22 = 3' : 'В кругах: 15 + 12 − 5 = 22. Вне кругов: 25 − 22 = 3']];
  };

  PIC.mul = function (en) {
    var h = '';
    for (var i = 0; i < 4; i++) for (var j = 0; j < 3; j++) h += C(20 + i * 26, 18 + j * 24, 8, 'f1');
    return [[svg(110, 78, h), en ? '3 rows of 4: 4 + 4 + 4 = 3 × 4 = 12' : '3 ряда по 4: 4 + 4 + 4 = 3 × 4 = 12']];
  };

  PIC.div = function (en) {
    var h = '';
    for (var g = 0; g < 3; g++) {
      var x = 10 + g * 78;
      h += R(x, 8, 62, 54, 'none round');
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) h += C(x + 19 + i * 24, 23 + j * 24, 8, 'f1');
    }
    return [[svg(246, 70, h), en ? '12 ÷ 3 = 4: shared equally into 3 groups' : '12 ÷ 3 = 4: разложили поровну в 3 кучки']];
  };

  PIC.symmetry = function (en) {
    return [
      [svg(96, 96, R(13, 13, 70, 70, 'f1') + L(48, 4, 48, 92, 'axis') + L(4, 48, 92, 48, 'axis') +
          L(6, 6, 90, 90, 'axis') + L(90, 6, 6, 90, 'axis')), en ? 'A square has 4 lines' : 'У квадрата 4 оси'],
      [svg(130, 86, R(15, 13, 100, 60, 'f1') + L(65, 4, 65, 82, 'axis') + L(6, 43, 124, 43, 'axis')),
        en ? 'A rectangle has 2' : 'У прямоугольника 2 оси']
    ];
  };

  PIC.scales = function (en) {
    var h = L(150, 40, 150, 122) + L(118, 122, 182, 122) + L(50, 40, 250, 40) + C(150, 40, 4, 'solid') +
      L(50, 40, 4, 92, 'thin ln') + L(50, 40, 96, 92, 'thin ln') + L(0, 92, 100, 92) +
      L(250, 40, 204, 92, 'thin ln') + L(250, 40, 296, 92, 'thin ln') + L(200, 92, 300, 92), i;
    for (i = 0; i < 3; i++) h += R(8 + i * 18, 75, 16, 16, 'f1');
    h += P('62,91 67,70 87,70 92,91', 'f2') + X(77, 86, '200', 'sm mid');
    for (i = 0; i < 5; i++) h += R(206 + i * 18, 75, 16, 16, 'f1');
    h += X(34, 112, en ? '3 cubes + 200 g' : '3 кубика + 200 г', 'sm mid') + X(250, 112, en ? '5 cubes' : '5 кубиков', 'sm mid');
    return [[svg(304, 120, h), en ? 'Take 3 cubes off each pan: 200 g = 2 cubes' : 'Сними по 3 кубика с каждой чаши: 200 г = 2 кубика']];
  };

  PIC.cycle = function (en) {
    var cls = ['cR', 'cB', 'cY'], h = '', i;
    for (i = 0; i < 10; i++) h += C(16 + i * 25, 22, 9, cls[i % 3]);
    h += C(241, 22, 13, 'ring') + X(241, 52, '10?', 'sm mid');
    for (i = 0; i < 3; i++) {
      var a = 7 + i * 75, b = a + 68;
      h += L(a, 40, b, 40, 'thin ln') + L(a, 36, a, 40, 'thin ln') + L(b, 36, b, 40, 'thin ln');
    }
    return [[svg(262, 58, h), en ? 'The pattern of 3 repeats: 10 = 3 + 3 + 3 + 1, so the 10th is like the 1st'
                                  : 'Узор из 3 бусин повторяется: 10 = 3 + 3 + 3 + 1, значит 10-я — как 1-я']];
  };

  PIC.figseq = function (en) {
    function sq(x, n) {
      var h = '', s = 26;
      for (var i = 0; i < n; i++) h += L(x + i * s, 10, x + (i + 1) * s, 10, 'match') + L(x + i * s, 36, x + (i + 1) * s, 36, 'match');
      for (i = 0; i <= n; i++) h += L(x + i * s, 10, x + i * s, 36, 'match');
      return h;
    }
    return [[svg(270, 64, sq(10, 1) + sq(60, 2) + sq(150, 3) + X(23, 58, '4', 'b mid') + X(86, 58, '7', 'b mid') + X(189, 58, '10', 'b mid')),
      en ? 'Each new square adds 3 matches: 4, 7, 10, …' : 'Каждый новый квадрат добавляет 3 спички: 4, 7, 10, …']];
  };

  PIC.seq = function (en) {
    var nums = ['2', '5', '9', '14', '20'], d = ['+3', '+4', '+5', '+6'], h = '', i;
    for (i = 0; i < 5; i++) h += X(22 + i * 50, 58, nums[i], 'b mid' + (i === 4 ? ' accent' : ''));
    for (i = 0; i < 4; i++) h += arc(28 + i * 50, 66 + i * 50, 40, 22) + X(47 + i * 50, 20, d[i], 'sm mid' + (i === 3 ? ' accent' : ''));
    return [[svg(245, 66, h), en ? 'The differences grow by 1: next is +6' : 'Разности растут на 1: следующая +6']];
  };

  PIC.routes = function (en) {
    var v = [[1, 1, 1], [1, 2, 3], [1, 3, 6]], h = '', i, j;
    for (i = 0; i < 3; i++) h += L(20, 20 + i * 50, 120, 20 + i * 50) + L(20 + i * 50, 20, 20 + i * 50, 120);
    for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) {
      h += C(20 + j * 50, 20 + i * 50, 12, i === 2 && j === 2 ? 'f2' : 'f1') + X(20 + j * 50, 25 + i * 50, String(v[i][j]), 'b mid');
    }
    return [[svg(140, 140, h), en ? 'Each number = the one above + the one on the left' : 'Каждое число = число сверху + число слева']];
  };

  PIC.handshakes = function (en) {
    var p = [], h = '', i, j;
    for (i = 0; i < 5; i++) {
      var a = (-90 + 72 * i) * Math.PI / 180;
      p.push([(60 + 44 * Math.cos(a)).toFixed(1), (58 + 44 * Math.sin(a)).toFixed(1)]);
    }
    for (i = 0; i < 5; i++) for (j = i + 1; j < 5; j++) h += L(p[i][0], p[i][1], p[j][0], p[j][1], 'thin ln');
    for (i = 0; i < 5; i++) h += C(p[i][0], p[i][1], 7, 'f2');
    return [[svg(120, 112, h), en ? '5 people — 10 lines: 5 × 4 ÷ 2 = 10' : '5 человек — 10 линий: 5 × 4 ÷ 2 = 10']];
  };

  PIC.line = function (en) {
    var x = { A: 20, B: 100, C: 140, D: 260 }, h = L(10, 40, 270, 40);
    Object.keys(x).forEach(function (k) { h += C(x[k], 40, 4, 'solid') + X(x[k], 28, k, 'b mid'); });
    h += L(20, 58, 100, 58, 'thin ln') + X(60, 74, '4', 'sm mid') +
         L(100, 58, 140, 58, 'fence') + X(120, 74, '2', 'b mid accent') +
         L(140, 58, 260, 58, 'thin ln') + X(200, 74, '6', 'sm mid');
    return [[svg(280, 82, h), en ? 'Measure everything from A: B is at 4, C is at 6, so BC = 6 − 4 = 2'
                                 : 'Всё считаем от A: B на 4, C на 6, значит BC = 6 − 4 = 2']];
  };

  PIC.time = function (en) {
    var p = [20, 90, 190, 240], t = ['10:15', '11:00', '12:00', '12:30'], d = ['+45', '+60', '+30'], h = L(10, 40, 250, 40), i;
    for (i = 0; i < 4; i++) h += C(p[i], 40, 4, 'solid') + X(p[i], 60, t[i], 'sm mid');
    for (i = 0; i < 3; i++) h += arc(p[i] + 4, p[i + 1] - 4, 34, 22) + X((p[i] + p[i + 1]) / 2, 16, d[i], 'sm mid accent');
    return [[svg(262, 68, h), en ? '45 + 60 + 30 = 135 minutes' : '45 + 60 + 30 = 135 минут']];
  };

  PIC.average = function (en) {
    var hs = [2, 6, 4], h = '', i;
    for (i = 0; i < 3; i++) h += R(15 + i * 36, 90 - hs[i] * 12, 28, hs[i] * 12, 'f1');
    h += L(10, 42, 120, 42, 'axis') + arrow(128, 60, 158, 'ln');
    for (i = 0; i < 3; i++) h += R(170 + i * 36, 42, 28, 48, 'f3');
    h += L(8, 90, 282, 90);
    return [[svg(290, 96, h), en ? 'The average is evening out: (2 + 6 + 4) ÷ 3 = 4' : 'Среднее — выровняли поровну: (2 + 6 + 4) ÷ 3 = 4']];
  };

  PIC.age = function (en) {
    var u = 4, x = 88;
    function row(y, kid, mum, lab) {
      return X(4, y + 30, lab, 'sm') + R(x, y, kid * u, 14, 'f1') + R(x, y + 18, kid * u, 14, 'f1') +
             R(x + kid * u, y + 18, (mum - kid) * u, 14, 'f2') + X(x + kid * u + (mum - kid) * u / 2, y + 29, '24', 'sm mid');
    }
    return [[svg(250, 92, row(6, 8, 32, en ? 'now' : 'сейчас') + row(52, 12, 36, en ? 'in 4 yrs' : 'через 4 г.')),
      en ? 'The difference of 24 years stays the same' : 'Разница 24 года остаётся той же']];
  };

  PIC.place = function (en) {
    var hd = en ? ['Th', 'H', 'T', 'O'] : ['Т', 'С', 'Д', 'Е'], dg = ['4', '7', '2', '8'], v = ['4000', '700', '20', '8'], h = '', i;
    for (i = 0; i < 4; i++) {
      h += R(10 + i * 52, 6, 52, 24, 'f1') + X(36 + i * 52, 23, hd[i], 'b mid') +
           R(10 + i * 52, 30, 52, 26, 'none') + X(36 + i * 52, 49, dg[i], 'b mid' + (i === 1 ? ' accent' : '')) +
           X(36 + i * 52, 74, v[i], 'sm mid');
    }
    return [[svg(222, 82, h), '4 728 = 4 000 + 700 + 20 + 8']];
  };

  PIC.worst = function (en) {
    return [[svg(210, 50, C(20, 25, 12, 'cR') + C(52, 25, 12, 'cB') + C(84, 25, 12, 'cG') + arrow(108, 25, 140, 'ln') +
        C(168, 25, 12, 'ring') + X(168, 30, '?', 'b mid')),
      en ? 'Worst luck: one of each colour. The 4th ball surely makes a pair' : 'Самое невезучее: по одному каждого цвета. Четвёртый точно даст пару']];
  };

  PIC.equalize = function (en) {
    var x = 64, u = 5;
    return [[svg(250, 86,
        X(4, 25, en ? 'Sasha' : 'Саша') + R(x, 10, 23 * u, 22, 'f1') + R(x + 23 * u, 10, 5 * u, 22, 'f2') + X(x + 25.5 * u, 26, '5', 'sm mid') +
        X(4, 67, en ? 'Dima' : 'Дима') + R(x, 52, 18 * u, 22, 'f1') + R(x + 18 * u, 52, 5 * u, 22, 'ghost') +
        L(x + 23 * u, 4, x + 23 * u, 80, 'axis') + X(x + 23 * u + 6, 46, '23', 'sm')),
      en ? 'Sasha gives 5 — both have 23' : 'Саша отдаёт 5 — у обоих по 23']];
  };

  PIC.backwards = function (en) {
    var b = [[10, '?'], [110, '10'], [210, '30']], h = '', i;
    for (i = 0; i < 3; i++) h += R(b[i][0], 18, 42, 28, i === 0 ? 'f2' : 'f1') + X(b[i][0] + 21, 37, b[i][1], 'b mid');
    h += arrow(54, 32, 108) + X(81, 25, '+7', 'sm mid') + arrow(154, 32, 208) + X(181, 25, '×3', 'sm mid');
    h += arrow(208, 66, 154, 'ln accentl') + X(181, 82, '÷3', 'sm mid accent') + arrow(108, 66, 54, 'ln accentl') + X(81, 82, '−7', 'sm mid accent');
    return [[svg(262, 90, h), en ? 'Forwards on top, back along the bottom: 30 ÷ 3 = 10, 10 − 7 = 3'
                                 : 'Вперёд — сверху, назад — снизу: 30 ÷ 3 = 10, 10 − 7 = 3']];
  };

  PIC.charts = function (en) {
    function dots(n, y) { var h = ''; for (var i = 0; i < n; i++) h += C(98 + i * 22, y, 8, 'f2'); return h; }
    return [[svg(210, 84, X(6, 25, en ? 'cats' : 'кошки') + dots(3, 20) + X(6, 55, en ? 'dogs' : 'собаки') + dots(2, 50) +
        C(98, 76, 5, 'f2') + X(108, 80, en ? '= 3 toys' : '= 3 игрушки', 'sm')),
      en ? 'Cats 3 × 3 = 9, dogs 2 × 3 = 6' : 'Кошек 3 × 3 = 9, собак 2 × 3 = 6']];
  };

  PIC.queue = function (en) {
    var h = '', i;
    for (i = 0; i < 5; i++) h += C(24 + i * 36, 22, 12, i === 2 ? 'f2' : 'f1');
    h += X(60, 56, en ? '3rd from the left' : '3-й слева', 'sm mid') + X(132, 56, en ? '3rd from the right' : '3-й справа', 'sm mid');
    return [[svg(190, 64, h), en ? '5 − 3 + 1 = 3' : '5 − 3 + 1 = 3']];
  };

  PIC.shapes = function (en) {
    var pent = [], i;
    for (i = 0; i < 5; i++) {
      var a = (-90 + 72 * i) * Math.PI / 180;
      pent.push((200 + 30 * Math.cos(a)).toFixed(1) + ',' + (40 + 30 * Math.sin(a)).toFixed(1));
    }
    return [[svg(240, 90, P('10,68 40,12 70,68', 'f1') + P('92,14 148,14 148,68 92,68', 'f1') + P(pent.join(' '), 'f1') +
        X(40, 86, '3', 'b mid') + X(120, 86, '4', 'b mid') + X(200, 86, '5', 'b mid')),
      en ? 'As many sides as corners' : 'Сторон столько же, сколько углов']];
  };

  PIC.weighings = function (en) {
    var h = '', g, i, lab = en ? ['on the scales', 'on the scales', 'aside'] : ['на весы', 'на весы', 'в сторону'];
    for (g = 0; g < 3; g++) {
      var x = 8 + g * 84;
      h += R(x, 6, 72, 34, 'none round');
      for (i = 0; i < 3; i++) h += C(x + 16 + i * 20, 23, 8, g === 2 ? 'f3' : 'f2');
      h += X(x + 36, 58, lab[g], 'sm mid');
    }
    return [[svg(262, 66, h), en ? 'Three piles: the scales show which pile has the light coin' : 'Три кучки: весы сразу покажут, в какой лёгкая монета']];
  };

  PIC.remain = function (en) {
    var h = '', g, i;
    for (g = 0; g < 3; g++) {
      h += R(6 + g * 66, 6, 60, 30, 'none round');
      for (i = 0; i < 5; i++) h += C(15 + g * 66 + i * 10.5, 21, 4.5, 'f1');
    }
    h += C(214, 21, 4.5, 'f2') + C(226, 21, 4.5, 'f2');
    return [[svg(240, 44, h), en ? '17 ÷ 5 = 3, remainder 2 — what is left over is always less than 5'
                                 : '17 ÷ 5 = 3 (остаток 2) — остаток всегда меньше пяти']];
  };

  PIC.fast = function (en) {
    var h = '', i;
    for (i = 0; i < 10; i++) h += X(16 + i * 26, 20, String(i + 1), 'b mid');
    for (i = 0; i < 5; i++) {
      var a = 16 + i * 26, b = 16 + (9 - i) * 26, y = 30 + i * 9;
      h += L(a, 26, a, y, 'thin ln') + L(b, 26, b, y, 'thin ln') + L(a, y, b, y, 'thin ln');
    }
    h += X(133, 82, en ? 'each pair = 11' : 'каждая пара = 11', 'sm mid accent');
    return [[svg(266, 88, h), en ? '5 pairs of 11: 5 × 11 = 55' : '5 пар по 11: 5 × 11 = 55']];
  };

  PIC.logic = function (en) {
    var rows = en ? ['Anya', 'Borya', 'Vera'] : ['Аня', 'Боря', 'Вера'], cols = ['🐱', '🐶', '🦜'],
        m = [['✗', '✗', '✓'], ['✓', '✗', '✗'], ['✗', '✓', '✗']], h = '', i, j;
    for (j = 0; j < 3; j++) h += X(92 + j * 40, 18, cols[j], 'mid');
    for (i = 0; i < 3; i++) {
      h += X(6, 44 + i * 26, rows[i]);
      for (j = 0; j < 3; j++) h += R(72 + j * 40, 26 + i * 26, 40, 26, m[i][j] === '✓' ? 'f3' : 'none') +
                                   X(92 + j * 40, 44 + i * 26, m[i][j], 'b mid');
    }
    return [[svg(200, 108, h), en ? 'Each “not” is a ✗; a single empty cell left is a ✓' : 'Каждое «не» — ✗; осталась одна пустая клетка — там ✓']];
  };

  PIC.combo = function (en) {
    var h = '', i, k, d = ['1', '2', '3', '4'];
    for (i = 0; i < 4; i++) {
      var x = 34 + i * 64, rest = d.filter(function (v) { return v !== d[i]; });
      h += C(x, 18, 11, 'f2') + X(x, 23, d[i], 'b mid');
      for (k = 0; k < 3; k++) h += L(x, 29, x - 18 + k * 18, 52, 'thin ln') + X(x - 18 + k * 18, 68, rest[k], 'sm mid');
    }
    return [[svg(262, 76, h), en ? '4 first digits, 3 second digits for each: 4 × 3 = 12' : '4 первые цифры, к каждой по 3 вторые: 4 × 3 = 12']];
  };

  PIC.parity = function (en) {
    function row(y, a, b, c) { return X(10, y, a + ' + ' + b + ' = ' + c, 'b'); }
    return [[svg(210, 80, row(20, en ? 'E' : 'Ч', en ? 'E' : 'Ч', en ? 'E' : 'Ч') + row(46, en ? 'O' : 'Н', en ? 'O' : 'Н', en ? 'E' : 'Ч') +
        row(72, en ? 'E' : 'Ч', en ? 'O' : 'Н', en ? 'O' : 'Н') +
        X(120, 20, '4 + 6 = 10', 'sm') + X(120, 46, '3 + 5 = 8', 'sm') + X(120, 72, '4 + 3 = 7', 'sm')),
      en ? 'E — even, O — odd' : 'Ч — чётное, Н — нечётное']];
  };

  PIC.add = function (en) {
    var h = '', i;
    for (i = 0; i < 5; i++) h += R(10 + i * 12, 8, 9, 50, 'f1');
    for (i = 0; i < 7; i++) h += R(76 + (i % 4) * 12, 8 + Math.floor(i / 4) * 12, 9, 9, 'f2');
    h += X(40, 76, '50', 'sm mid') + X(95, 76, '7', 'sm mid') + X(140, 38, '+', 'b mid');
    for (i = 0; i < 3; i++) h += R(160 + i * 12, 8, 9, 50, 'f1');
    for (i = 0; i < 6; i++) h += R(200 + (i % 3) * 12, 8 + Math.floor(i / 3) * 12, 9, 9, 'f2');
    h += X(176, 76, '30', 'sm mid') + X(212, 76, '6', 'sm mid');
    return [[svg(250, 84, h), en ? 'Tens with tens: 50 + 30 = 80. Ones with ones: 7 + 6 = 13 — a new ten!'
                                 : 'Десятки с десятками: 50 + 30 = 80. Единицы: 7 + 6 = 13 — появился новый десяток!']];
  };

  PIC.units = function (en) {
    var h = L(10, 30, 250, 30), i;
    for (i = 0; i <= 10; i++) h += L(10 + i * 24, 30, 10 + i * 24, i % 5 === 0 ? 14 : 20) + (i % 5 === 0 ? X(10 + i * 24, 48, String(i), 'sm mid') : '');
    h += R(58, 36, 120, 8, 'f2');
    return [[svg(262, 60, h), en ? 'Length on a ruler: end − start = 7 − 2 = 5 cm' : 'Длина по линейке: конец − начало = 7 − 2 = 5 см']];
  };

  PIC.divis = function (en) {
    return [[svg(230, 70, X(10, 24, '4 □ 2', 'b') + X(80, 24, '→ 4 + □ + 2 = 9', 'sm') +
        X(10, 56, '432', 'b accent') + X(80, 56, en ? '→ digit sum 9 ✓' : '→ сумма цифр 9 ✓', 'sm')),
      en ? 'Divisible by 9 ⇔ the digit sum is divisible by 9' : 'Делится на 9 ⇔ сумма цифр делится на 9']];
  };

  PIC.rate = function (en) {
    return [[svg(240, 60, R(8, 12, 60, 30, 'f1') + X(38, 32, '45 ' + (en ? 'min' : 'мин'), 'sm mid') + X(38, 56, '2700 ' + (en ? 'm' : 'м'), 'sm mid') +
        arrow(74, 27, 104) + R(110, 12, 40, 30, 'f2') + X(130, 32, '1 ' + (en ? 'min' : 'мин'), 'sm mid') + X(130, 56, '60 ' + (en ? 'm' : 'м'), 'sm mid') +
        arrow(156, 27, 186) + X(214, 32, '× 120', 'b mid')),
      en ? 'First find “per one”, then multiply' : 'Сначала «на одну», потом умножаем']];
  };

  PIC.beforeafter = function (en) {
    function mug(x, fill) {
      return R(x, 10, 44, 56, 'none') + R(x, 10 + 56 - fill, 44, fill, 'f2') + '<path d="M' + (x + 44) + ' 22 q16 0 16 16 q0 16 -16 16" class="ln"/>';
    }
    return [[svg(220, 92, mug(10, 52) + X(32, 84, '690 ' + (en ? 'g' : 'г'), 'sm mid') + mug(120, 26) + X(142, 84, '465 ' + (en ? 'g' : 'г'), 'sm mid') +
        arrow(80, 40, 112)),
      en ? 'The difference 690 − 465 = 225 g is exactly half the coffee' : 'Разница 690 − 465 = 225 г — это ровно половина кофе']];
  };

  PIC.assume = function (en) {
    var h = '', i;
    for (i = 0; i < 10; i++) h += X(12 + i * 22, 24, '🐔', 'mid emo');
    h += X(10, 46, en ? 'all chickens: 10 × 2 = 20 legs' : 'все куры: 10 × 2 = 20 ног', 'sm');
    h += X(10, 68, en ? 'short by 28 − 20 = 8 → 8 ÷ 2 = 4 🐰' : 'не хватает 28 − 20 = 8 → 8 ÷ 2 = 4 🐰', 'sm accent');
    return [[svg(232, 76, h), en ? 'Each rabbit instead of a chicken adds 2 legs' : 'Каждый кролик вместо курицы добавляет 2 ноги']];
  };

  PIC.pairsums = function (en) {
    return [[svg(170, 110, L(85, 22, 25, 90) + L(85, 22, 145, 90) + L(25, 90, 145, 90) +
        C(85, 22, 14, 'f1') + X(85, 27, 'A', 'b mid') + C(25, 90, 14, 'f1') + X(25, 95, 'B', 'b mid') + C(145, 90, 14, 'f1') + X(145, 95, 'C', 'b mid') +
        R(38, 44, 30, 20, 'f2') + X(53, 59, '15', 'sm mid') + R(102, 44, 30, 20, 'f2') + X(117, 59, '18', 'sm mid') + R(70, 80, 30, 20, 'f2') + X(85, 95, '23', 'sm mid')),
      en ? 'Each letter sits on two lines: the sum of all three counts it twice' : 'Каждая буква стоит на двух линиях: в сумме трёх она посчитана дважды']];
  };

  PIC.search = function (en) {
    // A < B < C, сумма 25: A и B как можно меньше — C получает всё остальное
    var u = 9, x = 30, h = '';
    h += X(4, 26, 'A', 'b') + R(x, 12, 2 * u, 20, 'f1') + X(x + 2 * u + 8, 27, '2', 'sm');
    h += X(4, 54, 'B', 'b') + R(x, 40, 3 * u, 20, 'f1') + X(x + 3 * u + 8, 55, en ? '3 (smallest above 2)' : '3 (меньше нельзя)', 'sm');
    h += X(4, 82, 'C', 'b') + R(x, 68, 20 * u, 20, 'f2') + X(x + 10 * u, 83, '25 − 2 − 3 = 20', 'sm mid');
    return [[svg(250, 94, h), en ? 'Make the others as small as the rules allow — the rest goes to C' : 'Остальные — как можно меньше по условиям, всё остальное достаётся C']];
  };

  PIC.order = function (en) {
    // над знаками — номера шагов: сначала умножение, потом слева направо
    var h = X(130, 44, '20  −  3 × 4  +  6', 'b mid');
    h += C(128, 16, 10, 'f2') + X(128, 20, '1', 'sm mid');
    h += C(84, 16, 10, 'f1') + X(84, 20, '2', 'sm mid');
    h += C(175, 16, 10, 'f1') + X(175, 20, '3', 'sm mid');
    h += L(104, 52, 152, 52, 'fence');
    h += X(130, 76, '20 − 12 + 6 = 8 + 6 = 14', 'sm mid');
    return [[svg(260, 84, h), en ? 'Step 1 — the multiplication, then left to right' : 'Шаг 1 — умножение, потом слева направо']];
  };

  PIC.steps = function (en) {
    var b = [['3 × 18', '54'], ['54 + 25', '79'], ['100 − 79', '21']], h = '', i;
    for (i = 0; i < 3; i++) {
      var x = 6 + i * 92;
      h += R(x, 8, 76, 40, i === 2 ? 'f2' : 'f1') + X(x + 38, 25, b[i][0], 'sm mid') + X(x + 38, 42, '= ' + b[i][1], 'b mid');
      if (i < 2) h += arrow(x + 78, 28, x + 90);
    }
    h += X(44, 66, en ? 'notebooks' : 'тетради', 'sm mid') + X(136, 66, en ? 'purchase' : 'покупка', 'sm mid') + X(228, 66, en ? 'left' : 'осталось', 'sm mid accent');
    return [[svg(276, 72, h), en ? 'A chain of easy steps — each with a label' : 'Цепочка простых шагов — у каждого подпись']];
  };

  PIC.missing = function (en) {
    var h = X(130, 22, '7 × □ − 14 = 35', 'b mid');
    h += R(8, 40, 44, 26, 'f1') + X(30, 58, '35', 'b mid') + arrow(54, 53, 96) + X(75, 46, '+14', 'sm mid accent') +
         R(98, 40, 44, 26, 'f1') + X(120, 58, '49', 'b mid') + arrow(144, 53, 186) + X(165, 46, '÷7', 'sm mid accent') +
         R(188, 40, 44, 26, 'f2') + X(210, 58, '7', 'b mid');
    return [[svg(244, 74, h), en ? 'Undo from the end: −14 becomes +14, ×7 becomes ÷7' : 'Отменяем с конца: −14 → +14, ×7 → ÷7']];
  };

  PIC.crypt = function (en) {
    var h = X(96, 18, '1', 'sm accent') +
      X(110, 34, 'А', 'b mid') + X(110, 54, 'А', 'b mid') + X(110, 74, 'А', 'b mid') + X(76, 54, '+', 'b mid') +
      L(70, 82, 130, 82) + X(92, 102, 'Б', 'b mid') + X(110, 102, 'А', 'b mid');
    h += X(150, 44, en ? '3 × A ends in A' : '3 × А оканчивается на А', 'sm') + X(150, 64, '→ А = 5', 'sm accent') + X(150, 84, '15 → Б = 1', 'sm accent');
    return [[svg(290, 110, h), en ? 'Start with the ones column — and remember the carry' : 'Начинай с единиц — и не забудь перенос']];
  };

  PIC.truth = function (en) {
    var who = en ? ['Anya', 'Borya', 'Vera'] : ['Аня', 'Боря', 'Вера'], m = [['✗', '✓', '✓'], ['✓', '✗', '✓'], ['✓', '✗', '✗']],
        h = X(6, 18, en ? 'if it was…' : 'если взял(а)…', 'sm'), i, j;
    for (j = 0; j < 3; j++) h += X(118 + j * 34, 18, who[j].charAt(0) + ':', 'sm mid');
    h += X(222, 18, en ? 'true' : 'правд', 'sm mid');
    for (i = 0; i < 3; i++) {
      var y = 26 + i * 26, good = i === 2;
      h += R(2, y, 250, 26, good ? 'f3' : 'none') + X(10, y + 18, who[i]);
      for (j = 0; j < 3; j++) h += X(118 + j * 34, y + 18, m[i][j], 'b mid');
      h += X(222, y + 18, String(m[i].filter(function (v) { return v === '✓'; }).length), 'b mid' + (good ? ' accent' : ''));
    }
    return [[svg(256, 108, h), en ? 'Only one option gives exactly one true statement' : 'Ровно одна правда — только в одном варианте']];
  };

  PIC.look = function (en) {
    function house(x, win, door, chim, mark) {
      var h = P((x) + ',40 ' + (x + 28) + ',16 ' + (x + 56) + ',40', 'f2') + R(x + 4, 40, 48, 36, 'f1') +
        R(x + (door ? 32 : 10), 56, 12, 20, 'none') + R(x + (chim ? 38 : 10), 18, 7, 12, 'f2');
      h += R(x + (door ? 10 : 32), 48, 10, 10, 'none');
      if (win === 2) h += R(x + 22, 48, 8, 8, 'none');
      if (mark) h += X(x + 28, 94, mark, 'b mid' + (mark === '✓' ? ' accent' : ''));
      return h;
    }
    return [[svg(290, 100, house(4, 2, true, true, '') + L(70, 10, 70, 90, 'dash') + house(80, 1, true, true, '✗') +
        house(148, 2, false, true, '✗') + house(216, 2, true, true, '✓')),
      en ? 'Check one detail at a time: windows, then the door, then the chimney' : 'Проверяй по одной детали: окна, потом дверь, потом труба']];
  };

  /* ---------------- разметка ---------------- */

  var UI = {
    ru: { btn: '🤔 Мне непонятно — объясни', idea: 'Главная идея', steps: 'Как действовать',
          ex: 'Разберём пример', ans: 'Ответ', trap: 'Частая ошибка', then: 'Теперь попробуй свою задачу тем же способом.' },
    en: { btn: '🤔 I don’t get it — explain', idea: 'The main idea', steps: 'What to do',
          ex: 'A worked example', ans: 'Answer', trap: 'A common mistake', then: 'Now try your problem the same way.' }
  };

  function langOf(lang) {
    if (lang === 'en' || lang === 'ru') return lang;
    return (window.I18N && window.I18N.lang === 'en') ? 'en' : 'ru';
  }

  function keyFor(q) {
    if (!q) return null;
    if (q.theory && LIB[q.theory]) return q.theory;
    if (q.topic && TOPIC[q.topic]) return TOPIC[q.topic];
    if (q.en && q.en.topic && TOPIC[q.en.topic]) return TOPIC[q.en.topic];
    return null;
  }

  function li(arr) { return arr.map(function (s) { return '<li>' + s + '</li>'; }).join(''); }

  function html(key, lang) {
    var L = langOf(lang);
    var e = LIB[key] && LIB[key][L];
    if (!e) return '';
    var u = UI[L];
    var pics = PIC[key] ? PIC[key](L === 'en') : [];
    return '<div class="th-title">📘 ' + e.t + '</div>' +
      '<p class="th-idea"><b>' + u.idea + '.</b> ' + e.idea + '</p>' +
      (pics.length ? '<div class="th-pics">' + pics.map(function (p) {
        return '<figure class="th-fig">' + p[0] + '<figcaption>' + p[1] + '</figcaption></figure>';
      }).join('') + '</div>' : '') +
      '<div class="th-h">' + u.steps + '</div><ol class="th-steps">' + li(e.steps) + '</ol>' +
      '<div class="th-h">' + u.ex + '</div>' +
      '<div class="th-ex"><p class="th-q">' + e.ex.q + '</p><ol>' + li(e.ex.s) + '</ol>' +
        '<p class="th-a"><b>' + u.ans + ':</b> ' + e.ex.a + '</p></div>' +
      (e.trap ? '<p class="th-trap">⚠️ <b>' + u.trap + ':</b> ' + e.trap + '</p>' : '') +
      '<p class="th-then">' + u.then + '</p>';
  }

  function forQuestion(q, lang) {
    var k = keyFor(q);
    return k ? html(k, lang) : '';
  }

  /* Стили свои: блок живёт и в многостраничной версии (quiz.css), и в
     одностраничной сборке, и в Android-приложении. Цвета берутся из
     переменных страницы, если они есть. */
  var CSS =
    '.theory{display:none;margin-top:.6rem;padding:.75rem .9rem;border-radius:10px;' +
      'background:var(--theory-bg,#eef4fb);border:1px solid var(--theory-line,#cfe0ee);' +
      'border-left:4px solid var(--theory-ink,#2980b9);font-size:.9rem;line-height:1.5;color:var(--ink,inherit)}' +
    '.theory.vis{display:block}' +
    '.theory .th-title{font-weight:800;font-size:1rem;margin-bottom:.35rem;color:var(--theory-ink,#2980b9)}' +
    '.theory .th-h{font-weight:800;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;' +
      'margin:.55rem 0 .2rem;color:var(--theory-ink,#2980b9)}' +
    '.theory ol{padding-left:1.3rem;margin:0}' +
    '.theory li{margin:.15rem 0}' +
    '.theory .th-ex{background:var(--card-sunk,rgba(255,255,255,.6));border-radius:8px;padding:.5rem .7rem}' +
    '.theory .th-q{font-weight:700;margin-bottom:.25rem}' +
    '.theory .th-a{margin-top:.3rem}' +
    '.theory .th-trap{margin-top:.55rem}' +
    '.theory .th-then{margin-top:.5rem;font-weight:700}' +
    '.theory-btn{border-color:var(--theory-ink,#2980b9)!important;color:var(--theory-ink,#2980b9)!important}' +
    '.theory .th-pics{display:flex;flex-wrap:wrap;gap:.6rem 1rem;justify-content:center;margin:.6rem 0 .2rem}' +
    '.theory .th-fig{margin:0;text-align:center;max-width:100%;flex:0 1 auto}' +
    '.theory .th-fig svg{max-width:100%;height:auto;display:block;margin:0 auto;overflow:visible}' +
    '.theory figcaption{font-size:.8rem;font-weight:700;max-width:17rem;margin:.25rem auto 0;opacity:.85}' +
    '.theory svg text{fill:currentColor;font:600 13px system-ui,sans-serif}' +
    '.theory svg .b{font-weight:800;font-size:15px}' +
    '.theory svg .sm{font-size:11.5px}' +
    '.theory svg .mid{text-anchor:middle}' +
    '.theory svg .emo{font-size:18px}' +
    '.theory svg .accent{fill:var(--theory-accent,#d35400)}' +
    '.theory svg .ln{stroke:currentColor;stroke-width:1.6;fill:none}' +
    '.theory svg .thin{stroke-width:1}' +
    '.theory svg .hair{stroke:currentColor;stroke-width:.8;opacity:.35}' +
    '.theory svg .solid{fill:currentColor;stroke:none}' +
    '.theory svg .none{fill:none;stroke:currentColor;stroke-width:1.6}' +
    '.theory svg .round{rx:10px}' +
    '.theory svg .f1{fill:rgba(41,128,185,.28);stroke:currentColor;stroke-width:1.4}' +
    '.theory svg .f2{fill:rgba(230,126,34,.45);stroke:currentColor;stroke-width:1.4}' +
    '.theory svg .f3{fill:rgba(39,174,96,.35);stroke:currentColor;stroke-width:1.4}' +
    '.theory svg .faint{fill:rgba(41,128,185,.10);stroke-opacity:.35}' +
    '.theory svg .see{fill-opacity:.55}' +
    '.theory svg .ghost{fill:none;stroke:currentColor;stroke-width:1.4;stroke-dasharray:4 3}' +
    '.theory svg .fence{fill:none;stroke:var(--theory-accent,#d35400);stroke-width:3.5;stroke-dasharray:7 4}' +
    '.theory svg .dash{fill:none;stroke:currentColor;stroke-width:1.4;stroke-dasharray:5 4}' +
    '.theory svg .axis{stroke:var(--theory-accent,#d35400);stroke-width:1.8;stroke-dasharray:6 4}' +
    '.theory svg .accentl{stroke:var(--theory-accent,#d35400)}' +
    '.theory svg .match{stroke:#c0843a;stroke-width:4.5;stroke-linecap:round}' +
    '.theory svg .dough{fill:#f6dca0;stroke:#b07a2a;stroke-width:1.2}' +
    '.theory svg .sauce{fill:#e0664f;stroke:#b07a2a;stroke-width:1.2}' +
    '.theory svg .pep{fill:#a93226;stroke:none}' +
    '.theory svg .crust{fill:none;stroke:#c0843a;stroke-width:4}' +
    '.theory svg .ring{fill:none;stroke:var(--theory-accent,#d35400);stroke-width:2.5;stroke-dasharray:4 3}' +
    '.theory svg .cR{fill:#e74c3c;stroke:currentColor}.theory svg .cB{fill:#3498db;stroke:currentColor}' +
    '.theory svg .cY{fill:#f1c40f;stroke:currentColor}.theory svg .cG{fill:#2ecc71;stroke:currentColor}' +
    '';

  if (typeof document !== 'undefined' && !document.getElementById('theory-css')) {
    var st = document.createElement('style');
    st.id = 'theory-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  var api = {
    keyFor: keyFor,
    html: html,
    forQuestion: forQuestion,
    label: function (lang) { return UI[langOf(lang)].btn; },
    keys: function () { return Object.keys(LIB); },
    topics: TOPIC,
    css: CSS
  };

  if (typeof window !== 'undefined') window.SASMO_THEORY = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
