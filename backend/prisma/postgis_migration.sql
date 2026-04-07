-- 1. Bật extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Thêm cột location cho bảng stations và depots
ALTER TABLE stations ADD COLUMN location geography(Point, 4326);
ALTER TABLE depots ADD COLUMN location geography(Point, 4326);

-- 3. Di chuyển data từ lat/lng sang dạng point của PostGIS (BẢO TOÀN DỮ LIỆU CŨ)
UPDATE stations 
SET location = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
WHERE lat IS NOT NULL AND lng IS NOT NULL;

UPDATE depots 
SET location = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
WHERE lat IS NOT NULL AND lng IS NOT NULL;

-- 4. Xóa cột lat/lng cũ (Tùy chọn, Prisma sẽ cảnh báo mất data do drop cột)
ALTER TABLE stations DROP COLUMN lat;
ALTER TABLE stations DROP COLUMN lng;

ALTER TABLE depots DROP COLUMN lat;
ALTER TABLE depots DROP COLUMN lng;
