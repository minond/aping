-include vendor/minond/scaffold/plugins/js.mk

dependencies:
	@git submodule update --init

install: dependencies
	npm install

documentation: install
	@./scripts/client-documentation client

test: install js-mocha
lint: install js-lint
