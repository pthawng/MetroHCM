# Operatefront: Domain-Driven Folder Structure

Tài liệu này định nghĩa cấu trúc thư mục chuẩn **Feature-Sliced Design (FSD)** cho Command Center. Cấu trúc này tối ưu cho việc mở rộng (Scalability), tách biệt logic nghiệp vụ (Domain Logic) và giao diện (UI).

## 1. Overview Structure

```text
src/
├── app/                  # App bootstrap (providers, config, styles)
│   ├── providers/        # SocketProvider, StoreProvider
│   └── styles/           # Global CSS, Design Tokens
│
├── shared/               # Reusable logic (Không chứa domain logic)
│   ├── lib/              # Socket.io setup, zod utils, axios
│   ├── ui/               # Primary UI components (Button, Input, Panel)
│   ├── types/            # Base TS types
│   └── constants/        # App-wide constants
│
├── entities/             # Trái tim của hệ thống: Các thực thế nghiệp vụ
│   ├── train/            # Domain: Tàu điện
│   │   ├── model/        # Types & Zod Schemas
│   │   ├── store/        # Zustand (Train Store)
│   │   └── lib/          # Mappers (Raw -> Normalized)
│   ├── station/          # Domain: Nhà ga
│   └── line/             # Domain: Tuyến đường
│
├── features/             # Business Logic & Use-cases (Logic vận hành)
│   ├── realtime-tracking/# Logic nhận/xử lý stream tọa độ
│   │   ├── socket/       # Socket events ingestion
│   │   └── model/        # Tracking services
│   ├── alerts/           # Logic phát hiện sự cố/delay
│   └── simulation-ctrl/  # Logic điều khiển Simulation (Pause/Resume)
│
├── widgets/              # UI blocks lớn (Compose từ entities + features)
│   ├── map-view/         # Component bản đồ (Mapbox + TrainLayer)
│   ├── train-panel/      # Bảng danh sách tàu & trạng thái
│   └── alert-feed/       # Danh sách cảnh báo thời gian thực
│
├── pages/                # Route-level components (Giữ ở mức tối giản)
│   └── dashboard/        # Giao diện chính của trung tâm điều hành
│
└── processes/           # (Optional) Logic đa domain (vd: Khởi chạy quy trình khẩn cấp)
```

## 2. Layer Definitions (Quy tắc Layer)

### 2.1. entities/ (Domain Models)
Đây là nơi định nghĩa dữ liệu "Sống". Mỗi entity bao gồm:
- **Model**: Định nghĩa hình dáng dữ liệu và cách validate (Zod).
- **Store**: Quản lý trạng thái bằng Zustand (Normalized Record).
- **Lib**: Các hàm biến đổi dữ liệu (Mapper/Formatter) đặc thù cho thực thể đó.

### 2.2. features/ (Application Logic)
Nơi xử lý các "hành động" của người dùng hoặc hệ thống. 
- **Lưu ý**: Feature xử lý logic (Data flow), không nên chứa các UI phức tạp. Nó kết nối Socket với Store của Entity.

### 2.3. widgets/ (UI Composition)
Nơi lắp ghép các Entity và Feature thành các khối giao diện hoàn chỉnh. 
- Ví dụ: `MapWidget` sẽ sử dụng `TrainEntity` để lấy tọa độ và `RealtimeFeature` để cập nhật vị trí.

### 2.4. shared/ (Bản vá hạ tầng)
Các hàm helper, setup thư viện (Socket.io) không liên quan đến nghiệp vụ Metro. Nếu bạn mang folder `shared` sang dự án khác, nó vẫn phải hoạt động được.

## 3. Quy tắc "Vàng" về ranh giới (Boundaries)

1.  **Không Import vòng**: Layer trên (vd: `widgets`) có thể import layer dưới (`entities`), nhưng layer dưới KHÔNG bao giờ được import layer trên.
2.  **Isolation**: Tuyệt đối không viết logic xử lý socket hoặc tính toán tọa độ trực tiếp trong file UI (`.tsx`). Logic phải nằm ở `features/` hoặc `entities/lib`.
3.  **Selective Subscriptions**: Trong UI, chỉ subscribe vào phần dữ liệu cần thiết của store để tối ưu FPS.

---
> [!IMPORTANT]
> **Staff Eng Mindset**: "Folder structure không phải để cho gọn, mà là để giữ ranh giới rõ ràng giữa Domain, Data và UI."
