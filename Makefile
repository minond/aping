-include vendor/minond/scaffold/plugins/js.mk

install: dependencies
	@npm install

dependencies:
	@git submodule update --init

documentation: install
	@./scripts/client-documentation client

test: install js-mocha
lint: install
	$(NPM_BIN)/jscs $(JS_JSCS_FLAGS) $(JS_JSCS_FILES) client
	$(NPM_BIN)/jshint $(JS_JSHINT_FLAGS) $(JS_JSHINT_FILES) client
	$(NPM_BIN)/cr $(JS_COMPLEXITY_FLAGS) $(JS_COMPLEXITY_FILES) client
