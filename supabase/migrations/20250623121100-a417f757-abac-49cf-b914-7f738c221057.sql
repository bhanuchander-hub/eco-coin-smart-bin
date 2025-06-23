
-- Add pickup location columns to waste_uploads table
ALTER TABLE public.waste_uploads 
ADD COLUMN pickup_location_lat DECIMAL(10, 8),
ADD COLUMN pickup_location_lng DECIMAL(11, 8);
