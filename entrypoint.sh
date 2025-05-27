#!/bin/bash
# entrypoint.sh

# ——— Mapeo de variables EasyPanel ——–
: "${ODOO_DB_HOST:=${HOST}}"
: "${ODOO_DB_PORT:=${PORT}}"
: "${ODOO_DB_USER:=${USER}}"
: "${ODOO_DB_PASSWORD:=${PASSWORD}}"

# Y para proxy_mode
: "${ODOO_PROXY_MODE:=${ODOO_PROXY}}"

# ——— Valores por defecto ——–
: "${ODOO_XMLRPC_PORT:=8069}"
: "${ODOO_LONGPOLLING_PORT:=8072}"
: "${ODOO_LOG_LEVEL:=info}"
: "${ODOO_DATA_DIR:=/var/lib/odoo}"
: "${ODOO_SESSIONS_DIR:=${ODOO_DATA_DIR}/sessions}"
: "${ODOO_SESSION_STORE:=file}"
: "${ODOO_ADDONS_PATH:=/mnt/extra-addons}"

ODOO_CONF="/etc/odoo/odoo.conf"

# 1) Generar odoo.conf
cat > $ODOO_CONF <<EOF
[options]
addons_path = ${ODOO_ADDONS_PATH}
data_dir = ${ODOO_DATA_DIR}
xmlrpc_port = ${ODOO_XMLRPC_PORT}
longpolling_port = ${ODOO_LONGPOLLING_PORT}
proxy_mode = ${ODOO_PROXY_MODE}
log_level = ${ODOO_LOG_LEVEL}

workers = 7
max_cron_threads = 2
limit_memory_soft = 3145728000   ;  3 GB
limit_memory_hard = 3435973836   ; ~3.2 GB
limit_time_cpu = 120             ; 120 seg CPU
limit_time_real = 240            ; 240 seg real

; sesiones en disco
sessions_dir = ${ODOO_SESSIONS_DIR}
session_store = ${ODOO_SESSION_STORE}
EOF

# 2) Añadir DB si se pasaron:
[[ -n "$ODOO_DB_HOST"     ]] && echo "db_host = ${ODOO_DB_HOST}"     >> $ODOO_CONF
[[ -n "$ODOO_DB_PORT"     ]] && echo "db_port = ${ODOO_DB_PORT}"     >> $ODOO_CONF
[[ -n "$ODOO_DB_USER"     ]] && echo "db_user = ${ODOO_DB_USER}"     >> $ODOO_CONF
[[ -n "$ODOO_DB_PASSWORD" ]] && echo "db_password = ${ODOO_DB_PASSWORD}" >> $ODOO_CONF

echo "=== odoo.conf generado ==="
cat $ODOO_CONF
echo "=========================="

# 3) Asegurar directorio de sesiones
mkdir -p "${ODOO_SESSIONS_DIR}"
chown -R odoo:odoo "${ODOO_SESSIONS_DIR}"
chmod 700 "${ODOO_SESSIONS_DIR}"

# 4) Arrancar Odoo
exec odoo -c $ODOO_CONF