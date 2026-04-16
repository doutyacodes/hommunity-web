-- SQL Alteration script for Hommunity
-- Run this on your live database to support new features and bug fixes.

-- 1. Support for 'Delivery Image Required' toggle on Gates
ALTER TABLE gates ADD COLUMN delivery_image_required BOOLEAN DEFAULT TRUE;

-- Add photo_url to residents for profile picture
ALTER TABLE residents ADD COLUMN photo_url TEXT;

-- 2. Support for missing visitor categories in Guard App (Bug Fix)
ALTER TABLE visitors MODIFY COLUMN visitor_category ENUM(
    'EXPECTED_GUEST',
    'DELIVERY_GUEST',
    'SERVICE_STAFF',
    'DAILY_STAFF',
    'CAB_RIDE',
    'EVENT_BULK',
    'UNINVITED',
    'GUEST',
    'MAID',
    'CAB',
    'OTHER'
) NOT NULL;
