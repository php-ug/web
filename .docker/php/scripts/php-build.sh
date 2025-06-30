#!/bin/bash
# Build PHP
set -xe

# persistent / runtime deps
PHPIZE_DEPS="autoconf \
    cmake \
    file \
    g++ \
    gcc \
    libc-dev \
    libpcre2-dev \
    make \
    git \
    pkgconf \
    re2c \
    libfreetype6-dev \
    libpng-dev  \
    libicu-dev \
    libxml2-dev \
    libzip-dev \
    libpcre2-dev \
    libfreetype6-dev \
    libjpeg-dev \
    libc-client-dev \
    libkrb5-dev \
    libmagickwand-dev \
    libjpeg-dev"
apt-get update
apt-get install -y \
    gpg \
    unzip

apt-get install -y $PHPIZE_DEPS
docker-php-ext-configure gd
docker-php-ext-configure bcmath --enable-bcmath
docker-php-ext-configure intl --enable-intl
docker-php-ext-configure pcntl --enable-pcntl
docker-php-ext-configure pdo_mysql
docker-php-ext-configure mysqli
docker-php-ext-configure soap --enable-soap
docker-php-ext-install -j$(nproc) \
        gd \
        bcmath \
        intl \
        pcntl \
        pdo_mysql \
        mysqli \
        soap \
        sockets \
        opcache

pie install phpredis/phpredis
pie install imagick/imagick
pie install pecl/zip

pie install xdebug/xdebug
echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
echo "xdebug.discover_client_host=on" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
echo "memory_limit=-1" >> /usr/local/etc/php/php.ini

apt-get remove -y $PHPIZE_DEPS
