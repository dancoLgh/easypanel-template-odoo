#!/bin/bash
# entrypoint.sh

# ——— Mapear variables de EasyPanel ———
: "${ODOO_DB_HOST:=${HOST}}"
: "${ODOO_DB_PORT:=${PORT}}"
: "${ODOO_DB_USER:=${USER}}"
: "${ODOO_DB_PASSWORD:=${PASSWORD}}"

# Si ODOO_MASTER_PASSWORD no viene definido, generar uno aleatorio de 16 caracteres
if [ -z "$ODOO_MASTER_PASSWORD" ]; then
  # tr + /dev/urandom => caracteres alfanuméricos aleatorios
  ODOO_MASTER_PASSWORD=$(tr -dc 'A-Za-z0-9' </dev/urandom | head -c 16)
  echo "Generando master password aleatoria: $ODOO_MASTER_PASSWORD"
fi

# Proxy mode (EasyPanel)
: "${ODOO_PROXY_MODE:=${ODOO_PROXY}}"

# ——— Valores por defecto ———
: "${ODOO_XMLRPC_PORT:=8069}"
: "${ODOO_LONGPOLLING_PORT:=8072}"
: "${ODOO_LOG_LEVEL:=info}"
: "${ODOO_DATA_DIR:=/var/lib/odoo}"
: "${ODOO_SESSIONS_DIR:=${ODOO_DATA_DIR}/sessions}"
: "${ODOO_SESSION_STORE:=file}"
: "${ODOO_ADDONS_PATH:=/mnt/extra-addons}"

ODOO_CONF="/etc/odoo/odoo.conf"

if [ ! -f "$ODOO_CONF" ]; then
  # 1) Sólo si no existe, crear odoo.conf
  cat > "$ODOO_CONF" <<EOF
[options]
addons_path = ${ODOO_ADDONS_PATH}
data_dir = ${ODOO_DATA_DIR}
xmlrpc_port = ${ODOO_XMLRPC_PORT}
longpolling_port = ${ODOO_LONGPOLLING_PORT}
proxy_mode = ${ODOO_PROXY_MODE}
log_level = ${ODOO_LOG_LEVEL}

workers = 7
max_cron_threads = 2
limit_memory_soft = 3145728000
limit_memory_hard = 3435973836
limit_time_cpu = 120
limit_time_real = 240

; sesiones en disco
sessions_dir = ${ODOO_SESSIONS_DIR}
session_store = ${ODOO_SESSION_STORE}

; —— Contraseña maestra ——
admin_passwd = ${ODOO_MASTER_PASSWORD}
EOF

  # 2) Agregar credenciales de BD si vienen por variable
  [[ -n "$ODOO_DB_HOST"     ]] && echo "db_host = ${ODOO_DB_HOST}"     >> "$ODOO_CONF"
  [[ -n "$ODOO_DB_PORT"     ]] && echo "db_port = ${ODOO_DB_PORT}"     >> "$ODOO_CONF"
  [[ -n "$ODOO_DB_USER"     ]] && echo "db_user = ${ODOO_DB_USER}"     >> "$ODOO_CONF"
  [[ -n "$ODOO_DB_PASSWORD" ]] && echo "db_password = ${ODOO_DB_PASSWORD}" >> "$ODOO_CONF"

  echo "=== odoo.conf GENERADO por primera vez ==="
  cat "$ODOO_CONF"
  echo "=========================================="
else
  echo "odoo.conf ya existe en /etc/odoo. No lo sobrescribo."
fi

# 3) Asegurar directorio de sesiones
mkdir -p "${ODOO_SESSIONS_DIR}"
chown -R odoo:odoo "${ODOO_SESSIONS_DIR}"
chmod 700 "${ODOO_SESSIONS_DIR}"

# 4) Arrancar Odoo usando el config persistente
exec odoo -c "$ODOO_CONF"
