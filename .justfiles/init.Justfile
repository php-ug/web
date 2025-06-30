# Generate the TLS certificates with mkcert for NGINX container
[group("Init:tls")]
init-tls-generate:
    mkdir .docker/nginx/ssl -p
    mkcert -cert-file .docker/nginx/ssl/php.ug.lo.crt -key-file .docker/nginx/ssl/php.ug.lo.key "*.php.ug.lo" "php.ug.lo"

# Install the local CA in the host system trust store
[group("Init:tls")]
init-tls-ca-install:
    mkcert -install
