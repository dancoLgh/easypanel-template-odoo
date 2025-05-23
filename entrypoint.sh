#!/bin/bash

# Ruta del archivo de configuración que vamos a generar
ODOO_CONF="/etc/odoo/odoo.conf"

echo "[options]" > $ODOO_CONF

: "${ODOO_XMLRPC_PORT:=8069}"
: "${ODOO_LONGPOLLING_PORT:=8072}"
: "${ODOO_PROXY_MODE:=True}"
: "${ODOO_LOG_LEVEL:=info}"
: "${ODOO_DATA_DIR:=/var/lib/odoo}"
: "${ODOO_ADDONS_PATH:=/mnt/extra-addons}"

echo "addons_path = ${ODOO_ADDONS_PATH}" >> $ODOO_CONF
echo "data_dir = ${ODOO_DATA_DIR}" >> $ODOO_CONF
echo "xmlrpc_port = ${ODOO_XMLRPC_PORT}" >> $ODOO_CONF
echo "longpolling_port = ${ODOO_LONGPOLLING_PORT}" >> $ODOO_CONF
echo "proxy_mode = ${ODOO_PROXY_MODE}" >> $ODOO_CONF
echo "log_level = ${ODOO_LOG_LEVEL}" >> $ODOO_CONF

# Otras posibles variables que quieras agregar
[[ -n "$ODOO_DB_HOST" ]] && echo "db_host = ${ODOO_DB_HOST}" >> $ODOO_CONF
[[ -n "$ODOO_DB_PORT" ]] && echo "db_port = ${ODOO_DB_PORT}" >> $ODOO_CONF
[[ -n "$ODOO_DB_USER" ]] && echo "db_user = ${ODOO_DB_USER}" >> $ODOO_CONF
[[ -n "$ODOO_DB_PASSWORD" ]] && echo "db_password = ${ODOO_DB_PASSWORD}" >> $ODOO_CONF

echo "Archivo odoo.conf generado:"
cat $ODOO_CONF
echo ""

# Ejecutar el comando original de Odoo
exec odoo -c $ODOO_CONF
