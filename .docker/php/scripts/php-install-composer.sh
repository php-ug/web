#!/bin/bash

EXPECTED_CHECKSUM="$(php -r 'copy("https://composer.github.io/installer.sig", "php://stdout");')"
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
ACTUAL_CHECKSUM="$(php -r "echo hash_file('sha384', 'composer-setup.php');")"
if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]; then rm composer-setup.php ; exit 1; fi
php composer-setup.php --quiet
rm composer-setup.php
mv ./composer.phar /usr/local/bin/composer
chmod 755 /usr/local/bin/composer
