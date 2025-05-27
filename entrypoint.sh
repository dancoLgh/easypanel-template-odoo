#!/bin/bash
# entrypoint.sh

# Ruta donde generaremos el odoo.conf
ODOO_CONF="/etc/odoo/odoo.conf"

# Variables por defecto (puedes sobreescribirlas al levantar el contenedor)
: "${ODOO_XMLRPC_PORT:=8069}"
: "${ODOO_LONGPOLLING_PORT:=8072}"
: "${ODOO_PROXY_MODE:=True}"
: "${ODOO_LOG_LEVEL:=info}"
: "${ODOO_DATA_DIR:=/var/lib/odoo}"
: "${ODOO_SESSIONS_DIR:=${ODOO_DATA_DIR}/sessions}"
: "${ODOO_SESSION_STORE:=file}"
: "${ODOO_ADDONS_PATH:=/mnt/extra-addons}"

# Opcionales para PostgreSQL (exportar DB_HOST, DB_PORT, DB_USER, DB_PASSWORD)
: "${ODOO_DB_HOST:=}"
: "${ODOO_DB_PORT:=}"
: "${ODOO_DB_USER:=}"
: "${ODOO_DB_PASSWORD:=}"

# 1. Generar configuración
cat > $ODOO_CONF <<EOF
[options]
addons_path = ${ODOO_ADDONS_PATH}
data_dir = ${ODOO_DATA_DIR}
xmlrpc_port = ${ODOO_XMLRPC_PORT}
longpolling_port = ${ODOO_LONGPOLLING_PORT}
proxy_mode = ${ODOO_PROXY_MODE}
log_level = ${ODOO_LOG_LEVEL}

; sesiones en disco
sessions_dir = ${ODOO_SESSIONS_DIR}
session_store = ${ODOO_SESSION_STORE}
EOF

# 2. Si se han pasado credenciales DB, agregarlas
if [[ -n "$ODOO_DB_HOST" ]]; then
  echo "db_host = ${ODOO_DB_HOST}" >> $ODOO_CONF
fi
if [[ -n "$ODOO_DB_PORT" ]]; then
  echo "db_port = ${ODOO_DB_PORT}" >> $ODOO_CONF
fi
if [[ -n "$ODOO_DB_USER" ]]; then
  echo "db_user = ${ODOO_DB_USER}" >> $ODOO_CONF
fi
if [[ -n "$ODOO_DB_PASSWORD" ]]; then
  echo "db_password = ${ODOO_DB_PASSWORD}" >> $ODOO_CONF
fi

# 3. Mostrar el archivo generado (útil para depuración)
echo "=== odoo.conf generado ==="
cat $ODOO_CONF
echo "=========================="

# 4. Asegurar que exista y tenga permisos el directorio de sesiones
mkdir -p "${ODOO_SESSIONS_DIR}"
chown -R odoo:odoo "${ODOO_SESSIONS_DIR}"
chmod 700 "${ODOO_SESSIONS_DIR}"

# 5. Ejecutar Odoo con la configuración creada
exec odoo -c $ODOO_CONF
