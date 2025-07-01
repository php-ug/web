#!/usr/bin/env just --justfile

export COMPOSE_BAKE := "true"

import '.justfiles/build.Justfile'
import '.justfiles/docker.Justfile'
import '.justfiles/init.Justfile'

# List all commands
list:
    @just --list --justfile {{ justfile() }}
