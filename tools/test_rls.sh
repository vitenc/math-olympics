#!/bin/sh
# Проверка supabase/schema.sql на временной локальной базе PostgreSQL.
# Нужен PostgreSQL (psql и сервер): поднимается на отдельном порту и
# удаляется после проверки. Запуск: sh tools/test_rls.sh
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd)
PGBIN=${PGBIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | tail -1)}
export PGOPTIONS="-c client_min_messages=warning"
PSQL="psql -X -q -v ON_ERROR_STOP=1 -h ${PGHOST:-/tmp} -p ${PGPORT:-5499} -U postgres"
DB=rls_test_$$

$PSQL -d postgres -c "create database $DB" >/dev/null
trap '$PSQL -d postgres -c "drop database if exists $DB" >/dev/null' EXIT
$PSQL -d $DB -f "$ROOT/supabase/test_shim.sql" >/dev/null
$PSQL -d $DB -f "$ROOT/supabase/schema.sql" >/dev/null
$PSQL -d $DB -f "$ROOT/supabase/schema.sql" >/dev/null     # повторный запуск не должен падать
$PSQL -d $DB -t -f "$ROOT/supabase/test_rls.sql"
