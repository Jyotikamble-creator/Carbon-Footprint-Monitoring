-- Seed all database tables with sample data
-- Run this script in your PostgreSQL database
-- Make sure emission_factors are already seeded first (run seed_factors.py)

-- Step 1: Ensure organizations exist for all org_ids
INSERT INTO organizations (id, name, plan, created_at, updated_at)
SELECT org_id, 'Organization ' || org_id::text, 'free', NOW(), NOW()
FROM (SELECT DISTINCT org_id FROM users WHERE org_id IN (3, 4, 5, 6, 7, 8, 9)) AS orgs
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create facilities (1-3 per organization)
DO $$
DECLARE
    org_id_val INT;
    fac_count INT;
    fac_data RECORD;
    facilities_data TEXT[][] := ARRAY[
        ARRAY['Headquarters', 'IN', 'IN-N'],
        ARRAY['Manufacturing Plant', 'US', NULL],
        ARRAY['Distribution Center', 'GB', NULL]
    ];
BEGIN
    FOR org_id_val IN SELECT DISTINCT org_id FROM users WHERE org_id IN (3, 4, 5, 6, 7, 8, 9)
    LOOP
        -- Check if facilities already exist
        SELECT COUNT(*) INTO fac_count FROM facilities WHERE facilities.org_id = org_id_val;
        
        IF fac_count = 0 THEN
            -- Create 1-3 facilities
            FOR i IN 1..(1 + floor(random() * 2)::int)
            LOOP
                fac_data := facilities_data[1 + floor(random() * array_length(facilities_data, 1))::int];
                
                INSERT INTO facilities (org_id, name, country, grid_region, created_at, updated_at)
                VALUES (
                    org_id_val,
                    CASE WHEN (1 + floor(random() * 2)) > 1 THEN fac_data[1] || ' ' || i::text ELSE fac_data[1] END,
                    fac_data[2],
                    NULLIF(fac_data[3], 'NULL'),
                    NOW(),
                    NOW()
                );
            END LOOP;
            
            RAISE NOTICE 'Created facilities for org %', org_id_val;
        ELSE
            RAISE NOTICE 'Org % already has facilities, skipping...', org_id_val;
        END IF;
    END LOOP;
END $$;

-- Step 3: Create activity events (5-15 per organization)
DO $$
DECLARE
    org_id_val INT;
    event_count INT;
    facility_ids INT[];
    fac_id INT;
    category_data TEXT[];
    category TEXT;
    unit TEXT;
    min_val NUMERIC;
    max_val NUMERIC;
    value_num NUMERIC;
    occurred_dt TIMESTAMP;
    event_hash TEXT;
    event_id_val BIGINT;
    i INT;
    days_ago INT;
    categories_data TEXT[][] := ARRAY[
        ARRAY['electricity.kwh', 'kWh', '100', '5000'],
        ARRAY['diesel.litre', 'l', '10', '500'],
        ARRAY['petrol.litre', 'l', '5', '300'],
        ARRAY['air.travel.km.short', 'km', '100', '5000'],
        ARRAY['spend.generic.inr', 'INR', '10000', '500000']
    ];
BEGIN
    FOR org_id_val IN SELECT DISTINCT org_id FROM users WHERE org_id IN (3, 4, 5, 6, 7, 8, 9)
    LOOP
        -- Check if events already exist
        SELECT COUNT(*) INTO event_count FROM activity_events WHERE activity_events.org_id = org_id_val;
        
        IF event_count = 0 THEN
            -- Get facility IDs for this org
            SELECT ARRAY_AGG(id) INTO facility_ids FROM facilities WHERE facilities.org_id = org_id_val;
            
            -- Create 5-15 events
            FOR i IN 1..(5 + floor(random() * 11)::int)
            LOOP
                -- Random date within last 6 months
                days_ago := floor(random() * 181)::int;
                occurred_dt := NOW() - (days_ago || ' days')::INTERVAL + (floor(random() * 24)::int || ' hours')::INTERVAL;
                
                -- Random category
                category_data := categories_data[1 + floor(random() * array_length(categories_data, 1))::int];
                category := category_data[1];
                unit := category_data[2];
                min_val := category_data[3]::NUMERIC;
                max_val := category_data[4]::NUMERIC;
                value_num := round((random() * (max_val - min_val) + min_val)::NUMERIC, 2);
                
                -- Random facility or NULL
                IF array_length(facility_ids, 1) > 0 THEN
                    fac_id := facility_ids[1 + floor(random() * array_length(facility_ids, 1))::int];
                ELSE
                    fac_id := NULL;
                END IF;
                
                -- Create hash (simplified)
                event_hash := encode(digest(
                    'org_id=' || org_id_val || 
                    '|facility_id=' || COALESCE(fac_id::text, '0') ||
                    '|occurred_at=' || occurred_dt::text ||
                    '|category=' || category ||
                    '|unit=' || unit ||
                    '|value_numeric=' || value_num::text,
                    'sha256'
                ), 'hex');
                
                -- Insert event
                INSERT INTO activity_events (
                    org_id, facility_id, source_id, occurred_at, category, subcategory,
                    unit, value_numeric, currency, spend_value, raw_payload_json,
                    extracted_fields_json, scope_hint, hash_dedupe, created_at, updated_at
                )
                VALUES (
                    org_id_val,
                    fac_id,
                    'seed_' || i::text,
                    occurred_dt,
                    category,
                    NULL,
                    unit,
                    value_num,
                    CASE WHEN category = 'spend.generic.inr' THEN 'INR' ELSE NULL END,
                    CASE WHEN category = 'spend.generic.inr' THEN value_num ELSE NULL END,
                    NULL,
                    NULL,
                    NULL,
                    event_hash,
                    NOW(),
                    NOW()
                )
                RETURNING id INTO event_id_val;
                
                RAISE NOTICE 'Created event % for org %: % = % %', event_id_val, org_id_val, category, value_num, unit;
            END LOOP;
        ELSE
            RAISE NOTICE 'Org % already has events, skipping...', org_id_val;
        END IF;
    END LOOP;
END $$;

-- Step 4: Calculate and create emissions
DO $$
DECLARE
    org_id_val INT;
    event_rec RECORD;
    factor_rec RECORD;
    co2e_kg_val NUMERIC;
    scope_val TEXT;
    category_lower TEXT;
    created_count INT;
BEGIN
    FOR org_id_val IN SELECT DISTINCT org_id FROM users WHERE org_id IN (3, 4, 5, 6, 7, 8, 9)
    LOOP
        created_count := 0;
        
        -- Delete existing emissions for this org's events
        DELETE FROM emissions 
        WHERE org_id = org_id_val 
        AND event_id IN (SELECT id FROM activity_events WHERE activity_events.org_id = org_id_val);
        
        -- Process each event
        FOR event_rec IN 
            SELECT e.id, e.org_id, e.category, e.occurred_at, e.value_numeric, e.unit
            FROM activity_events e
            WHERE e.org_id = org_id_val
        LOOP
            -- Find best factor
            SELECT id, factor_value, geography, version
            INTO factor_rec
            FROM emission_factors
            WHERE category = event_rec.category
              AND valid_from <= event_rec.occurred_at
              AND valid_to >= event_rec.occurred_at
            ORDER BY version DESC, valid_from DESC
            LIMIT 1;
            
            IF factor_rec.id IS NULL THEN
                RAISE NOTICE 'No factor found for event % (category: %), skipping...', event_rec.id, event_rec.category;
                CONTINUE;
            END IF;
            
            -- Calculate CO2e
            co2e_kg_val := event_rec.value_numeric * factor_rec.factor_value;
            
            -- Infer scope
            category_lower := lower(event_rec.category);
            IF category_lower LIKE '%fuel%' OR category_lower LIKE '%diesel%' OR category_lower LIKE '%petrol%' THEN
                scope_val := '1';
            ELSIF category_lower LIKE '%electric%' OR category_lower LIKE '%kwh%' THEN
                scope_val := '2';
            ELSE
                scope_val := '3';
            END IF;
            
            -- Insert emission
            INSERT INTO emissions (
                org_id, event_id, factor_id, scope, co2e_kg, calc_version,
                uncertainty_pct, provenance_json, created_at, updated_at
            )
            VALUES (
                event_rec.org_id,
                event_rec.id,
                factor_rec.id,
                scope_val,
                co2e_kg_val,
                'v1',
                NULL,
                json_build_object(
                    'formula', 'value * factor_value',
                    'factor_version', factor_rec.version,
                    'geography', factor_rec.geography,
                    'method', 'activity'
                ),
                NOW(),
                NOW()
            );
            
            created_count := created_count + 1;
        END LOOP;
        
        RAISE NOTICE 'Created % emissions for org %', created_count, org_id_val;
    END LOOP;
END $$;

-- Display summary
SELECT 'Summary' AS info;
SELECT 'Organizations' AS table_name, COUNT(*) AS count FROM organizations;
SELECT 'Facilities' AS table_name, COUNT(*) AS count FROM facilities;
SELECT 'Activity Events' AS table_name, COUNT(*) AS count FROM activity_events;
SELECT 'Emissions' AS table_name, COUNT(*) AS count FROM emissions;
SELECT 'Emission Factors' AS table_name, COUNT(*) AS count FROM emission_factors;

