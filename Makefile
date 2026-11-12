FRONTEND := frontend
DESA ?= TINGGI
UV ?= uv

.DEFAULT_GOAL := help
.PHONY: help setup install env db seed dev test typecheck lint check build start gate pipeline-inputs pipeline-fetch pipeline-run pipeline-test clean

help:
	@echo "setup           npm ci + uv sync + salin .env + buat data/dev.db"
	@echo "install         npm ci dan uv sync"
	@echo "env             salin .env.example ke .env bila belum ada"
	@echo "db              buat ulang data/dev.db (25 desa uji)"
	@echo "seed            buat akun demo, DESA=TINGGI secara bawaan"
	@echo "dev             jalankan next dev"
	@echo "test            npm test + pytest"
	@echo "typecheck       next typegen + tsc --noEmit"
	@echo "lint            eslint"
	@echo "build           next build"
	@echo "start           next build lalu next start"
	@echo "gate            test + typecheck + lint + build"
	@echo "pipeline-inputs unduh batas desa HDX dan gambut WRI/GFW"
	@echo "pipeline-fetch  unduh FIRMS, butuh FIRMS_MAP_KEY"
	@echo "pipeline-run    jalankan seluruh pipeline, tulis data/siapkemarau.db"
	@echo "clean           hapus frontend/.next"

setup: install env db

install:
	cd $(FRONTEND) && npm ci
	$(UV) sync

env:
	@test -f $(FRONTEND)/.env || cp $(FRONTEND)/.env.example $(FRONTEND)/.env
	@test -f .env || cp .env.example .env
	@echo "Isi DEMO_PASSWORD di $(FRONTEND)/.env; isi FIRMS_MAP_KEY di .env bila menjalankan pipeline."

db:
	@echo "Membuat ulang data/dev.db (data uji)."
	cd $(FRONTEND) && npx tsx scripts/dev-db.ts

seed:
	cd $(FRONTEND) && npx tsx scripts/seed-accounts.ts --desa $(DESA)

dev:
	cd $(FRONTEND) && npm run dev

test:
	cd $(FRONTEND) && npm test
	$(UV) run pytest pipeline/tests -q

typecheck:
	cd $(FRONTEND) && npm run typecheck

lint:
	cd $(FRONTEND) && npm run lint

check: typecheck lint

build:
	cd $(FRONTEND) && npm run build

start: build
	cd $(FRONTEND) && npm start

gate: test check build

pipeline-inputs:
	$(UV) run python pipeline/fetch_inputs.py

pipeline-fetch:
	$(UV) run python pipeline/fetch_firms.py

pipeline-run:
	$(UV) run python pipeline/run_all.py

pipeline-test:
	$(UV) run pytest pipeline/tests -q

clean:
	rm -rf $(FRONTEND)/.next
