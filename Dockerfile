# Usamos como base la imagen oficial de Odoo 17
FROM odoo:17

# Cambiamos a usuario root para poder instalar con pip y paquetes del sistema
USER root

# Instalamos dependencias del sistema y configuramos locale
RUN apt-get update && apt-get install -y \
    locales \
    && rm -rf /var/lib/apt/lists/* \
    && echo "es_ES.UTF-8 UTF-8" >> /etc/locale.gen \
    && locale-gen es_ES.UTF-8 \
    && update-locale LANG=es_ES.UTF-8


# Instalamos las librerías de Python que necesitamos
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

# Regresamos al usuario odoo para que la ejecución de Odoo sea correcta
USER odoo
