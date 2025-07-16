# Dockerfile

# 1. Usar la imagen base de Odoo 17
FROM odoo:18

USER root

# 2. Instalar dependencias del sistema y locales
RUN apt-get update && apt-get install -y \
    locales \
  && rm -rf /var/lib/apt/lists/* \
  && echo "es_ES.UTF-8 UTF-8" >> /etc/locale.gen \
  && locale-gen es_ES.UTF-8 \
  && update-locale LANG=es_ES.UTF-8

# 3. Instalar librerías Python
RUN pip3 install \
    woocommerce \
    pillow \
    dropbox \
    pyncclient \
    nextcloud-api-wrapper \
    boto3 \
    paramiko \
    cachetools \
    shipday

# 4. Crear directorio de datos y sesiones, y asignar permisos
RUN mkdir -p /var/lib/odoo/sessions \
  && chown -R odoo:odoo /var/lib/odoo/sessions \
  && chmod 700 /var/lib/odoo/sessions

# 5. Copiar el entrypoint y hacerlo ejecutable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 6. Montar el volumen de datos (opcional, pero recomendable)
VOLUME ["/var/lib/odoo", "/mnt/extra-addons"]

# 7. Usar nuestro entrypoint
ENTRYPOINT ["/entrypoint.sh"]
