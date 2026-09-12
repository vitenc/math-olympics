/* ==========================================================================
   SASMO — рисунки к задачам

   Картинки не лежат файлами, а рисуются на месте: это векторная графика,
   она не мылится на планшете, переживает тёмную тему и одинаково работает
   и в многостраничной версии, и в одностраничной, и на file://.

   В задаче:  fig: 'grid:3,3'     — рисунок к условию
              exfig: 'bars:...'   — рисунок к разбору (появляется вместе с ответом)
              img: 'img/sasmo/…'  — обычная картинка файлом, если понадобится

   Спецификация — строка «имя:аргументы через запятую».
   Список имён — в объекте SHAPES ниже.
   ========================================================================== */

(function () {
  'use strict';

  var U = 34;          // сторона клетки по умолчанию

  /* -------------------------------------------------------------- служебное */

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function num(v, dflt) {
    var n = parseFloat(v);
    return isNaN(n) ? dflt : n;
  }

  function svg(w, h, inner, label) {
    w = Math.round(w); h = Math.round(h);
    return '<figure class="fig"><svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" '
         + 'height="' + h + '" role="img" aria-label="' + esc(label || 'рисунок к задаче') + '">'
         + inner + '</svg></figure>';
  }

  function rect(x, y, w, h, cls) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" class="'
         + (cls || 'st') + '"/>';
  }

  function line(x1, y1, x2, y2, cls) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="'
         + (cls || 'st') + '"/>';
  }

  function txt(x, y, s, cls) {
    return '<text x="' + x + '" y="' + y + '" class="' + (cls || 'lbl') + '">' + esc(s) + '</text>';
  }

  function dot(x, y, r, cls) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 5) + '" class="' + (cls || 'pt') + '"/>';
  }

  /* Фигурная скобка справа: «всё это вместе — одна величина». */
  function braceRight(x, y1, y2, label) {
    var m = (y1 + y2) / 2, d = 8;
    return '<path d="M' + x + ' ' + y1 + ' q' + d + ' 0 ' + d + ' ' + d
         + ' L' + (x + d) + ' ' + (m - d) + ' q0 ' + d + ' ' + d + ' ' + d
         + ' q' + (-d) + ' 0 ' + (-d) + ' ' + d + ' L' + (x + d) + ' ' + (y2 - d)
         + ' q0 ' + d + ' ' + (-d) + ' ' + d + '" class="st thin"/>'
         + txt(x + 2 * d + 4, m + 5, label);
  }

  /* Фигурная скобка сверху. */
  function braceTop(x1, x2, y, label) {
    var m = (x1 + x2) / 2, d = 7;
    return '<path d="M' + x1 + ' ' + y + ' q0 ' + (-d) + ' ' + d + ' ' + (-d)
         + ' L' + (m - d) + ' ' + (y - d) + ' q' + d + ' 0 ' + d + ' ' + (-d)
         + ' q0 ' + d + ' ' + d + ' ' + d + ' L' + (x2 - d) + ' ' + (y - d)
         + ' q' + d + ' 0 ' + d + ' ' + d + '" class="st thin"/>'
         + '<text x="' + m + '" y="' + (y - 2 * d - 7) + '" class="lbl mid">' + esc(label) + '</text>';
  }

  /* =========================================================== сами фигуры === */

  var SHAPES = {};

  /* grid:C,R — прямоугольник, разбитый на C столбцов и R рядов.
     Рисунок к «сколько квадратов / прямоугольников на рисунке». */
  SHAPES.grid = function (a) {
    var c = num(a[0], 3), r = num(a[1], c);
    var u = Math.min(U, Math.round(300 / Math.max(c, r)));
    var w = c * u, h = r * u, p = 14;
    var s = rect(p, p, w, h, 'st fill');
    for (var i = 1; i < c; i++) s += line(p + i * u, p, p + i * u, p + h, 'st thin');
    for (var j = 1; j < r; j++) s += line(p, p + j * u, p + w, p + j * u, 'st thin');
    return svg(w + 2 * p, h + 2 * p, s, 'сетка ' + c + ' на ' + r);
  };

  /* tri:K — треугольник, разрезанный отрезками из вершины на K маленьких. */
  SHAPES.tri = function (a) {
    var k = num(a[0], 3), w = 240, h = 140, p = 14;
    var ax = p + w / 2, ay = p, by = p + h;
    var s = '<polygon points="' + ax + ',' + ay + ' ' + p + ',' + by + ' ' + (p + w) + ',' + by
          + '" class="st fill"/>';
    for (var i = 1; i < k; i++) s += line(ax, ay, p + w * i / k, by, 'st thin');
    return svg(w + 2 * p, h + 2 * p, s, 'треугольник, разделённый на ' + k + ' части');
  };

  /* dots:1,4,9,? — ряд фигур из точек (квадрат n на n). «?» — искомая фигура. */
  SHAPES.dots = function (a) {
    var step = 15, pad = 16, gap = 32, x = pad, boxes = [];

    a.forEach(function (v) {
      var side = v === '?' ? 3 : Math.round(Math.sqrt(num(v, 1)));
      boxes.push({ v: v, side: side, w: Math.max((side - 1) * step, 16) });
    });

    var maxSide = boxes.reduce(function (m, b) { return Math.max(m, b.side); }, 1);
    var h = (maxSide - 1) * step + pad * 2 + 24;
    var base = h - 32;
    var s = '';

    boxes.forEach(function (b, n) {
      if (b.v === '?') {
        s += '<text x="' + (x + b.w / 2) + '" y="' + (base - b.w / 2 + 8) + '" class="lbl big mid">?</text>';
      } else {
        for (var r = 0; r < b.side; r++) {
          for (var c = 0; c < b.side; c++) s += dot(x + c * step, base - r * step, 4.5);
        }
      }
      s += '<text x="' + (x + b.w / 2) + '" y="' + (h - 6) + '" class="lbl sm mid">' + (n + 1) + '-я</text>';
      x += b.w + gap;
    });

    return svg(x - gap + pad, h, s, 'последовательность фигур из точек');
  };

  /* triangles:1,3,6,? — то же, но треугольные числа: ряды 1, 2, 3 … точек. */
  SHAPES.triangles = function (a) {
    var step = 16, pad = 16, gap = 30, x = pad, boxes = [];

    a.forEach(function (v) {
      var n = num(v, 1), rows = 3;
      if (v !== '?') { rows = Math.round((Math.sqrt(8 * n + 1) - 1) / 2); }
      boxes.push({ v: v, rows: rows, w: Math.max((rows - 1) * step, 16) });
    });

    var maxRows = boxes.reduce(function (m, b) { return Math.max(m, b.rows); }, 1);
    var h = (maxRows - 1) * step + pad * 2 + 24;
    var base = h - 32;
    var s = '';

    boxes.forEach(function (b, n) {
      if (b.v === '?') {
        s += '<text x="' + (x + b.w / 2) + '" y="' + (base - b.w / 2 + 8) + '" class="lbl big mid">?</text>';
      } else {
        for (var r = 0; r < b.rows; r++) {
          var cnt = r + 1, y = base - (b.rows - 1 - r) * step;
          for (var c = 0; c < cnt; c++) {
            s += dot(x + b.w / 2 - (cnt - 1) * step / 2 + c * step, y, 4.5);
          }
        }
      }
      s += '<text x="' + (x + b.w / 2) + '" y="' + (h - 6) + '" class="lbl sm mid">' + (n + 1) + '-я</text>';
      x += b.w + gap;
    });

    return svg(x - gap + pad, h, s, 'последовательность треугольников из точек');
  };

  /* points:4 — точки на прямой: к задачам «сколько отрезков». */
  SHAPES.points = function (a) {
    var n = num(a[0], 4), p = 28;
    var u = Math.min(62, Math.round(300 / Math.max(n - 1, 1)));
    var w = (n - 1) * u, y = 46, names = 'ABCDEFGHKLMN';
    var s = line(p - 16, y, p + w + 16, y, 'st thin');

    for (var i = 0; i < n; i++) {
      s += dot(p + i * u, y, 5.5, 'pt accent')
         + '<text x="' + (p + i * u) + '" y="' + (y - 13) + '" class="lbl sm mid">'
         + (names.charAt(i) || (i + 1)) + '</text>';
    }
    return svg(w + 2 * p, y + 20, s, 'точки на прямой');
  };

  /* tristrip:3 — треугольники в ряд с общими сторонами (из палочек). */
  SHAPES.tristrip = function (a) {
    var n = num(a[0], 3), u = 54, h = Math.round(u * 0.87), p = 14, s = '';

    for (var i = 0; i < n; i++) {
      var x = p + i * u / 2;
      s += (i % 2 === 0)
        ? '<polygon points="' + x + ',' + (p + h) + ' ' + (x + u) + ',' + (p + h) + ' '
          + (x + u / 2) + ',' + p + '" class="st fill thin"/>'
        : '<polygon points="' + (x + u / 2) + ',' + p + ' ' + (x + 3 * u / 2) + ',' + p + ' '
          + (x + u) + ',' + (p + h) + '" class="st fill thin"/>';
    }
    return svg((n + 1) * u / 2 + 2 * p, h + 2 * p, s, 'треугольники в ряд из палочек');
  };

  /* stairs:3,2,1 — лесенка из клеток: числа — высоты столбцов слева направо. */
  SHAPES.stairs = function (a) {
    var cols = a.map(function (v) { return num(v, 1); });
    var maxH = Math.max.apply(null, cols);
    var u = Math.min(U, Math.round(260 / Math.max(cols.length, maxH)));
    var p = 14, w = cols.length * u, h = maxH * u, s = '';

    cols.forEach(function (n, i) {
      for (var j = 0; j < n; j++) s += rect(p + i * u, p + h - (j + 1) * u, u, u, 'st fill thin');
    });
    return svg(w + 2 * p, h + 2 * p, s, 'ступенчатая фигура из клеток');
  };

  /* steprect:12,8 — ступенчатая фигура внутри габаритного прямоугольника.
     Главный рисунок дня о периметре: пунктир показывает, что периметры равны. */
  SHAPES.steprect = function (a) {
    var lw = a[0] || '', lh = a[1] || '';
    var p = 24, w = 230, h = 150;
    var x0 = p, y0 = p, x1 = p + w, y1 = p + h;
    var kx = x0 + Math.round(w * 0.45), ky = y0 + Math.round(h * 0.42);

    var s = rect(x0, y0, w, h, 'st dash')
          + '<polygon points="' + [x0 + ',' + y1, x0 + ',' + y0, kx + ',' + y0, kx + ',' + ky,
                                   x1 + ',' + ky, x1 + ',' + y1].join(' ') + '" class="st fill"/>';
    if (lw) s += '<text x="' + (x0 + w / 2) + '" y="' + (y1 + 20) + '" class="lbl mid">' + esc(lw) + '</text>';
    if (lh) s += '<text x="' + (x1 + 10) + '" y="' + (y0 + h / 2) + '" class="lbl">' + esc(lh) + '</text>';

    return svg(w + 2 * p + 30, h + 2 * p + 8, s, 'ступенчатая фигура в описанном прямоугольнике');
  };

  /* rect:длина,ширина — прямоугольник с подписанными сторонами, «?» разрешён. */
  SHAPES.rect = function (a) {
    var la = a[0] || '?', lb = a[1] || '?';
    var p = 22, w = 200, h = 120;
    // подпись правой стороны стоит за рамкой — холст должен её вместить,
    // иначе «12 футов» обрезается до «12 фу»
    var right = 12 + lb.length * 9;
    var s = rect(p, p, w, h, 'st fill')
          + '<text x="' + (p + w / 2) + '" y="' + (p + h + 21) + '" class="lbl mid">' + esc(la) + '</text>'
          + '<text x="' + (p + w + 10) + '" y="' + (p + h / 2 + 5) + '" class="lbl">' + esc(lb) + '</text>';
    return svg(w + p + right, h + 2 * p + 10, s, 'прямоугольник со сторонами ' + la + ' и ' + lb);
  };

  /* segment:5,3,27 см — отрезок из N равных долей, K первых охвачены скобкой. */
  SHAPES.segment = function (a) {
    var n = num(a[0], 5), k = num(a[1], 0), label = a[2] || '';
    var u = Math.min(52, Math.round(300 / n)), p = 20, top = 46, w = n * u;
    var s = '';
    for (var i = 0; i < n; i++) s += rect(p + i * u, top, u, 26, 'st fill thin');
    if (k > 0) s += braceTop(p, p + k * u, top - 6, label);
    return svg(w + 2 * p, top + 26 + p, s, 'отрезок из ' + n + ' равных частей');
  };

  /* parts:74,38,? — модель «часть–целое»: целое сверху, части внутри полоски.
     Первое число — целое, остальные — части; «?» рисуется знаком вопроса. */
  SHAPES.parts = function (a) {
    var whole = a[0] || '?', pieces = a.slice(1);
    if (!pieces.length) return '';

    var vals = pieces.map(function (v) { return v === '?' ? null : num(v, null); });
    var known = vals.filter(function (v) { return v !== null; });
    var avg = known.length ? known.reduce(function (m, v) { return m + v; }, 0) / known.length : 1;
    var sum = vals.reduce(function (m, v) { return m + (v === null ? avg : v); }, 0) || 1;

    var p = 16, top = 46, bh = 34, full = 300;
    var x = p, s = '';

    pieces.forEach(function (label, i) {
      var w = Math.max(64, Math.round(full * (vals[i] === null ? avg : vals[i]) / sum));
      s += rect(x, top, w, bh, 'st fill thin')
         + '<text x="' + (x + w / 2) + '" y="' + (top + 23) + '" class="lbl mid">'
         + esc(label) + '</text>';
      x += w;
    });

    s += braceTop(p, x, top - 6, String(whole));
    return svg(x + p, top + bh + p, s, 'часть и целое');
  };

  /* bars:Ваня=1;Петя=3;@total=48 — модельный метод, полоски из долей.
       @total=…  скобка справа на все полоски
       @diff=…   скобка сверху над «лишними» долями самой длинной полоски
       @one=…    подпись к одной доле                                        */
  SHAPES.bars = function (a, raw) {
    var rows = [], total = null, diff = null, one = null;

    raw.split(';').forEach(function (part) {
      var eq = part.indexOf('=');
      if (eq < 0) return;
      var key = part.slice(0, eq).trim(), val = part.slice(eq + 1).trim();
      if (key === '@total') total = val;
      else if (key === '@diff') diff = val;
      else if (key === '@one') one = val;
      else {
        var plus = val.indexOf('+');                 // «1+12» — доля и подписанная разница
        rows.push(plus < 0
          ? { name: key, n: num(val, 1), extra: null }
          : { name: key, n: num(val.slice(0, plus), 1), extra: val.slice(plus + 1).trim() });
      }
    });
    if (!rows.length) return '';

    var maxN = rows.reduce(function (m, r) { return Math.max(m, r.n); }, 1);
    var u = Math.min(46, Math.max(20, Math.round(230 / maxN)));
    var bh = 28, gap = 14, pad = 12;
    var nameW = rows.reduce(function (m, r) { return Math.max(m, r.name.length); }, 0) * 8 + 12;
    var x0 = pad + nameW;

    rows.forEach(function (r) {
      r.ew = r.extra ? Math.max(u, r.extra.length * 9 + 14) : 0;
      r.w = r.n * u + r.ew;
    });
    var maxW = rows.reduce(function (m, r) { return Math.max(m, r.w); }, 0);
    var minW = rows.reduce(function (m, r) { return Math.min(m, r.w); }, maxW);

    var topPad = pad + (diff !== null ? 28 : 0);
    var s = '';

    rows.forEach(function (r, i) {
      r.y = topPad + i * (bh + gap);
      s += '<text x="' + pad + '" y="' + (r.y + 19) + '" class="lbl">' + esc(r.name) + '</text>';
      for (var j = 0; j < r.n; j++) s += rect(x0 + j * u, r.y, u, bh, 'st fill thin');
      if (r.extra) {
        s += rect(x0 + r.n * u, r.y, r.ew, bh, 'st soft thin')
           + '<text x="' + (x0 + r.n * u + r.ew / 2) + '" y="' + (r.y + 19)
           + '" class="lbl sm mid">' + esc(r.extra) + '</text>';
      }
    });

    var lastY = rows[rows.length - 1].y + bh;
    var rightX = x0 + maxW;
    var extra = pad;

    if (total !== null) {
      s += braceRight(rightX + 8, topPad, lastY, total);
      extra = 30 + String(total).length * 9;
    }
    if (diff !== null && maxW > minW) {
      s += braceTop(x0 + minW, x0 + maxW, rows[0].y - 5, diff);
    }
    var h = lastY + pad + (one ? 30 : 0);
    if (one) s += braceTop(x0, x0 + u, h - 6, one);

    return svg(rightX + extra, h, s, 'модель задачи: полоски');
  };

  /* balance:3 кубика и гиря,5 кубиков — чашечные весы в равновесии. */
  SHAPES.balance = function (a) {
    var left = a[0] || '', right = a[1] || '';
    var w = 360, h = 150, cx = w / 2, beam = 46;
    var s = line(cx, beam, cx, h - 24)
          + line(cx - 36, h - 24, cx + 36, h - 24)
          + line(cx - 124, beam, cx + 124, beam);

    [-1, 1].forEach(function (dir) {
      var px = cx + dir * 124;
      s += line(px, beam, px, beam + 18)
         + '<path d="M' + (px - 48) + ' ' + (beam + 18) + ' L' + (px + 48) + ' ' + (beam + 18)
         + ' L' + (px + 32) + ' ' + (beam + 46) + ' L' + (px - 32) + ' ' + (beam + 46)
         + ' Z" class="st fill"/>';
    });

    s += '<text x="' + (cx - 124) + '" y="' + (beam - 14) + '" class="lbl sm mid">' + esc(left) + '</text>'
       + '<text x="' + (cx + 124) + '" y="' + (beam - 14) + '" class="lbl sm mid">' + esc(right) + '</text>'
       + '<text x="' + cx + '" y="' + (h - 4) + '" class="lbl sm mid">равновесие</text>';

    return svg(w, h + 10, s, 'весы в равновесии: ' + left + ' и ' + right);
  };

  /* euler:всего,A,B,оба,имяA,имяB — два круга Эйлера с числами по частям. */
  SHAPES.euler = function (a) {
    var total = num(a[0], 0), A = num(a[1], 0), B = num(a[2], 0), both = num(a[3], 0);
    var nameA = a[4] || '', nameB = a[5] || '';
    var w = 360, h = 228, r = 76, cy = 104, ax = 132, bx = 228;
    var outside = total - (A + B - both);

    var s = rect(10, 26, w - 20, 156, 'st dash')
          + '<circle cx="' + ax + '" cy="' + cy + '" r="' + r + '" class="st fill soft"/>'
          + '<circle cx="' + bx + '" cy="' + cy + '" r="' + r + '" class="st fill soft"/>'
          + '<text x="' + (ax - 36) + '" y="' + (cy + 7) + '" class="lbl big mid">' + (A - both) + '</text>'
          + '<text x="' + ((ax + bx) / 2) + '" y="' + (cy + 7) + '" class="lbl big mid">' + both + '</text>'
          + '<text x="' + (bx + 36) + '" y="' + (cy + 7) + '" class="lbl big mid">' + (B - both) + '</text>'
          + '<text x="' + (ax - r) + '" y="18" class="lbl sm">' + esc(nameA) + '</text>'
          + '<text x="' + (bx + r) + '" y="18" class="lbl sm" text-anchor="end">' + esc(nameB) + '</text>';

    if (total) {
      s += '<text x="' + (w - 32) + '" y="' + 170 + '" class="lbl big mid">'
         + (outside >= 0 ? outside : '?') + '</text>'
         + '<text x="' + (w / 2) + '" y="' + (h - 6) + '" class="lbl sm mid">'
         + 'снаружи кругов — те, кто ни там, ни там</text>';
    }
    return svg(w, h, s, 'круги Эйлера');
  };

  /* posts:100,10 — столбы вдоль дороги: видно, что их на один больше интервалов. */
  SHAPES.posts = function (a) {
    var len = num(a[0], 100), step = num(a[1], 10);
    var n = Math.max(1, Math.round(len / step));
    var p = 24, w = Math.min(340, n * 34), u = w / n, y = 82;
    var s = line(p, y, p + w, y, 'st thin');

    for (var i = 0; i <= n; i++) {
      var x = p + i * u;
      s += line(x, y, x, y - 22) + dot(x, y - 25, 3.5);
    }
    for (i = 0; i < n; i++) {
      s += '<text x="' + (p + (i + 0.5) * u) + '" y="' + (y + 18) + '" class="lbl sm mid">' + step + '</text>';
    }
    s += braceTop(p, p + w, y - 34, String(len));
    return svg(w + 2 * p, y + 28, s, 'столбы вдоль дороги');
  };

  /* log:5 — бревно, распиленное на N частей: распилов на один меньше. */
  SHAPES.log = function (a) {
    var n = num(a[0], 5), p = 20, u = Math.min(58, Math.round(320 / n));
    var w = n * u, top = 26, bh = 40, s = rect(p, top, w, bh, 'st fill');

    for (var i = 1; i < n; i++) s += line(p + i * u, top - 10, p + i * u, top + bh + 10, 'st cut');
    for (i = 0; i < n; i++) {
      s += '<text x="' + (p + (i + 0.5) * u) + '" y="' + (top + bh / 2 + 5) + '" class="lbl sm mid">'
         + (i + 1) + '</text>';
    }
    s += '<text x="' + (p + w / 2) + '" y="' + (top + bh + 32) + '" class="lbl sm mid">'
       + (n - 1) + ' распил' + (n - 1 === 1 ? '' : (n - 1 < 5 ? 'а' : 'ов')) + '</text>';

    return svg(w + 2 * p, top + bh + 42, s, 'бревно, распиленное на ' + n + ' частей');
  };

  /* floors:4 — этажи и пролёты между ними. */
  SHAPES.floors = function (a) {
    var n = num(a[0], 4), p = 18, u = 44, w = 210;
    var h = (n - 1) * u + 2 * p + 12, s = '';

    for (var i = 0; i < n; i++) {
      var y = p + (n - 1 - i) * u;
      s += line(p + 38, y, p + w, y, 'st')
         + '<text x="' + p + '" y="' + (y + 5) + '" class="lbl sm">' + (i + 1) + '-й</text>';
      if (i < n - 1) {
        s += '<text x="' + (p + 120) + '" y="' + (y - u / 2 + 5) + '" class="lbl sm mid">пролёт</text>';
      }
    }
    return svg(w + p, h, s, 'этажи и пролёты между ними');
  };

  /* paths:2,2 — сетка для задачи о маршрутах, отмечены старт и финиш. */
  SHAPES.paths = function (a) {
    var c = num(a[0], 2), r = num(a[1], c);
    var u = Math.min(56, Math.round(220 / Math.max(c, r)));
    var p = 30, w = c * u, h = r * u, s = '';

    for (var i = 0; i <= c; i++) s += line(p + i * u, p, p + i * u, p + h, 'st thin');
    for (var j = 0; j <= r; j++) s += line(p, p + j * u, p + w, p + j * u, 'st thin');

    s += dot(p, p, 7, 'pt accent') + dot(p + w, p + h, 7, 'pt accent')
       + '<text x="' + p + '" y="' + (p - 10) + '" class="lbl sm mid">старт</text>'
       + '<text x="' + (p + w) + '" y="' + (p + h + 20) + '" class="lbl sm mid">финиш</text>';

    return svg(w + 2 * p, h + 2 * p + 6, s, 'сетка маршрутов ' + c + ' на ' + r);
  };

  /* один кубик в изометрии: передняя грань, крышка и правый бок */
  function cubeAt(x, y, u, d) {
    return '<polygon points="' + [x + ',' + y, (x + u) + ',' + y, (x + u) + ',' + (y + u),
                                  x + ',' + (y + u)].join(' ') + '" class="st fill thin"/>'
         + '<polygon points="' + [x + ',' + y, (x + d) + ',' + (y - d), (x + u + d) + ',' + (y - d),
                                  (x + u) + ',' + y].join(' ') + '" class="st soft thin"/>'
         + '<polygon points="' + [(x + u) + ',' + y, (x + u + d) + ',' + (y - d),
                                  (x + u + d) + ',' + (y + u - d), (x + u) + ',' + (y + u)].join(' ')
         + '" class="st soft thin"/>';
  }

  /* cube — один куб. */
  SHAPES.cube = function () {
    var u = 96, d = 36, p = 16;
    return svg(u + d + 2 * p, u + d + 2 * p, cubeAt(p, p + d, u, d), 'куб');
  };

  /* cubes:3 — большой куб N на N на N, сложенный из маленьких. */
  SHAPES.cubes = function (a) {
    var n = num(a[0], 3), u = Math.min(34, Math.round(110 / n)), d = Math.round(u * 0.4), p = 16, s = '';

    /* от дальнего слоя к ближнему, иначе кубики перекроют друг друга неверно */
    for (var z = n - 1; z >= 0; z--) {
      for (var y = n - 1; y >= 0; y--) {
        for (var x = 0; x < n; x++) {
          s += cubeAt(p + x * u + z * d, p + y * u + (n - z) * d, u, d);
        }
      }
    }
    return svg(n * u + n * d + 2 * p, n * u + n * d + 2 * p,
               s, 'куб ' + n + ' на ' + n + ' на ' + n + ' из маленьких кубиков');
  };

  /* tower:4,3,2,1 — башня: числа — сторона квадратного слоя снизу вверх. */
  SHAPES.tower = function (a) {
    var layers = a.map(function (v) { return num(v, 1); });
    var base = layers.reduce(function (m, v) { return Math.max(m, v); }, 1);
    var L = layers.length, u = 24, d = 10, p = 16, s = '';

    /* укладываем от дальних кубиков к ближним и снизу вверх,
       иначе верхние слои перекрывают не то, что нужно */
    for (var k = base - 1; k >= 0; k--) {
      for (var li = 0; li < L; li++) {
        var side = layers[li], off = (base - side) / 2;
        if (k < off || k >= off + side) continue;
        for (var c = 0; c < side; c++) {
          s += cubeAt(p + (off + c) * u + k * d,
                      p + (L - 1 - li) * u + (base - k) * d, u, d);
        }
      }
    }
    return svg(base * (u + d) + 2 * p, (L - 1) * u + base * d + u + 2 * p,
               s, 'башня из кубиков слоями');
  };

  /* box:3,2,2 — коробка, плотно уложенная кубиками (длина, ширина, высота). */
  SHAPES.box = function (a) {
    var c = num(a[0], 3), r = num(a[1], 2), lay = num(a[2], 2);
    var u = 32, d = 13, p = 16, s = '';

    for (var z = r - 1; z >= 0; z--) {
      for (var y = lay - 1; y >= 0; y--) {
        for (var x = 0; x < c; x++) {
          s += cubeAt(p + x * u + z * d, p + y * u + (r - z) * d, u, d);
        }
      }
    }
    return svg(c * u + r * d + 2 * p, lay * u + r * d + 2 * p,
               s, 'кубики в коробке ' + c + ' на ' + r + ' на ' + lay);
  };

  /* sym:tri,square,penta,circle — фигуры с показанными осями симметрии. */
  SHAPES.sym = function (a) {
    var cell = 104, p = 8, y = 66, s = '', x = p + cell / 2;
    var sides = { tri: 3, square: 4, penta: 5, hexa: 6 };

    a.forEach(function (name) {
      var R = 38, k = sides[name] || 0, i, an;

      if (k) {
        var pts = [], rot = k === 4 ? -Math.PI / 4 : -Math.PI / 2;
        for (i = 0; i < k; i++) {
          an = rot + i * 2 * Math.PI / k;
          pts.push((x + R * Math.cos(an)).toFixed(1) + ',' + (y + R * Math.sin(an)).toFixed(1));
        }
        s += '<polygon points="' + pts.join(' ') + '" class="st fill"/>';
        for (i = 0; i < k; i++) {
          an = rot + i * Math.PI / k;
          s += line((x - (R + 7) * Math.cos(an)).toFixed(1), (y - (R + 7) * Math.sin(an)).toFixed(1),
                    (x + (R + 7) * Math.cos(an)).toFixed(1), (y + (R + 7) * Math.sin(an)).toFixed(1),
                    'st axis');
        }
        s += '<text x="' + x + '" y="' + (y + R + 34) + '" class="lbl sm mid">'
           + k + ' ' + (k < 5 ? 'оси' : 'осей') + '</text>';
      } else {
        s += '<circle cx="' + x + '" cy="' + y + '" r="' + R + '" class="st fill"/>';
        for (i = 0; i < 6; i++) {
          an = i * Math.PI / 6;
          s += line((x - (R + 7) * Math.cos(an)).toFixed(1), (y - (R + 7) * Math.sin(an)).toFixed(1),
                    (x + (R + 7) * Math.cos(an)).toFixed(1), (y + (R + 7) * Math.sin(an)).toFixed(1),
                    'st axis');
        }
        s += '<text x="' + x + '" y="' + (y + R + 34) + '" class="lbl sm mid">бесконечно</text>';
      }
      x += cell;
    });

    return svg(a.length * cell + 2 * p, 150, s, 'оси симметрии фигур');
  };

  /* clockstrike:6 — удары часов: промежутков на один меньше, чем ударов. */
  SHAPES.clockstrike = function (a) {
    var n = num(a[0], 6), p = 26, w = Math.min(320, (n - 1) * 52), u = w / (n - 1), y = 66;
    var s = line(p, y, p + w, y, 'st thin');

    for (var i = 0; i < n; i++) {
      var x = p + i * u;
      s += line(x, y - 20, x, y + 10, 'st') + dot(x, y - 24, 4);
    }
    for (i = 0; i < n - 1; i++) {
      s += '<text x="' + (p + (i + 0.5) * u) + '" y="' + (y + 26) + '" class="lbl sm mid">' + (i + 1) + '</text>';
    }
    s += '<text x="' + (p + w / 2) + '" y="' + (y + 46) + '" class="lbl sm mid">'
       + n + ' ударов — ' + (n - 1) + ' промежутк' + (n - 1 === 1 ? '' : (n - 1 < 5 ? 'а' : 'ов')) + '</text>';

    return svg(w + 2 * p, y + 58, s, 'удары часов и промежутки между ними');
  };

  /* clock:9,10 — циферблат со стрелками на указанном времени.
     Ребёнок должен читать часы по картинке, а не по подписи «9:10». */
  SHAPES.clock = function (a) {
    var hh = num(a[0], 12) % 12, mm = num(a[1], 0);
    var R = 92, c = R + 16, s = '';

    s += '<circle cx="' + c + '" cy="' + c + '" r="' + R + '" class="st"/>';

    for (var i = 0; i < 60; i++) {
      var ang = i * 6 * Math.PI / 180;          // 0 — вверх, дальше по часовой
      var big = i % 5 === 0;
      var r1 = R - (big ? 11 : 5);
      s += line(c + r1 * Math.sin(ang), c - r1 * Math.cos(ang),
                c + (R - 2) * Math.sin(ang), c - (R - 2) * Math.cos(ang),
                big ? 'st thin' : 'st thin hair');
    }

    for (i = 1; i <= 12; i++) {
      var na = i * 30 * Math.PI / 180, nr = R - 26;
      s += '<text x="' + (c + nr * Math.sin(na)) + '" y="' + (c - nr * Math.cos(na) + 5) +
           '" class="lbl mid">' + i + '</text>';
    }

    /* Часовая стрелка сдвинута на прошедшие минуты: в 9:10 она уже за девяткой. */
    function hand(deg, len, cls) {
      var r = deg * Math.PI / 180;
      return line(c - 12 * Math.sin(r), c + 12 * Math.cos(r),
                  c + len * Math.sin(r), c - len * Math.cos(r), cls);
    }
    s += hand((hh + mm / 60) * 30, R - 40, 'st hour')
       + hand(mm * 6, R - 18, 'st minute')
       + dot(c, c, 6);

    var hlbl = (hh === 0 ? 12 : hh) + ':' + String(mm).padStart(2, '0');
    return svg(2 * c, 2 * c, s, 'циферблат: ' + hlbl);
  };

  /* gridfill:C,R,X,Y,W,H — сетка C на R с закрашенным прямоугольником
     W на H, левый верхний угол которого стоит в клетке (X, Y), счёт с нуля.
     Задачи «площадь фигуры на клетчатой бумаге». */
  SHAPES.gridfill = function (a) {
    var c = num(a[0], 6), r = num(a[1], 4);
    var x = num(a[2], 1), y = num(a[3], 1), fw = num(a[4], 2), fh = num(a[5], 2);
    var u = Math.min(26, Math.round(320 / Math.max(c, r)));
    var w = c * u, h = r * u, p = 14;

    var s = rect(p + x * u, p + y * u, fw * u, fh * u, 'soft');
    for (var i = 1; i < c; i++) s += line(p + i * u, p, p + i * u, p + h, 'st thin hair');
    for (var j = 1; j < r; j++) s += line(p, p + j * u, p + w, p + j * u, 'st thin hair');
    s += rect(p, p, w, h, 'st') + rect(p + x * u, p + y * u, fw * u, fh * u, 'st');

    return svg(w + 2 * p, h + 2 * p + 20,
               s + '<text x="' + (p + w / 2) + '" y="' + (h + 2 * p + 12) +
                   '" class="lbl sm mid">клетка — 1 см&#178;</text>',
               'фигура на сетке ' + c + ' на ' + r);
  };

  /* regpoly:3,6 см — правильный многоугольник с подписью стороны.
     Для периметра: ребёнок должен увидеть, что все стороны равны. */
  SHAPES.regpoly = function (a) {
    var n = Math.max(3, num(a[0], 3)), label = a[1] || '';
    var R = 74, c = R + 10 + label.length * 5, pts = [];

    for (var i = 0; i < n; i++) {
      var ang = (i * 360 / n - 90) * Math.PI / 180;
      pts.push((c + R * Math.cos(ang)).toFixed(1) + ',' + (c + R * Math.sin(ang)).toFixed(1));
    }
    var s = '<polygon points="' + pts.join(' ') + '" class="st soft"/>';

    /* Подпись у каждой стороны — иначе «все стороны по 6» приходится брать на веру. */
    if (label) {
      for (i = 0; i < n; i++) {
        var p1 = pts[i].split(','), p2 = pts[(i + 1) % n].split(',');
        var mx = (+p1[0] + +p2[0]) / 2, my = (+p1[1] + +p2[1]) / 2;
        /* Отодвигаем подпись от стороны наружу, иначе у треугольника
           боковые подписи ложатся прямо на линию и читаются как внутренние. */
        var k = 1 + 26 / Math.sqrt((mx - c) * (mx - c) + (my - c) * (my - c) || 1);
        s += '<text x="' + (c + (mx - c) * k) + '" y="' + (c + (my - c) * k + 4) +
             '" class="lbl sm mid">' + esc(label) + '</text>';
      }
    }
    return svg(2 * c, 2 * c, s, 'правильный ' + n + '-угольник');
  };

  /* =========================================================== точка входа === */

  function build(spec) {
    if (!spec) return '';
    var i = String(spec).indexOf(':');
    var name = (i < 0 ? String(spec) : spec.slice(0, i)).trim();
    var raw = i < 0 ? '' : String(spec).slice(i + 1);
    var fn = SHAPES[name];
    if (!fn) return '';
    var args = raw === '' ? [] : raw.split(',').map(function (v) { return v.trim(); });
    try { return fn(args, raw); } catch (e) { return ''; }
  }

  /* Картинка файлом — запасной путь, если понадобится растр. */
  function image(src, alt) {
    if (!src) return '';
    return '<figure class="fig"><img src="' + esc(src) + '" alt="'
         + esc(alt || 'рисунок к задаче') + '" loading="lazy"></figure>';
  }

  function forQuestion(q) { return build(q.fig) + image(q.img, q.imgAlt); }
  function forExplain(q) { return build(q.exfig); }

  var CSS =
    '.fig{margin:.8rem 0;text-align:center;color:var(--ink-soft,#4d5d78)}' +
    '.fig svg,.fig img{max-width:100%;height:auto;display:inline-block}' +
    '.fig img{border-radius:10px}' +
    '.fig .st{fill:none;stroke:currentColor;stroke-width:2;stroke-linejoin:round}' +
    '.fig .thin{stroke-width:1.4}' +
    '.fig .hair{stroke-width:.9;opacity:.45}' +
    '.fig .hour{stroke-width:5;stroke-linecap:round}' +
    '.fig .minute{stroke-width:3.4;stroke-linecap:round}' +
    '.fig .fill{fill:var(--card-sunk,rgba(127,127,127,.10))}' +
    '.fig .soft{fill:var(--accent-bg,rgba(127,127,127,.20))}' +
    '.fig .dash{stroke-dasharray:6 5;opacity:.5;fill:none}' +
    '.fig .cut{stroke-dasharray:5 4;stroke:var(--no,#c33f2d);stroke-width:2}' +
    '.fig .axis{stroke-dasharray:5 4;stroke:var(--accent,#2f5fa8);stroke-width:1.4}' +
    '.fig .pt{fill:currentColor;stroke:none}' +
    '.fig .pt.accent{fill:var(--accent,#2f5fa8)}' +
    '.fig text{fill:currentColor;stroke:none;font:600 14px var(--ui,inherit)}' +
    '.fig .sm{font-size:12px;opacity:.85}' +
    '.fig .big{font-size:19px}' +
    '.fig .mid{text-anchor:middle}';

  if (typeof document !== 'undefined' && !document.getElementById('fig-css')) {
    var st = document.createElement('style');
    st.id = 'fig-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  window.SASMO_FIG = {
    build: build, image: image, forQuestion: forQuestion, forExplain: forExplain,
    css: CSS, shapes: SHAPES
  };
})();
