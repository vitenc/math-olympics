/* ==========================================================================
   SASMO Grade 2 — программа подготовки на 28 дней

   Та же машина, что и у третьего класса, но своя программа, свои задачи
   (data/g2/) и свой ключ хранения: за тренажёром сидят разные дети,
   и прогресс одного не должен подмешиваться к прогрессу другого.

   kind:
     test   — срез (много задач, микс тем)
     topic  — тематический день
     exam   — пробный экзамен в полном формате (90 мин)
     review — день разбора: новых задач нет, работаем с журналом ошибок
   ========================================================================== */

window.PLANS = window.PLANS || {};

window.PLANS[2] = {
  grade: 2,
  label: 'Grade 2',
  sub: 'Grade 2 • подготовка за месяц',
  en: { sub: 'Grade 2 • one month to the olympiad' },

  dir: 'data/g2/',
  keys: { progress: 'sasmo.g2.progress', errors: 'sasmo.g2.errors', single: 'sasmo.month.g2.v1' },

  weeks: [
    { n: 1, title: 'Неделя 1 — счёт, который должен стать автоматическим',
      sub: 'Разряды, сложение и вычитание, умножение, доли', from: 1, to: 7,
      en: { title: 'Week 1 — arithmetic that must become automatic', sub: 'Place value, addition and subtraction, multiplication, fractions' } },
    { n: 2, title: 'Неделя 2 — приёмы нестандартных задач',
      sub: 'Здесь набирается основная часть баллов SASMO', from: 8, to: 14,
      en: { title: 'Week 2 — techniques for non-routine problems', sub: 'This is where most SASMO points are won' } },
    { n: 3, title: 'Неделя 3 — величины, геометрия, первый экзамен',
      sub: 'Деньги, время, фигуры — и боевой режим', from: 15, to: 21,
      en: { title: 'Week 3 — quantities, geometry, first exam', sub: 'Money, time, shapes, and exam conditions' } },
    { n: 4, title: 'Неделя 4 — дожим и тактика',
      sub: 'Слабые темы, ещё два экзамена, выход на пик к дате олимпиады', from: 22, to: 28,
      en: { title: 'Week 4 — final push and tactics', sub: 'Weak topics, two more exams, peaking on the olympiad date' } }
  ],

  days: [
    { d: 1,  kind: 'test',   id: 'day01', v: 'G2DAY01', n: 25,
      title: 'Диагностический срез', skill: 'Смотрим, что уже умеем',
      en: { title: 'Diagnostic test', skill: 'See what we already know' } },
    { d: 2,  kind: 'topic',  id: 'day02', v: 'G2DAY02', n: 10,
      title: 'Числа до 1000 и разряды', skill: 'Сравнение, соседи, круглые числа',
      en: { title: 'Numbers to 1000 and place value', skill: 'Comparing, neighbours, round numbers' } },
    { d: 3,  kind: 'topic',  id: 'day03', v: 'G2DAY03', n: 10,
      title: 'Сложение и вычитание', skill: 'Переход через десяток, удобные пары',
      en: { title: 'Addition and subtraction', skill: 'Crossing tens, friendly pairs' } },
    { d: 4,  kind: 'topic',  id: 'day04', v: 'G2DAY04', n: 10,
      title: 'Умножение на 2, 5 и 10', skill: 'Умножение — это сложение равных',
      en: { title: 'Multiplying by 2, 5 and 10', skill: 'Multiplication is repeated addition' } },
    { d: 5,  kind: 'topic',  id: 'day05', v: 'G2DAY05', n: 10,
      title: 'Умножение на 3 и 4, деление', skill: 'Деление — обратное умножению',
      en: { title: 'Multiplying by 3 and 4, division', skill: 'Division undoes multiplication' } },
    { d: 6,  kind: 'topic',  id: 'day06', v: 'G2DAY06', n: 10,
      title: 'Доли: половина и четверть', skill: 'Делим поровну',
      en: { title: 'Fractions: half and quarter', skill: 'Sharing equally' } },
    { d: 7,  kind: 'test',   id: 'day07', v: 'G2DAY07', n: 15,
      title: 'Повтор недели 1', skill: 'Микс тем + разбор журнала',
      en: { title: 'Week 1 review', skill: 'Mixed topics + error journal' } },

    { d: 8,  kind: 'topic',  id: 'day08', v: 'G2DAY08', n: 10,
      title: 'Закономерности в числах', skill: 'Смотрим на разности',
      en: { title: 'Number patterns', skill: 'Look at the differences' } },
    { d: 9,  kind: 'topic',  id: 'day09', v: 'G2DAY09', n: 10,
      title: 'Фигурные закономерности', skill: 'От рисунка к числу',
      en: { title: 'Figure patterns', skill: 'From picture to number' } },
    { d: 10, kind: 'topic',  id: 'day10', v: 'G2DAY10', n: 10,
      title: 'Полоски: часть и целое', skill: 'Рисуем задачу, а не гадаем',
      en: { title: 'Bars: part and whole', skill: 'Draw the problem, do not guess' } },
    { d: 11, kind: 'topic',  id: 'day11', v: 'G2DAY11', n: 10,
      title: 'На сколько больше и во сколько раз', skill: 'Разница и кратное сравнение',
      en: { title: 'How many more and how many times', skill: 'Difference and ratio comparison' } },
    { d: 12, kind: 'topic',  id: 'day12', v: 'G2DAY12', n: 10,
      title: 'Обратный ход', skill: 'Раскручиваем задачу с конца',
      en: { title: 'Working backwards', skill: 'Unwind the problem from the end' } },
    { d: 13, kind: 'topic',  id: 'day13', v: 'G2DAY13', n: 10,
      title: 'Числовые ребусы', skill: 'Пропущенные цифры и знаки',
      en: { title: 'Number puzzles', skill: 'Missing digits and signs' } },
    { d: 14, kind: 'test',   id: 'day14', v: 'G2DAY14', n: 15,
      title: 'Повтор недели 2', skill: 'Микс тем + разбор журнала',
      en: { title: 'Week 2 review', skill: 'Mixed topics + error journal' } },

    { d: 15, kind: 'topic',  id: 'day15', v: 'G2DAY15', n: 10,
      title: 'Деньги', skill: 'Рубли, сдача, сколько монет',
      en: { title: 'Money', skill: 'Coins, change, how many coins' } },
    { d: 16, kind: 'topic',  id: 'day16', v: 'G2DAY16', n: 10,
      title: 'Время и календарь', skill: 'Часы, минуты, дни недели',
      en: { title: 'Time and calendar', skill: 'Clocks, minutes, days of the week' } },
    { d: 17, kind: 'topic',  id: 'day17', v: 'G2DAY17', n: 10,
      title: 'Длина, масса, объём', skill: 'Перевод единиц и весы',
      en: { title: 'Length, mass, volume', skill: 'Unit conversion and scales' } },
    { d: 18, kind: 'topic',  id: 'day18', v: 'G2DAY18', n: 10,
      title: 'Фигуры, периметр, симметрия', skill: 'Стороны, углы, оси',
      en: { title: 'Shapes, perimeter, symmetry', skill: 'Sides, corners, axes' } },
    { d: 19, kind: 'topic',  id: 'day19', v: 'G2DAY19', n: 10,
      title: 'Счёт фигур на рисунке', skill: 'Считаем по размерам',
      en: { title: 'Counting figures', skill: 'Count by size' } },
    { d: 20, kind: 'exam',   id: 'exam1', v: 'G2EXAM1', n: 25,
      title: 'Пробный экзамен №1', skill: '90 минут, полный формат',
      en: { title: 'Mock exam 1', skill: '90 minutes, full format' } },
    { d: 21, kind: 'review', id: 'rev21',
      title: 'Разбор экзамена №1', skill: 'Переписываем ошибки начисто',
      en: { title: 'Exam 1 review', skill: 'Rewrite the mistakes cleanly' } },

    { d: 22, kind: 'topic',  id: 'day22', v: 'G2DAY22', n: 10,
      title: 'Задачи на интервалы', skill: 'Столбы, распилы, этажи',
      en: { title: 'Interval problems', skill: 'Posts, cuts, floors' } },
    { d: 23, kind: 'topic',  id: 'day23', v: 'G2DAY23', n: 10,
      title: 'Логика', skill: 'Правда и ложь, кто есть кто',
      en: { title: 'Logic', skill: 'True and false, who is who' } },
    { d: 24, kind: 'topic',  id: 'day24', v: 'G2DAY24', n: 10,
      title: 'Перебор вариантов', skill: 'Считаем по порядку, ничего не теряя',
      en: { title: 'Listing cases', skill: 'Count in order, miss nothing' } },
    { d: 25, kind: 'exam',   id: 'exam2', v: 'G2EXAM2', n: 25,
      title: 'Пробный экзамен №2', skill: '90 минут, контроль времени',
      en: { title: 'Mock exam 2', skill: '90 minutes, time control' } },
    { d: 26, kind: 'review', id: 'rev26',
      title: 'Разбор экзамена №2', skill: 'Добиваем две слабые темы',
      en: { title: 'Exam 2 review', skill: 'Finish off two weak topics' } },
    { d: 27, kind: 'exam',   id: 'exam3', v: 'G2EXAM3', n: 25,
      title: 'Пробный экзамен №3', skill: 'Финальная репетиция',
      en: { title: 'Mock exam 3', skill: 'Final rehearsal' } },
    { d: 28, kind: 'test',   id: 'day28', v: 'G2DAY28', n: 10,
      title: 'Лёгкий день перед стартом', skill: 'Уверенность и ранний сон',
      en: { title: 'Easy day before the start', skill: 'Confidence and an early night' } }
  ],

  ready: ['day01', 'day02', 'day03', 'day04', 'day05', 'day06', 'day07',
          'day08', 'day09', 'day10', 'day11', 'day12', 'day13', 'day14',
          'day15', 'day16', 'day17', 'day18', 'day19', 'exam1',
          'day22', 'day23', 'day24', 'exam2', 'exam3', 'day28',
          'rev21', 'rev26'],

  isReady: function (day) { return this.ready.indexOf(day.id) !== -1; },

  day: function (d) {
    for (var i = 0; i < this.days.length; i++) {
      if (this.days[i].d === d) return this.days[i];
    }
    return null;
  },

  href: function (day) {
    var g = this.grade === 3 ? '' : 'g=' + this.grade + '&';
    if (day.kind === 'exam')   return 'exam.html?' + g + 'e=' + day.id.slice(4);
    if (day.kind === 'review') return 'errors.html' + (g ? '?g=' + this.grade : '');
    return 'day.html?' + g + 'd=' + String(day.d).padStart(2, '0');
  }
};
