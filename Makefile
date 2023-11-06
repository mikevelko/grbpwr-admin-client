DEFAULT_GOAL := up
VERSION := $(shell git describe --tags --always --long |sed -e "s/^v//")
GO_LINT_VERSION := v1.53.3

.PHONY: generate internal/statics proto

init: submodules clean install proto

install: ## Install the web dependencies
	yarn install --ignore-engines

dev: ## Run the local dev server
	yarn dev

build-dist: ## Build dist version
	yarn build

proto:
	buf generate --path proto/common/buyer.proto && \
	buf generate --path proto/common/dict.proto && \
	buf generate --path proto/common/filter.proto && \
	buf generate --path proto/common/media.proto && \
	buf generate --path proto/common/order.proto && \
	buf generate --path proto/common/payment.proto && \
	buf generate --path proto/common/product.proto && \
	buf generate --path proto/common/promo.proto && \
	buf generate --path proto/common/shipment.proto && \
	buf generate --path proto/common/subscription.proto && \
	buf generate --path proto/admin/admin.proto \
	--path proto/auth/auth.proto \
	--path proto/frontend/frontend.proto 

clean:
	rm -rf dist
	rm -rf src/api/proto-http/*

submodules:
	git submodule update --init --recursive