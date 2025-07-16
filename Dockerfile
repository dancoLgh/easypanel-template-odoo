# Dockerfile

# 1. Usar la imagen base de Odoo 18
FROM odoo:18

USER root

# 2. Instalar dependencias del sistema y locales
RUN apt-get update && apt-get install -y \
    locales \
    python3-venv \
    python3-pip \
  && rm -rf /var/lib/apt/lists/* \
  && echo "es_ES.UTF-8 UTF-8" >> /etc/locale.gen \
  && locale-gen es_ES.UTF-8 \
  && update-locale LANG=es_ES.UTF-8

# 3. Crear entorno virtual e instalar paquetes
RUN python3 -m venv /opt/venv \
  && /opt/venv/bin/pip install --upgrade pip setuptools \
  && /opt/venv/bin/pip install \
    woocommerce \
    pillow \
    dropbox \
    pyncclient \
    nextcloud-api-wrapper \
    boto3 \
    paramiko \
    cachetools \
    shipday

# 4. Añadir el entorno virtual al PATH 
ENV PATH="/opt/venv/bin:$PATH"

# 5. Crear directorio de datos y sesiones, y asignar permisos
RUN mkdir -p /var/lib/odoo/sessions \
  && chown -R odoo:odoo /var/lib/odoo/sessions \
  && chmod 700 /var/lib/odoo/sessions

# 6. Copiar el entrypoint y hacerlo ejecutable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 7. Montar el volumen de datos (opcional, pero recomendable)
VOLUME ["/var/lib/odoo", "/mnt/extra-addons"]

# 8. Usar nuestro entrypoint
ENTRYPOINT ["/entrypoint.sh"]
