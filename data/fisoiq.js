/* FISO (Future Intelligence Student Olympiad), 3–4 класс, категория 2 —
   примерные IQ-задания, работа целиком. Источник:
   src/FISO_IQ_3-4_класс_Категория_2.pdf (две страницы, английский и русский текст).

   10 задач с выбором из четырёх вариантов. Цен задач FISO не публикует,
   поэтому счёт условный, как у data/fiso26.js: по 4 балла, штрафов нет.
   Время работы — 20 минут, предположение: в листке его нет.

   Ключа в листке нет — каждый ответ посчитан заново, ход решения в `ex`.
     №1  — справа от фигурной скобки в листке пусто: числа, которые
           соответствуют словам, потеряны при вёрстке. Без них задача не
           решается, поэтому коды трёх слов дописаны в условие (HAP = 376,
           PAH = 673, POB = 619) — так, чтобы ответ остался среди вариантов.
     №2  — помечена `skip`: по рисунку не видно, есть ли кубики, скрытые
           за передними, и ответ однозначно не восстанавливается. Рисунок
           вырезан из чужой картинки (турецкий сборник) с пятью вариантами,
           в листке их четыре. В счёт задача не идёт, максимум — 36.
     №6  — ряд 1, 4, 16, 25 — квадраты чисел 1, 2, 4, 5; основания растут
           на +1, +2, +1, +2, следующее — 7, ответ 49.
   Варианты №3 — картинки (q03a…q03d). */

(function () {

var DIR = 'img/fiso/iq/';

function pic(name) {
  return '<img src="' + DIR + name + '.png" alt="" style="height:72px;vertical-align:middle">';
}

window.FISOIQ = {
  title: 'FISO · IQ · 3–4 класс',

  rules: {
    start: 0,
    max: 36,
    sections: [
      { ok: 4, no: 0, type: 'mcq', name: 'IQ-задания',
        head: 'IQ-ЗАДАНИЯ · задачи 1–10 · выбор ответа',
        note: '+4 за верный · 0 за неверный и за пропуск. Штрафа нет — ' +
              'отвечай на всё, даже наугад.' }
    ],
    blankNote: '⚠️ Пустых ответов осталось <b>{n}</b>. Штрафов в этой работе нет — ' +
               'отвечать нужно на все задачи, даже наугад.',
    tiers: [[85, '🥇 Уровень золота'], [70, '🥈 Уровень серебра'],
            [55, '🥉 Уровень бронзы'], [40, '🎖 Уровень похвального отзыва']]
  },

  intro: {
    title: 'FISO, 3–4 класс — IQ-задания',
    en: { title: 'FISO, Grades 3–4 — IQ sample problems',
          body: "<p>FISO sample IQ problems for Grades 3–4 (category 2): 10 problems, 20 minutes.</p><ul><li>Every problem is multiple choice with four options.</li><li><b>No penalties</b> — answer everything.</li><li>FISO does not publish its points, so here every problem is worth 4. Problem 2 has no recovered answer and does not count: the maximum is 36.</li></ul>" },
    body:
      '<p>Примерные IQ-задания олимпиады FISO для 3–4 класса (категория 2): ' +
      '10 задач, 20 минут.</p>' +
      '<ul>' +
      '<li>Во всех задачах выбор из четырёх вариантов.</li>' +
      '<li><b>Штрафов нет</b> — отвечай на всё.</li>' +
      '<li>Цены задач FISO не публикует, поэтому здесь каждая стоит 4 балла. ' +
      'К задаче 2 ответ не восстановлен, в счёт она не идёт: максимум 36.</li>' +
      '</ul>'
  },

  questions: [

  { type: 'mcq', topic: 'Буквы вместо цифр',
    q: 'Каждая буква обозначает свою цифру, разные буквы — разные цифры. ' +
       'Известно: <b>HAP = 376</b>, <b>PAH = 673</b>, <b>POB = 619</b>.<br>' +
       'Чему может быть равно <b>POJ</b>?',
    opts: ['615', '376', '673', '619'], ans: 0,
    hint: 'Из HAP и PAH узнай, какая цифра у P. Из POB — какая у O. ' +
          'А J — не такая буква, как B.',
    ex: 'HAP = 376: H = 3, A = 7, P = 6 (и PAH = 673 ✓). POB = 619: O = 1, B = 9. ' +
        'Значит, POJ = 61J. Из вариантов на «61» начинаются 615 и 619, но 619 — ' +
        'это POB, а J и B — разные буквы, значит, и цифры разные. POJ = <b>615</b>.',
    en: { q: 'Each letter stands for its own digit; different letters are different digits. We know: <b>HAP = 376</b>, <b>PAH = 673</b>, <b>POB = 619</b>.<br>What can <b>POJ</b> be?',
          hint: 'HAP and PAH give P, POB gives O. And J is a different letter from B.',
          ex: 'P = 6, O = 1, so POJ = 61J. 619 is POB and J ≠ B, so POJ = <b>615</b>.' } },

  { type: 'mcq', topic: 'Кубики', skip: true,
    img: DIR + 'q02.png',
    q: 'Сколько маленьких кубиков на этом рисунке? Варианты: 31, 32, 33, 34.',
    en: { q: 'How many small cubes are in this figure? Options: 31, 32, 33, 34.' } },

  { type: 'mcq', topic: 'Закономерности',
    img: DIR + 'q03.png',
    q: 'Какая фигурка должна стоять вместо знака вопроса?',
    opts: [pic('q03a'), pic('q03b'), pic('q03c'), pic('q03d')], ans: 2,
    hint: 'У фигурки три части: голова, рот и ноги. Посмотри, как они ' +
          'повторяются в каждой строке.',
    ex: 'В каждой строке у трёх фигурок разные головы (круг, квадрат, треугольник), ' +
        'разные рты (улыбка, прямой, грустный) и разные ступни (квадратики, ' +
        'треугольники, кружки). В нижней строке уже есть треугольная голова с ' +
        'улыбкой и кружками и круглая голова с прямым ртом и квадратиками. ' +
        'Не хватает квадратной головы, грустного рта и ступней-треугольников — ' +
        'это вариант <b>C</b>.',
    en: { q: 'Which figure should replace the question mark?',
          hint: 'A figure has three parts: head, mouth and feet. See how they repeat in each row.',
          ex: 'Each row has every head, every mouth and every kind of feet once. The bottom row is missing a square head, a sad mouth and triangle feet — option <b>C</b>.' } },

  { type: 'mcq', topic: 'Закономерности',
    q: 'Найдите пропущенное число: <b>7, 14, 16, ?, 34, 68</b>',
    opts: ['30', '32', '36', '38'], ans: 1,
    check: '16 * 2',
    hint: 'Посмотри, как получается каждое следующее число: 7 → 14 → 16.',
    ex: 'Действия чередуются: ×2, +2, ×2, +2, ×2. 7 × 2 = 14, 14 + 2 = 16, ' +
        '16 × 2 = <b>32</b>, 32 + 2 = 34, 34 × 2 = 68 ✓.',
    en: { q: 'Find the missing number: <b>7, 14, 16, ?, 34, 68</b>',
          hint: 'How does 7 become 14, and 14 become 16?',
          ex: 'The steps alternate ×2 and +2: 16 × 2 = <b>32</b>, then 34 and 68.' } },

  { type: 'mcq', topic: 'Убывающие ряды',
    q: 'Найдите пропущенное число: <b>720, 120, 24, ?, 2, 1</b>',
    opts: ['4', '5', '12', '6'], ans: 3,
    check: '24 / 4',
    hint: 'Во сколько раз уменьшается каждое число? 720 → 120, 120 → 24…',
    ex: 'Делим по очереди на 6, 5, 4, 3, 2: 720 ÷ 6 = 120, 120 ÷ 5 = 24, ' +
        '24 ÷ 4 = <b>6</b>, 6 ÷ 3 = 2, 2 ÷ 2 = 1 ✓.',
    en: { q: 'Find the missing number: <b>720, 120, 24, ?, 2, 1</b>',
          hint: 'How many times smaller is each number than the one before?',
          ex: 'Divide by 6, 5, 4, 3, 2: 24 ÷ 4 = <b>6</b>.' } },

  { type: 'mcq', topic: 'Хитрые ряды',
    q: 'Какое число следующее: <b>1, 4, 16, 25, ?</b>',
    opts: ['36', '49', '56', '64'], ans: 1,
    check: '7**2',
    hint: 'Все числа ряда — квадраты: 1 = 1 × 1, 4 = 2 × 2. Какие числа ' +
          'возводят в квадрат и как они меняются?',
    ex: 'Это квадраты: 1 = 1², 4 = 2², 16 = 4², 25 = 5². Основания 1, 2, 4, 5 растут ' +
        'на +1, +2, +1 — значит, дальше +2: 7. Следующее число 7 × 7 = <b>49</b>. ' +
        'Ловушка — взять 36: тогда шаги оснований были бы +1, +2, +1, +1, без правила.',
    en: { q: 'What comes next: <b>1, 4, 16, 25, ?</b>',
          hint: 'All of them are square numbers. Which numbers are squared, and how do they change?',
          ex: '1², 2², 4², 5²: the bases grow by +1, +2, +1, so next is +2 → 7, and 7² = <b>49</b>.' } },

  { type: 'mcq', topic: 'Порядок действий',
    q: 'Введены новые действия:<br>' +
       'a ▲ b = a + 2 × b;<br>' +
       'a ● b = 3 × a &minus; b.<br>' +
       'Найдите <b>(4 ▲ 3) + (4 ● 5)</b>.',
    opts: ['16', '17', '18', '20'], ans: 1,
    check: '(4 + 2*3) + (3*4 - 5)',
    hint: 'Подставь числа в правило по буквам: в 4 ▲ 3 буква a — это 4, b — это 3.',
    ex: '4 ▲ 3 = 4 + 2 × 3 = 10. 4 ● 5 = 3 × 4 &minus; 5 = 7. Сумма 10 + 7 = <b>17</b>.',
    en: { q: 'New operations are defined:<br>a ▲ b = a + 2 × b;<br>a ● b = 3 × a &minus; b.<br>Find <b>(4 ▲ 3) + (4 ● 5)</b>.',
          hint: 'Put the numbers into the rule: in 4 ▲ 3, a is 4 and b is 3.',
          ex: '4 ▲ 3 = 10, 4 ● 5 = 7, total <b>17</b>.' } },

  { type: 'mcq', topic: 'Обратный ход',
    img: DIR + 'q08.png',
    q: 'Пройдите по стрелкам и выполните действия. Найдите значение <b>y &minus; x</b>.',
    opts: ['34', '32', '27', '16'], ans: 2,
    check: '16*2 - 15/3',
    hint: 'x получается из 15 делением на 3. А y — из 16 умножением на 2.',
    ex: 'Цепочка сверху: 20 ÷ 2 = 10, 10 + 5 = 15, 15 ÷ 3 = x = 5 (проверка: ' +
        '5 + 5 = 10 ✓). Справа: 8 × 2 = 16, 16 × 2 = y = 32 (проверка: 32 ÷ 4 = 8 ✓). ' +
        'y &minus; x = 32 &minus; 5 = <b>27</b>.',
    en: { q: 'Follow the arrows and do the operations. Find <b>y &minus; x</b>.',
          hint: 'x comes from 15 divided by 3, and y from 16 times 2.',
          ex: 'x = 15 ÷ 3 = 5, y = 16 × 2 = 32, so y &minus; x = <b>27</b>.' } },

  { type: 'mcq', topic: 'Закономерности',
    img: DIR + 'q09.png',
    q: 'В этой пирамиде действует одно правило. По этому правилу найдите ' +
       'значение <b>a + b + c + d</b>.',
    opts: ['36', '72', '60', '82'], ans: 3,
    check: '(5 + 5) + 2*(8 + 5 + 5) + 2*(8 + 5 + 5)',
    hint: 'Посмотри на нижние ряды: 1 и 2 под тройкой, 2 и 3 под пятёркой. ' +
          'Как число получается из двух чисел под ним?',
    ex: 'Каждое число — сумма двух чисел под ним: 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8. ' +
        'Тогда a = 5 + 5 = 10, c = 8 + 10 = 18, b = 10 + 8 = 18, d = 18 + 18 = 36. ' +
        'a + b + c + d = 10 + 18 + 18 + 36 = <b>82</b>.',
    en: { q: 'One rule works throughout this pyramid. Using it, find <b>a + b + c + d</b>.',
          hint: 'Look at the bottom rows: 1 and 2 under a 3, 2 and 3 under a 5.',
          ex: 'Each number is the sum of the two below it: a = 10, b = c = 18, d = 36. Total <b>82</b>.' } },

  { type: 'mcq', topic: 'Криптарифмы',
    q: 'Решите ребус (K и L — цифры):<br>' +
       '<b>KK + KL + LK + LL = 308</b>.<br>Найдите K + L.',
    opts: ['10', '14', '12', '16'], ans: 1,
    check: 'Rational(308, 22)',
    hint: 'Сколько раз K стоит в десятках и сколько раз в единицах? То же для L.',
    ex: 'K стоит в десятках дважды (KK, KL) и в единицах дважды (KK, LK): ' +
        '2 × 10K + 2 × K = 22K. Для L так же: 22L. Значит, 22 × (K + L) = 308, ' +
        'K + L = 308 ÷ 22 = <b>14</b>.',
    en: { q: 'Solve the cryptarithm (K and L are digits):<br><b>KK + KL + LK + LL = 308</b>.<br>Find K + L.',
          hint: 'How many times is K a tens digit, and how many times a ones digit? Same for L.',
          ex: 'The sum is 22K + 22L = 308, so K + L = <b>14</b>.' } }

  ]
};

})();
