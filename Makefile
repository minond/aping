-include .scaffold/plugins/js.mk

js_istanbul_extra_flags = --include-all-sources \
	-x **/coverage/** -x **/client/**

default:: install lint test apitest documentation

test: install js-mocha

install: dependencies
	@npm install

dependencies:
	@git submodule update --init

documentation: install
	@echo "## Clients" > SUPPORT.md
	@echo "" >> SUPPORT.md
	@$(npm_bin)/text-documentor client >> SUPPORT.md

apitest:
	@$(npm_bin)/mocha --timeout 20000 test/integration/*

lint: install
	$(npm_bin)/jscs $(js_jscs_flags) $(js_jscs_files) client transformer
	$(npm_bin)/jshint $(js_jshint_flags) $(js_jshint_files) client transformer
	$(npm_bin)/cr $(js_complexity_flags) $(js_complexity_files) client transformer
