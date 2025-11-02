"""
Seed all database tables with sample data using raw SQL.
This script can be run without full ORM dependencies.
Make sure to run seed_factors.py first to ensure emission factors exist.
"""
from __future__ import annotations

import hashlib
from datetime import datetime, timedelta
from random import choice, randint, uniform

from sqlalchemy import create_engine, text

from app.core.config import settings


def stable_event_hash(payload: dict) -> str:
    """Generate stable hash for event deduplication."""
    normalized = []
    for key in sorted(payload.keys()):
        normalized.append(f"{key}={payload[key]}")
    joined = "|".join(normalized)
    return hashlib.sha256(joined.encode("utf-8")).hexdigest()


# Sample facility data
FACILITIES_DATA = [
    {"name": "Headquarters", "country": "IN", "grid_region": "IN-N"},
    {"name": "Manufacturing Plant", "country": "US", "grid_region": None},
    {"name": "Distribution Center", "country": "GB", "grid_region": None},
]

# Sample activity event categories
EVENT_CATEGORIES = [
    ("electricity.kwh", "kWh", 100, 5000),
    ("diesel.litre", "l", 10, 500),
    ("petrol.litre", "l", 5, 300),
    ("air.travel.km.short", "km", 100, 5000),
    ("spend.generic.inr", "INR", 10000, 500000),
]

# Organization IDs from users table
ORG_IDS = [3, 4, 5, 6, 7, 8, 9]


def ensure_organizations(conn):
    """Ensure organizations exist."""
    for org_id in ORG_IDS:
        result = conn.execute(
            text("SELECT COUNT(*) FROM organizations WHERE id = :org_id"),
            {"org_id": org_id}
        )
        if result.scalar() == 0:
            conn.execute(
                text("""
                    INSERT INTO organizations (id, name, plan, created_at, updated_at)
                    VALUES (:id, :name, 'free', NOW(), NOW())
                """),
                {"id": org_id, "name": f"Organization {org_id}"}
            )
            print(f"Created organization {org_id}")
        else:
            print(f"Organization {org_id} already exists")


def seed_facilities(conn):
    """Create facilities for each organization."""
    for org_id in ORG_IDS:
        result = conn.execute(
            text("SELECT COUNT(*) FROM facilities WHERE org_id = :org_id"),
            {"org_id": org_id}
        )
        if result.scalar() > 0:
            print(f"Organization {org_id} already has facilities, skipping...")
            continue
        
        num_facilities = randint(1, 3)
        for i in range(num_facilities):
            fac_data = choice(FACILITIES_DATA)
            name = f"{fac_data['name']} {i+1}" if num_facilities > 1 else fac_data['name']
            conn.execute(
                text("""
                    INSERT INTO facilities (org_id, name, country, grid_region, created_at, updated_at)
                    VALUES (:org_id, :name, :country, :grid_region, NOW(), NOW())
                """),
                {
                    "org_id": org_id,
                    "name": name,
                    "country": fac_data["country"],
                    "grid_region": fac_data["grid_region"],
                }
            )
            print(f"Created facility '{name}' for org {org_id}")


def seed_activity_events(conn):
    """Create activity events and return event IDs by org."""
    event_ids_by_org = {}
    
    for org_id in ORG_IDS:
        result = conn.execute(
            text("SELECT COUNT(*) FROM activity_events WHERE org_id = :org_id"),
            {"org_id": org_id}
        )
        if result.scalar() > 0:
            print(f"Organization {org_id} already has events, getting existing IDs...")
            # Get existing event IDs
            result = conn.execute(
                text("SELECT id FROM activity_events WHERE org_id = :org_id"),
                {"org_id": org_id}
            )
            event_ids_by_org[org_id] = [row[0] for row in result]
            continue
        
        # Get facilities for this org
        result = conn.execute(
            text("SELECT id FROM facilities WHERE org_id = :org_id"),
            {"org_id": org_id}
        )
        facility_ids = [row[0] for row in result]
        
        event_ids = []
        num_events = randint(5, 15)
        start_date = datetime.utcnow() - timedelta(days=180)
        
        for i in range(num_events):
            days_ago = randint(0, 180)
            occurred_at = start_date + timedelta(days=days_ago, hours=randint(0, 23))
            
            category, unit, min_val, max_val = choice(EVENT_CATEGORIES)
            value_numeric = round(uniform(min_val, max_val), 2)
            
            facility_id = choice(facility_ids) if facility_ids else None
            
            # Create hash
            data_for_hash = {
                "org_id": org_id,
                "facility_id": facility_id or 0,
                "occurred_at": occurred_at.isoformat(),
                "category": category,
                "unit": unit,
                "value_numeric": value_numeric,
            }
            event_hash = stable_event_hash(data_for_hash)
            
            currency = "INR" if category == "spend.generic.inr" else None
            spend_value = value_numeric if category == "spend.generic.inr" else None
            
            result = conn.execute(
                text("""
                    INSERT INTO activity_events (
                        org_id, facility_id, source_id, occurred_at, category, subcategory,
                        unit, value_numeric, currency, spend_value, raw_payload_json,
                        extracted_fields_json, scope_hint, hash_dedupe, created_at, updated_at
                    )
                    VALUES (
                        :org_id, :facility_id, :source_id, :occurred_at, :category, :subcategory,
                        :unit, :value_numeric, :currency, :spend_value, :raw_payload_json,
                        :extracted_fields_json, :scope_hint, :hash_dedupe, NOW(), NOW()
                    )
                    RETURNING id
                """),
                {
                    "org_id": org_id,
                    "facility_id": facility_id,
                    "source_id": f"seed_{i+1}",
                    "occurred_at": occurred_at,
                    "category": category,
                    "subcategory": None,
                    "unit": unit,
                    "value_numeric": value_numeric,
                    "currency": currency,
                    "spend_value": spend_value,
                    "raw_payload_json": None,
                    "extracted_fields_json": None,
                    "scope_hint": None,
                    "hash_dedupe": event_hash,
                }
            )
            event_id = result.scalar()
            event_ids.append(event_id)
            print(f"Created event {event_id} for org {org_id}: {category} = {value_numeric} {unit}")
        
        event_ids_by_org[org_id] = event_ids
    
    return event_ids_by_org


def calculate_emissions(conn, event_ids_by_org):
    """Calculate emissions using emission calculation logic via SQL."""
    total_created = 0
    
    for org_id, event_ids in event_ids_by_org.items():
        if not event_ids:
            continue
        
        # Delete existing emissions for these events
        conn.execute(
            text("DELETE FROM emissions WHERE org_id = :org_id AND event_id = ANY(:event_ids)"),
            {"org_id": org_id, "event_ids": event_ids}
        )
        
        # Get events and calculate emissions
        result = conn.execute(
            text("""
                SELECT e.id, e.org_id, e.category, e.occurred_at, e.value_numeric, e.unit
                FROM activity_events e
                WHERE e.org_id = :org_id AND e.id = ANY(:event_ids)
            """),
            {"org_id": org_id, "event_ids": event_ids}
        )
        
        created = 0
        for row in result:
            event_id, event_org_id, category, occurred_at, value_numeric, unit = row
            
            # Find best factor
            factor_result = conn.execute(
                text("""
                    SELECT id, factor_value, geography, version
                    FROM emission_factors
                    WHERE category = :category
                      AND valid_from <= :occurred_at
                      AND valid_to >= :occurred_at
                    ORDER BY version DESC, valid_from DESC
                    LIMIT 1
                """),
                {"category": category, "occurred_at": occurred_at}
            )
            
            factor_row = factor_result.fetchone()
            if not factor_row:
                print(f"  No factor found for event {event_id} (category: {category}), skipping...")
                continue
            
            factor_id, factor_value, geography, version = factor_row
            co2e_kg = float(value_numeric) * float(factor_value)
            
            # Infer scope
            category_lower = category.lower()
            if "fuel" in category_lower or "diesel" in category_lower or "petrol" in category_lower:
                scope = "1"
            elif "electric" in category_lower or "kwh" in category_lower:
                scope = "2"
            else:
                scope = "3"
            
            # Insert emission
            conn.execute(
                text("""
                    INSERT INTO emissions (
                        org_id, event_id, factor_id, scope, co2e_kg, calc_version,
                        uncertainty_pct, provenance_json, created_at, updated_at
                    )
                    VALUES (
                        :org_id, :event_id, :factor_id, :scope, :co2e_kg, 'v1',
                        :uncertainty_pct, :provenance_json, NOW(), NOW()
                    )
                """),
                {
                    "org_id": event_org_id,
                    "event_id": event_id,
                    "factor_id": factor_id,
                    "scope": scope,
                    "co2e_kg": co2e_kg,
                    "uncertainty_pct": None,
                    "provenance_json": {
                        "formula": "value * factor_value",
                        "factor_version": version,
                        "geography": geography,
                        "method": "activity",
                    },
                }
            )
            created += 1
        
        total_created += created
        print(f"Created {created} emissions for org {org_id}")
    
    return total_created


def main():
    """Main seeding function."""
    print("=" * 60)
    print("Seeding database with sample data (SQL-based)")
    print("=" * 60)
    
    engine = create_engine(settings.database_url, future=True)
    with engine.begin() as conn:
        # Step 1: Ensure organizations
        print("\n1. Ensuring organizations exist...")
        ensure_organizations(conn)
        print()
        
        # Step 2: Create facilities
        print("2. Creating facilities...")
        seed_facilities(conn)
        print()
        
        # Step 3: Check emission factors
        result = conn.execute(text("SELECT COUNT(*) FROM emission_factors"))
        count = result.scalar()
        if count == 0:
            print("ERROR: No emission factors found!")
            print("Please run 'python scripts/seed_factors.py' first!")
            return
        print(f"3. Found {count} emission factors\n")
        
        # Step 4: Create activity events
        print("4. Creating activity events...")
        event_ids_by_org = seed_activity_events(conn)
        total_events = sum(len(ids) for ids in event_ids_by_org.values())
        print(f"   Total events: {total_events}\n")
        
        # Step 5: Calculate emissions
        print("5. Calculating emissions...")
        total_emissions = calculate_emissions(conn, event_ids_by_org)
        print(f"   Created {total_emissions} emissions\n")
        
        # Summary
        print("=" * 60)
        print("Seeding complete!")
        print("=" * 60)
        result = conn.execute(text("SELECT COUNT(*) FROM organizations"))
        print(f"Organizations: {result.scalar()}")
        result = conn.execute(text("SELECT COUNT(*) FROM facilities"))
        print(f"Facilities: {result.scalar()}")
        result = conn.execute(text("SELECT COUNT(*) FROM activity_events"))
        print(f"Activity Events: {result.scalar()}")
        result = conn.execute(text("SELECT COUNT(*) FROM emissions"))
        print(f"Emissions: {result.scalar()}")
        print("=" * 60)


if __name__ == "__main__":
    main()

