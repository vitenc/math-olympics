/* ==========================================================================
   Демо-режим: образец прогресса для показа

   index.html?demo=1 включает демо (флаг ставит assets/i18n.js) и вызывает
   DEMO.seed(PLAN). Движок в демо-режиме держит прогресс и журнал ошибок под
   ключами с приставкой «demo.», поэтому настоящие результаты ребёнка не
   затрагиваются, а выход через ?demo=0 возвращает их на место.

   Образец: 19 пройденных дней, сданный первый экзамен, начатый день 22
   и четыре задачи в журнале ошибок — настоящие задачи из наборов,
   с переводом, чтобы журнал открывался и по-английски.
   ========================================================================== */

window.DEMO = (function () {
  'use strict';

  /* дата в формате движка: дд.мм, отсчёт назад от сегодняшнего дня */
  function ago(days) {
    var d = new Date();
    d.setDate(d.getDate() - days);
    return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0');
  }

  /* [id, верных, всего] — прогресс правдоподобный, не идеальный */
  var DAYS = [
    ['day01', 17, 25], ['day02', 8, 10], ['day03', 9, 10], ['day04', 7, 10],
    ['day05', 9, 10], ['day06', 8, 10], ['day07', 12, 15], ['day08', 10, 10],
    ['day09', 8, 10], ['day10', 7, 10], ['day11', 9, 10], ['day12', 9, 10],
    ['day13', 8, 10], ['day14', 14, 15], ['day15', 9, 10], ['day16', 8, 10],
    ['day17', 9, 10], ['day18', 10, 10], ['day19', 8, 10]
  ];

  function answers(ok, total) {
    var a = {};
    for (var i = 0; i < total; i++) a[i] = { g: null, ok: i < ok };
    return a;
  }

  function seed(plan) {
    var S = window.SASMO;
    if (!S || !plan) return;

    var progress = {};
    DAYS.forEach(function (d, i) {
      progress[d[0]] = {
        answers: answers(d[1], d[2]), ok: d[1], no: d[2] - d[1], total: d[2],
        date: ago(DAYS.length + 1 - i), done: true
      };
    });
    progress.exam1 = { answers: answers(19, 25), ok: 19, no: 6, total: 25, date: ago(1), done: true, score: 63 };
    progress.day22 = { answers: answers(2, 3), ok: 2, no: 1, total: 10, date: ago(0) };

    var now = Date.now();
    var errors = [
      { key: 'day10#2', setId: 'day10', idx: 2, ts: now - 9 * 864e5, type: 'mcq', topic: 'Криптарифмы',
        q: 'В примере A3 + 2B = 71 буквы A и B обозначают цифры. Чему равна сумма A + B?',
        opts: ['10', '11', '12', '13'], ans: 2,
        hint: 'Распиши оба числа по разрядам и собери всё, что известно.',
        ex: '(10A + 3) + (20 + B) = 10A + B + 23 = 71, значит 10A + B = 48. ' +
            'Отсюда A = 4, B = 8 и A + B = <b>12</b>. Проверка: 43 + 28 = 71. ✓',
        en: { topic: 'Cryptarithms',
          q: 'In the sum A3 + 2B = 71 the letters A and B stand for digits. What is A + B?',
          hint: 'Write both numbers by place value and collect everything you know.',
          ex: '(10A + 3) + (20 + B) = 10A + B + 23 = 71, so 10A + B = 48. ' +
              'Hence A = 4, B = 8 and A + B = <b>12</b>. Check: 43 + 28 = 71. ✓' } },
      { key: 'day13#0', setId: 'day13', idx: 0, ts: now - 6 * 864e5, type: 'mcq', topic: 'Комбинаторика',
        q: 'Сколько различных двузначных чисел можно составить из цифр 1, 2 и 3, если цифры в числе не повторяются?',
        opts: ['3', '6', '9', '12'], ans: 1,
        hint: 'Первую цифру можно выбрать тремя способами, вторую — двумя.',
        ex: '3 × 2 = <b>6</b>: 12, 13, 21, 23, 31, 32.',
        en: { topic: 'Combinatorics',
          q: 'How many different two-digit numbers can be made from the digits 1, 2 and 3 if no digit repeats?',
          hint: 'The first digit can be chosen in three ways, the second in two.',
          ex: '3 × 2 = <b>6</b>: 12, 13, 21, 23, 31, 32.' } },
      { key: 'day16#0', setId: 'day16', idx: 0, ts: now - 3 * 864e5, type: 'mcq', topic: 'Счёт фигур',
        q: 'Квадрат разделён на сетку 3 на 3 клетки. Сколько всего квадратов можно найти на этом рисунке?',
        opts: ['9', '13', '14', '15'], ans: 2, fig: 'grid:3,3',
        hint: 'Кроме девяти клеток есть квадраты 2×2 и один большой.',
        ex: 'Клеток 9, квадратов 2×2 — 4, большой — 1. Всего 9 + 4 + 1 = <b>14</b>.',
        en: { topic: 'Counting figures',
          q: 'A square is divided into a 3 by 3 grid. How many squares can be found in this picture altogether?',
          hint: 'Besides the nine cells there are 2×2 squares and one big one.',
          ex: '9 cells, four 2×2 squares, one big square. In total 9 + 4 + 1 = <b>14</b>.' } },
      { key: 'day19#0', setId: 'day19', idx: 0, ts: now - 1 * 864e5, type: 'mcq', topic: 'Интервалы',
        q: 'Вдоль дороги длиной 100 м поставили столбы через каждые 10 м, от самого начала до самого конца. Сколько поставили столбов?',
        opts: ['10', '11', '12', '20'], ans: 1, fig: 'posts:100,10',
        hint: 'Сначала промежутки, потом прибавь один.',
        ex: 'Промежутков: 100 ÷ 10 = 10. Столбов на один больше: <b>11</b>.',
        en: { topic: 'Intervals',
          q: 'Posts were placed along a 100 m road every 10 m, from the very start to the very end. How many posts were placed?',
          hint: 'Intervals first, then add one.',
          ex: 'Intervals: 100 ÷ 10 = 10. One more post than that: <b>11</b>.' } }
    ];

    S.saveProgress(progress);
    S.saveErrors(errors);
  }

  return { seed: seed };
})();
