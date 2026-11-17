# remy-test

A deliberately small repo for testing the Snyk Remediation Agent.

**Do not deploy this code.** The dependencies are pinned to vulnerable versions on purpose.

## Layout

| Module | Ecosystem | Tests |
|---|---|---|
| `node-service/` | npm, public registry only | `npm test` (Node built-in runner, 8 tests) |
| `java-service/` | Maven, Maven Central only | `mvn test` (JUnit 5, 4 tests) |

Both test suites pass on a clean tree, and CI runs them on every PR so the agent's fixes are checked.

## Seeded vulnerable dependencies

Results are from `snyk test --all-projects` on 17 Nov 2026: 14 issues in node-service, 5 vulnerabilities plus 1 license issue in java-service.

| Module | Package | Pinned | Fix | Issues (severity) | Expected breakability |
|---|---|---|---|---|---|
| node-service | `lodash` | 4.17.15 | 4.18.1 (minor) | 9 (5 high, 4 medium) | Low |
| node-service | `node-fetch` | 2.6.0 | 2.6.7 (patch) | 2 (medium) | Low |
| node-service | `minimist` | 1.2.5 | 1.2.6 (patch) | 1 (low) | Low |
| node-service | `jsonwebtoken` | 8.5.1 | 9.0.0 (major) | 3 (medium) | High |
| java-service | `commons-collections:commons-collections` | 3.2.1 | 3.2.2 (patch) | 3 (critical) | Low |
| java-service | `c3p0:c3p0` | 0.9.1.2 | None as an upgrade; needs a move to `com.mchange:c3p0` 0.9.5.x | 2 (1 critical, 1 high) + LGPL-3.0 license | High |

## Resetting

Do this once, before the first run, to mark the vulnerable baseline:

```
git checkout main
git pull
git tag baseline
git push origin baseline
```

After the agent's fixes merge, reset `main` back to the baseline:

```
git checkout main
git pull
git reset --hard baseline
git push --force-with-lease origin main
```

Then close any of the agent's PRs that are still open.
