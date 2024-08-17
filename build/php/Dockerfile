FROM php:apache


RUN apt-get update \
    && apt-get install -y libssh2-1-dev libssh2-1 \
    && pecl install ssh2 \
    && docker-php-ext-enable ssh2 \
    && docker-php-ext-install mysqli
