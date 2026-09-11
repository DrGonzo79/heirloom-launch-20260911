# Heirloom Launch

A runnable prototype for screening a family food recipe before its first commercial production run. Enter fictional recipe economics, select a product and channel, and receive deterministic margin, cash, shelf-life, and demo co-packer-fit results.

**Demo:** https://drgonzo79.github.io/heirloom-launch-20260911/

## What works

- Responsive Next.js App Router workbench with validated product and economics inputs.
- Loading, validation, passed, blocked, and no-match states.
- Deterministic first-run cash, contribution, readiness, and blocker calculation.
- Selectable fictional co-packer route as a second working interaction.
- FastAPI domain operation using the same explicit fixture and validation rules.
- Python integration tests and Playwright desktop/mobile interaction and overflow tests.

Every company, certification, price, score, and result is fictional. This is not food-safety, legal, vendor, or investment advice. No recipe is uploaded or stored. GitHub Pages hosts the static frontend only; FastAPI is tested source and is not deployed.

## Run and verify

```bash
npm ci
npm run dev
npm run typecheck
npm run test:e2e
npm run build
npm audit --audit-level=high
cd api && uv sync --frozen && uv run pytest -q
```

Run the API with `cd api && uv run uvicorn main:app --reload`. The Pages demo mirrors its deterministic operation client-side.

## Documentation

- [Source notes](research/notes.md)
- [Office Hours diagnostic](docs/OFFICE_HOURS.md)
- [Product plan](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [CEO review](docs/CEO_REVIEW.md)
- [Phased build prompts](docs/BUILD_PROMPTS.md)
