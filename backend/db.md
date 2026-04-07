# Metro HCM — Database Schema

> **Scope (Phase 1 — Core Backend)**
> - Transport Infrastructure (Hạ tầng vận tải)
> - Travel & Routing (Logic di chuyển)

---

## ERD Overview

```
lines ──< line_stations >── stations ──< station_fare_zones >── fare_zones
  │              │                                                    │
  │         (sequence,km)                                       fare_rules
  │
  ├──< segments (from→to station per line)
  │
  ├──< depots ──< trains
  │
  └──< schedules ──< trips ──< stop_times
                                    │
                              (station_id)

transfers : station × line → station × line   (đổi tuyến)
routes    : precomputed path cache
route_segments : legs của từng route
```

---

## 1. Transport Infrastructure

### 1.1 `lines` — Tuyến metro

```sql
CREATE TABLE lines (
  id              UUID          PRIMARY KEY,
  code            VARCHAR(10)   UNIQUE NOT NULL,          -- 'L1', 'L2' …
  name            VARCHAR       NOT NULL,                  -- Bến Thành – Suối Tiên
  name_en         VARCHAR,
  color           VARCHAR(7)    NOT NULL DEFAULT '#000000',-- hex, hiển thị bản đồ
  status          VARCHAR(20)   NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','under_construction','suspended','closed')),
  total_length_km DOUBLE PRECISION,                        -- tổng chiều dài (km)
  opening_date    DATE,
  created_at      TIMESTAMP     NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP     NOT NULL DEFAULT now()
);
```

---

### 1.2 `stations` — Ga tàu

```sql
CREATE TABLE stations (
  id              UUID          PRIMARY KEY,
  code            VARCHAR(10)   UNIQUE NOT NULL,           -- 'BT', 'BH', 'ST' …
  name            VARCHAR       NOT NULL,
  name_en         VARCHAR,
  lat             DOUBLE PRECISION NOT NULL,
  lng             DOUBLE PRECISION NOT NULL,
  address         VARCHAR,
  type            VARCHAR(20)   NOT NULL DEFAULT 'underground'
                    CHECK (type IN ('underground','elevated','at_grade')),
  has_elevator    BOOLEAN       NOT NULL DEFAULT FALSE,
  has_parking     BOOLEAN       NOT NULL DEFAULT FALSE,
  status          VARCHAR(20)   NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','closed','under_construction')),
  created_at      TIMESTAMP     NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP     NOT NULL DEFAULT now()
);
```

---

### 1.3 `line_stations` — Ga thuộc tuyến *(ordered junction)*

> Một ga có thể thuộc nhiều tuyến (ga trung chuyển).
> `sequence_order` xác định thứ tự trên tuyến (bắt đầu từ 1).

```sql
CREATE TABLE line_stations (
  id              UUID          PRIMARY KEY,
  line_id         UUID          NOT NULL REFERENCES lines(id)    ON DELETE CASCADE,
  station_id      UUID          NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  sequence_order  SMALLINT      NOT NULL,     -- thứ tự trên tuyến, bắt đầu từ 1
  km_from_start   DOUBLE PRECISION NOT NULL DEFAULT 0, -- khoảng cách tích lũy từ ga đầu (km)
  platform_count  SMALLINT      NOT NULL DEFAULT 2,
  created_at      TIMESTAMP     NOT NULL DEFAULT now(),

  UNIQUE (line_id, sequence_order),
  UNIQUE (line_id, station_id)
);
```

---

### 1.4 `segments` — Đoạn đường ray giữa 2 ga liên tiếp

> Mỗi `segment` là 1 cạnh có hướng (from → to) trong graph định tuyến.
> Để đi 2 chiều cần 2 bản ghi (hoặc treat là undirected tùy thuật toán).

```sql
CREATE TABLE segments (
  id                UUID          PRIMARY KEY,
  line_id           UUID          NOT NULL REFERENCES lines(id)      ON DELETE CASCADE,
  from_station_id   UUID          NOT NULL REFERENCES stations(id),
  to_station_id     UUID          NOT NULL REFERENCES stations(id),
  distance_km       DOUBLE PRECISION NOT NULL,
  travel_time_sec   INTEGER       NOT NULL,   -- thời gian chạy (giây), không tính dừng ga
  max_speed_kmh     SMALLINT,
  track_type        VARCHAR(20)   NOT NULL DEFAULT 'underground'
                      CHECK (track_type IN ('underground','elevated','at_grade')),
  created_at        TIMESTAMP     NOT NULL DEFAULT now(),

  UNIQUE (line_id, from_station_id, to_station_id),
  CHECK (from_station_id <> to_station_id)
);
```

---

### 1.5 `depots` — Depot / kho tàu

```sql
CREATE TABLE depots (
  id          UUID        PRIMARY KEY,
  code        VARCHAR(10) UNIQUE NOT NULL,
  name        VARCHAR     NOT NULL,
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  line_id     UUID        REFERENCES lines(id),   -- tuyến chủ quản
  capacity    SMALLINT,                            -- số đoàn tàu tối đa
  created_at  TIMESTAMP   NOT NULL DEFAULT now()
);
```

---

### 1.6 `trains` — Đoàn tàu

```sql
CREATE TABLE trains (
  id                UUID        PRIMARY KEY,
  code              VARCHAR(20) UNIQUE NOT NULL,  -- 'T-L1-001'
  line_id           UUID        NOT NULL REFERENCES lines(id),
  depot_id          UUID        REFERENCES depots(id),
  car_count         SMALLINT    NOT NULL DEFAULT 4,
  capacity_per_car  SMALLINT    NOT NULL DEFAULT 200,
  manufacturer      VARCHAR,
  manufacture_year  SMALLINT,
  status            VARCHAR(20) NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active','maintenance','retired')),
  created_at        TIMESTAMP   NOT NULL DEFAULT now(),
  updated_at        TIMESTAMP   NOT NULL DEFAULT now()
);

-- Tổng sức chứa = car_count × capacity_per_car (computed ở app layer hoặc generated col)
```

---

## 2. Travel & Routing

### 2.1 `fare_zones` — Vùng vé

> Hệ thống tính vé theo zone (phổ biến với metro nhiều tuyến).

```sql
CREATE TABLE fare_zones (
  id          UUID        PRIMARY KEY,
  code        VARCHAR(10) UNIQUE NOT NULL,  -- 'Z1', 'Z2' …
  name        VARCHAR     NOT NULL,
  description TEXT,
  created_at  TIMESTAMP   NOT NULL DEFAULT now()
);
```

---

### 2.2 `station_fare_zones` — Ga thuộc zone

```sql
CREATE TABLE station_fare_zones (
  station_id    UUID  NOT NULL REFERENCES stations(id)   ON DELETE CASCADE,
  fare_zone_id  UUID  NOT NULL REFERENCES fare_zones(id) ON DELETE CASCADE,
  PRIMARY KEY (station_id, fare_zone_id)
);
```

---

### 2.3 `fare_rules` — Quy tắc giá vé

> Linh hoạt: có thể theo zone, theo số ga, hoặc kết hợp.

```sql
CREATE TABLE fare_rules (
  id              UUID            PRIMARY KEY,
  name            VARCHAR         NOT NULL,           -- 'Zone 1→2', '1-5 stations'
  from_zone_id    UUID            REFERENCES fare_zones(id),  -- NULL = any zone
  to_zone_id      UUID            REFERENCES fare_zones(id),  -- NULL = any zone
  min_stations    SMALLINT,                           -- số ga tối thiểu (inclusive)
  max_stations    SMALLINT,                           -- số ga tối đa (inclusive), NULL = ∞
  base_price      NUMERIC(12,0)   NOT NULL,           -- VND
  currency        VARCHAR(3)      NOT NULL DEFAULT 'VND',
  valid_from      DATE,
  valid_to        DATE,
  created_at      TIMESTAMP       NOT NULL DEFAULT now()
);
```

---

### 2.4 `schedules` — Lịch vận hành (template)

> Mỗi schedule là 1 template áp dụng cho 1 nhóm ngày (ngày thường / cuối tuần / lễ).

```sql
CREATE TABLE schedules (
  id                  UUID        PRIMARY KEY,
  line_id             UUID        NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
  name                VARCHAR     NOT NULL,           -- 'Ngày thường', 'Cuối tuần'
  day_type            VARCHAR(20) NOT NULL
                        CHECK (day_type IN ('weekday','weekend','holiday','special')),
  direction           SMALLINT    NOT NULL DEFAULT 0
                        CHECK (direction IN (0, 1)),  -- 0 = chiều đi, 1 = chiều về
  headway_peak_sec    SMALLINT    NOT NULL,           -- giãn cách giờ cao điểm (giây)
  headway_offpeak_sec SMALLINT    NOT NULL,           -- giãn cách giờ thường (giây)
  first_departure     TIME        NOT NULL,
  last_departure      TIME        NOT NULL,
  effective_from      DATE        NOT NULL,
  effective_to        DATE,                           -- NULL = còn hiệu lực
  created_at          TIMESTAMP   NOT NULL DEFAULT now(),
  updated_at          TIMESTAMP   NOT NULL DEFAULT now()
);
```

---

### 2.5 `trips` — Chuyến tàu cụ thể

> Mỗi `trip` = 1 lần tàu chạy hết tuyến (hoặc một phần tuyến) vào 1 ngày cụ thể.

```sql
CREATE TABLE trips (
  id                    UUID        PRIMARY KEY,
  schedule_id           UUID        REFERENCES schedules(id),
  line_id               UUID        NOT NULL REFERENCES lines(id),
  train_id              UUID        REFERENCES trains(id),          -- gán tàu có thể muộn hơn
  direction             SMALLINT    NOT NULL DEFAULT 0
                          CHECK (direction IN (0, 1)),
  service_date          DATE        NOT NULL,
  planned_departure_at  TIMESTAMP   NOT NULL,   -- thời gian xuất phát khỏi ga đầu (planned)
  actual_departure_at   TIMESTAMP,
  status                VARCHAR(20) NOT NULL DEFAULT 'scheduled'
                          CHECK (status IN ('scheduled','in_progress','completed','cancelled','delayed')),
  delay_seconds         INTEGER     NOT NULL DEFAULT 0,
  created_at            TIMESTAMP   NOT NULL DEFAULT now(),
  updated_at            TIMESTAMP   NOT NULL DEFAULT now()
);

CREATE INDEX idx_trips_service_date  ON trips (service_date);
CREATE INDEX idx_trips_line_date     ON trips (line_id, service_date);
```

---

### 2.6 `stop_times` — Thời gian dừng tại từng ga của 1 chuyến

```sql
CREATE TABLE stop_times (
  id                  UUID      PRIMARY KEY,
  trip_id             UUID      NOT NULL REFERENCES trips(id)    ON DELETE CASCADE,
  station_id          UUID      NOT NULL REFERENCES stations(id),
  sequence_order      SMALLINT  NOT NULL,
  planned_arrival_at  TIMESTAMP,              -- NULL cho ga đầu tiên
  planned_departure_at TIMESTAMP,             -- NULL cho ga cuối cùng
  actual_arrival_at   TIMESTAMP,
  actual_departure_at TIMESTAMP,
  dwell_time_sec      SMALLINT  NOT NULL DEFAULT 30,  -- thời gian dừng tối thiểu (giây)
  created_at          TIMESTAMP NOT NULL DEFAULT now(),

  UNIQUE (trip_id, sequence_order),
  UNIQUE (trip_id, station_id)
);

CREATE INDEX idx_stop_times_station ON stop_times (station_id);
```

---

### 2.7 `transfers` — Điểm đổi tuyến

> Ghi nhận cặp (ga, tuyến) → (ga, tuyến) hợp lệ để đổi tuyến.
> `from_station_id = to_station_id` khi đổi tuyến cùng ga.

```sql
CREATE TABLE transfers (
  id                    UUID        PRIMARY KEY,
  from_station_id       UUID        NOT NULL REFERENCES stations(id),
  to_station_id         UUID        NOT NULL REFERENCES stations(id),
  from_line_id          UUID        NOT NULL REFERENCES lines(id),
  to_line_id            UUID        NOT NULL REFERENCES lines(id),
  transfer_type         VARCHAR(20) NOT NULL DEFAULT 'same_station'
                          CHECK (transfer_type IN ('same_station','nearby_station')),
  walking_time_sec      SMALLINT    NOT NULL DEFAULT 120,
  walking_distance_m    SMALLINT,
  created_at            TIMESTAMP   NOT NULL DEFAULT now(),

  UNIQUE (from_station_id, to_station_id, from_line_id, to_line_id),
  CHECK (from_line_id <> to_line_id)
);
```

---

### 2.8 `routes` — Precomputed route cache

> Cache kết quả tìm đường (shortest path) giữa 2 ga.
> Rebuild khi topology / schedule thay đổi.

```sql
CREATE TABLE routes (
  id                    UUID            PRIMARY KEY,
  origin_station_id     UUID            NOT NULL REFERENCES stations(id),
  destination_station_id UUID           NOT NULL REFERENCES stations(id),
  total_distance_km     DOUBLE PRECISION NOT NULL,
  total_duration_sec    INTEGER         NOT NULL,   -- ước tính (không tính chờ)
  total_fare            NUMERIC(12,0),              -- giá vé tương ứng
  transfer_count        SMALLINT        NOT NULL DEFAULT 0,
  computed_at           TIMESTAMP       NOT NULL DEFAULT now(),

  UNIQUE (origin_station_id, destination_station_id),
  CHECK  (origin_station_id <> destination_station_id)
);

CREATE INDEX idx_routes_od ON routes (origin_station_id, destination_station_id);
```

---

### 2.9 `route_segments` — Các leg của 1 route

> Mỗi route có 1..N leg; mỗi leg đi liên tục trên 1 tuyến không cần đổi.

```sql
CREATE TABLE route_segments (
  id                  UUID            PRIMARY KEY,
  route_id            UUID            NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  sequence_order      SMALLINT        NOT NULL,
  line_id             UUID            NOT NULL REFERENCES lines(id),
  board_station_id    UUID            NOT NULL REFERENCES stations(id),   -- lên tàu
  alight_station_id   UUID            NOT NULL REFERENCES stations(id),   -- xuống tàu
  station_count       SMALLINT        NOT NULL,
  distance_km         DOUBLE PRECISION NOT NULL,
  duration_sec        INTEGER         NOT NULL,
  created_at          TIMESTAMP       NOT NULL DEFAULT now(),

  UNIQUE (route_id, sequence_order),
  CHECK  (board_station_id <> alight_station_id)
);
```

---

## 3. Indexes tổng hợp

```sql
-- Tra cứu ga theo tuyến theo thứ tự
CREATE INDEX idx_line_stations_line    ON line_stations (line_id, sequence_order);

-- Tra cứu segment cho graph routing
CREATE INDEX idx_segments_from        ON segments (from_station_id);
CREATE INDEX idx_segments_line_from   ON segments (line_id, from_station_id);

-- Tra cứu chuyến tàu theo ngày + ga (for real-time departure board)
CREATE INDEX idx_stop_times_trip      ON stop_times (trip_id, sequence_order);

-- Transfer lookup
CREATE INDEX idx_transfers_from       ON transfers (from_station_id, from_line_id);
```

---

## 4. Ghi chú thiết kế

| Quyết định | Lý do |
|---|---|
| `segments` lưu có hướng (from→to) | Thời gian chạy 2 chiều có thể khác nhau (độ dốc, tốc độ giới hạn) |
| `line_stations.km_from_start` | Tính nhanh khoảng cách giữa 2 ga cùng tuyến: `|km_a - km_b|` |
| `routes` precomputed | Tránh chạy Dijkstra/BFS realtime cho mỗi request; rebuild theo batch |
| `fare_rules` generic | Hỗ trợ cả mô hình zone-based lẫn distance-based mà không đổi schema |
| `trips.delay_seconds` | Dùng cho real-time tracking phase sau, tính từ `stop_times` actual vs planned |
| `schedules` tách `trips` | Schedule = template (tái sử dụng); Trip = instance thực tế của ngày cụ thể |
| UUID cho tất cả PK | Dễ federate / shard sau này, tránh ID leak |
