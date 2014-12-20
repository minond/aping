-include .scaffold/plugins/js.mk

JS_ISTANBUL_EXTRA_FLAGS = --include-all-sources \
	-x **/coverage/** -x **/client/**

all:: install lint test apitest documentation

test: install js-mocha

install: dependencies
	@npm install

dependencies:
	@git submodule update --init

documentation: install
	@echo "## Clients" > SUPPORT.md
	@echo "" >> SUPPORT.md
	@$(NPM_BIN)/text-documentor client >> SUPPORT.md

apitest:
	@$(NPM_BIN)/mocha --timeout 20000 test/integration/*

lint: install
	$(NPM_BIN)/jscs $(JS_JSCS_FLAGS) $(JS_JSCS_FILES) client transformer
	$(NPM_BIN)/jshint $(JS_JSHINT_FLAGS) $(JS_JSHINT_FILES) client transformer
	$(NPM_BIN)/cr $(JS_COMPLEXITY_FLAGS) $(JS_COMPLEXITY_FILES) client transformer
