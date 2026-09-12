/* ==========================================================================
   SASMO Grade 3 — программа подготовки на 28 дней

   kind:
     test   — срез (много задач, микс тем)
     topic  — тематический день
     exam   — пробный экзамен в полном формате (90 мин)
     review — день разбора: новых задач нет, работаем с журналом ошибок
   ========================================================================== */

window.PLANS = window.PLANS || {};

window.PLANS[3] = {
  grade: 3,
  label: 'Grade 3',
  sub: 'Grade 3 • подготовка за месяц',

  /* Где лежат задачи и под каким ключом хранится прогресс.
     У каждого класса свой ключ: за тренажёром сидят разные дети. */
  dir: 'data/',
  keys: { progress: 'sasmo.progress', errors: 'sasmo.errors', single: 'sasmo.month.v1' },

  weeks: [
    { n: 1, title: 'Неделя 1 — диагностика и фундамент',
      sub: 'Понимаем, где дыры, и чиним счёт, модельный метод и обратный ход', from: 1, to: 7 },
    { n: 2, title: 'Неделя 2 — ядро нестандартных задач',
      sub: 'Здесь набирается основная часть баллов SASMO', from: 8, to: 14 },
    { n: 3, title: 'Неделя 3 — геометрия, измерения, счёт фигур',
      sub: 'И первый пробный экзамен в боевом режиме', from: 15, to: 21 },
    { n: 4, title: 'Неделя 4 — дожим и тактика',
      sub: 'Слабые темы, ещё два экзамена, выход на пик к дате олимпиады', from: 22, to: 28 }
  ],

  days: [
    { d: 1,  kind: 'test',   id: 'day01', v: 'DAY01', n: 25,
      title: 'Диагностический срез', skill: 'Смотрим, что уже умеем' },
    { d: 2,  kind: 'topic',  id: 'day02', v: 'DAY02', n: 10,
      title: 'Разряды, чётность, делимость', skill: 'Признаки делимости и остатки' },
    { d: 3,  kind: 'topic',  id: 'day03', v: 'DAY03', n: 10,
      title: 'Четыре действия и порядок', skill: 'Группировка, пропущенное число' },
    { d: 4,  kind: 'topic',  id: 'day04', v: 'DAY04', n: 10,
      title: 'Модельный метод I', skill: 'Полоски: часть–целое и сравнение' },
    { d: 5,  kind: 'topic',  id: 'day05', v: 'DAY05', n: 10,
      title: 'Модельный метод II', skill: 'Уравнивание, «было — стало»' },
    { d: 6,  kind: 'topic',  id: 'day06', v: 'DAY06', n: 10,
      title: 'Обратный ход', skill: 'Раскручиваем задачу с конца' },
    { d: 7,  kind: 'test',   id: 'day07', v: 'DAY07', n: 15,
      title: 'Повтор недели 1', skill: 'Микс тем + разбор журнала' },

    { d: 8,  kind: 'topic',  id: 'day08', v: 'DAY08', n: 10,
      title: 'Закономерности I', skill: 'Таблица разностей' },
    { d: 9,  kind: 'topic',  id: 'day09', v: 'DAY09', n: 10,
      title: 'Закономерности II', skill: 'Фигурные последовательности' },
    { d: 10, kind: 'topic',  id: 'day10', v: 'DAY10', n: 10,
      title: 'Криптарифмы', skill: 'Перенос разряда, крайние цифры' },
    { d: 11, kind: 'topic',  id: 'day11', v: 'DAY11', n: 10,
      title: 'Логика I', skill: 'Таблица соответствий' },
    { d: 12, kind: 'topic',  id: 'day12', v: 'DAY12', n: 10,
      title: 'Логика II', skill: 'Правда/ложь, весы' },
    { d: 13, kind: 'topic',  id: 'day13', v: 'DAY13', n: 10,
      title: 'Комбинаторика', skill: 'Дерево вариантов, маршруты' },
    { d: 14, kind: 'test',   id: 'day14', v: 'DAY14', n: 15,
      title: 'Повтор недели 2', skill: 'Микс тем + разбор журнала' },

    { d: 15, kind: 'topic',  id: 'day15', v: 'DAY15', n: 10,
      title: 'Периметр и площадь', skill: '«Описанный прямоугольник»' },
    { d: 16, kind: 'topic',  id: 'day16', v: 'DAY16', n: 10,
      title: 'Счёт фигур на рисунке', skill: 'Считаем по размерам' },
    { d: 17, kind: 'topic',  id: 'day17', v: 'DAY17', n: 10,
      title: 'Пространственное мышление', skill: 'Кубики, развёртки, симметрия' },
    { d: 18, kind: 'topic',  id: 'day18', v: 'DAY18', n: 10,
      title: 'Измерения и время', skill: 'Перевод единиц, календарь' },
    { d: 19, kind: 'topic',  id: 'day19', v: 'DAY19', n: 10,
      title: 'Задачи на интервалы', skill: '«Интервалов на один меньше»' },
    { d: 20, kind: 'exam',   id: 'exam1', v: 'EXAM1', n: 25,
      title: 'Пробный экзамен №1', skill: '90 минут, полный формат' },
    { d: 21, kind: 'review', id: 'rev21',
      title: 'Разбор экзамена №1', skill: 'Переписываем ошибки начисто' },

    { d: 22, kind: 'topic',  id: 'day22', v: 'DAY22', n: 10,
      title: 'Метод предположения', skill: '«Куры и кролики», средние' },
    { d: 23, kind: 'topic',  id: 'day23', v: 'DAY23', n: 10,
      title: 'Наихудший случай', skill: 'Принцип Дирихле, «гарантированно»' },
    { d: 24, kind: 'topic',  id: 'day24', v: 'DAY24', n: 10,
      title: 'Множества и возраст', skill: 'Круги Эйлера, разница возрастов' },
    { d: 25, kind: 'exam',   id: 'exam2', v: 'EXAM2', n: 25,
      title: 'Пробный экзамен №2', skill: '90 минут, контроль времени' },
    { d: 26, kind: 'review', id: 'rev26',
      title: 'Разбор экзамена №2', skill: 'Добиваем две слабые темы' },
    { d: 27, kind: 'exam',   id: 'exam3', v: 'EXAM3', n: 25,
      title: 'Пробный экзамен №3', skill: 'Финальная репетиция' },
    { d: 28, kind: 'test',   id: 'day28', v: 'DAY28', n: 10,
      title: 'Лёгкий день перед стартом', skill: 'Уверенность и ранний сон' }
  ],

  /* Наборы задач, которые уже готовы. Хаб гасит остальные карточки,
     чтобы не вести ребёнка на пустую страницу. Список растёт по этапам. */
  ready: ['day01', 'day02', 'day03', 'day04', 'day05', 'day06', 'day07',
          'day08', 'day09', 'day10', 'day11', 'day12', 'day13', 'day14',
          'day15', 'day16', 'day17', 'day18', 'day19', 'exam1',
          'day22', 'day23', 'day24', 'exam2', 'exam3', 'day28',
          'rev21', 'rev26'],

  isReady: function (day) { return this.ready.indexOf(day.id) !== -1; },

  /* найти день по номеру */
  day: function (d) {
    for (var i = 0; i < this.days.length; i++) {
      if (this.days[i].d === d) return this.days[i];
    }
    return null;
  },

  /* ссылка на страницу дня */
  href: function (day) {
    var g = this.grade === 3 ? '' : 'g=' + this.grade + '&';
    if (day.kind === 'exam')   return 'exam.html?' + g + 'e=' + day.id.slice(4);
    if (day.kind === 'review') return 'errors.html' + (g ? '?g=' + this.grade : '');
    return 'day.html?' + g + 'd=' + String(day.d).padStart(2, '0');
  }
};

/* Класс по умолчанию — третий: так продолжают работать старые ссылки. */
window.PLAN = window.PLANS[3];
