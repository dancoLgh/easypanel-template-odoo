FROM odoo:17
USER root
RUN apt-get update && apt-get install -y \
    locales \
    && rm -rf /var/lib/apt/lists/* \
    && echo "es_ES.UTF-8 UTF-8" >> /etc/locale.gen \
    && locale-gen es_ES.UTF-8 \
    && update-locale LANG=es_ES.UTF-8
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


