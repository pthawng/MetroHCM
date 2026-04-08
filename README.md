# MetroHCM: Advanced Operations Command & Control (OCC) System
> Real-time Monitoring & Management System for Ho Chi Minh City Metro Line 1.
> Hệ thống Trung tâm Điều hành và Giám sát Thời gian thực - Tuyến Metro Số 1 TP. Hồ Chí Minh.

---

## 🌐 Language / Ngôn ngữ
- [English](#-mission--vision)
- [Tiếng Việt](#-tầm-nhìn--sứ-mệnh)

---

## 🌟 Mission & Vision / Tầm nhìn & Sứ mệnh

### [English]
**MetroHCM** is a cutting-edge digital infrastructure designed to manage, operate, and optimize the Ho Chi Minh City Metro Line 1 (Ben Thanh - Suoi Tien). Our mission is to provide a **resilient, real-time, and high-fidelity monitoring infrastructure** that gives dispatchers and engineers a precise, millisecond-accurate view of the urban rail network.

### [Tiếng Việt]
**MetroHCM** là nền tảng hạ tầng kỹ thuật số tiên tiến, được thiết kế để quản lý, điều hành và tối ưu hóa hoạt động của Tuyến Metro Số 1 (Bến Thành - Suối Tiên). Sứ mệnh của chúng tôi là cung cấp một lớp **hạ tầng giám sát kiên cố, thời gian thực và độ trung thực cao**, giúp các điều độ viên và kỹ sư có cái nhìn chính xác đến từng mili-giây về toàn bộ mạng lưới đường sắt đô thị.

---

## 🏗️ Architectural Overview / Kiến trúc Hệ thống

The system follows an **Event-Driven Architecture (EDA)** combined with **Domain-Driven Design (DDD)** to ensure scalability and maintainability.
Hệ thống được thiết kế theo mô hình **Kiến trúc Hướng sự kiện (EDA)** kết hợp với **Thiết kế Hướng tên miền (DDD)** để đảm bảo tính mở rộng và dễ bảo trì.

```mermaid
graph TD
    subgraph "Simulation & Telemetry Layer"
        SE[Simulation Engine] --> |WebSocket/Protocol| B[Backend API]
    End

    subgraph "Core Data & Logic Layer"
        B --> |Prisma/SQL| DB[(PostgreSQL)]
        B --> |Socket.io| WS[Real-time Gateway]
    End

    subgraph "Observation & Control Layer"
        WS --> |Live Streaming| OF[Operate Front: Command Center]
        B --> |REST API| UF[User Front: Mobile App]
    End

    subgraph "External Integration"
        CT[CheckTicket Service] --> B
    End

    style B fill:#f96,stroke:#333,stroke-width:2px
    style OF fill:#00c,color:#fff,stroke-width:4px
```

---

## 📦 Core Modules / Các thành phần chính

1.  **`backend`**: 
    - **EN**: The "Heart" of the system - NestJS API Gateway handling data flows, authentication, and infrastructure resource management.
    - **VI**: "Trái tim" của hệ thống - NestJS API Gateway xử lý luồng dữ liệu, xác thực, và quản trị tài nguyên hạ tầng.
2.  **`operatefront`**: 
    - **EN**: Operations Command Center dashboard. Uses Mapbox GL JS to render train movements with 60 FPS interpolation.
    - **VI**: Dashboard điều hành Trung tâm. Sử dụng Mapbox GL JS để hiển thị chuyển động của đoàn tàu với độ mượt 60 FPS (nội suy).
3.  **`simulation-engine`**: 
    - **EN**: Movement and telemetry simulation tool, acting as the "digital twin" of the physical system.
    - **VI**: Công cụ giả lập chuyển động và telemetry, đóng vai trò như "digital twin" của hệ thống thực tế.
4.  **`userfront`**: 
    - **EN**: Consumer-facing interface for passengers, providing real-time route information and station status.
    - **VI**: Giao diện dành cho hành khách, cung cấp thông tin lộ trình và tình trạng ga theo thời gian thực.
5.  **`checkTicket`**: 
    - **EN**: Ticketing control and passenger flow management system at ticket gates.
    - **VI**: Hệ thống kiểm soát vé và quản lý lưu lượng hành khách tại cổng soát vé.

---

## 🛠️ Technology Stack / Công nghệ sử dụng

| Layer / Lớp | Technologies / Công nghệ |
| :--- | :--- |
| **Backend** | NestJS, TypeScript, Prisma, Socket.io |
| **Frontend** | React, Vite, Zustand, TailwindCSS, MapboxGL |
| **Database** | PostgreSQL, Redis (Caching L2) |
| **Simulation** | Node.js, RxJS (Stream processing) |
| **Infrastructure** | Docker, Kubernetes (K8s), Prometheus/Grafana |

---

## 🚀 Getting Started / Hướng dẫn Triển khai

### 1. Prerequisites / Yêu cầu hệ thống
- **Node.js**: v20.x or higher / Phiên bản 20.x trở lên.
- **Docker**: For Database and Redis / Để khởi chạy Database và Redis.

### 2. Configuration / Cấu hình
Copy `.env.example` to `.env` in each module directory and update:
Sao chép `.env.example` thành `.env` trong từng thư mục module và cập nhật:
- `MAPBOX_ACCESS_TOKEN` (for `operatefront`)
- `DATABASE_URL` (for `backend`)

### 3. Installation & Setup / Cài đặt & Khởi chạy
```bash
# Install dependencies / Cài đặt phụ thuộc
cd backend && npm install
cd ../operatefront && npm install
cd ../simulation-engine && npm install

# Run Development Mode / Khởi chạy chế độ phát triển
# 1. Start Backend
cd backend && npm run start:dev

# 2. Start Simulation Engine
cd simulation-engine && npm run start:dev

# 3. Start Command Center (Operate Front)
cd operatefront && npm run dev
```

---

## 🛡️ Engineering Excellence / Tiêu chuẩn Kỹ thuật

**English**:
The project strictly adheres to **Google L9 (Staff/Principal Engineer)** documentation and coding standards:
- **Type Safety**: 100% TypeScript with `strict: true`.
- **Atomic Operations**: Ensuring data integrity via complex transactions.
- **Observability**: Built-in Prometheus metrics and structured logging.
- **Performance**: Zero-GC leaks policy for real-time visualization.

**Tiếng Việt**:
Dự án tuân thủ nghiêm ngặt các tiêu chuẩn kỹ thuật **Staff/Principal Engineer Google (L9)**:
- **Type Safety**: 100% codebase sử dụng TypeScript với cấu hình hệ thống `strict: true`.
- **Atomic Operations**: Đảm bảo tính nhất quán dữ liệu qua các transaction phức tạp.
- **Observability**: Hệ thống logging tập trung và metrics (Prometheus) tích hợp sẵn.
- **Performance**: Chính sách xử lý dữ liệu không rò rỉ bộ nhớ (Zero-GC leaks) cho hiển thị thời gian thực.

---

## 📄 License
Copyright &copy; 2026 **MetroHCM Team**.

---

> [!IMPORTANT]
> All schema changes or WebSocket protocol updates must be reviewed by the Principal Architect before merging to `main`.
> Mọi thay đổi về schema hoặc giao thức WebSocket phải được review bởi Architect trước khi merge vào nhánh `main`.
