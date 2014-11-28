-include vendor/minond/scaffold/plugins/js.mk

install: dependencies
	npm install

dependencies:
	@git submodule update --init

documentation: install
	@./scripts/client-documentation client

test: install js-mocha
lint: install js-lint
