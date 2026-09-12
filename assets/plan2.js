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

  dir: 'data/g2/',
  keys: { progress: 'sasmo.g2.progress', errors: 'sasmo.g2.errors', single: 'sasmo.month.g2.v1' },

  weeks: [
    { n: 1, title: 'Неделя 1 — счёт, который должен стать автоматическим',
      sub: 'Разряды, сложение и вычитание, умножение, доли', from: 1, to: 7 },
    { n: 2, title: 'Неделя 2 — приёмы нестандартных задач',
      sub: 'Здесь набирается основная часть баллов SASMO', from: 8, to: 14 },
    { n: 3, title: 'Неделя 3 — величины, геометрия, первый экзамен',
      sub: 'Деньги, время, фигуры — и боевой режим', from: 15, to: 21 },
    { n: 4, title: 'Неделя 4 — дожим и тактика',
      sub: 'Слабые темы, ещё два экзамена, выход на пик к дате олимпиады', from: 22, to: 28 }
  ],

  days: [
    { d: 1,  kind: 'test',   id: 'day01', v: 'G2DAY01', n: 25,
      title: 'Диагностический срез', skill: 'Смотрим, что уже умеем' },
    { d: 2,  kind: 'topic',  id: 'day02', v: 'G2DAY02', n: 10,
      title: 'Числа до 1000 и разряды', skill: 'Сравнение, соседи, круглые числа' },
    { d: 3,  kind: 'topic',  id: 'day03', v: 'G2DAY03', n: 10,
      title: 'Сложение и вычитание', skill: 'Переход через десяток, удобные пары' },
    { d: 4,  kind: 'topic',  id: 'day04', v: 'G2DAY04', n: 10,
      title: 'Умножение на 2, 5 и 10', skill: 'Умножение — это сложение равных' },
    { d: 5,  kind: 'topic',  id: 'day05', v: 'G2DAY05', n: 10,
      title: 'Умножение на 3 и 4, деление', skill: 'Деление — обратное умножению' },
    { d: 6,  kind: 'topic',  id: 'day06', v: 'G2DAY06', n: 10,
      title: 'Доли: половина и четверть', skill: 'Делим поровну' },
    { d: 7,  kind: 'test',   id: 'day07', v: 'G2DAY07', n: 15,
      title: 'Повтор недели 1', skill: 'Микс тем + разбор журнала' },

    { d: 8,  kind: 'topic',  id: 'day08', v: 'G2DAY08', n: 10,
      title: 'Закономерности в числах', skill: 'Смотрим на разности' },
    { d: 9,  kind: 'topic',  id: 'day09', v: 'G2DAY09', n: 10,
      title: 'Фигурные закономерности', skill: 'От рисунка к числу' },
    { d: 10, kind: 'topic',  id: 'day10', v: 'G2DAY10', n: 10,
      title: 'Полоски: часть и целое', skill: 'Рисуем задачу, а не гадаем' },
    { d: 11, kind: 'topic',  id: 'day11', v: 'G2DAY11', n: 10,
      title: 'На сколько больше и во сколько раз', skill: 'Разница и кратное сравнение' },
    { d: 12, kind: 'topic',  id: 'day12', v: 'G2DAY12', n: 10,
      title: 'Обратный ход', skill: 'Раскручиваем задачу с конца' },
    { d: 13, kind: 'topic',  id: 'day13', v: 'G2DAY13', n: 10,
      title: 'Числовые ребусы', skill: 'Пропущенные цифры и знаки' },
    { d: 14, kind: 'test',   id: 'day14', v: 'G2DAY14', n: 15,
      title: 'Повтор недели 2', skill: 'Микс тем + разбор журнала' },

    { d: 15, kind: 'topic',  id: 'day15', v: 'G2DAY15', n: 10,
      title: 'Деньги', skill: 'Рубли, сдача, сколько монет' },
    { d: 16, kind: 'topic',  id: 'day16', v: 'G2DAY16', n: 10,
      title: 'Время и календарь', skill: 'Часы, минуты, дни недели' },
    { d: 17, kind: 'topic',  id: 'day17', v: 'G2DAY17', n: 10,
      title: 'Длина, масса, объём', skill: 'Перевод единиц и весы' },
    { d: 18, kind: 'topic',  id: 'day18', v: 'G2DAY18', n: 10,
      title: 'Фигуры, периметр, симметрия', skill: 'Стороны, углы, оси' },
    { d: 19, kind: 'topic',  id: 'day19', v: 'G2DAY19', n: 10,
      title: 'Счёт фигур на рисунке', skill: 'Считаем по размерам' },
    { d: 20, kind: 'exam',   id: 'exam1', v: 'G2EXAM1', n: 25,
      title: 'Пробный экзамен №1', skill: '90 минут, полный формат' },
    { d: 21, kind: 'review', id: 'rev21',
      title: 'Разбор экзамена №1', skill: 'Переписываем ошибки начисто' },

    { d: 22, kind: 'topic',  id: 'day22', v: 'G2DAY22', n: 10,
      title: 'Задачи на интервалы', skill: 'Столбы, распилы, этажи' },
    { d: 23, kind: 'topic',  id: 'day23', v: 'G2DAY23', n: 10,
      title: 'Логика', skill: 'Правда и ложь, кто есть кто' },
    { d: 24, kind: 'topic',  id: 'day24', v: 'G2DAY24', n: 10,
      title: 'Перебор вариантов', skill: 'Считаем по порядку, ничего не теряя' },
    { d: 25, kind: 'exam',   id: 'exam2', v: 'G2EXAM2', n: 25,
      title: 'Пробный экзамен №2', skill: '90 минут, контроль времени' },
    { d: 26, kind: 'review', id: 'rev26',
      title: 'Разбор экзамена №2', skill: 'Добиваем две слабые темы' },
    { d: 27, kind: 'exam',   id: 'exam3', v: 'G2EXAM3', n: 25,
      title: 'Пробный экзамен №3', skill: 'Финальная репетиция' },
    { d: 28, kind: 'test',   id: 'day28', v: 'G2DAY28', n: 10,
      title: 'Лёгкий день перед стартом', skill: 'Уверенность и ранний сон' }
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
