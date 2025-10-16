(QA & CI)

Run unit tests and typecheck locally:

```bash
npm ci
npm test
npx tsc --noEmit
```

Playwright E2E (optional):

Install Playwright browsers and run tests:

```bash
npm run e2e:install
npm run e2e
```

CI:
- A GitHub Actions workflow (`.github/workflows/ci.yml`) runs tests on push/PR and builds+pushes a Docker image to GHCR when changes land on `main`.

