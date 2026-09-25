/* День 22 — метод предположения («куры и кролики») и средние. */

window.DAY22 = {
  intro: {
    title: 'Приём дня: допущение и поправка',
    en: { title: 'Technique of the day: assume, then correct',
      body: '<p>Problem: a cage holds chickens and rabbits, <b>10 heads</b> and <b>28 legs</b> in all. How many rabbits are there?</p><p>The technique takes three steps:</p><ol><li><b>Assume the extreme case.</b> Say all ten are chickens. Then there are 10 × 2 = 20 legs.</li><li><b>Find the shortfall.</b> There are really 28 legs, so 28 &minus; 20 = 8 are missing.</li><li><b>Divide by the “price of a swap”.</b> Each time a chicken is swapped for a rabbit, 4 &minus; 2 = 2 legs are added. So there are 8 ÷ 2 = <b>4</b> rabbits.</li></ol><p>Check: 4 rabbits with 4 legs make 16, and 6 chickens with 2 legs make 12. Together 28. ✓</p><p>The <b>average</b> means “if shared out equally”. The key formula works both ways: <b>sum = average × count</b>.</p>' },
    body:
      '<p>Задача: в клетке куры и кролики, всего <b>10 голов</b> и <b>28 ног</b>. ' +
      'Сколько кроликов?</p>' +
      '<p>Приём в три шага:</p>' +
      '<ol>' +
      '<li><b>Предположи крайний случай.</b> Пусть все десять — куры. Тогда ног ' +
      '10 × 2 = 20.</li>' +
      '<li><b>Найди нехватку.</b> Настоящих ног 28, не хватает 28 &minus; 20 = 8.</li>' +
      '<li><b>Раздели на «цену замены».</b> Каждая замена курицы на кролика добавляет ' +
      '4 &minus; 2 = 2 ноги. Значит кроликов 8 ÷ 2 = <b>4</b>.</li>' +
      '</ol>' +
      '<p>Проверка: 4 кролика по 4 ноги — 16, и 6 кур по 2 ноги — 12. Вместе 28. ✓</p>' +
      '<p><b>Среднее</b> — это «если поделить поровну». Главная формула ' +
      'работает в обе стороны: <b>сумма = среднее × количество</b>.</p>'
  },

  questions: [
    { type: 'mcq', topic: 'Метод предположения',
      q: 'В клетке сидят куры и кролики: всего 10 голов и 28 ног. Сколько в клетке кроликов?',
      opts: ['3', '4', '6', '8'], ans: 1,
      hint: 'Предположи, что все десять — куры, и посчитай, сколько ног не хватает.',
      ex: 'Если все куры: 10 × 2 = 20 ног, не хватает 8. Каждая замена добавляет 2 ноги: ' +
          '8 ÷ 2 = <b>4</b> кролика. Проверка: 4 × 4 + 6 × 2 = 28. ✓',
      en: { topic: 'Assumption method',
        q: 'A cage holds chickens and rabbits: 10 heads and 28 legs in all. How many rabbits are in the cage?',
        hint: 'Assume all ten are chickens and work out how many legs are missing.',
        ex: 'If all are chickens: 10 × 2 = 20 legs, 8 are missing. Each swap adds 2 legs: 8 ÷ 2 = <b>4</b> rabbits. Check: 4 × 4 + 6 × 2 = 28. ✓' } },

    { type: 'mcq', topic: 'Метод предположения',
      q: 'У Пети 12 монет по 5 и по 10 рублей на общую сумму 95 рублей. Сколько у него монет по 10 рублей?',
      opts: ['5', '6', '7', '8'], ans: 2,
      hint: 'Предположи, что все монеты пятирублёвые, и посчитай нехватку.',
      ex: 'Если все по 5: 12 × 5 = 60 рублей, не хватает 35. Каждая замена добавляет 5 рублей: ' +
          '35 ÷ 5 = <b>7</b> монет по 10. Проверка: 7 × 10 + 5 × 5 = 95. ✓',
      en: { topic: 'Assumption method',
        q: 'Yusuf has 12 notes of 5 and 10 dirhams worth 95 dirhams in total. How many 10-dirham notes does he have?',
        hint: 'Assume all the notes are 5-dirham notes and work out the shortfall.',
        ex: 'If all are 5s: 12 × 5 = 60 dirhams, 35 are missing. Each swap adds 5 dirhams: 35 ÷ 5 = <b>7</b> ten-dirham notes. Check: 7 × 10 + 5 × 5 = 95. ✓' } },

    { type: 'mcq', topic: 'Среднее',
      q: 'Среднее трёх чисел равно 12. Чему равна их сумма?',
      opts: ['4', '15', '36', '48'], ans: 2,
      hint: 'Сумма равна среднему, умноженному на количество.',
      ex: '12 × 3 = <b>36</b>.',
      en: { topic: 'Average',
        q: 'The average of three numbers is 12. What is their sum?',
        hint: 'The sum equals the average times the count.',
        ex: '12 × 3 = <b>36</b>.' } },

    { type: 'mcq', topic: 'Среднее',
      q: 'За четыре контрольные средний балл Пети равен 4. Сколько всего баллов он набрал?',
      opts: ['8', '12', '16', '20'], ans: 2,
      hint: 'Та же формула: сумма = среднее × количество.',
      ex: '4 × 4 = <b>16</b> баллов.',
      en: { topic: 'Average',
        q: 'Over four quizzes Yusuf’s average mark is 4. How many marks did he get in total?',
        hint: 'The same formula: sum = average × count.',
        ex: '4 × 4 = <b>16</b> marks.' } },

    { type: 'mcq', topic: 'Метод предположения',
      q: 'В мастерской стоят двухколёсные велосипеды и трёхколёсные самокаты — всего 9 штук и 21 колесо. Сколько трёхколёсных самокатов?',
      opts: ['3', '4', '5', '6'], ans: 0,
      hint: 'Предположи, что всё — велосипеды. Сколько колёс не хватает?',
      ex: 'Если все велосипеды: 9 × 2 = 18 колёс, не хватает 3. Каждый самокат добавляет ' +
          'одно колесо: 3 ÷ 1 = <b>3</b> самоката. Проверка: 3 × 3 + 6 × 2 = 21. ✓',
      en: { topic: 'Assumption method',
        q: 'A workshop has two-wheeled bicycles and three-wheeled scooters: 9 of them and 21 wheels in all. How many three-wheeled scooters are there?',
        hint: 'Assume they are all bicycles. How many wheels are missing?',
        ex: 'If all are bicycles: 9 × 2 = 18 wheels, 3 are missing. Each scooter adds one wheel: 3 ÷ 1 = <b>3</b> scooters. Check: 3 × 3 + 6 × 2 = 21. ✓' } },

    { type: 'open', topic: 'Метод предположения',
      q: 'В банке сидят пауки (по 8 ног) и жуки (по 6 ног) — всего 8 существ и 54 ноги. Сколько там пауков?',
      ans: 3,
      hint: 'Предположи, что все — жуки, у них ног меньше.',
      ex: 'Если все жуки: 8 × 6 = 48 ног, не хватает 6. Каждый паук добавляет 2 ноги: ' +
          '6 ÷ 2 = <b>3</b> паука. Проверка: 3 × 8 + 5 × 6 = 54. ✓',
      en: { topic: 'Assumption method',
        q: 'A jar holds spiders (8 legs each) and beetles (6 legs each): 8 creatures and 54 legs in all. How many spiders are there?',
        hint: 'Assume they are all beetles, which have fewer legs.',
        ex: 'If all are beetles: 8 × 6 = 48 legs, 6 are missing. Each spider adds 2 legs: 6 ÷ 2 = <b>3</b> spiders. Check: 3 × 8 + 5 × 6 = 54. ✓' } },

    { type: 'open', topic: 'Метод предположения',
      q: 'На ферме куры и коровы — всего 20 голов и 56 ног. Сколько на ферме коров?',
      ans: 8,
      hint: 'Все куры → 40 ног. Сколько не хватает и сколько добавляет одна корова?',
      ex: 'Если все куры: 20 × 2 = 40 ног, не хватает 16. Каждая корова добавляет 2 ноги: ' +
          '16 ÷ 2 = <b>8</b> коров. Проверка: 8 × 4 + 12 × 2 = 56. ✓',
      en: { topic: 'Assumption method',
        q: 'A farm has chickens and cows: 20 heads and 56 legs in all. How many cows are on the farm?',
        hint: 'All chickens → 40 legs. How many are missing, and how many does one cow add?',
        ex: 'If all are chickens: 20 × 2 = 40 legs, 16 are missing. Each cow adds 2 legs: 16 ÷ 2 = <b>8</b> cows. Check: 8 × 4 + 12 × 2 = 56. ✓' } },

    { type: 'open', topic: 'Среднее',
      q: 'Среднее пяти чисел равно 14. Четыре из них: 10, 12, 15 и 18. Чему равно пятое число?',
      ans: 15,
      hint: 'Найди сумму всех пяти и вычти сумму известных четырёх.',
      ex: 'Сумма всех: 14 × 5 = 70. Сумма известных: 10 + 12 + 15 + 18 = 55. ' +
          'Пятое: 70 &minus; 55 = <b>15</b>.',
      en: { topic: 'Average',
        q: 'The average of five numbers is 14. Four of them are 10, 12, 15 and 18. What is the fifth number?',
        hint: 'Find the sum of all five and subtract the sum of the four you know.',
        ex: 'Sum of all: 14 × 5 = 70. Sum of the known ones: 10 + 12 + 15 + 18 = 55. The fifth: 70 &minus; 55 = <b>15</b>.' } },

    { type: 'open', topic: 'Метод предположения',
      q: 'В тесте 20 вопросов: за верный ответ дают 5 баллов, за неверный снимают 2. Ученик ответил на все вопросы и набрал 79 баллов. Сколько у него верных ответов?',
      ans: 17,
      hint: 'Предположи, что все ответы верные. Сколько баллов теряется на каждом неверном?',
      ex: 'Если все верные: 20 × 5 = 100 баллов. Не хватает 100 &minus; 79 = 21. ' +
          'Каждый неверный ответ стоит 5 + 2 = 7 баллов: 21 ÷ 7 = 3 неверных. ' +
          'Верных: 20 &minus; 3 = <b>17</b>. Проверка: 17 × 5 &minus; 3 × 2 = 79. ✓',
      en: { topic: 'Assumption method',
        q: 'A test has 20 questions: a correct answer earns 5 points and a wrong one loses 2. A pupil answered every question and scored 79 points. How many correct answers did the pupil give?',
        hint: 'Assume every answer is correct. How many points does each wrong answer cost?',
        ex: 'If all are correct: 20 × 5 = 100 points. That is 100 &minus; 79 = 21 too many. Each wrong answer costs 5 + 2 = 7 points: 21 ÷ 7 = 3 wrong. Correct: 20 &minus; 3 = <b>17</b>. Check: 17 × 5 &minus; 3 × 2 = 79. ✓' } },

    { type: 'open', topic: 'Среднее',
      q: 'Среднее двух чисел равно 25, а одно из них равно 18. Чему равно другое число?',
      ans: 32,
      hint: 'Сначала найди сумму обоих чисел.',
      ex: 'Сумма: 25 × 2 = 50. Другое число: 50 &minus; 18 = <b>32</b>.',
      en: { topic: 'Average',
        q: 'The average of two numbers is 25, and one of them is 18. What is the other number?',
        hint: 'First find the sum of both numbers.',
        ex: 'Sum: 25 × 2 = 50. The other number: 50 &minus; 18 = <b>32</b>.' } }
  ]
};
