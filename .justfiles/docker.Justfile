# Start the local instance
[group("Docker")]
up:
    docker compose up -d nginx --remove-orphans

# Start the local instance and ALL workers
[group("Docker")]
up-all:
    docker compose up -d

# Build the PHP docker image
[group("Docker")]
build-php:
    docker compose build php

# Stop the running containers
[group("Docker")]
down:
    docker compose down --remove-orphans

# Open a shell in the running PHP container
[group("Docker")]
shell:
    docker compose exec php /bin/bash

# Show and follow the docker logs
[group("Docker")]
logs:
    docker compose logs --follow

[group("Docker")]
node:
	docker compose run node /bin/bash
