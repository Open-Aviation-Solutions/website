# Development/build image for the Open Aviation Solutions website.
#
# Provides Node.js (matching CI) plus the Vale prose linter and the en_AU
# Hunspell dictionary it spell-checks against, so `make dev`/`build`/`check`
# all work without installing any toolchain on the host. Used by the Makefile
# via docker or podman.
FROM node:24-bookworm-slim

# - hunspell-en-au: the en_AU dictionary Vale's spell check reads from
#   /usr/share/hunspell (see .vale/styles/OpenAviation/Spelling.yml). Vale parses
#   the .dic/.aff files directly, so libhunspell itself is not needed.
# - ca-certificates + curl: only used below to fetch the Vale binary.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ca-certificates \
      hunspell-en-au \
      curl \
 && rm -rf /var/lib/apt/lists/*

# Vale: a single static binary. Keep VALE_VERSION in sync with .github/workflows/ci.yml.
ARG VALE_VERSION=3.14.2
RUN arch="$(dpkg --print-architecture)" \
 && case "$arch" in \
      amd64) valearch="64-bit" ;; \
      arm64) valearch="arm64" ;; \
      *) echo "unsupported architecture: $arch" >&2; exit 1 ;; \
    esac \
 && curl -sSfL "https://github.com/vale-cli/vale/releases/download/v${VALE_VERSION}/vale_${VALE_VERSION}_Linux_${valearch}.tar.gz" \
      | tar -xz -C /usr/local/bin vale

# lychee: the link checker `make check-links` runs over the built site. The
# statically linked musl build runs regardless of the base image's glibc
# version. Keep LYCHEE_VERSION in sync with .github/workflows/link-check.yml.
ARG LYCHEE_VERSION=0.24.2
RUN arch="$(dpkg --print-architecture)" \
 && case "$arch" in \
      amd64) lycheearch="x86_64-unknown-linux-musl" ;; \
      arm64) lycheearch="aarch64-unknown-linux-musl" ;; \
      *) echo "unsupported architecture: $arch" >&2; exit 1 ;; \
    esac \
 && curl -sSfL "https://github.com/lycheeverse/lychee/releases/download/lychee-v${LYCHEE_VERSION}/lychee-${lycheearch}.tar.gz" \
      | tar -xz -C /usr/local/bin --strip-components=1 "lychee-${lycheearch}/lychee"

WORKDIR /app
