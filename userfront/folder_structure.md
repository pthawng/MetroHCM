# 🏗️ MetroHCM Storefront Architecture

This document outlines the standard folder structure and architectural guidelines for the MetroHCM Storefront. We follow a **Feature-based, Scalable, and Domain-driven** approach.

## 🛠️ Tech Stack (Senior Standard)

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | SEO-friendly, Server Components, high performance. |
| **Language** | TypeScript | Type safety, self-documenting code, better IDE support. |
| **Server State** | TanStack React Query | Robust caching, synchronization, and error handling. |
| **Client State** | Zustand | Lightweight, high-performance, boilerplate-free. |
| **Styling** | Tailwind CSS | Utility-first, fast development, consistent design system. |
| **Form Management** | React Hook Form + Zod | Type-safe form validation and complex schema handling. |
| **Authentication** | NextAuth.js / Custom JWT | Secure, flexible, and industry-standard. |
| **Maps** | Mapbox / Google Maps API | High-quality visualization for metro routes. |
| **i18n** | `next-intl` | Standard for multi-language support (English/Vietnamese). |

---

## 📂 Folder Structure

```text
src/
├── app/                        # Next.js App Router (Routing & Layouts)
│   ├── (auth)/                 # Auth flow (Login, Register, Reset Password)
│   ├── (main)/                 # Main application routes
│   │   ├── stations/           # Station listing/details
│   │   ├── routes/             # Metro route information
│   │   ├── page.tsx            # Landing Page / Home
│   ├── (booking)/              # Ticket booking flow (Ticket Selection, Payment, Success)
│   │   ├── ticket/
│   │   │   ├── confirm/
│   │   │   ├── payment/
│   │   │   └── success/
│   ├── api/                    # Route Handlers (BFF - Backend for Frontend)
│   ├── layout.tsx              # Root Layout (Providers, Global UI)
│   └── globals.css             # Global Styles
│
├── features/                   # 💥 CORE BUSINESS LOGIC (Domain-driven)
│   ├── station/                # Station-related logic
│   │   ├── components/         # Station-specific UI (StationCard, MapPicker)
│   │   ├── hooks/              # useStationSearch, useStationDetails
│   │   ├── services/           # API calls (station.api.ts)
│   │   ├── types/              # Station-specific types
│   │   └── index.ts            # Public API (Barrel file)
│   ├── ticket/                 # Ticket & Booking business logic
│   ├── route/                  # Metro route calculation & display
│   ├── payment/                # Payment integration (Momo, VNPay, Stripe)
│   └── user/                   # Profile, history, settings
│
├── components/                 # Reusable UI (Presentation only)
│   ├── ui/                     # Design System (Button, Input, Modal, Toast) - Shadcn/UI pattern
│   ├── common/                 # Layout elements (Navbar, Footer, Sidebar)
│   └── shared/                 # Logic-less shared components
│
├── services/                   # Global Service Layer
│   ├── api-client.ts           # Axios/Fetch instance configuration (Interceptors)
│   └── socket.ts               # Optional: Real-time updates (via WebSocket)
│
├── store/                      # Global Client State (Zustand)
│   ├── useAuthStore.ts         # User session & tokens
│   └── useBookingStore.ts      # Temporary booking data during flow
│
├── hooks/                      # Global Custom Hooks
│   ├── useMediaQuery.ts
│   └── useDebounce.ts
│
├── lib/                        # Helpers & Configs
│   ├── constants/              # App-wide constants (URLs, Enuums)
│   ├── utils/                  # Pure utility functions (cn, formatters)
│   └── validators/             # Shared Zod schemas
│
├── types/                      # Global TypeScript Definitions
│   ├── api.ts                  # Common API Response shapes
│   └── common.ts
│
├── config/                     # Application Configuration
│   ├── env.ts                  # Zod-validated environment variables
│   └── site.ts                 # SEO & metadata configuration
│
└── styles/                     # Supplementary styles (Animations, Variables)
```

---

## 🧠 Architectural Principles (Senior Mindset)

### 1. Feature-Based Isolation
*   **Anti-pattern:** Dumping all components in `/components` and all hooks in `/hooks`.
*   **Senior Pattern:** If a component/hook is only used by the "Ticket" feature, it stays inside `features/ticket`. This reduces cognitive load and allows teams to scale without "spaghetti code."

### 2. Encapsulation via Barrel Files (`index.ts`)
Each feature module must have an `index.ts` file. 
*   **Only export** what is needed by other features or pages.
*   Internal logic (private helpers, sub-components) remains hidden from the rest of the application.
*   *Import example:* `import { TicketForm } from '@/features/ticket';`

### 3. Clear Layers of Responsibility
| Layer | Responsibility | Rule |
|---|---|---|
| **UI (Components)** | Rendering | No complex logic. Data comes from props/hooks. |
| **Hooks (Logic)** | State & Side Effects | Orchestrates services and local state. |
| **Services (API)** | Data Fetching | Pure functions for communication with the backend. |
| **Store (Global)** | Cross-page state | Only for data that *must* persist across pages. |

### 4. Smart/Dumb Component Pattern
*   **Smart:** Features (pages/sections) that handle state and data.
*   **Dumb:** `components/ui` components that are purely stylistic and reusable.

---

## 🔄 User Flow Optimization (The Metro Experience)

| Phase | Feature | Logic Location |
|---|---|---|
| **Discovery** | `feature/station` | Search ga đi/đến, hiển thị map. |
| **Selection** | `feature/route` | Tính toán tuyến đường tối ưu, thời gian chờ. |
| **Booking** | `feature/ticket` | Form nhập thông tin, chọn loại vé (Single/Day). |
| **Checkout** | `feature/payment` | Tích hợp cổng thanh toán. |
| **Success** | `feature/user` | Lưu vé vào lịch sử, hiển thị QR Code. |

---

## 🚀 Performance & Security

*   **Lazy Loading:** Use `next/dynamic` for heavy components like Maps.
*   **Zod Safety:** Validate all API responses before using them in the UI.
*   **Optimistic Updates:** Use React Query `onMutate` to provide instant feedback for ticket bookings or profile updates.
*   **Route Protection:** Use Next.js Middleware for server-side auth checks.

## 🧪 Testing Strategy
*   **Unit Tests:** Business logic in `features/*/hooks` and `lib/utils`.
*   **Integration Tests:** Ticket booking flow using React Testing Library.
*   **E2E:** Critical path (Search -> Select -> Pay) using Playwright.

---
*Generated by Antigravity - Senior Architect Mode*
