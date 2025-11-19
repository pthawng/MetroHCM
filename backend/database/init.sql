-- -------------------------------------------------------------
-- Metro HCM - Schema Initialization
-- Generated from db.md
-- -------------------------------------------------------------

-- 1. Transport Infrastructure
CREATE TABLE lines (
  id              UUID          PRIMARY KEY,
  code            VARCHAR(10)   UNIQUE NOT NULL,
  name            VARCHAR       NOT NULL,
  name_en         VARCHAR,
  color           VARCHAR(7)    NOT NULL DEFAULT '#000000',
  status          VARCHAR(20)   NOT NULL DEFAULT 'active',
  total_length_km DOUBLE PRECISION,
  opening_date    DATE,
  created_at      TIMESTAMP     NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE stations (
  id              UUID          PRIMARY KEY,
  code            VARCHAR(10)   UNIQUE NOT NULL,
  name            VARCHAR       NOT NULL,
  name_en         VARCHAR,
  lat             DOUBLE PRECISION NOT NULL,
  lng             DOUBLE PRECISION NOT NULL,
  address         VARCHAR,
  type            VARCHAR(20)   NOT NULL DEFAULT 'underground',
  has_elevator    BOOLEAN       NOT NULL DEFAULT FALSE,
  has_parking     BOOLEAN       NOT NULL DEFAULT FALSE,
  status          VARCHAR(20)   NOT NULL DEFAULT 'active',
  created_at      TIMESTAMP     NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE line_stations (
  id              UUID          PRIMARY KEY,
  line_id         UUID          NOT NULL REFERENCES lines(id)    ON DELETE CASCADE,
  station_id      UUID          NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  sequence_order  SMALLINT      NOT NULL,
  km_from_start   DOUBLE PRECISION NOT NULL DEFAULT 0,
  platform_count  SMALLINT      NOT NULL DEFAULT 2,
  created_at      TIMESTAMP     NOT NULL DEFAULT now(),
  UNIQUE (line_id, sequence_order),
  UNIQUE (line_id, station_id)
);

CREATE TABLE segments (
  id                UUID          PRIMARY KEY,
  line_id           UUID          NOT NULL REFERENCES lines(id)      ON DELETE CASCADE,
  from_station_id   UUID          NOT NULL REFERENCES stations(id),
  to_station_id     UUID          NOT NULL REFERENCES stations(id),
  distance_km       DOUBLE PRECISION NOT NULL,
  travel_time_sec   INTEGER       NOT NULL,
  max_speed_kmh     SMALLINT,
  track_type        VARCHAR(20)   NOT NULL DEFAULT 'underground',
  created_at        TIMESTAMP     NOT NULL DEFAULT now(),
  UNIQUE (line_id, from_station_id, to_station_id)
);

CREATE TABLE depots (
  id          UUID        PRIMARY KEY,
  code        VARCHAR(10) UNIQUE NOT NULL,
  name        VARCHAR     NOT NULL,
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  line_id     UUID        REFERENCES lines(id),
  capacity    SMALLINT,
  created_at  TIMESTAMP   NOT NULL DEFAULT now()
);

CREATE TABLE trains (
  id                UUID        PRIMARY KEY,
  code              VARCHAR(20) UNIQUE NOT NULL,
  line_id           UUID        NOT NULL REFERENCES lines(id),
  depot_id          UUID        REFERENCES depots(id),
  car_count         SMALLINT    NOT NULL DEFAULT 4,
  capacity_per_car  SMALLINT    NOT NULL DEFAULT 200,
  manufacturer      VARCHAR,
  manufacture_year  SMALLINT,
  status            VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at        TIMESTAMP   NOT NULL DEFAULT now(),
  updated_at        TIMESTAMP   NOT NULL DEFAULT now()
);

-- 2. Travel & Routing
CREATE TABLE fare_zones (
  id          UUID        PRIMARY KEY,
  code        VARCHAR(10) UNIQUE NOT NULL,
  name        VARCHAR     NOT NULL,
  description TEXT,
  created_at  TIMESTAMP   NOT NULL DEFAULT now()
);

CREATE TABLE station_fare_zones (
  station_id    UUID  NOT NULL REFERENCES stations(id)   ON DELETE CASCADE,
  fare_zone_id  UUID  NOT NULL REFERENCES fare_zones(id) ON DELETE CASCADE,
  PRIMARY KEY (station_id, fare_zone_id)
);

CREATE TABLE fare_rules (
  id              UUID            PRIMARY KEY,
  name            VARCHAR         NOT NULL,
  from_zone_id    UUID            REFERENCES fare_zones(id),
  to_zone_id      UUID            REFERENCES fare_zones(id),
  min_stations    SMALLINT,
  max_stations    SMALLINT,
  base_price      NUMERIC(12,0)   NOT NULL,
  currency        VARCHAR(3)      NOT NULL DEFAULT 'VND',
  valid_from      DATE,
  valid_to        DATE,
  created_at      TIMESTAMP       NOT NULL DEFAULT now()
);

CREATE TABLE schedules (
  id                  UUID        PRIMARY KEY,
  line_id             UUID        NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
  name                VARCHAR     NOT NULL,
  day_type            VARCHAR(20) NOT NULL,
  direction           SMALLINT    NOT NULL DEFAULT 0,
  headway_peak_sec    SMALLINT    NOT NULL,
  headway_offpeak_sec SMALLINT    NOT NULL,
  first_departure     TIME        NOT NULL,
  last_departure      TIME        NOT NULL,
  effective_from      DATE        NOT NULL,
  effective_to        DATE,
  created_at          TIMESTAMP   NOT NULL DEFAULT now(),
  updated_at          TIMESTAMP   NOT NULL DEFAULT now()
);

CREATE TABLE trips (
  id                    UUID        PRIMARY KEY,
  schedule_id           UUID        REFERENCES schedules(id),
  line_id               UUID        NOT NULL REFERENCES lines(id),
  train_id              UUID        REFERENCES trains(id),
  direction             SMALLINT    NOT NULL DEFAULT 0,
  service_date          DATE        NOT NULL,
  planned_departure_at  TIMESTAMP   NOT NULL,
  actual_departure_at   TIMESTAMP,
  status                VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  delay_seconds         INTEGER     NOT NULL DEFAULT 0,
  created_at            TIMESTAMP   NOT NULL DEFAULT now(),
  updated_at            TIMESTAMP   NOT NULL DEFAULT now()
);

CREATE TABLE stop_times (
  id                  UUID      PRIMARY KEY,
  trip_id             UUID      NOT NULL REFERENCES trips(id)    ON DELETE CASCADE,
  station_id          UUID      NOT NULL REFERENCES stations(id),
  sequence_order      SMALLINT  NOT NULL,
  planned_arrival_at  TIMESTAMP,
  planned_departure_at TIMESTAMP,
  dwell_time_sec      SMALLINT  NOT NULL DEFAULT 30,
  created_at          TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (trip_id, sequence_order),
  UNIQUE (trip_id, station_id)
);

CREATE TABLE transfers (
  id                    UUID        PRIMARY KEY,
  from_station_id       UUID        NOT NULL REFERENCES stations(id),
  to_station_id         UUID        NOT NULL REFERENCES stations(id),
  from_line_id          UUID        NOT NULL REFERENCES lines(id),
  to_line_id            UUID        NOT NULL REFERENCES lines(id),
  transfer_type         VARCHAR(20) NOT NULL DEFAULT 'same_station',
  walking_time_sec      SMALLINT    NOT NULL DEFAULT 120,
  walking_distance_m    SMALLINT,
  created_at            TIMESTAMP   NOT NULL DEFAULT now(),
  UNIQUE (from_station_id, to_station_id, from_line_id, to_line_id)
);

CREATE TABLE routes (
  id                    UUID            PRIMARY KEY,
  origin_station_id     UUID            NOT NULL REFERENCES stations(id),
  destination_station_id UUID           NOT NULL REFERENCES stations(id),
  total_distance_km     DOUBLE PRECISION NOT NULL,
  total_duration_sec    INTEGER         NOT NULL,
  total_fare            NUMERIC(12,0),
  transfer_count        SMALLINT        NOT NULL DEFAULT 0,
  computed_at           TIMESTAMP       NOT NULL DEFAULT now(),
  UNIQUE (origin_station_id, destination_station_id)
);

CREATE TABLE route_segments (
  id                  UUID            PRIMARY KEY,
  route_id            UUID            NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  sequence_order      SMALLINT        NOT NULL,
  line_id             UUID            NOT NULL REFERENCES lines(id),
  board_station_id    UUID            NOT NULL REFERENCES stations(id),
  alight_station_id   UUID            NOT NULL REFERENCES stations(id),
  station_count       SMALLINT        NOT NULL,
  distance_km         DOUBLE PRECISION NOT NULL,
  duration_sec        INTEGER         NOT NULL,
  created_at          TIMESTAMP       NOT NULL DEFAULT now(),
  UNIQUE (route_id, sequence_order)
);

-- 3. Optimization Indices
CREATE INDEX idx_line_stations_line    ON line_stations (line_id, sequence_order);
CREATE INDEX idx_segments_from        ON segments (from_station_id);
CREATE INDEX idx_segments_line_from   ON segments (line_id, from_station_id);
CREATE INDEX idx_stop_times_trip      ON stop_times (trip_id, sequence_order);
CREATE INDEX idx_transfers_from       ON transfers (from_station_id, from_line_id);
CREATE INDEX idx_trips_service_date   ON trips (service_date);
CREATE INDEX idx_routes_od            ON routes (origin_station_id, destination_station_id);
