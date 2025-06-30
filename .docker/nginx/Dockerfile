FROM nginx:latest
LABEL authors="andreas@heigl.org"

COPY ./ssl /etc/nginx/ssl
WORKDIR /etc/nginx
#
# This requires to have these commands run inside the nginx-folder to create the CA certificates
#
# > openssl genrsa -out ssl/ca.key 4096; \
# > openssl req -x509 -new -nodes -subj "/C=ug/O=php/CN=development certificates;" -key ssl/ca.key -sha512 -days 3650 -out ssl/ca.crt;
#
RUN apt-get update && apt-get install -y openssl && \
    openssl genrsa -out "ssl/php.ug.lo.key" 2048 && \
    openssl req -new -subj "/C=ug/O=php/CN=php.ug.lo.lo" -key "ssl/php.ug.lo.key" -out "ssl/php.ug.lo.csr" && \
    openssl x509 -req -in "ssl/php.ug.lo.csr" -extfile "ssl/php.ug.lo.ext" -CA "ssl/ca.crt" -CAkey "ssl/ca.key" -CAcreateserial -out "ssl/php.ug.lo.crt" -days=365 -sha512 && \
    rm "ssl/php.ug.lo.csr" "ssl/ca.key" && \
    apt-get remove -y openssl

WORKDIR /var/www/php.ug/public



