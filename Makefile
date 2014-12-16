-include vendor/minond/scaffold/plugins/js.mk

JS_ISTANBUL_EXTRA_FLAGS = --include-all-sources \
	-x **/coverage/** -x **/client/**

install: dependencies
	@npm install

dependencies:
	@git submodule update --init

documentation: install
	@$(NPM_BIN)/text-documentor client

apitest:
	@$(NPM_BIN)/mocha --timeout 20000 test/integration/*

test: install js-mocha
lint: install
	$(NPM_BIN)/jscs $(JS_JSCS_FLAGS) $(JS_JSCS_FILES) client scripts transformer
	$(NPM_BIN)/jshint $(JS_JSHINT_FLAGS) $(JS_JSHINT_FILES) client scripts transformer
	$(NPM_BIN)/cr $(JS_COMPLEXITY_FLAGS) $(JS_COMPLEXITY_FILES) client scripts transformer
