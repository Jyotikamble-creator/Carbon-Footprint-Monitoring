# Route to Database Table Mapping Analysis

## Database Tables
1. **organizations** - Organization entity
2. **users** - User accounts
3. **facilities** - Facility locations
4. **activity_events** - Activity events/measurements
5. **emission_factors** - Emission conversion factors
6. **emissions** - Calculated emissions from events

---

## Routes and Their Table Interactions

### ✅ `/v1/auth` - Authentication Routes

#### `POST /v1/auth/signup`
- **Writes:**
  - ✅ `organizations` (creates if not exists)
  - ✅ `users` (creates new admin user)
- **Reads:** `organizations`, `users` (for checking duplicates)

#### `POST /v1/auth/login`
- **Writes:** None
- **Reads:** `users` (authentication only)

#### `GET /v1/auth/me`
- **Writes:** None
- **Reads:** `users`, `organizations`

---

### ✅ `/v1/tenants` - Tenant Management Routes

#### `POST /v1/tenants/facilities`
- **Writes:** ✅ `facilities`
- **Reads:** None (check for duplicates via IntegrityError)

#### `GET /v1/tenants/facilities`
- **Writes:** None
- **Reads:** `facilities`

#### `POST /v1/tenants/users`
- **Writes:** ✅ `users`
- **Reads:** None (check for duplicates via IntegrityError)

#### `GET /v1/tenants/users`
- **Writes:** None
- **Reads:** `users`

---

### ✅ `/v1/factors` - Emission Factor Routes

#### `POST /v1/factors`
- **Writes:** ✅ `emission_factors`
- **Reads:** None (check for duplicates via IntegrityError)

#### `GET /v1/factors`
- **Writes:** None
- **Reads:** `emission_factors`

#### `GET /v1/factors/preview`
- **Writes:** None
- **Reads:** `emission_factors`

---

### ✅ `/v1/ingest` - Data Ingestion Routes

#### `POST /v1/ingest/events`
- **Writes:**
  - ✅ `activity_events` (creates new events)
  - ✅ `emissions` (indirectly via `recalculate_for_events()`)
- **Reads:** None (check for duplicates via IntegrityError)
- **Note:** Emissions are created automatically when events are ingested

#### `POST /v1/ingest/upload-csv`
- **Writes:**
  - ✅ `activity_events` (creates from CSV)
  - ✅ `emissions` (indirectly via `recalculate_for_events()`)
- **Reads:** None
- **Note:** Same as `/events`, but for CSV uploads

---

### ✅ `/v1/emissions` - Emissions Management Routes

#### `GET /v1/emissions`
- **Writes:** None
- **Reads:** `emissions`, `activity_events`

#### `POST /v1/emissions/recompute`
- **Writes:**
  - ✅ `emissions` (deletes old, creates new via `recalculate_for_events()`)
- **Reads:** `activity_events`

---

### ✅ `/v1/analytics` - Analytics Routes

#### `GET /v1/analytics/kpis`
- **Writes:** None
- **Reads:** `emissions`

#### `GET /v1/analytics/trend`
- **Writes:** None
- **Reads:** `emissions`, `activity_events`

#### `GET /v1/analytics/summary`
- **Writes:** None
- **Reads:** `emissions`, `activity_events`, `facilities`

---

### ✅ `/v1/reports` - Reporting Routes

#### `GET /v1/reports/period`
- **Writes:** None
- **Reads:** `emissions`, `activity_events`

---

## Summary: All Tables Are Filled

| Table | Filled By Routes | Status |
|-------|------------------|--------|
| `organizations` | `POST /v1/auth/signup` | ✅ Filled |
| `users` | `POST /v1/auth/signup`, `POST /v1/tenants/users` | ✅ Filled |
| `facilities` | `POST /v1/tenants/facilities` | ✅ Filled |
| `activity_events` | `POST /v1/ingest/events`, `POST /v1/ingest/upload-csv` | ✅ Filled |
| `emission_factors` | `POST /v1/factors` | ✅ Filled |
| `emissions` | `POST /v1/ingest/events`, `POST /v1/ingest/upload-csv`, `POST /v1/emissions/recompute` | ✅ Filled |

---

## Potential Issues Found

### ⚠️ Issue 1: Missing `db.flush()` in `recalculate_for_events()`
**Location:** `app/services/calc/worker_stub.py:66-77`

**Problem:** The `recalculate_for_events()` function deletes old emissions and creates new ones, but doesn't call `db.flush()` after adding emissions. While the session auto-commits at the end of the request (via `get_db()`), this could cause issues if:
- IDs are needed immediately after creation
- There are foreign key constraint issues that could be caught earlier

**Recommendation:** Add `db.flush()` after the loop in `recalculate_for_events()`:
```python
def recalculate_for_events(db: Session, *, org_id: int, event_ids: list[int]) -> int:
    if not event_ids:
        return 0
    deleted = db.query(Emission).filter(Emission.org_id == org_id, Emission.event_id.in_(event_ids)).delete(synchronize_session=False)
    events = list(db.scalars(select(ActivityEvent).where(ActivityEvent.org_id == org_id, ActivityEvent.id.in_(event_ids))))
    created = 0
    for ev in events:
        em = calculate_emission_for_event(db, org_id=org_id, event=ev)
        if em:
            created += 1
    db.flush()  # ← Add this
    return created
```

### ✅ Issue 2: All routes properly handle database transactions
All routes that write to the database properly handle transactions via the `get_db()` dependency which commits on success and rolls back on exception.

---

## Conclusion

✅ **All relevant routes fill relevant tables in the database.**

Every table has at least one route that creates/writes to it:
- `organizations` and `users` are created during signup
- `facilities` can be created via tenant management
- `activity_events` are created via ingestion routes
- `emission_factors` can be created via factors route
- `emissions` are automatically created when events are ingested

The only minor improvement would be to add a `db.flush()` in `recalculate_for_events()` for better error handling and immediate ID availability, but this doesn't prevent the table from being filled.

