# Dockerfile
# Usar la imagen base de Odoo 17
FROM odoo:17
# Instalar dependencias del sistema
USER root
# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    locales \
    && rm -rf /var/lib/apt/lists/* \
    && echo "es_ES.UTF-8 UTF-8" >> /etc/locale.gen \
    && locale-gen es_ES.UTF-8 \
    && update-locale LANG=es_ES.UTF-8
# Establecer la variable de entorno para la localización
RUN pip3 install \
    woocommerce \
    pillow \
    dropbox \
    pyncclient \
    nextcloud-api-wrapper \
    boto3 \
    paramiko\
    cachetools\
    shipday

# Copiar el entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Usar nuestro entrypoint personalizado
ENTRYPOINT ["/entrypoint.sh"]


