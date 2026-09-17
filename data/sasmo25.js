/* SASMO 2025, Primary 3 (Grade 3) — работа целиком.
   Источник: src/G3 v2 - Copy.docx (трёхъязычный буклет EN / KG / RU),
   перенесена задача в задачу. Английский оригинал едет рядом в поле `en`:
   на олимпиаде текст будет английским, и полезно видеть, как он звучит.

   Счёт у SASMO такой же, как у пробных экзаменов программы, поэтому своего
   поля `rules` набор не несёт — работают правила движка по умолчанию:
   15 баллов на старте, секция A (1–15) +2/−1, секция B (16–25) +4/0,
   максимум 85.

   Ответов в буклете нет — каждый посчитан заново, ход решения стоит в `ex`.
   Задачи 3, 6, 12, 14, 16, 17, 22 и 24 без картинки не читаются: рисунки
   вырезаны из того же буклета и лежат в img/sasmo/2025/. Два собраны заново:
   картограмма задачи 17 — из значка буклета с русскими подписями, мишень
   задачи 24 нарисована по размерам оригинала (в буклете она сильно зашумлена
   JPEG-сжатием, и цифры на ней плыли).

   Два места, где мы разошлись с бланком ответов:
     • задача 11 — самая дешёвая покупка 23 билетов стоит 121 доллар,
       а такого варианта в списке нет, поэтому верно «ничего из
       перечисленного». Это не описка переноса: см. разбор;
     • задача 3 и задача 12 — варианты ответа там картинки, а не текст.
       Картинки подписаны A–E на рисунке, а в списке вариантов стоят
       ссылки на эти подписи.                                                */

(function () {

var DIR = 'img/sasmo/2025/';

window.SASMO25 = {
  title: 'SASMO 2025 · 3 класс',

  intro: {
    title: 'SASMO 2025, 3 класс — работа целиком',
    body:
      '<p>Это настоящая работа олимпиады SASMO 2025 для третьего класса: ' +
      '25 задач, 90 минут. Счёт тот же, что на пробных экзаменах программы, ' +
      'значит и тактика та же.</p>' +
      '<ul>' +
      '<li><b>Секция A — задачи 1–15, выбор из пяти вариантов.</b> ' +
      '+2 за верный, <b>−1 за неверный</b>, 0 за пропуск. Не смог вычеркнуть ' +
      'хотя бы два варианта — пропускай.</li>' +
      '<li><b>Секция B — задачи 16–25, ответ числом.</b> +4 за верный, ' +
      'за ошибку не снимают. Пустых ответов быть не должно.</li>' +
      '<li>Пятый вариант «ничего из перечисленного» — не для красоты: ' +
      'в этой работе он один раз оказывается верным.</li>' +
      '</ul>'
  },

  questions: [

  /* ---------- СЕКЦИЯ A · задачи 1–15 · выбор ответа ---------- */

  { type: 'mcq', topic: 'Быстрый счёт',
    q: 'Вычисли сумму:<br>2205 + 2025 + 25',
    opts: ['4255', '4250', '4230', '4000', 'ничего из перечисленного'], ans: 0,
    hint: 'Начни с двух последних слагаемых — 2025 + 25 даёт круглое число.',
    ex: '2025 + 25 = 2050, затем 2205 + 2050 = <b>4255</b>.',
    en: { q: 'Calculate the following sum.<br>2205 + 2025 + 25',
          opts: ['4255', '4250', '4230', '4000', 'None of the above'],
          hint: 'Start with the last two addends — 2025 + 25 is a round number.',
          ex: '2025 + 25 = 2050, then 2205 + 2050 = <b>4255</b>.' } },

  { type: 'mcq', topic: 'Степени',
    q: 'Запись 3⁴ означает, что 3 умножили на себя 4 раза: 3⁴ = 3 × 3 × 3 × 3 = 81. ' +
       'Чему равно 5⁴?',
    opts: ['9', '20', '125', '625', 'ничего из перечисленного'], ans: 3,
    hint: 'Умножай по одному множителю: 5 × 5, потом ещё на 5, потом ещё на 5.',
    ex: '5 × 5 = 25, 25 × 5 = 125, 125 × 5 = <b>625</b>.',
    en: { q: '3⁴ means 3 multiplied by itself 4 times, i.e. 3⁴ = 3 × 3 × 3 × 3 = 81. ' +
             'What is 5⁴ equal to?',
          opts: ['9', '20', '125', '625', 'None of the above'],
          hint: 'Multiply one factor at a time: 5 × 5, then × 5, then × 5.',
          ex: '5 × 5 = 25, 25 × 5 = 125, 125 × 5 = <b>625</b>.' } },

  { type: 'mcq', topic: 'Внимание к деталям',
    img: DIR + 'q03.png',
    q: 'Какая картинка из нижнего ряда в точности такая же, как картинка сверху?',
    opts: ['картинка A', 'картинка B', 'картинка C', 'картинка D', 'картинка E'], ans: 4,
    hint: 'Сравнивай по частям, а не целиком: надпись на косточке, тёмный проём ' +
          'будки, миска, хвост собаки.',
    ex: 'У A на косточке пропала буква «g», у B нет тёмного проёма будки, ' +
        'у C миска пустая, у D у собаки нет хвоста. Совпадает во всём только ' +
        '<b>картинка E</b>.',
    en: { q: 'Which option is exactly the same as the picture above?',
          opts: ['picture A', 'picture B', 'picture C', 'picture D', 'picture E'],
          hint: 'Compare part by part: the word on the bone, the dark doorway, ' +
                'the bowl, the dog’s tail.',
          ex: 'A is missing the letter “g”, B has no dark doorway, C has an empty ' +
              'bowl, D has no tail. Only <b>picture E</b> matches everything.' } },

  { type: 'mcq', topic: 'Закономерности',
    q: 'Какое число следующее в этой последовательности?<br>120, 112, 96, 72, 40, ?',
    opts: ['0', '1', '2', '8', 'ничего из перечисленного'], ans: 0,
    hint: 'Выпиши разности соседних чисел и посмотри на них как на отдельный ряд.',
    ex: 'Разности: 120 − 112 = 8, 112 − 96 = 16, 96 − 72 = 24, 72 − 40 = 32 — ' +
        'каждый раз на 8 больше. Значит вычитаем 40: 40 − 40 = <b>0</b>.',
    en: { q: 'What is the next number in the sequence below?<br>120, 112, 96, 72, 40, ?',
          opts: ['0', '1', '2', '8', 'None of the above'],
          hint: 'Write down the differences and look at them as a sequence of their own.',
          ex: 'The differences are 8, 16, 24, 32 — each 8 more than the last. ' +
              'So subtract 40: 40 − 40 = <b>0</b>.' } },

  { type: 'mcq', topic: 'Очередь',
    q: 'Дети стоят в очереди на школьное собрание. Мия стояла ровно в середине ' +
       'очереди. Потом в конец очереди встали ещё 5 детей, и Мия оказалась ' +
       '11-й с конца. Какая она теперь по счёту с начала очереди?',
    opts: ['5', '6', '7', '11', 'ничего из перечисленного'], ans: 1,
    hint: 'Дети встали в конец, поэтому место Мии с начала не изменилось. ' +
          'А «в середине» значит, что с начала и с конца её номер был одинаковый.',
    ex: 'Пусть сначала Мия была k-й и с начала, и с конца. Пятеро встали ' +
        'позади неё, и с конца стало k + 5 = 11, то есть k = 6. С начала ' +
        'её место не менялось: Мия <b>6</b>-я.',
    en: { q: 'A group of students is lining up in a queue to enter the school ' +
             'assembly. Mia was in the middle of the queue. Then 5 students joined ' +
             'the queue at the back, making Mia the 11th student from the back. ' +
             'What position is Mia from the front of the queue now?',
          opts: ['5', '6', '7', '11', 'None of the above'],
          hint: 'The new students joined the back, so Mia’s place from the front ' +
                'did not change.',
          ex: 'Mia was k-th from both ends. Five joined behind her: k + 5 = 11, ' +
              'so k = 6. She is still <b>6</b>th from the front.' } },

  { type: 'mcq', topic: 'Кубики',
    img: DIR + 'q06.png',
    q: 'Ирфан сложил из одинаковых кубиков фигуру на Рисунке 1 — в углу комнаты. ' +
       'Потом Мэри достроила её до фигуры на Рисунке 2. На сколько кубиков ' +
       'Мэри использовала больше, чем Ирфан? <i>(Пол горизонтальный, две стены ' +
       'вертикальные; за видимыми кубиками нет ни пустот, ни дырок.)</i>',
    opts: ['1', '2', '27', '28', 'ничего из перечисленного'], ans: 0,
    hint: 'Считай по слоям. И перечитай вопрос: спрашивают не сколько кубиков ' +
          'во второй фигуре, а насколько больше положила Мэри, чем Ирфан.',
    ex: 'Рисунок 1 — два слоя: 19 кубиков снизу и 8 сверху, всего 27. ' +
        'Рисунок 2 — пять слоёв: 21, 15, 10, 6 и 3 кубика, всего 55. ' +
        'Ирфан поставил 27 кубиков, Мэри доложила 55 − 27 = 28. ' +
        'Значит Мэри использовала на 28 − 27 = <b>1</b> кубик больше.',
    en: { q: 'Irfan builds Figure 1 in the corner of a room using identical cubes. ' +
             'Then Mary continues building on Irfan’s figure to complete Figure 2. ' +
             'How many more cubes did Mary use than Irfan? <i>(The floor is ' +
             'horizontal and the two walls are vertical. There are no gaps or holes ' +
             'behind the visible cubes.)</i>',
          opts: ['1', '2', '27', '28', 'None of the above'],
          hint: 'Count layer by layer — and read the question again: it asks for ' +
                'the difference between Mary’s cubes and Irfan’s.',
          ex: 'Figure 1 has two layers, 19 + 8 = 27 cubes. Figure 2 has five layers, ' +
              '21 + 15 + 10 + 6 + 3 = 55 cubes. Mary added 55 − 27 = 28, so she used ' +
              '28 − 27 = <b>1</b> cube more than Irfan.' } },

  { type: 'mcq', topic: 'Интервалы',
    /* Схема этажей подсказывает весь ход решения, поэтому она в разборе,
       а не в условии — на олимпиаде её тоже не будет. */
    exfig: 'floors:4',
    q: 'Этан поднимается с 1-го этажа на 4-й за 12 минут. Сколько минут ему ' +
       'понадобится, чтобы подняться с 4-го этажа на 9-й?',
    opts: ['15 минут', '16 минут', '20 минут', '24 минуты', 'ничего из перечисленного'], ans: 2,
    hint: 'Считай не этажи, а пролёты между ними: с 1-го на 4-й — это три пролёта, ' +
          'а не четыре.',
    ex: 'С 1-го на 4-й — 3 пролёта, значит один пролёт занимает 12 : 3 = 4 минуты. ' +
        'С 4-го на 9-й — 5 пролётов: 5 × 4 = <b>20</b> минут.',
    en: { q: 'Ethan takes 12 minutes to walk from the 1st floor to the 4th floor. ' +
             'If he starts from the 4th floor, how many minutes will it take him to ' +
             'reach the 9th floor?',
          opts: ['15 minutes', '16 minutes', '20 minutes', '24 minutes', 'None of the above'],
          hint: 'Count the flights of stairs, not the floors: 1st to 4th is three flights.',
          ex: '1st to 4th is 3 flights, so one flight takes 12 : 3 = 4 minutes. ' +
              '4th to 9th is 5 flights: 5 × 4 = <b>20</b> minutes.' } },

  { type: 'mcq', topic: 'Логика',
    q: 'Хафиз, Джейсон, Эмма и Кумар играли в шахматном турнире, и все заняли ' +
       'разные места. Кумар оказался на одно место выше Эммы. Хафиз занял место ' +
       'сразу за победителем. Кто победил в турнире?',
    opts: ['Хафиз', 'Джейсон', 'Эмма', 'Кумар', 'ничего из перечисленного'], ans: 1,
    hint: 'Из второго условия сразу видно место Хафиза. Дальше пристрой пару ' +
          '«Кумар — Эмма»: они стоят рядом.',
    ex: 'Хафиз — сразу за победителем, значит он второй (и не первый). ' +
        'Кумар и Эмма идут рядом, а из свободных мест 1, 3 и 4 рядом только 3 и 4: ' +
        'Кумар третий, Эмма четвёртая. Первое место остаётся <b>Джейсону</b>.',
    en: { q: 'Hafiz, Jason, Emma and Kumar compete in a chess tournament. Kumar ' +
             'finishes one rank ahead of Emma. Hafiz finishes one rank behind the ' +
             'champion. Who wins the tournament?',
          opts: ['Hafiz', 'Jason', 'Emma', 'Kumar', 'None of the above'],
          hint: 'The second clue fixes Hafiz’s place. Then fit in the Kumar–Emma pair.',
          ex: 'Hafiz is 2nd. Kumar and Emma are next to each other, and of the free ' +
              'places 1, 3, 4 only 3 and 4 are adjacent, so Kumar is 3rd and Emma 4th. ' +
              '<b>Jason</b> wins.' } },

  { type: 'mcq', topic: 'Комбинаторика',
    q: 'Школьная форма бывает четырёх цветов: зелёная, белая, синяя и серая. ' +
       'К форме подбирают либо шорты, либо брюки. Сколько разных комплектов ' +
       'формы можно составить?',
    opts: ['4', '5', '6', '8', 'ничего из перечисленного'], ans: 3,
    hint: 'К каждому цвету — два варианта низа. Сложение тут не подойдёт, нужно ' +
          'умножение.',
    ex: 'На каждый из 4 цветов приходится 2 варианта низа: 4 × 2 = <b>8</b> комплектов.',
    en: { q: 'A school uniform comes in 4 different colours: green, white, blue and ' +
             'grey. The uniform can be paired with either shorts or trousers. How ' +
             'many different uniform combinations are possible?',
          opts: ['4', '5', '6', '8', 'None of the above'],
          hint: 'Each colour goes with two choices of bottom — multiply, don’t add.',
          ex: '4 colours × 2 bottoms = <b>8</b> combinations.' } },

  { type: 'mcq', topic: 'Делимость',
    q: 'Четырёхзначное число 714A делится на 3. Сколько значений может принимать ' +
       'цифра A?',
    opts: ['1', '3', '4', '5', 'ничего из перечисленного'], ans: 2,
    hint: 'Число делится на 3, когда на 3 делится сумма его цифр. Посчитай сумму ' +
          'первых трёх цифр.',
    ex: '7 + 1 + 4 = 12 — уже делится на 3, значит и A должна делиться на 3. ' +
        'Подходят A = 0, 3, 6, 9 — всего <b>4</b> значения.',
    en: { q: 'If the four-digit number 714A is divisible by 3, how many possible ' +
             'values are there for A?',
          opts: ['1', '3', '4', '5', 'None of the above'],
          hint: 'A number is divisible by 3 when its digit sum is. Add the first three digits.',
          ex: '7 + 1 + 4 = 12 is already divisible by 3, so A must be too: ' +
              'A = 0, 3, 6, 9 — <b>4</b> values.' } },

  { type: 'mcq', topic: 'Наименьшая стоимость',
    q: 'В кинотеатре такие цены на билеты:<br>' +
       '1 билет — 6 $<br>6 билетов — 33 $<br>14 билетов — 70 $<br>' +
       'Какая наименьшая сумма (в долларах) нужна, чтобы купить 23 билета?',
    opts: ['138 $', '129 $', '122 $', '120 $', 'ничего из перечисленного'], ans: 4,
    hint: 'Посчитай, сколько стоит один билет в каждом наборе, и набирай 23 билета ' +
          'начиная с самого выгодного. А потом обязательно сверься со списком ' +
          'вариантов.',
    ex: 'Один билет в наборах стоит 70 : 14 = 5 $, 33 : 6 = 5,5 $ и 6 $ — выгоднее ' +
        'всего набор из 14. Берём 14 + 6 + 3 отдельных билета = 23 билета за ' +
        '70 + 33 + 3 × 6 = 121 $. Другие наборы дороже: 14 + 9 отдельных = 124 $, ' +
        '6 + 6 + 6 + 5 отдельных = 129 $, 6 × 4 = 132 $. Самое дешёвое — 121 $, ' +
        'а такого варианта в списке нет, поэтому верно <b>ничего из перечисленного</b>.',
    en: { q: 'A cinema offers the following ticket prices for a movie:<br>' +
             '1 ticket: $6<br>6 tickets: $33<br>14 tickets: $70<br>' +
             'What is the least amount (in $) needed to buy 23 tickets?',
          opts: ['$138', '$129', '$122', '$120', 'None of the above'],
          hint: 'Work out the price per ticket in each deal, then build up 23 tickets ' +
                'from the best deal — and check your total against the options.',
          ex: 'Per ticket the deals cost $5, $5.50 and $6, so the 14-ticket deal is ' +
              'best: 14 + 6 + 3 singles = 23 tickets for 70 + 33 + 18 = $121. Every ' +
              'other mix costs more ($124, $129, $132). $121 is not listed, so the ' +
              'answer is <b>None of the above</b>.' } },

  { type: 'mcq', topic: 'Время',
    img: DIR + 'q12.png',
    q: 'Часы в верхнем ряду показывают время по определённому правилу. ' +
       'Какие часы должны стоять следующими вместо знака вопроса?',
    opts: ['часы A', 'часы B', 'часы C', 'часы D', 'часы E'], ans: 2,
    hint: 'Сначала прочитай время на всех четырёх часах ряда. Короткая стрелка — ' +
          'часовая, длинная — минутная.',
    ex: 'В ряду 12:45, 13:30, 14:15 и 15:00 — каждый раз на 45 минут больше. ' +
        'Дальше 15:00 + 45 минут = 15:45, а это <b>часы C</b> (часовая стрелка ' +
        'почти у 4, минутная — на 9).',
    en: { q: 'The clocks in the top row follow a specific pattern. Which clock should ' +
             'come next in the sequence?',
          opts: ['clock A', 'clock B', 'clock C', 'clock D', 'clock E'],
          hint: 'First read all four clocks in the row. The short hand shows hours.',
          ex: 'The row reads 12:45, 1:30, 2:15, 3:00 — 45 minutes more each time. ' +
              'Next is 3:45, which is <b>clock C</b>.' } },

  { type: 'mcq', topic: 'Перечисление',
    q: 'Сколько целых чисел от 1 до 400 записываются только нечётными цифрами?',
    opts: ['200', '125', '80', '75', 'ничего из перечисленного'], ans: 2,
    hint: 'Разбери отдельно однозначные, двузначные и трёхзначные числа. ' +
          'Нечётных цифр всего пять: 1, 3, 5, 7, 9.',
    ex: 'Однозначные: 1, 3, 5, 7, 9 — 5 чисел. Двузначные: 5 × 5 = 25. ' +
        'Трёхзначные до 400: первая цифра нечётная и меньше 4 — это 1 или 3 ' +
        '(2 варианта), остальные две по 5 вариантов: 2 × 5 × 5 = 50. ' +
        'Всего 5 + 25 + 50 = <b>80</b>.',
    en: { q: 'How many whole numbers from 1 to 400 consist of only odd digits?',
          opts: ['200', '125', '80', '75', 'None of the above'],
          hint: 'Split into 1-digit, 2-digit and 3-digit numbers. There are five odd digits.',
          ex: '1-digit: 5. 2-digit: 5 × 5 = 25. 3-digit below 400: the hundreds digit ' +
              'is 1 or 3, so 2 × 5 × 5 = 50. Total 5 + 25 + 50 = <b>80</b>.' } },

  { type: 'mcq', topic: 'Площадь',
    img: DIR + 'q14.png',
    q: 'Сторона квадрата ABCD равна 12 см. Точки E, F, G и H лежат на сторонах ' +
       'AB, BC, CD и DA, причём AE = BF = GD = HA = 4 см. Какова площадь ' +
       'закрашенной части (в см²)?',
    opts: ['136 см²', '112 см²', '104 см²', '72 см²', 'ничего из перечисленного'], ans: 2,
    hint: 'Закрашенную фигуру считать неудобно, а вот два белых уголка — ' +
          'прямоугольные треугольники, и их площади найти легко.',
    ex: 'Площадь квадрата 12 × 12 = 144 см². Белый уголок у A — треугольник ' +
        'с катетами AE = 4 и AH = 4: площадь 4 × 4 : 2 = 8 см². Белый уголок ' +
        'у C — треугольник с катетами FC = 12 − 4 = 8 и CG = 12 − 4 = 8: ' +
        'площадь 8 × 8 : 2 = 32 см². Закрашено 144 − 8 − 32 = <b>104</b> см².',
    en: { q: 'Square ABCD has a side length of 12 cm. Points E, F, G and H are located ' +
             'on sides AB, BC, CD and DA respectively, such that AE = BF = GD = HA = 4 cm. ' +
             'What is the area (in cm²) of the shaded region?',
          opts: ['136 cm²', '112 cm²', '104 cm²', '72 cm²', 'None of the above'],
          hint: 'Don’t measure the shaded shape — subtract the two white corner triangles.',
          ex: 'The square is 144 cm². The corner at A is 4 × 4 : 2 = 8 cm², the corner ' +
              'at C is 8 × 8 : 2 = 32 cm². Shaded: 144 − 8 − 32 = <b>104</b> cm².' } },

  { type: 'mcq', topic: 'Логика',
    q: 'Четверо детей — Адам, Белла, Чарли и Дэвид — стоят в ряд. У каждого один ' +
       'предмет: книга, линейка, рюкзак или калькулятор.<br>' +
       '1. Адам стоит где-то левее Беллы.<br>' +
       '2. Ребёнок с книгой стоит где-то левее ребёнка с линейкой.<br>' +
       '3. Чарли стоит где-то правее ребёнка с рюкзаком.<br>' +
       '4. Ребёнок с калькулятором стоит где-то правее Чарли.<br>' +
       '5. Дэвид стоит между двумя другими детьми.<br>' +
       '6. Ребёнок с линейкой не стоит между двумя детьми.<br>' +
       'У кого в руках книга?',
    opts: ['у Адама', 'у Беллы', 'у Чарли', 'у Дэвида', 'определить невозможно'], ans: 2,
    hint: 'Начни с условий 6 и 2: они вдвоём прибивают линейку к одному месту. ' +
          'Потом ищи, где может стоять Чарли.',
    ex: 'По условию 6 линейка на краю — на 1-м или 4-м месте, а по условию 2 ' +
        'левее неё есть книга, значит линейка на <b>4-м</b> месте. Тогда калькулятор ' +
        'левее 4-го, но правее Чарли (условие 4) — Чарли не 4-й и не 3-й; ' +
        'а по условию 3 рюкзак левее Чарли, значит Чарли и не 1-й. Остаётся: ' +
        'Чарли 2-й. Дэвид по условию 5 стоит на 2-м или 3-м месте — значит 3-й, ' +
        'и тогда Адам 1-й, Белла 4-я (условие 1). Рюкзак левее Чарли — у Адама, ' +
        'калькулятор правее Чарли — у Дэвида, линейка у Беллы. Книга остаётся ' +
        '<b>у Чарли</b>.',
    en: { q: 'Four children, Adam, Bella, Charlie and David, are standing in a line. ' +
             'Each child holds one item: a book, a ruler, a backpack or a calculator.<br>' +
             '1. Adam is somewhere to the left of Bella.<br>' +
             '2. The child with the book is somewhere to the left of the child with the ruler.<br>' +
             '3. Charlie is somewhere to the right of the child who has the backpack.<br>' +
             '4. The child with the calculator is somewhere to the right of Charlie.<br>' +
             '5. David is standing between two other children.<br>' +
             '6. The child with the ruler is not between two children.<br>' +
             'Which child is holding the book?',
          opts: ['Adam', 'Bella', 'Charlie', 'David', 'Impossible to determine'],
          hint: 'Clues 6 and 2 together pin the ruler to one seat. Then find where ' +
                'Charlie can stand.',
          ex: 'The ruler must be 4th. Then Charlie is 2nd, David 3rd, Adam 1st and ' +
              'Bella 4th; the backpack is Adam’s and the calculator David’s, so the ' +
              'book is <b>Charlie’s</b>.' } },

  /* ---------- СЕКЦИЯ B · задачи 16–25 · открытый ответ ---------- */

  { type: 'open', topic: 'Счёт фигур',
    img: DIR + 'q16.png',
    q: 'Сколько треугольников на рисунке?',
    ans: 15,
    hint: 'Рисунок симметричен относительно длинной горизонтальной линии: ' +
          'посчитай треугольники в верхней половине, столько же будет в нижней, ' +
          'а потом отдельно — те, что лежат сразу в двух половинах.',
    ex: 'В верхней половине 5 треугольников и столько же в нижней — 10. ' +
        'Ещё 5 треугольников лежат сразу в двух половинах: два больших ' +
        '«крыла» (левое и правое), два половинчатых с вершиной справа и ' +
        'треугольник с вершиной слева. Всего <b>15</b>.',
    en: { q: 'How many triangles are there in the figure?',
          hint: 'The figure is symmetric about the long horizontal line — count one ' +
                'half, then the triangles that span both halves.',
          ex: '5 triangles above the line, 5 below, and 5 more spanning both halves: ' +
              '<b>15</b> in total.' } },

  { type: 'open', topic: 'Диаграммы',
    img: DIR + 'q17.png',
    q: 'На картограмме показано, сколько шариков у Уильяма, Софи, Хассана и Аиши. ' +
       'Все вместе они собрали 120 шариков. На сколько шариков у Уильяма больше, ' +
       'чем у Хассана?',
    ans: 30,
    hint: 'Сначала посчитай все значки на картограмме — тогда узнаешь, сколько ' +
          'шариков стоит за одним значком.',
    ex: 'Значков всего 9 + 7 + 3 + 5 = 24, а шариков 120, значит один значок — ' +
        'это 120 : 24 = 5 шариков. У Уильяма 9 значков, у Хассана 3, разница ' +
        '9 − 3 = 6 значков, то есть 6 × 5 = <b>30</b> шариков.',
    en: { q: 'The picture graph shows the number of marbles that William, Sophie, ' +
             'Hassan and Aisha have. Altogether, they have 120 marbles. How many more ' +
             'marbles does William have than Hassan?',
          hint: 'Count all the symbols first — that tells you what one symbol is worth.',
          ex: '9 + 7 + 3 + 5 = 24 symbols for 120 marbles, so one symbol is 5 marbles. ' +
              '(9 − 3) × 5 = <b>30</b>.' } },

  { type: 'open', topic: 'Уравнивание',
    q: 'Сара собрала 50 марок из четырёх стран: Японии, Франции, Италии и Испании. ' +
       'Японских марок у неё на 11 больше, чем французских, и на 3 больше, ' +
       'чем итальянских. Испанских — на 3 больше, чем французских. Сколько ' +
       'японских марок собрала Сара?',
    ans: 18,
    hint: 'Вырази все три остальные страны через японские марки: сколько ' +
          'получится, если из 50 убрать все разницы?',
    ex: 'Французских на 11 меньше японских, итальянских — на 3 меньше, ' +
        'испанских — на 11 − 3 = 8 меньше. Если бы всех марок было столько же, ' +
        'сколько японских, вышло бы 50 + 11 + 3 + 8 = 72, то есть четыре раза ' +
        'по японским. Значит японских 72 : 4 = <b>18</b>. ' +
        'Проверка: 18 + 7 + 15 + 10 = 50.',
    en: { q: 'Sarah collected 50 stamps from four different countries: Japan, France, ' +
             'Italy and Spain. She collected 11 more Japanese stamps than French, ' +
             '3 more Japanese than Italian, and 3 more Spanish than French. How many ' +
             'Japanese stamps did Sarah collect?',
          hint: 'Express every country through the Japanese count.',
          ex: 'French is 11 fewer, Italian 3 fewer, Spanish 8 fewer. So ' +
              '50 + 11 + 3 + 8 = 72 = 4 × Japanese, giving <b>18</b>.' } },

  { type: 'open', topic: 'Перебор',
    q: 'На полке 43 книги трёх видов: детективы, научные и исторические. ' +
       'Детективов в 9 раз больше, чем научных. Научных книг больше, чем ' +
       'исторических. Сколько на полке детективов?',
    ans: 36,
    hint: 'Перебирай число научных книг: 1, 2, 3, … — и каждый раз проверяй, ' +
          'остаётся ли исторических меньше, чем научных.',
    ex: 'Если научных n, то детективов 9n, а исторических 43 − 10n. ' +
        'При n = 1, 2, 3 исторических 33, 23, 13 — больше научных, не подходит. ' +
        'При n = 4 исторических 43 − 40 = 3, и 4 > 3 — годится. ' +
        'При n = 5 книг уже не хватает. Значит детективов 9 × 4 = <b>36</b>.',
    en: { q: 'There are 3 different types of books on a shelf. The total number of ' +
             'books is 43. The number of mystery books is 9 times the number of science ' +
             'books. If there are more science books than history books, how many ' +
             'mystery books are there?',
          hint: 'Try 1, 2, 3, … science books and check the history count each time.',
          ex: 'With n science books there are 9n mystery and 43 − 10n history. ' +
              'Only n = 4 gives fewer history (3) than science (4), so mystery = ' +
              '9 × 4 = <b>36</b>.' } },

  { type: 'open', topic: 'Метод предположения',
    q: 'Даниэль купил 4 тетради, 5 ручек и 6 ластиков за 43 $. Тетрадь и ручка ' +
       'вместе стоят 7 $, ручка и ластик вместе — 5 $. Сколько долларов стоит ' +
       'одна тетрадь?',
    ans: 4,
    hint: 'Обозначь цену ручки и вырази через неё тетрадь и ластик — тогда в ' +
          'большой покупке останется одно неизвестное.',
    ex: 'Если ручка стоит p, то тетрадь 7 − p, а ластик 5 − p. Тогда ' +
        '4(7 − p) + 5p + 6(5 − p) = 28 − 4p + 5p + 30 − 6p = 58 − 5p = 43, ' +
        'значит 5p = 15 и p = 3. Тетрадь стоит 7 − 3 = <b>4</b> доллара.',
    en: { q: 'Daniel bought 4 notebooks, 5 pens and 6 erasers for $43. A notebook and ' +
             'a pen together cost $7. A pen and an eraser together cost $5. How much ' +
             '(in $) does a notebook cost?',
          hint: 'Call the pen p and write the notebook and eraser in terms of p.',
          ex: '4(7 − p) + 5p + 6(5 − p) = 58 − 5p = 43, so p = 3 and a notebook ' +
              'costs <b>4</b> dollars.' } },

  { type: 'open', topic: 'Остатки',
    q: 'Все 60 яблок разложили в корзины двух размеров: в маленькую входит ' +
       '5 яблок, в большую — 7. Корзин каждого вида взяли хотя бы по одной, ' +
       'и все корзины заполнены доверху. Сколько взяли маленьких корзин?',
    ans: 5,
    hint: 'Число яблок в больших корзинах должно давать остаток 0 при вычитании ' +
          'из 60 и делиться на 5. Перебирай число больших корзин.',
    ex: 'Пусть больших корзин b. Тогда 60 − 7b должно делиться на 5, то есть ' +
        '7b должно давать остаток 0 при делении на 5 — значит b кратно 5. ' +
        'Подходит только b = 5 (при b = 10 яблок уже 70, это больше 60): ' +
        '7 × 5 = 35 яблок в больших корзинах, остаётся 60 − 35 = 25 яблок, ' +
        'то есть 25 : 5 = <b>5</b> маленьких корзин.',
    en: { q: 'A total of 60 apples are packed into two different basket sizes. The ' +
             'small basket holds 5 apples, the large one 7. Both kinds of basket are ' +
             'used, and all baskets are completely filled. How many small baskets are used?',
          hint: 'Try the number of large baskets — what is left must divide by 5.',
          ex: '60 − 7b must be a multiple of 5, so b is a multiple of 5. Only b = 5 ' +
              'fits: 60 − 35 = 25 apples, i.e. <b>5</b> small baskets.' } },

  { type: 'open', topic: 'Криптарифмы',
    img: DIR + 'q22.png',
    q: 'Каждая картинка на рисунке — это одно и то же число во всех трёх строках. ' +
       'Чему равна ракета?',
    ans: 7,
    hint: 'Третья строка говорит, что грузовик и джойстик в произведении дают 54, ' +
          'а вторая — что они отличаются на 3. Найди эту пару.',
    ex: 'Из второй и третьей строк: джойстик на 3 больше грузовика, а их ' +
        'произведение 54. Подходит только 6 и 9 — грузовик 6, джойстик 9 ' +
        '(6 × 9 = 54 и 9 − 6 = 3). Подставляем в первую строку: ' +
        'ракета × 6 + 9 = 51, значит ракета × 6 = 42 и ракета = <b>7</b>.',
    en: { q: 'Each picture stands for the same number in all three lines. ' +
             'What is the rocket equal to?',
          hint: 'The controller is 3 more than the truck and their product is 54.',
          ex: 'Truck = 6, controller = 9. Then rocket × 6 + 9 = 51, so ' +
              'rocket = <b>7</b>.' } },

  { type: 'open', topic: 'Быстрый счёт',
    q: 'Чему равна сумма первых 45 чисел этой последовательности?<br>' +
       '70, 69, 68, 67, 66, …',
    ans: 2160,
    hint: 'Найди сначала 45-е число. Дальше складывай парами: первое с последним, ' +
          'второе с предпоследним — суммы получатся одинаковые.',
    ex: 'Каждое следующее число на 1 меньше, поэтому 45-е равно 70 − 44 = 26. ' +
        'Первое и последнее вместе дают 70 + 26 = 96, и таких пар 45 : 2. ' +
        'Сумма равна 96 × 45 : 2 = <b>2160</b>.',
    en: { q: 'What is the sum of the first 45 numbers of the following pattern?<br>' +
             '70, 69, 68, 67, 66, …',
          hint: 'Find the 45th term first, then pair the first with the last.',
          ex: 'The 45th term is 70 − 44 = 26, so the sum is 96 × 45 : 2 = <b>2160</b>.' } },

  { type: 'open', topic: 'Перечисление',
    img: DIR + 'q24.png',
    q: 'Кларибель бросает в мишень четыре дротика, и каждый попадает в какую-то ' +
       'из областей — за неё дают 1, 5, 9 или 13 очков. Например, 52 очка в сумме ' +
       'набрать можно, а 1 очко — нельзя. Сколько разных целых сумм очков может ' +
       'получиться у Кларибель?',
    ans: 13,
    hint: 'Все числа на мишени дают остаток 1 при делении на 4. Запиши каждое как ' +
          '1 плюс несколько четвёрок — и посмотри, сколько четвёрок может выйти ' +
          'на четырёх дротиках.',
    ex: 'Очки на мишени — это 1 + 0 × 4, 1 + 1 × 4, 1 + 2 × 4 и 1 + 3 × 4. ' +
        'За четыре дротика единицы дают 4 очка, а четвёрок набирается от 0 до ' +
        '3 + 3 + 3 + 3 = 12, и любое число от 0 до 12 набрать можно. Значит сумма ' +
        'равна 4 + 4k, где k = 0, 1, …, 12 — это 4, 8, 12, …, 52, всего ' +
        '<b>13</b> разных сумм.',
    en: { q: 'Claribel throws four darts at the target shown, each dart landing in a ' +
             'region worth 1, 5, 9 or 13 points. For example she can score 52 points ' +
             'in total, but she cannot score 1 point. How many whole numbers can be ' +
             'her total score?',
          hint: 'Every score is 1 more than a multiple of 4.',
          ex: 'Each dart scores 1 + 4m with m = 0…3, so the total is 4 + 4k with ' +
              'k = 0…12 — that is 4, 8, …, 52, i.e. <b>13</b> different totals.' } },

  { type: 'open', topic: 'Делимость',
    q: 'Дети сели за круглый стол; места пронумерованы подряд от 1 до числа, ' +
       'меньшего 40. Райан сидел ровно напротив Даниэля, номера их мест делились ' +
       'на 7, и ни один из них не занимал место с самым большим номером. ' +
       'Сколько детей сидело за столом?',
    ans: 28,
    hint: 'Если за столом n мест, то номера напротив различаются ровно на n : 2. ' +
          'А разница двух чисел, кратных 7, тоже кратна 7.',
    ex: 'Места напротив различаются на n : 2, значит n чётное. Оба номера кратны 7, ' +
        'поэтому и их разница n : 2 кратна 7. При n < 40 это даёт n : 2 = 7 или 14, ' +
        'то есть n = 14 или n = 28. При n = 14 кратны 7 только места 7 и 14, ' +
        'но 14 — самый большой номер, а его занимать нельзя. При n = 28 подходит ' +
        'пара 7 и 21: разница 14 = 28 : 2, и место 28 свободно. Значит за столом ' +
        '<b>28</b> детей.',
    en: { q: 'A group of students sat around a circular table, with their seats ' +
             'numbered consecutively from 1 to a number less than 40. Ryan sat directly ' +
             'opposite Daniel, and both seat numbers were multiples of 7. Neither Ryan ' +
             'nor Daniel occupied the highest-numbered seat. How many students were ' +
             'seated around the table?',
          hint: 'Opposite seats differ by n : 2, and the difference of two multiples ' +
                'of 7 is a multiple of 7.',
          ex: 'n : 2 must be a multiple of 7, so n = 14 or 28. n = 14 fails because ' +
              'seat 14 is the highest; n = 28 works with seats 7 and 21. Answer: ' +
              '<b>28</b>.' } }

  ]
};

})();
