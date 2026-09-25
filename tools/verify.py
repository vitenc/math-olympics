#!/usr/bin/env python3
"""Независимая проверка ответов через sympy.

build/check.js смотрит на структуру набора: столько ли задач, четыре ли
варианта, встречается ли ответ в разборе. Но само число он берёт на веру —
если в задаче написано «60 ÷ 12», а в ans стоит 6, проверка промолчит.

Здесь ответ считается заново, из условия, символьной математикой. Задача
несёт поле `check` — выражение на Python с доступом к sympy:

    { type: 'open', q: 'Площадь 60, ширина 12. Длина?',
      ans: 5, check: 'solve(Eq(12*L, 60), L)[0]' }

Результат должен совпасть с `ans` (у open) или с числом из верного варианта
(у mcq). Заодно проверяется, что ни один неверный вариант не равен верному
ответу — так ловятся опечатки, из-за которых в задаче два правильных ответа.

Там, где ответ не число, а утверждение («какое сравнение НЕ является верным»,
«какое уравнение подходит»), задача несёт `optcheck` — по выражению на каждый
вариант, и `optpick`, который говорит, какой из них верен:

    optcheck: ['9876 > 8765', '14321 < 15432', '13567 > 13678', '6543 > 5432'],
    optpick: 'false'      // верен тот вариант, чьё утверждение ложно

Проверка требует, чтобы подходил ровно один вариант и чтобы это был `ans`.
Именно на этом ловится дефект исходной работы MathXCEL 2024: в задаче 13 там
ложны сразу два сравнения, а выбрать просят одно.

Запуск:
    python tools/verify.py                # MathXCEL и формы замера
    python tools/verify.py mathxcel24     # только один
    python tools/verify.py --strict       # задача без `check` — тоже ошибка

Данные читаются через node: файлы в data/ — это JavaScript, и разбирать их
регулярками значит однажды разойтись с тем, что видит браузер.
"""

import json
import os
import re
import subprocess
import sys

import sympy
from sympy import (Eq, Integer, Rational, factorial, floor, gcd, lcm,  # noqa: F401
                   nsimplify, simplify, solve, symbols, sqrt)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Консоль Windows по умолчанию не cp-нейтральна, а весь вывод здесь русский.
for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, 'reconfigure'):
        stream.reconfigure(encoding='utf-8', errors='replace')

# Буквы для неизвестных: задача пишет solve(Eq(12*L, 60), L), а не объявляет
# символы сама.
SYMBOLS = {name: symbols(name) for name in
           list('abcdefghijklmnopqrstuvwxyz') + list('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}


def ns():
    """Пространство имён для `check`: sympy плюс однобуквенные неизвестные."""
    env = {k: v for k, v in vars(sympy).items() if not k.startswith('_')}
    env.update(SYMBOLS)
    env['__builtins__'] = {
        'abs': abs, 'all': all, 'any': any, 'divmod': divmod, 'len': len,
        'max': max, 'min': min, 'pow': pow, 'range': range, 'round': round,
        'sorted': sorted, 'sum': sum, 'list': list, 'set': set, 'int': int,
    }
    return env


def load(set_id):
    """Набор задач как JSON — через node, чтобы читать ровно то же, что браузер."""
    var = {'mathxcel24': 'MATHXCEL24'}.get(set_id)
    if var is None:
        var = re.sub(r'[^a-z0-9]', '', set_id).upper()

    script = (
        'global.window={};'
        f'require({json.dumps(os.path.join(ROOT, "data", set_id + ".js"))});'
        f'const d=global.window[{json.dumps(var)}];'
        'if(!d) { console.error("нет window.' + var + '"); process.exit(2); }'
        'process.stdout.write(JSON.stringify(d));'
    )
    out = subprocess.run(['node', '-e', script], capture_output=True, text=True,
                         encoding='utf-8', cwd=ROOT)
    if out.returncode != 0:
        raise SystemExit(f'не удалось прочитать data/{set_id}.js:\n{out.stderr}')
    return json.loads(out.stdout)


def as_number(text):
    """«45 см²» → 45, «10:00 утра» → None. Единицы и разметка не мешают."""
    plain = re.sub(r'<[^>]+>', ' ', str(text))
    plain = plain.replace('&minus;', '-').replace('&nbsp;', ' ')
    plain = re.sub(r'&[a-z]+\d*;', ' ', plain)
    # 8 910 — это одно число с неразрывным пробелом внутри, а не два
    plain = re.sub(r'(?<=\d)[\s ](?=\d)', '', plain)
    hits = re.findall(r'-?\d+(?:[.,]\d+)?', plain)
    if len(hits) != 1:
        return None
    return Rational(hits[0].replace(',', '.'))


def as_bool(value, where):
    """Выражение варианта обязано быть «да/нет» — число здесь ничего не значит."""
    if value is sympy.true or value is True:
        return True
    if value is sympy.false or value is False:
        return False
    raise ValueError(f'{where}: выражение дало {value!r}, а нужно True или False')


def check_options(q, at, bad):
    """Проверка варианта-утверждения: подходит ровно один, и это `ans`."""
    exprs = q['optcheck']
    if len(exprs) != len(q['opts']):
        bad.append(f'{at}: optcheck на {len(exprs)} вариантов, а вариантов {len(q["opts"])}')
        return

    want = q.get('optpick', 'true') == 'true'
    hits = []
    for j, expr in enumerate(exprs):
        try:
            value = as_bool(eval(expr, ns()), f'{at} вариант {"ABCD"[j]}')   # noqa: S307
        except Exception as e:                                               # noqa: BLE001
            bad.append(f'{at}: вариант {"ABCD"[j]} не вычислился — {type(e).__name__}: {e}')
            return
        if value is want:
            hits.append(j)

    letters = ', '.join('ABCD'[j] for j in hits) or '—'
    if len(hits) != 1:
        bad.append(f'{at}: подходящих вариантов {len(hits)} ({letters}), а должен быть ровно один')
    elif hits[0] != q['ans']:
        bad.append(f'{at}: сходится вариант {letters}, а в ответе {"ABCD"[q["ans"]]}')


def expected(q):
    """Что должен дать `check`: число открытой задачи или число верного варианта."""
    if q['type'] == 'open':
        return Rational(str(q['ans']))
    return as_number(q['opts'][q['ans']])


def check_set(set_id, strict):
    data = load(set_id)
    questions = data['questions']
    bad, skipped = [], []

    for i, q in enumerate(questions, 1):
        at = f'{set_id} #{i}'

        # Ответ-утверждение проверяется по вариантам, а не числом
        if q.get('optcheck'):
            check_options(q, at, bad)
            continue

        want = expected(q)

        # Вариант ответа без числа — «Литры», «Сантиметры». Такое sympy не
        # проверит, и притворяться, что проверила, не надо.
        if want is None:
            skipped.append(f'{at}: верный вариант не число («{q["opts"][q["ans"]]}»)')
            continue

        if not q.get('check'):
            skipped.append(f'{at}: нет поля check')
            if strict:
                bad.append(f'{at}: нет поля check')
            continue

        try:
            got = simplify(eval(q['check'], ns()))          # noqa: S307
        except Exception as e:                               # noqa: BLE001
            bad.append(f'{at}: check не вычислился — {type(e).__name__}: {e}')
            continue

        if simplify(got - want) != 0:
            bad.append(f'{at}: check даёт {got}, а в ответе {want}  [{q["check"]}]')
            continue

        # Два правильных варианта в одном mcq — ошибка, которую ребёнок
        # обнаружит раньше взрослого.
        if q['type'] == 'mcq':
            for j, opt in enumerate(q['opts']):
                if j == q['ans']:
                    continue
                other = as_number(opt)
                if other is not None and simplify(other - want) == 0:
                    bad.append(f'{at}: вариант {"ABCD"[j]} «{opt}» равен верному ответу')

    checked = len(questions) - len(skipped)
    print(f'{set_id}: задач {len(questions)}, проверено символьно {checked}, '
          f'без проверки {len(skipped)}')
    return bad, skipped


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    strict = '--strict' in sys.argv
    # Формы замера «до и после» проверяются всегда: по ним меряется прирост,
    # и ошибка в ключе исказила бы сам результат пилота.
    sets = args or ['mathxcel24', 'assess-g3a', 'assess-g3b', 'assess-g2a', 'assess-g2b']

    bad, skipped = [], []
    for set_id in sets:
        b, s = check_set(set_id, strict)
        bad += b
        skipped += s

    if skipped:
        print(f'\nБез символьной проверки ({len(skipped)}):')
        for s in skipped:
            print('  • ' + s)

    if bad:
        print(f'\nНЕ СХОДИТСЯ ({len(bad)}):')
        for b in bad:
            print('  ✗ ' + b)
        return 1

    print('\nВсе ответы сошлись.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
