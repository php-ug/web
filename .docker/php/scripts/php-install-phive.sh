#!/bin/bash

curl -Lo phive.phar https://phar.io/releases/phive.phar
curl -Lo phive.phar.asc https://phar.io/releases/phive.phar.asc
gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys 0x9D8A98B29B2D5D79
gpg --verify phive.phar.asc phive.phar
chmod +x phive.phar
mv phive.phar /usr/local/bin/phive
