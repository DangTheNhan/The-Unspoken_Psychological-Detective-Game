> APPROVED 16/11/2026 — DEC-026. Implementation on branch duy per user instruction. The proposal text below records the reviewed contract.

# Story Content — Implementation Plan for Approval

Date: 16 November 2026. Project: The Unspoken.

**Status: approved for implementation — DEC-026.** The user approved all four decision groups on 16 November 2026, then explicitly selected branch `duy`. The proposal wording below is retained as the reviewed contract; operational instructions are in STORY_CONTENT.md.

## 1. Objective and verified baseline

Provide an Admin page for entering replacement text on existing narrative nodes. Preserve Data Contract 2.0 structure, route order, guards, effects, scoring, checkpoint behavior, and saved progress.

Evidence inspected in this planning task:

- Project.docx §5.1–5.2, including the original and newer reference copies: Admin analytics, bug management, and integration verification. These sections do not specify a story editor or its persistence/API.
- Data Contract 2.0, especially Node and paths, Conditions, Effects and provenance, and Notebook/Final/Phase Transition; CHAPTER1_MEMORY §0/§7/§9; CHAPTER1_PLAN §1–§5; DEC-016/019/023/024/025.
- `frontend/src/game/data/chapters.js`: only Chapter 1 is registered.
- The deployed runtime candidate, `frontend/public/assets/chapters/chapter1/chapter1.json`, has **1,264 nodes**. The immutable source package has 1,257. Use the current runtime graph as the editor baseline; do not replace it with the source package.
- `PreloadScene` caches static chapter JSON. `StoryScene` passes it into the pure story runner. React performs API calls through the existing bridge/EventBus architecture.
- Admin routes and `/api/admin/**` require ROLE_ADMIN. The SQL currently has no story text tables.

Important distinction: node text is not every text visible in the game. Notebook records can come from effects or saved state; deduction cards and slots come from the root deduction configuration; global interface labels come from `uiText.js`. Those sources remain outside this feature.

## 2. Exact proposed editable-field allowlist

Here `i` means the node position in the trusted baseline; the client identifies the node by its immutable ID. `j` means an existing choice index. Accept only fields that already exist and contain strings.

| Node type | Schema definition | Concrete graph path | Current fields |
|---|---|---|---:|
| dialogue | `#/$defs/node/properties/text` | `/nodes/i/text` | 542 |
| narration | same | `/nodes/i/text` | 78 |
| action | same | `/nodes/i/text` | 100 |
| ui | same | `/nodes/i/text` | 13 |
| choice | `#/$defs/node/properties/choices/items/properties/text` | `/nodes/i/choices/j/text` | 63 |
| investigation | same | `/nodes/i/choices/j/text` | 3 |
| cross_examination | same | `/nodes/i/choices/j/text` | 12 |
| deduction | same | `/nodes/i/choices/j/text` | 2 |
| **Total proposed for release 1** | | | **813** |

The schema has a generic node `text` property; it is not permission to edit that property on every node type. The server will enforce the specific type/path combinations above.

**Read-only in release 1:** the one `notebook_update.text`; all hotspot fields, including nine `hotspots[j].text` labels; root deduction text; catalog text; strings inside effects and conditions; speakers, expressions, IDs, targets, rules, handlers, state and checkpoint schemas; global UI translations; room inspection dialogue files. The source schema declares `hotspots` only as an array, without defining its item fields. Editing hotspot labels would require a separately approved allowlist extension.

Use structured override entries: `nodeId`, `field` (`text` or `choiceText`), `choiceIndex` only for choiceText, and `value`. The API will not accept arbitrary JSON pointers, object merges, JSON Patch operations, or a replacement graph. Resolve the actual path from the trusted baseline. A missing, duplicate, unknown, or out-of-range target is an error.

Proposed input constraints: plain Unicode strings; preserve entered whitespace and line breaks; reject null, non-string, and whitespace-only replacements. Suggested limits for approval: 4,000 Unicode code points for node text and 500 for choice labels. The current maximum lengths are 547 and 66 respectively. Saving the baseline wording removes that override; this restores text without deleting a node or a field. Do not introduce HTML or a new Markdown dialect. Preserve the player's existing removal of `**` when displaying story text.

### Existing schema discrepancy

The source schema requires `condition` on every choice. The runtime graph omits it on the new opening choices in P1_HALL_204, P1_ROOM_204_VIEW, and P1_ROOM_204_EXIT. The runner and the supplied custom validator accept a missing condition as true. The three source-package counterparts do not exist; the original source graph has no missing choice conditions.

**Recommended handling for approval:** retain this accepted runtime baseline, use the supplied schema to identify editable text fields, and validate with the existing supported validator plus strict override/invariance checks. Do not silently add conditions, modify the source schema, or claim full JSON Schema conformance. If full validation against the unmodified source schema is required, resolve that discrepancy in a separately approved change before implementation.

### Actual display behavior

- Dialogue and UI text can appear through the existing player presentation paths.
- Narration and action nodes are automatically traversed by `storyRunner.js`; their edited text will be stored and previewable as content, but this feature will not start displaying them in dialogue boxes.
- Labels on some choices are presented through map interactions or contextual menus, rather than as a permanent button list.
- Editing a dialogue line does not rewrite matching words inside a Statement/Evidence record, root deduction data, or previously saved conversation history. Admins must review meaning and consistency manually.

## 3. Persistence options and recommendation

The existing project documents do not define this storage contract. The following are proposals, not existing requirements.

| Option | Benefits | Drawbacks |
|---|---|---|
| MySQL draft + immutable published override versions | Uses the approved stack; durable across restarts; supports transactional publication and version history | Requires additional approved tables, entities and deployment SQL |
| Server-managed versioned JSON files outside the source tree | Avoids new database tables; easy to inspect/export | Requires writable server storage, backup and file locking; publication and concurrency become more involved |
| Browser-local drafts with manual export | Smallest backend change for drafting | Does not provide shared persistent editing and direct publication to all players; insufficient for the full requested workflow |

**Recommend MySQL.** Store only sparse text overrides and editorial metadata. Each published version is a complete snapshot of the override set, not a copy of the story graph.

Proposed additional tables:

| Table | Purpose and principal fields |
|---|---|
| `story_text_chapters` | Registered chapter ID; pointer to the active published version; optimistic-lock revision |
| `story_text_drafts` | One working draft per chapter; base graph hash, contract/allowlist versions, draft revision, overrides JSON, validation/preview fingerprints, author and update time |
| `story_text_versions` | Immutable release ID; chapter, base hash and format versions; overrides JSON/checksum; publication author/time; parent or restored-from version; originating draft revision |

Use LONGTEXT for serialized override sets and existing Jackson/JPA capabilities. Publishing creates a version and updates the active pointer in one transaction. Reject concurrent stale saves/publications with HTTP 409. A repeated publication of the same current draft must not produce duplicate releases.

Add an explicitly approved supplemental SQL file for these tables; leave the original `db/schema.sql` verbatim. Keep `ddl-auto=validate`. No migration library or other dependency is proposed. Table creation must precede deployment of entities that expect them.

### Trusted baseline and deployment

The backend needs the same trusted graph that the frontend ships. Do not accept a graph or an allowlist from a browser, and do not read `docs/sources` as the runtime baseline.

Propose a small build preparation script using the existing Node runtime: read registered chapters from CHAPTER_DATA and package the exact runtime graph bytes plus a manifest for the frontend and backend deployment. Generated copies are build outputs; the maintained structural source remains the current runtime JSON. The manifest supplies chapter ID, contract version and SHA-256 `baseHash` of the exact UTF-8 graph bytes. The loader verifies the actual loaded bytes before merging overrides; a manifest alone must not be trusted when an asset is stale.

This requires approval for the build/resource preparation and loader changes. Base-hash mismatches block draft validation/publication and prevent applying an incompatible release. Do not automatically rebase old overrides after a structural deployment; an Admin must review and explicitly re-enter/revalidate them against the new baseline.

## 4. Proposed API contract

All routes and shapes in this section are **new proposals requiring approval**. Existing auth/save/load/evidence/report APIs remain unchanged.

Let `A = /api/admin/story/chapters/{chapterId}`.

| Method and route | Purpose |
|---|---|
| GET `/api/admin/story/chapters` | Registered chapters, baseline hashes and editorial status |
| GET `A/nodes` | Search by node ID/type/speaker/base or effective text; return node metadata and allowed text fields, with unsupported fields read-only |
| GET `A/draft` | Read the saved draft, revision, baseline identity and current publication ID |
| PUT `A/draft` | Save the complete sparse override set with baseHash and expected draft revision |
| POST `A/draft/validate` | Validate that exact revision and return a bound validation fingerprint/report |
| POST `A/draft/preview` | Return before/after text for the validated revision and record the preview fingerprint; never execute game effects |
| POST `A/publish` | Publish the validated/previewed revision using expected draft and published-version IDs |
| GET `A/versions` and GET `A/versions/{versionId}` | Read version metadata and override differences |
| POST `A/versions/{versionId}/restore-draft` | Copy a compatible historical override set into the working draft, subject to the current draft revision |
| GET `/api/game/chapters/{chapterId}/story-text?baseHash=...` | Return only the active published overrides matching the caller's graph baseline |

Draft PUT body: `baseHash`, `expectedDraftRevision`, `overrides[]`. Each entry has the structured fields from §2. Server-owned identity, timestamps, baseline graph, and allowed paths cannot be set by the caller.

Editorial responses identify `chapterId`, `baseHash`, `contractVersion`, `allowlistVersion`, `draftRevision` and/or `versionId` as appropriate. Publish also supplies the validation/preview fingerprints and `expectedPublishedVersionId`. The server rechecks the locked draft and current baseline before committing; a client-provided fingerprint is not a substitute for validation.

A player response contains chapter/baseline/allowlist identity, active version ID and the published override entries. When nothing has been published, return a successful empty override set with a null version ID. Do not return drafts, validation reports, publication authors, a full graph, or answer keys through this endpoint.

Proposed statuses: 200 for successful reads, draft save, validation and preview; 201 for a newly created publication; 400 for malformed or disallowed edits; 401 without valid authentication; 403 for non-Admin editorial access; 404 for unknown chapters/nodes/versions; 409 for stale revisions, incompatible hashes, or unmet publication prerequisites. A valid but invalid-for-publication draft produces a validation report with `valid: false`; no publication is created.

Protect every editorial endpoint server-side with ROLE_ADMIN and reuse AdminRoute for the page. Authenticated players can only read published text through the game endpoint. Actor identity comes from the authenticated principal, not request bodies. Add all frontend endpoint constants in `shared/api/endpoints.js`.

## 5. Admin page and workflow

Proposed route: `/admin/story-content`, under the existing AdminLayout and AdminRoute. Use Vietnamese UI labels consistent with the current Admin website; this English plan does not imply an English-only product interface.

Preserve the Noir Archive palette and typography. Use a compact searchable node list beside a reading/editing surface, rather than a grid of decorative cards. Display actual node IDs, type and speaker as read-only context. Offer an editable-fields filter so technical nodes do not overwhelm everyday editing. On narrow screens, stack the list and editor in task order.

The editor shows baseline wording, published wording where different, and the draft input. Provide explicit Save draft, Validate, Preview and Publish actions, dirty-state protection, clear error/conflict feedback, and keyboard-accessible controls. A loading failure must not look like an empty chapter. The UI must distinguish unsaved edits from a saved unpublished draft.

Workflow:

1. Open Chapter 1 and load the existing draft. If no draft exists, start the editor from the current published override set or an empty set without writing data during GET.
2. Edit permitted text and save the draft. Increment its revision; invalidate older validation and preview fingerprints.
3. Validate the saved revision against the trusted baseline and allowlist.
4. Preview the same revision. Show before/after text and label skipped narration/action accurately. This is a content/layout approximation, not a promise that the full Phaser scene or branch was executed.
5. Publish only that validated and previewed revision. Recheck the baseline and revisions in the transaction; create an immutable release and atomically switch the pointer.

Preview will not run story nodes, modify a save, grant evidence, change scores, or autosave. Automated validation cannot certify story canon or the factual meaning of a changed label; Admin review remains necessary.

## 6. Runtime activation, active sessions and saved games

Options requiring a product decision:

| Policy | Benefit | Cost |
|---|---|---|
| Latest publication when New Game or Continue starts; fixed during that session | No mid-conversation changes; existing saves work without adding content-version fields | Continuing an old save later can show newer future dialogue alongside older recorded history |
| Permanently pin a publication to each saved game | Consistent wording across every continuation | Requires save-envelope version metadata, legacy-save handling and historical version retrieval |
| Apply updates immediately to active sessions | Fastest visible update | Can change a line/choice during an interaction; unnecessary complexity for this release |

**Recommend the first policy.** Fetch once at each New Game/Continue start, including a new session begun from the same menu without reloading the page. Finish the fetch/validation decision before starting the runner. Keep the selected effective graph in session memory until the session ends; do not poll or mutate an active runner.

API work stays in React via Axios. Phaser requests content through EventBus; React returns a response with a session request ID. Ignore responses from old requests or destroyed games, including React StrictMode remounts. Keep the merge module pure and independent of React/Phaser. Do not mutate the cached base graph; merge into a session copy and keep publication metadata outside graph/state v2.

Existing saves retain node positions, flags, scores, inventory and checkpoints. Loading a save or starting a new game selects the current publication; checkpoint restore within a session keeps that session's publication. Already recorded conversation history and Notebook text remain exactly as recorded. This feature does not fix the separate ISS-29 server-save identity issue.

Proposed offline policy: use the last locally validated published override set for the same baseHash and allowlist version; otherwise use the untouched base graph with a visible connection/content-status message. Store that cache separately from saved game state. Never cache drafts as playable content. An explicit server response saying no publication exists must use the base graph rather than resurrecting a cached publication. An invalid or incompatible override set is rejected as a whole, not partially applied.

## 7. Version history and restoration

List immutable publications with version ID, date, author and changed-field count. Allow an Admin to inspect the text diff and restore a compatible version into the draft. Restoration does not delete history or immediately change live content: it must go through validate → preview → publish and creates a new version linked to the restored version.

Restoring the original wording means publishing an empty override set. Restrict restoration to versions of the currently trusted baseHash/allowlist. Warn before replacing unsaved draft work and reject stale restore requests. Keep previously published versions; automatic deletion/retention is outside release 1.

## 8. Validation and verification

On draft save and again before publication:

- Resolve only registered chapters and existing nodes from server-trusted data.
- Validate target type, field, index, existing string value, replacement type and agreed limits. Reject duplicate targets and extra request fields.
- Merge text on a copy. Verify both graph copies are deeply equal after masking only the approved text paths. Preserve array order/length and object key sets; every field outside the allowlist, including other strings, must be identical.
- Bind the result to baseHash, allowlist version, draft revision and complete override-set checksum. Any edit invalidates validation/preview.
- Keep all lifecycle guards server-side; hidden buttons alone provide no enforcement.

After implementation approval, add meaningful Java and JS tests for disallowed structural updates, invalid paths, stale revisions/hash mismatch, merge immutability, atomic publication, restoration, and draft isolation. Re-run existing story golden paths with an isolated text-only fixture. Expected narrative-history text may differ; non-text gameplay outcomes, routes, penalties and checkpoints must match the base run.

Use the supported `scripts/chapter1/validate.py` workflow, not the source validator directly. Propose extending this wrapper to accept an override fixture/release input and run against a merged **temporary copy**. The current command validates only the static chapter JSON; running it alone would not validate database overrides. Keep source files and runtime chapter files untouched. Do not require Python as a new production-server runtime: server publication checks use the approved Java stack; full walkthrough validation runs in development/build verification.

The existing custom validator uses schema field/type checks and path simulations, not full JSON Schema validation. Its source-map provenance check does not verify newly authored Admin text against canon. Report those limits honestly.

After implementation, run `npm run check`, `mvn clean test`, the chapter wrapper on baseline and merged fixture, and appropriate Playwright/manual checks. Demonstrate that an Admin can draft/validate/preview/publish/restore, a regular player receives 403 on editorial APIs, and a player sees only published wording. Verify session stability, save continuation, offline behavior, Vietnamese glyphs, keyboard focus, long text and narrow viewport layout. No test, build, application launch or CSDL operation has been run during this planning task.

## 9. Affected components and delivery sequence

All additions below are proposed, not files already created:

| Area | Planned changes |
|---|---|
| Admin frontend | Story Content page and focused list/editor/preview/history components under `features/admin`; AdminSidebar, routePaths and AppRouter; Admin API functions |
| API and bridge | `shared/api/endpoints.js`; play-side story-text service; `useGameBridge`; EventBus event constants; separate publication-cache key |
| Game integration | Pure override validation/merge module in `game/narrative`; PreloadScene, MainMenuScene, StoryScene and runtime session graph selection; any added game-facing status labels in both languages in `uiText.js` |
| Backend | Admin story controller/service/DTOs; trusted read-only chapter catalog; draft/version/pointer entities and repositories; authenticated published-text game endpoint; explicit security tests |
| Deployment/database | Approved supplemental SQL; manifest and chapter resource preparation from CHAPTER_DATA; build/package configuration to include the generated trusted backend resources |
| Verification/docs | Override-aware temporary chapter-validator input; meaningful tests; architecture/API documentation, project memory and checkpoints |

Delivery after approval:

1. **Contract checkpoint:** record approved allowlist, persistence, endpoints, session policy, limits and existing-schema handling. Work on branch `duy` per the user’s explicit instruction, preserving existing local changes. Do not commit or push without a separate request.
2. **Data and validation:** implement trusted baseline packaging, sparse override validation and the approved supplemental persistence schema. Prove structural equality checks and revision conflict behavior.
3. **Admin workflow:** build list/search/edit, save, validate and preview with persistent drafts and access enforcement.
4. **Publication and history:** implement atomic publication, immutable version history and restore-to-draft flow.
5. **Game delivery:** connect session-start published-text loading, baseline identity checks, pure merge and offline fallback through EventBus.
6. **Verification and handover:** run the agreed checks, inspect Admin/player behavior, document actual results and remaining limits. Do not commit or push unless requested.

## 10. Benefits, limitations and approval request

This design lets Admins maintain wording while preserving graph mechanics, supports preview and recovery, and keeps the runtime graph/source package intact. Its costs are additional persistence/API/build integration and a second content layer to reason about. Text edits can still contradict unchanged Notebook records; structural checks reduce software risk but cannot prove narrative correctness. Offline players can temporarily see an older publication or base wording. Text changes can also affect layout; visual verification remains necessary.

**Please approve or revise these decisions before implementation:**

1. **Editable scope:** Chapter 1 only; 813 schema-backed fields from §2; hotspot labels and non-node record text read-only; proposed 4,000/500 character limits; narration/action remain automatically traversed.
2. **Validation baseline:** preserve the three existing missing choice conditions; use the supported custom validator plus strict text-only invariance checks, rather than silently altering graph/schema or claiming full JSON Schema conformance.
3. **Storage and API:** MySQL sparse overrides in the three proposed tables, supplemental SQL, immutable publications and the proposed §4 contract; generated trusted deployment resources from the actual runtime graph.
4. **Activation and recovery:** latest publication at each New Game/Continue start, fixed during that session, existing saved/history text preserved; matching cached publication or base graph on connectivity failure; restoration goes through a new draft and publication.

These storage/API/publishing details extend the original project documents under the user’s explicit approval, DEC-026. All four groups above were approved before implementation.
