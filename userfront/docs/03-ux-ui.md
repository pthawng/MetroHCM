# 03 UX/UI Design System (Senior SPEC)

## 🎯 Design Philosophy: Digital Twin HUD

MetroHCM bypasses traditional SaaS aesthetics for an **Industrial Stealth / Command Center** visual language. Total digital immersion is achieved through high-contrast telemetry and glassmorphism, treating the passenger interface as a living monitoring system for the metro infrastructure.

---

## 🎨 Atomic Color Architecture

| Layer | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| **Void Black** | `#04060B` | Primary background, creating deep contrast for HUD elements. |
| **Telemetry Blue** | `#007AFF` | Primary status, active route tracking, and core branding. |
| **Safe Emerald** | `#22C55E` | Validation, active tickets, and operational readiness. |
| **Alert Amber** | `#F59E0B` | System maintenance, delayed telemetry, or warnings. |
| **Slate HUD** | `#94A3B8` | Metadata, unit measurements, and inactive states. |

---

## 🧩 Component System (Command Center Primitives)

Our Atomic Design is built specifically for high-fidelity data visualization:

### 1. Atoms (Telemetry Base)
- **Glass Panel**: A `#04060B` surface with `backdrop-blur-3xl` and `border-white/10`.
- **Digital Stripe**: 1px accent lines used for section separators and header indicators.
- **HUD Button**: High-transparency interactive zones with `primary` or `white` variants.

### 2. Molecules (Data Modules)
- **StationNode**: Interactive GIS markers with ripple effects on hover.
- **MagneticStripe**: A visual "Digital Card" pattern used to signify authenticity in tickets.
- **TelemetryDisplay**: Standardized unit + value pairs (e.g., "28.4°C [Global_Avg]").

### 3. Organisms (Command Surfaces)
- **MapPreview (GIS HUD)**: The core interactive engine utilizing SVG Geodata and dynamic fleet positioning.
- **TicketVault**: A grid-based component aggregating digital assets with high-fidelity QR generation.
- **MetroWallet**: A financial module mirroring premium banking interfaces with balance persistence.

---

## 🎞️ Motion System (HUD Pulse)

Animations are used not just for aesthetics, but to signal **Real-Time Data Continuity**:

- **Telemetry Pulse**: Subtle scaling (1.02x) on interaction zones to indicate "Readiness".
- **Scan Lines**: Linear animations across the Map Engine to simulate GIS data refreshing.
- **The Glow**: `drop-shadow` transitions on active routes to simulate electrical infrastructure.

**Standard Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (Precision / Industrial feel).
**Duration**: `0.6s` for transitions, `10s+` for background telemetry.

---

## 📐 Layout Engine (Grid-Based)

- **HUD Grid**: 40px base grid with persistent overlays.
- **Viewport Constraints**: Focused on a **Single Content Surface** (No scrolling where possible, favoring state-toggling within the HUD).
