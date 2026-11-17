# Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **No PII Storage**: `/leaderboard_easy/{entryId}`, `/leaderboard_normal/{entryId}`, and `/leaderboard_master/{entryId}` store only game display callsigns (`name`), `score`, `accuracy`, `difficulty`, `mode`, `date`, and server-enforced `createdAt`. No emails, UIDs, or personal contact info are stored.
2. **Difficulty-Collection Alignment**: Documents inside `/leaderboard_easy` must have `difficulty == 'easy'`, inside `/leaderboard_normal` must have `difficulty == 'normal'`, and inside `/leaderboard_master` must have `difficulty == 'master'`.
3. **Strict Path ID Hygiene**: Every `entryId` must match `^[a-zA-Z0-9_-]+$` and be `<= 128` characters.
4. **Strict Schema & Bounds**:
   - `name`: string, 1–20 chars, matching `^[A-Za-zÀ-ÖØ-öø-ÿ0-9 _\-\.]{1,20}$`
   - `score`: integer, `1 <= score <= 50000`
   - `accuracy`: integer, `0 <= accuracy <= 100`
   - `difficulty`: matches collection tier (`'easy' | 'normal' | 'master'`)
   - `mode`: `'choice' | 'typing' | 'context'`
   - `date`: string, 1–20 chars
   - `createdAt`: strictly `request.time` (server timestamp)
5. **Immutable Public Leaderboard**: Because no login is required, entries can be created (`create`) and read (`get`, `list`), but **never updated or deleted** from clients (`allow update, delete: if false`).
6. **Default Deny**: Any collection outside the three leaderboard collections is denied by default.

## 2. Adversarial "Dirty Dozen" Payloads

1. **Ghost Field Injection**: Adding `isAdmin: true` or `verified: true` -> Rejected by `data.keys().hasOnly(...)`.
2. **Missing Required Field**: Omitting `createdAt` or `mode` -> Rejected by `data.keys().hasAll(...)`.
3. **Client Timestamp Spoofing**: Setting `createdAt` to a client `Timestamp` -> Rejected by `data.createdAt == request.time`.
4. **Score Overflow Attack**: Submitting `score: 999999999` -> Rejected by `data.score <= 50000`.
5. **Negative / Zero Score**: Submitting `score: 0` or `score: -100` -> Rejected by `data.score >= 1`.
6. **Float / String Type Poisoning**: Submitting `score: "1500"` or `score: 12.5` -> Rejected by `data.score is int`.
7. **Accuracy Out of Bounds**: Submitting `accuracy: 150` -> Rejected by `data.accuracy <= 100`.
8. **XSS / Oversized Callsign**: Submitting `<script>alert(1)</script>` or 500-char `name` -> Rejected by `name.size() <= 20` and regex `matches`.
9. **Cross-Difficulty Spoofing**: Submitting `difficulty: 'master'` into `/leaderboard_easy/{entryId}` -> Rejected by `data.difficulty == expectedDifficulty`.
10. **ID Poisoning**: Creating `/leaderboard_easy/bad..id` or 500-char `entryId` -> Rejected by `isValidId(entryId)`.
11. **Score Tampering (Update)**: Attempting `update` on any leaderboard document -> Rejected by `allow update: if false`.
12. **Leaderboard Wipe (Delete)**: Attempting `delete` on any leaderboard document -> Rejected by `allow delete: if false`.
