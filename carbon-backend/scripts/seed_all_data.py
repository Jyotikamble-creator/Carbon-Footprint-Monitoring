from __future__ import annotations

import sys
from datetime import datetime, timedelta
from pathlib import Path
from random import choice, randint, uniform

from sqlalchemy.orm import Session

# Add parent directory to path for imports
script_dir = Path(__file__).parent
backend_dir = script_dir.parent
sys.path.insert(0, str(backend_dir))

from app.db.database import SessionLocal
from app.db.models import Organization, Facility, ActivityEvent, Emission, EmissionFactor, User
from app.services.calc.worker_stub import recalculate_for_events
from app.services.ingestion.hash_utils import stable_event_hash


# Sample facility data
FACILITIES_DATA = [
    {"name": "Headquarters", "country": "IN", "grid_region": "IN-N"},
    {"name": "Manufacturing Plant", "country": "US", "grid_region": None},
    {"name": "Distribution Center", "country": "GB", "grid_region": None},
]

# Sample activity event categories and their typical values
EVENT_CATEGORIES = [
    ("electricity.kwh", "kWh", 100, 5000),  # category, unit, min_value, max_value
    ("diesel.litre", "l", 10, 500),
    ("petrol.litre", "l", 5, 300),
    ("air.travel.km.short", "km", 100, 5000),
    ("spend.generic.inr", "INR", 10000, 500000),
]


def ensure_organizations(db: Session) -> dict[int, Organization]:
    """Ensure organizations exist for all org_ids in users table."""
    orgs = {}
    # Get all unique org_ids from users
    users = db.query(User).all()
    org_ids = {user.org_id for user in users}
    
    for org_id in org_ids:
        org = db.get(Organization, org_id)
        if not org:
            org = Organization(
                id=org_id,
                name=f"Organization {org_id}",
                plan="free",
            )
            db.add(org)
            print(f"Created organization {org_id}")
        else:
            print(f"Organization {org_id} already exists")
        orgs[org_id] = org
    
    db.commit()
    return orgs


def seed_facilities(db: Session, orgs: dict[int, Organization]):
    """Create facilities for each organization."""
    for org_id, org in orgs.items():
        # Check if facilities already exist for this org
        existing = db.query(Facility).filter(Facility.org_id == org_id).count()
        if existing > 0:
            print(f"Organization {org_id} already has {existing} facilities, skipping...")
            continue
        
        # Create 1-3 facilities per organization
        num_facilities = randint(1, 3)
        for i in range(num_facilities):
            fac_data = choice(FACILITIES_DATA)
            facility = Facility(
                org_id=org_id,
                name=f"{fac_data['name']} {i+1}" if num_facilities > 1 else fac_data['name'],
                country=fac_data['country'],
                grid_region=fac_data['grid_region'],
            )
            db.add(facility)
            print(f"Created facility '{facility.name}' for org {org_id}")
        
        db.commit()


def seed_activity_events(db: Session, orgs: dict[int, Organization]):
    """Create activity events for each organization."""
    # Get all facilities grouped by org_id
    facilities_by_org: dict[int, list[Facility]] = {}
    for org_id in orgs.keys():
        facilities = db.query(Facility).filter(Facility.org_id == org_id).all()
        facilities_by_org[org_id] = facilities
    
    event_ids_by_org: dict[int, list[int]] = {}
    
    for org_id, org in orgs.items():
        # Check if events already exist
        existing = db.query(ActivityEvent).filter(ActivityEvent.org_id == org_id).count()
        if existing > 0:
            print(f"Organization {org_id} already has {existing} events, skipping...")
            # Get existing event IDs for emission recalculation
            existing_events = db.query(ActivityEvent.id).filter(ActivityEvent.org_id == org_id).all()
            event_ids_by_org[org_id] = [eid for eid, in existing_events]
            continue
        
        facilities = facilities_by_org.get(org_id, [])
        event_ids = []
        
        # Create 5-15 events per organization, spread over the last 6 months
        num_events = randint(5, 15)
        start_date = datetime.utcnow() - timedelta(days=180)
        
        for i in range(num_events):
            # Random date within last 6 months
            days_ago = randint(0, 180)
            occurred_at = start_date + timedelta(days=days_ago) + timedelta(hours=randint(0, 23))
            
            # Random category
            category, unit, min_val, max_val = choice(EVENT_CATEGORIES)
            value_numeric = round(uniform(min_val, max_val), 2)
            
            # Randomly assign to a facility or None
            facility_id = choice(facilities).id if facilities else None
            
            # Create hash for deduplication
            data_for_hash = {
                "org_id": org_id,
                "facility_id": facility_id or 0,
                "occurred_at": occurred_at.isoformat(),
                "category": category,
                "unit": unit,
                "value_numeric": value_numeric,
            }
            event_hash = stable_event_hash(data_for_hash)
            
            event = ActivityEvent(
                org_id=org_id,
                facility_id=facility_id,
                source_id=f"seed_{i+1}",
                occurred_at=occurred_at,
                category=category,
                subcategory=None,
                unit=unit,
                value_numeric=value_numeric,
                currency="INR" if category == "spend.generic.inr" else None,
                spend_value=value_numeric if category == "spend.generic.inr" else None,
                raw_payload_json=None,
                extracted_fields_json=None,
                scope_hint=None,
                hash_dedupe=event_hash,
            )
            db.add(event)
            db.flush()  # Get the ID
            event_ids.append(event.id)
            print(f"Created event {event.id} for org {org_id}: {category} = {value_numeric} {unit}")
        
        db.commit()
        event_ids_by_org[org_id] = event_ids
    
    return event_ids_by_org


def ensure_emission_factors(db: Session):
    """Ensure emission factors exist (should already be seeded, but check)."""
    count = db.query(EmissionFactor).count()
    if count == 0:
        print("Warning: No emission factors found. Run 'python scripts/seed_factors.py' first.")
        return False
    print(f"Found {count} emission factors")
    return True


def calculate_emissions(db: Session, event_ids_by_org: dict[int, list[int]]):
    """Calculate emissions for all created events."""
    total_created = 0
    for org_id, event_ids in event_ids_by_org.items():
        if not event_ids:
            continue
        print(f"Calculating emissions for org {org_id} ({len(event_ids)} events)...")
        created = recalculate_for_events(db, org_id=org_id, event_ids=event_ids)
        db.flush()
        total_created += created
        print(f"Created {created} emissions for org {org_id}")
    
    db.commit()
    return total_created


def main():
    """Main seeding function."""
    print("=" * 60)
    print("Seeding database with sample data")
    print("=" * 60)
    
    db = SessionLocal()
    try:
        # Step 1: Ensure organizations exist
        print("\n1. Ensuring organizations exist...")
        orgs = ensure_organizations(db)
        print(f"   Found/created {len(orgs)} organizations\n")
        
        # Step 2: Create facilities
        print("2. Creating facilities...")
        seed_facilities(db, orgs)
        print()
        
        # Step 3: Check emission factors
        print("3. Checking emission factors...")
        if not ensure_emission_factors(db):
            print("   Please run 'python scripts/seed_factors.py' first!")
            return
        print()
        
        # Step 4: Create activity events
        print("4. Creating activity events...")
        event_ids_by_org = seed_activity_events(db, orgs)
        total_events = sum(len(ids) for ids in event_ids_by_org.values())
        print(f"   Created/total events: {total_events}\n")
        
        # Step 5: Calculate emissions
        print("5. Calculating emissions...")
        total_emissions = calculate_emissions(db, event_ids_by_org)
        print(f"   Created {total_emissions} emissions\n")
        
        # Summary
        print("=" * 60)
        print("Seeding complete!")
        print("=" * 60)
        print(f"Organizations: {len(orgs)}")
        facilities_count = db.query(Facility).count()
        print(f"Facilities: {facilities_count}")
        events_count = db.query(ActivityEvent).count()
        print(f"Activity Events: {events_count}")
        emissions_count = db.query(Emission).count()
        print(f"Emissions: {emissions_count}")
        print("=" * 60)
        
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()

