FROM php:8.4-fpm
LABEL authors="andreas@heigl.org"

COPY --from=ghcr.io/php/pie:bin /pie /usr/bin/pie
COPY scripts /tmp
RUN bash -c "/tmp/php-build.sh"
RUN bash -c "/tmp/php-install-composer.sh"
RUN bash -c "/tmp/php-install-phive.sh"
WORKDIR "/var/www/php.ug"
