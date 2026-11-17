# Story Content — Verification record (T-059)

Date: 16/11/2026. Branch: `duy`, as explicitly requested by the user. Scope approved in DEC-026.

## Final results

| Check actually run | Result |
|---|---|
| `frontend/npm run check` | PASS: ESLint without warnings/errors, Prettier, 27 Vitest files / 204 tests, Vite production build |
| `backend/mvn -Dmaven.repo.local=C:/Users/Admin/.m2/repository clean test -q` | PASS: 17 tests, 0 failures/errors/skips (totals read from Surefire XML) |
| `python scripts/chapter1/validate.py` | PASS: 6,290 assertions, 1,264 nodes, 43 statements, no broken/unreachable targets |
| `python scripts/chapter1/validate.py --overrides frontend/node_modules/.cache/story-content-overrides.json` | PASS: same 6,290 assertions against a temporary merge changing all 813 permitted fields with an appended newline; graph remainder equality checked |
| Browser E2E, final complete run | PASS: 4 tests in 2.4 minutes on Chrome, including both complete Chapter 1 paths and the new Admin/player workflow |
| Manifest generation / `--check` | PASS: current registry identity/hash/813 field count; unchanged input no longer rewrites the manifest or causes Vite reload |
| `git diff --check` | PASS |
| Source/graph/schema preservation | No diff under docs/sources, frontend/public/assets/chapters/chapter1, or original backend db/schema.sql |

Maven needed its existing user repository path because the environment default pointed to an inaccessible C:/.m2. No application dependency or version was added/changed.

The declared `@playwright/test` package is not installed on this machine, so `npm run test:e2e` initially could not find its runner. Browser verification used the genuine bundled Playwright 1.62.1 CLI/test exports through an external tooling-only import alias. The project declaration and lockfile were not changed. The final four-test command was the bundled `playwright/cli.js test` with STORY_TEST_API set to the disposable local backend. This records the tooling difference rather than claiming execution under the uninstalled declared runner version.

## What the live test demonstrated

- Real JWT login/register, real Spring Security, JPA, MySQL and the React Admin page.
- Non-Admin receives 403 for editorial endpoints; anonymous receives 401. Player route redirects to /play.
- Forbidden payload with a route change receives 400; stale draft revision receives 409.
- Draft survives page reload and does not appear in the player publication API.
- Validate → preview → review acknowledgement → publish changes only the chosen text field. The fixture adds a newline to existing source text; no new narrative was written.
- Player endpoint does not contain draft revision or full graph metadata.
- A running player continues to see its pinned text after a newer version is published.
- Continuing the same local save picks up the newer published wording at the same node.
- Restoration writes only a new draft, clears prior approval fingerprints, and leaves the current publication unchanged.
- Desktop 1280px and mobile 390px screenshots were captured and visually inspected. Mobile horizontal overflow check passed; history layout was adjusted and inspected again.
- JS unit checks cover invalid/baseline-mismatched publications, atomic merge rejection, immutable session copies, matching offline cache, and explicit empty-publication cache clearing.
- Java tests cover lifecycle prerequisites, idempotent publishing, invalidation after edits, immutable version history, input/length/hash guards, and the real SecurityFilterChain through MockMvc.

The pre-existing canvas tests use their fake browser auth and an explicit empty-publication API fixture. The separate Story Content E2E uses actual protected backend responses. Both complete Chapter 1 paths also run against text-edited graphs in Vitest.

## Issues found and resolved

1. JPA initially expected VARCHAR for supplemental CHAR(64) columns. Added explicit CHAR JDBC mapping; the real backend then started successfully with ddl-auto=validate and the unchanged supplemental SQL.
2. Default access-denied handling triggered Tomcat /error dispatch and returned 401 instead of 403. An explicit 403 handler now avoids that dispatch; live API and security tests confirm the intended distinction.
3. Rewriting an unchanged manifest during a simultaneous check/build caused Vite reloads during two browser tests. Generator now writes only changed content. The complete final browser run was performed after edits/build activity had finished and passed all four cases.

## Data and process cleanup

- Applied only the approved supplemental three-table SQL to the local detective_game database.
- Live publication tests used a separately created disposable database, not detective_game. That test database was dropped after tests.
- The three supplemental tables in detective_game were checked after cleanup: chapter pointers = 0, drafts = 0, versions = 0. No fixture publication was left in the user's game database.
- Task-owned test backend (18981) and Vite (5196) were stopped; their listener ports were checked closed.
- No commit or push was performed. Unrelated pre-existing working changes, including AGENTS.md, were preserved.

## Remaining practical limits

The game uses fallback fonts because the pre-existing Playfair Display and Be Vietnam Pro TTF files are absent; build and game remain functional with their existing fallback behavior. This task did not add font assets. ISS-29 server-save identity is unchanged and does not block Story Content publication. Runtime narration/action and stored Notebook/history text retain the limitations documented in STORY_CONTENT.md.
