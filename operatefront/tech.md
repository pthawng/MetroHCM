# Operatefront: Technical Stack & Architecture (Refined)

Tài liệu này định nghĩa bộ công nghệ (Tech Stack) và nguyên tắc thiết kế cho **Command Center (operatefront)** của dự án MetroHCM. Kiến trúc này được tối ưu hóa cho **Hiệu suất (60 FPS)**, **Tính nhất quán của dữ liệu (Consistency)** và **Khả năng điều khiển (Control Layer)**.

## 1. Core Framework & Build Tool
- **Vite + React (SPA)**: Khởi động cực nhanh, render thực tế.
- **TypeScript (Strict Mode)**: Đảm bảo Type Safety xuyên suốt hệ thống.

## 2. Data Lifecycle Strategy (The Pipeline) 🛠️
Dữ liệu được xử lý qua 4 lớp tách biệt để tránh hiện tượng "jitter" và lỗi runtime:
1.  **Socket Raw Stream**: Tiếp nhận dữ liệu thô từ cổng `3001`.
2.  **Validation Layer (Zod)**: Sử dụng `TrainSchema.safeParse` kèm **versioning schema**. Nếu fail, đẩy vào metrics/logs thay vì reject âm thầm.
3.  **Normalized Store (Zustand)**: Lưu trữ dưới dạng `Record<string, Train>` thay vì mảng. Support **Batch Updates** để tránh re-render thừa.
4.  **Derived State (Selectors)**: Sử dụng các selectors hiệu quả (như `useMemo`) để tính toán số liệu tàu trễ, trạng thái hệ thống mà không tính toán lại toàn bộ store.

## 3. High-Performance Rendering Strategy 🏎️
- **Mapbox Engine (GeoJSON Source)**: 
  - **NGUYÊN TẮC**: React KHÔNG phải là render engine cho bản đồ.
  - Tàu sẽ được render trực tiếp thông qua `map.getSource("trains").setData(geoJson)`. Điều này giúp hệ thống giữ vững 60 FPS ngay cả khi có hàng trăm đoàn tàu.
- **Interpolation Loop**: Dữ liệu bắn về 1s/lần. Hệ thống sẽ sử dụng một loop nội suy (interpolation) để di chuyển tàu mượt mà giữa điểm A (cũ) và điểm B (mới) trong khoảng thời gian chờ package tiếp theo.

## 4. Control Layer (Command) 🎮
Operatefront không chỉ là Dashboard hiển thị, nó là một **Command Center**:
- **Simulation Control**: Pause, Play, Reset Simulation.
- **Fault Injection**: Cho phép người vận hành "tiêm" sự cố (delay, dừng khẩn cấp) trực tiếp từ giao diện vào Simulation Engine.

## 5. UI/UX & Interaction Priority
- **Glassmorphism Design**: Layout màu tối, chiều sâu hội họa cao.
- **Z-Index System**:
    - Map (0) -> Overlays (10) -> Panels (100) -> Alerts/Modals (1000).
- **Interaction Priority**: Đảm bảo các tác vụ kéo/thả Map (Interaction) không bị chặn bởi các tiến trình update dữ liệu ngầm.

## 6. Temporal Debugging (Timeline) ⏳
- **Event Log Buffer**: Lưu trữ log sự kiện trong bộ nhớ (in-memory) để người vận hành có thể tra cứu nhanh: "5 phút trước đoàn tàu này ở đâu?".

---
> [!IMPORTANT]
> **Staff Mindset**: Chúng ta không xây dựng một ứng dụng hiển thị (Visualizer), chúng ta xây dựng một Hệ thống điều hành (Operating System) cho mạng lưới Metro.
