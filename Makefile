-include vendor/minond/scaffold/plugins/js.mk

dependencies:
	git submodule update --init

install: dependencies
	npm install

documentation:
	./scripts/client-documentation client

test: js-mocha
lint: js-lint
