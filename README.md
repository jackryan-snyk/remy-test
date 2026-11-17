# remy-test

A deliberately small repo for testing the Snyk Remediation Agent (cloud remediation campaigns) and the Jira prototype built on its API.

**Do not deploy this code.** The dependencies are pinned to vulnerable versions on purpose.

## Why this repo exists

`js-goof` has 100+ findings, so every run hits the daily fix cap (10) and you can't tell scoping behaviour from quota behaviour. This repo keeps the vulnerable direct dependencies few enough that one run can cover them.

## Layout

| Module | Ecosystem | Tests |
|---|---|---|
| `node-service/` | npm, public registry only | `npm test` (Node built-in runner, 8 tests) |
| `java-service/` | Maven, Maven Central only | `mvn test` (JUnit 5, 4 tests) |

Both test suites pass on a clean tree, and CI runs them on every PR so the agent's fixes are checked.

## Seeded vulnerable dependencies

Node results are from `snyk test --all-projects` on 17 Nov 2026 (14 issues). Java rows are expected values until the Maven project is scanned.

| Module | Package | Pinned | Fix | Issues (severity) | Expected breakability |
|---|---|---|---|---|---|
| node-service | `lodash` | 4.17.15 | 4.18.1 (minor) | 9 (5 high, 4 medium) | Low |
| node-service | `node-fetch` | 2.6.0 | 2.6.7 (patch) | 2 (medium) | Low |
| node-service | `minimist` | 1.2.5 | 1.2.6 (patch) | 1 (low) | Low |
| node-service | `jsonwebtoken` | 8.5.1 | 9.0.0 (major) | 3 (medium) | High |
| java-service | `commons-collections:commons-collections` | 3.2.1 | 3.2.2 (patch) | TBC | Low |
| java-service | `c3p0:c3p0` | 0.9.1.2 | `com.mchange:c3p0` 0.9.5.x (groupId change) | TBC (XXE) | High |

The c3p0 entry mirrors Jira ticket NGP-1376 (XXE in `c3p0:c3p0@0.9.1.2`).

**Campaign filters change what you'll see:**
- With `severity_filter: ["critical", "high"]`, only the lodash highs and the Java findings are in scope. `jsonwebtoken`, `node-fetch` and `minimist` have no high or critical issues, so they are filtered out before breakability matters.
- To exercise the high-breakability hold-back on Node, include `medium` in the severity filter so `jsonwebtoken` is in scope.
- Count issues against the daily fix cap of 10: all severities on Node alone is 14 issues.

## Setup

1. Import the repo into Snyk through the GitHub SCM integration (not as a CLI target; the agent can't remediate CLI targets).
2. Note the org ID, target ID and project IDs from Snyk.
3. Use the Postman collection in `Test-Remediation-Agent` against `https://api.snyk.io/rest/tenants/{tenant_id}/remediation/...?version=2024-10-15`.

## Resetting

After a run merges fixes, reset by reverting the agent's PR. Unmerged PRs can simply be closed; the vulnerable baseline on `main` stays as is.
