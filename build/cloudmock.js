/* Имитация Supabase в памяти: Auth (код из письма) и PostgREST (таблицы
   schema.sql с теми же правилами доступа, что и RLS). Нужна build/cloudtest.js;
   код подтверждения у всех — 123456. fetch(url, opts) ведёт себя как
   window.fetch, но ответ — только status, ok и text(). */


const DB = { users: {}, profiles: {}, students: {}, classes: {}, members: [], kv: {} };
let offline = false;
function setOffline(v) { offline = !!v; }
let seq = 0;
const uuid = () => '00000000-0000-4000-8000-' + String(++seq).padStart(12, '0');

function userByToken(auth) {
  const m = /^Bearer (.+)$/.exec(auth || '');
  if (!m) return null;
  for (const u of Object.values(DB.users)) if (u.token === m[1]) return u;
  return null;
}
const owns = (uid, sid) => DB.students[sid] && DB.students[sid].owner_id === uid;
const teaches = (uid, sid) => DB.members.some(m => m.student_id === sid && DB.classes[m.class_id].teacher_id === uid);

// PostgREST-фильтры: col=eq.v, col=in.(a,b)
function filters(q) {
  const out = [];
  for (const [k, v] of q.entries()) {
    if (['select', 'order', 'on_conflict'].includes(k)) continue;
    let m;
    if ((m = /^eq\.(.*)$/.exec(v))) out.push(r => String(r[k]) === m[1]);
    else if ((m = /^in\.\((.*)\)$/.exec(v))) { const set = m[1].split(',').map(decodeURIComponent); out.push(r => set.includes(String(r[k]))); }
  }
  return (r) => out.every(f => f(r));
}

function reply(status, body) {
  const text = body === undefined ? '' : JSON.stringify(body);
  return Promise.resolve({ ok: status < 400, status, text: () => Promise.resolve(text) });
}

function mockFetch(url, opts) {
  if (offline) return Promise.reject(new TypeError('Failed to fetch'));
  const u = new URL(url);
  const q = u.searchParams;
  const method = (opts && opts.method) || 'GET';
  const body = opts && opts.body ? JSON.parse(opts.body) : null;
  const h = (opts && opts.headers) || {};
  const p = u.pathname;

  /* ---- Auth ---- */
  if (p === '/auth/v1/otp') {
    const email = body.email.toLowerCase();
    if (!DB.users[email]) DB.users[email] = { id: uuid(), email, token: null, refresh: null };
    DB.users[email].code = '123456';
    return reply(200, {});
  }
  if (p === '/auth/v1/verify') {
    const usr = DB.users[body.email.toLowerCase()];
    if (!usr || body.token !== usr.code) return reply(403, { msg: 'Token has expired or is invalid' });
    usr.token = 'at-' + uuid(); usr.refresh = 'rt-' + uuid();
    return reply(200, { access_token: usr.token, refresh_token: usr.refresh, expires_in: 3600, user: { id: usr.id, email: usr.email } });
  }
  if (p === '/auth/v1/token') {
    const usr = Object.values(DB.users).find(x => x.refresh === body.refresh_token);
    if (!usr) return reply(400, { msg: 'Invalid Refresh Token' });
    usr.token = 'at-' + uuid();
    return reply(200, { access_token: usr.token, refresh_token: usr.refresh, expires_in: 3600, user: { id: usr.id, email: usr.email } });
  }
  if (p === '/auth/v1/logout') return reply(204);

  const me = userByToken(h.Authorization);
  if (!me) return reply(401, { message: 'JWT expired' });
  const uid = me.id;
  const where = filters(q);
  const now = () => new Date(Date.now()).toISOString();

  /* ---- RPC ---- */
  if (p === '/rest/v1/rpc/join_class') {
    if (!owns(uid, body.student)) return reply(403, { code: '42501', message: 'not your student' });
    const c = Object.values(DB.classes).find(x => x.join_code === String(body.code).trim().toUpperCase());
    if (!c) return reply(404, { code: 'P0002', message: 'no such class' });
    if (!DB.members.some(m => m.class_id === c.id && m.student_id === body.student)) {
      DB.members.push({ class_id: c.id, student_id: body.student, joined_at: now() });
    }
    return reply(200, c.name);
  }
  if (p === '/rest/v1/rpc/student_classes') {
    if (!owns(uid, body.student)) return reply(200, []);
    return reply(200, DB.members.filter(m => m.student_id === body.student)
      .map(m => ({ class_id: m.class_id, name: DB.classes[m.class_id].name })));
  }

  /* ---- таблицы ---- */
  const table = p.replace('/rest/v1/', '');
  const rep = String(h.Prefer || '').includes('return=representation');

  if (table === 'profiles') {
    if (method === 'GET') return reply(200, Object.values(DB.profiles).filter(r => r.id === uid).filter(where));
    for (const r of body) { if (r.id !== uid) return reply(403, { message: 'rls' }); DB.profiles[uid] = { ...DB.profiles[uid], ...r }; }
    return reply(201, rep ? [DB.profiles[uid]] : undefined);
  }
  if (table === 'students') {
    if (method === 'GET') return reply(200, Object.values(DB.students).filter(r => r.owner_id === uid || teaches(uid, r.id)).filter(where));
    if (method === 'POST') {
      const r = { id: uuid(), owner_id: uid, consent_at: now(), created_at: now(), ...body };
      DB.students[r.id] = r;
      return reply(201, rep ? [r] : undefined);
    }
    if (method === 'DELETE') {
      for (const r of Object.values(DB.students).filter(where)) {
        if (r.owner_id !== uid) continue;
        delete DB.students[r.id];
        DB.members = DB.members.filter(m => m.student_id !== r.id);
        for (const k of Object.keys(DB.kv)) if (k.startsWith(r.id + '|')) delete DB.kv[k];
      }
      return reply(204);
    }
  }
  if (table === 'classes') {
    if (method === 'GET') return reply(200, Object.values(DB.classes).filter(r => r.teacher_id === uid).filter(where));
    const r = { id: uuid(), teacher_id: uid, join_code: 'K' + String(seq).padStart(5, '0'), created_at: now(), ...body };
    DB.classes[r.id] = r;
    return reply(201, rep ? [r] : undefined);
  }
  if (table === 'class_members') {
    if (method === 'GET') {
      return reply(200, DB.members
        .filter(m => DB.classes[m.class_id].teacher_id === uid || owns(uid, m.student_id)).filter(where)
        .map(m => ({ ...m, students: DB.students[m.student_id] || null })));
    }
    if (method === 'POST') {
      if (!(DB.classes[body.class_id] && DB.classes[body.class_id].teacher_id === uid && owns(uid, body.student_id))) {
        return reply(403, { code: '42501', message: 'rls' });
      }
      DB.members.push({ ...body, joined_at: now() });
      return reply(201);
    }
    if (method === 'DELETE') {
      DB.members = DB.members.filter(m => !(where(m) && (DB.classes[m.class_id].teacher_id === uid || owns(uid, m.student_id))));
      return reply(204);
    }
  }
  if (table === 'kv') {
    if (method === 'GET') {
      return reply(200, Object.values(DB.kv).filter(r => owns(uid, r.student_id) || teaches(uid, r.student_id)).filter(where));
    }
    const out = [];
    for (const r of body) {
      if (!owns(uid, r.student_id)) return reply(403, { code: '42501', message: 'new row violates row-level security policy' });
      const row = { student_id: r.student_id, key: r.key, value: r.value, updated_at: now() };
      DB.kv[r.student_id + '|' + r.key] = row;
      out.push(row);
    }
    return reply(201, rep ? out : undefined);
  }
  return reply(404, { message: 'no route ' + p });
}


module.exports = { DB, fetch: mockFetch, setOffline };
