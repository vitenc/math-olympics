/* День 8 — закономерности I: таблица разностей.
   Поле `en` — то же самое по-английски; движок берёт его, когда выбран
   английский язык (см. assets/i18n.js). Ответы и типы общие. */

window.DAY08 = {
  intro: {
    title: 'Приём дня: таблица разностей',
    body:
      '<p>Увидел ряд чисел — не гадай, а <b>выпиши разности соседних</b> под рядом. ' +
      'Почти всегда ответ виден сразу.</p>' +
      '<div class="mono">ряд:       5   8   13   20   29   ?\n' +
      'разности:    3   5    7    9   ?</div>' +
      '<p>Разности сами образуют ряд 3, 5, 7, 9 — растут на 2. Значит следующая 11, ' +
      'и ответ 29 + 11 = 40.</p>' +
      '<p>Если разности не помогают — проверь <b>умножение</b>: может, каждое следующее ' +
      'число вдвое или втрое больше предыдущего.</p>' +
      '<p>Третий вариант — <b>чередование</b>: два правила по очереди, например +2, &minus;1, +2, &minus;1.</p>',
    en: {
      title: 'Technique of the day: the table of differences',
      body:
        '<p>See a row of numbers? Don\'t guess. <b>Write the differences between neighbours</b> ' +
        'underneath the row. The answer is almost always visible at once.</p>' +
        '<div class="mono">row:          5   8   13   20   29   ?\n' +
        'differences:    3   5    7    9   ?</div>' +
        '<p>The differences form their own row, 3, 5, 7, 9, growing by 2. So the next one is 11, ' +
        'and the answer is 29 + 11 = 40.</p>' +
        '<p>If differences don\'t help, check <b>multiplication</b>: maybe each number is ' +
        'twice or three times the previous one.</p>' +
        '<p>The third option is <b>alternation</b>: two rules taking turns, for example +2, &minus;1, +2, &minus;1.</p>'
    }
  },

  questions: [
    { type: 'mcq', topic: 'Закономерности',
      q: 'Продолжи ряд: 4, 9, 14, 19, ?',
      opts: ['22', '23', '24', '25'], ans: 2,
      hint: 'Разности здесь одинаковые.',
      ex: 'Каждый раз прибавляется 5: 19 + 5 = <b>24</b>.',
      en: { topic: 'Patterns',
        q: 'Continue the sequence: 4, 9, 14, 19, ?',
        hint: 'The differences here are all the same.',
        ex: 'Each time 5 is added: 19 + 5 = <b>24</b>.' } },

    { type: 'mcq', topic: 'Закономерности',
      q: 'Продолжи ряд: 1, 4, 9, 16, ?',
      opts: ['20', '24', '25', '36'], ans: 2,
      hint: 'Попробуй умножить каждое место на само себя: 1×1, 2×2, 3×3…',
      ex: 'Это квадраты: 1×1, 2×2, 3×3, 4×4, значит дальше 5×5 = <b>25</b>. ' +
          'Разности тоже подсказывают: 3, 5, 7, следующая 9 → 16 + 9 = 25.',
      en: { topic: 'Patterns',
        q: 'Continue the sequence: 1, 4, 9, 16, ?',
        hint: 'Try multiplying each position by itself: 1×1, 2×2, 3×3…',
        ex: 'These are squares: 1×1, 2×2, 3×3, 4×4, so next comes 5×5 = <b>25</b>. ' +
            'The differences point the same way: 3, 5, 7, next is 9 → 16 + 9 = 25.' } },

    { type: 'mcq', topic: 'Закономерности',
      q: 'Продолжи ряд: 100, 91, 83, 76, ?',
      opts: ['68', '69', '70', '71'], ans: 2,
      hint: 'Ряд убывает. Выпиши, на сколько именно каждый раз.',
      ex: 'Вычитаются 9, 8, 7 — на единицу меньше каждый раз. Следующее вычитание 6: ' +
          '76 &minus; 6 = <b>70</b>.',
      en: { topic: 'Patterns',
        q: 'Continue the sequence: 100, 91, 83, 76, ?',
        hint: 'The sequence goes down. Write exactly how much it drops each time.',
        ex: 'It drops by 9, 8, 7, one less each time. The next drop is 6: ' +
            '76 &minus; 6 = <b>70</b>.' } },

    { type: 'mcq', topic: 'Закономерности',
      q: 'Продолжи ряд: 2, 6, 18, 54, ?',
      opts: ['108', '152', '162', '216'], ans: 2,
      hint: 'Разности растут слишком быстро — проверь умножение.',
      ex: 'Каждое следующее втрое больше: 54 × 3 = <b>162</b>.',
      en: { topic: 'Patterns',
        q: 'Continue the sequence: 2, 6, 18, 54, ?',
        hint: 'The differences grow too fast. Check multiplication.',
        ex: 'Each number is three times the previous one: 54 × 3 = <b>162</b>.' } },

    { type: 'mcq', topic: 'Закономерности',
      q: 'Продолжи ряд: 3, 5, 4, 6, 5, 7, ?',
      opts: ['5', '6', '8', '9'], ans: 1,
      hint: 'Здесь два правила чередуются. Выпиши разности и посмотри на них через одну.',
      ex: 'Разности: +2, &minus;1, +2, &minus;1, +2 — дальше <b>&minus;1</b>: 7 &minus; 1 = <b>6</b>.',
      en: { topic: 'Patterns',
        q: 'Continue the sequence: 3, 5, 4, 6, 5, 7, ?',
        hint: 'Two rules take turns here. Write the differences and look at every other one.',
        ex: 'Differences: +2, &minus;1, +2, &minus;1, +2, so next is <b>&minus;1</b>: 7 &minus; 1 = <b>6</b>.' } },

    { type: 'open', topic: 'Закономерности',
      q: 'Продолжи ряд: 5, 8, 13, 20, 29, ?',
      ans: 40,
      hint: 'Выпиши разности — они сами образуют ряд.',
      ex: 'Разности: 3, 5, 7, 9 — растут на 2. Следующая 11: 29 + 11 = <b>40</b>.',
      en: { topic: 'Patterns',
        q: 'Continue the sequence: 5, 8, 13, 20, 29, ?',
        hint: 'Write the differences: they form a sequence of their own.',
        ex: 'Differences: 3, 5, 7, 9, growing by 2. The next is 11: 29 + 11 = <b>40</b>.' } },

    { type: 'open', topic: 'Закономерности',
      q: 'В ряду 7, 14, 21, 28, … какое число стоит на 12-м месте?',
      ans: 84,
      hint: 'Это таблица умножения. На каком месте стоит число — на столько и умножай.',
      ex: 'На n-м месте стоит 7 × n. Значит на 12-м: 7 × 12 = <b>84</b>. ' +
          'Считать по одному до 12-го места не нужно — так на олимпиаде теряют время.',
      en: { topic: 'Patterns',
        q: 'In the sequence 7, 14, 21, 28, … which number is in the 12th place?',
        hint: 'This is the times table. Multiply by the position of the number.',
        ex: 'The n-th place holds 7 × n. So the 12th is 7 × 12 = <b>84</b>. ' +
            'No need to count one by one up to the 12th place: that is how time is lost at the olympiad.' } },

    { type: 'open', topic: 'Закономерности',
      q: 'Продолжи ряд: 1, 2, 4, 7, 11, 16, ?',
      ans: 22,
      hint: 'Разности здесь — это просто 1, 2, 3, 4…',
      ex: 'Разности: 1, 2, 3, 4, 5. Следующая 6: 16 + 6 = <b>22</b>.',
      en: { topic: 'Patterns',
        q: 'Continue the sequence: 1, 2, 4, 7, 11, 16, ?',
        hint: 'The differences here are simply 1, 2, 3, 4…',
        ex: 'Differences: 1, 2, 3, 4, 5. The next is 6: 16 + 6 = <b>22</b>.' } },

    { type: 'open', topic: 'Закономерности',
      q: 'В ряду 2, 3, 5, 8, 12, 17, … чему равна сумма двух следующих чисел?',
      ans: 53,
      hint: 'Сначала найди оба следующих числа, и только потом складывай.',
      ex: 'Разности: 1, 2, 3, 4, 5. Дальше +6 → 23, затем +7 → 30. Сумма: 23 + 30 = <b>53</b>.',
      en: { topic: 'Patterns',
        q: 'In the sequence 2, 3, 5, 8, 12, 17, … what is the sum of the next two numbers?',
        hint: 'First find both next numbers, and only then add them.',
        ex: 'Differences: 1, 2, 3, 4, 5. Then +6 → 23, then +7 → 30. Sum: 23 + 30 = <b>53</b>.' } },

    { type: 'open', topic: 'Закономерности',
      q: 'Каждый день Маша откладывает на 2 рубля больше, чем в предыдущий. В первый день она отложила 5 рублей. Сколько рублей она отложит всего за 6 дней?',
      ans: 60,
      hint: 'Выпиши все шесть чисел, а потом складывай парами с краёв.',
      ex: 'По дням: 5, 7, 9, 11, 13, 15. Пары с краёв дают по 20: (5+15), (7+13), (9+11) — ' +
          'три пары. 3 × 20 = <b>60</b> рублей.',
      en: { topic: 'Patterns',
        q: 'Every day Maryam saves 2 dirhams more than the day before. On the first day she saved 5 dirhams. How many dirhams will she save in total over 6 days?',
        hint: 'Write out all six numbers, then add them in pairs from the ends.',
        ex: 'By day: 5, 7, 9, 11, 13, 15. Pairs from the ends give 20 each: (5+15), (7+13), (9+11), ' +
            'three pairs. 3 × 20 = <b>60</b> dirhams.' } }
  ]
};
