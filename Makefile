.PHONY: help dev build preview install test lint-prose check

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "%-12s %s\n", $$1, $$2}'

node_modules: package.json package-lock.json
	npm install
	@touch node_modules

install: node_modules ## Install dependencies

dev: node_modules ## Start dev server at localhost:4321
	npm run dev

build: node_modules ## Build site to ./dist/
	npm run build

preview: build ## Preview the built site locally
	npm run preview

test: node_modules ## Run e2e tests (requires Chromium — install with: npx playwright install --with-deps chromium)
	npm test

lint-prose: ## Spell- and style-check content with Vale
	vale src/content/docs/

check: lint-prose ## Run all checks
