# 11 Technical Feature Spec: Passenger Dashboard

## 🛸 The Command Center Architecture

The Passenger Dashboard is the primary management interface for a verified user. It aggregates their **Digital Identity**, **Financial Ledger**, and **Transit Assets** into a unified HUD.

---

## 🎟️ Asset Module: Ticket Vault (`/tickets`)

The Ticket Vault manages all digital transit assets. Each ticket is treated as a secure token in the system's ledger.

### 🧩 Component: `TicketCard.tsx`
- **Visual Design**: High-fidelity "Magnetic Stripe" card with `glow` effects on active status.
- **QR Generation**: Dynamic encoding of `TicketID` (Mock) for validation at turnstiles.
- **States**: 
    - `ACTIVE`: Safe Emerald highlights, high-priority in the grid.
    - `USED`: Muted Slate, status indicator set to `Consumed`.
    - `EXPIRED`: Alert Amber indicator, disabled download actions.

### 🔄 Data Lifecycle
1.  **Fetch**: Queries `TicketService` for user-bound assets.
2.  **Filtering**: Client-side sorting by status (Active/All).
3.  **Real-Time State**: React-memoized cards for 60fps performance on high-count inventories.

---

## 🆔 Identity Module: Digital ID (`/profile`)

The Digital ID is the system's core source of truth for the passenger's identity.

### 🧩 Component: `IDCard.tsx`
- **Design System**: Industrial ID card layout with `GlassPanel` background.
- **Metadata**: Persistent display of Name, ID Number, and Membership Tier.
- **Interaction**: Subtle hover scaling to reveal system-level identification details.

---

## 💳 Financial Module: Metro Wallet (`/profile`)

A secure module for managing the passenger's pre-paid transit funds.

### 🧩 Component: `MetroWallet.tsx`
- **Visuals**: High-contrast balance display with localized currency formatting (`vi-VN`).
- **Refill Logic**:
    - Interactive "Refill" amount selection.
    - Payment confirmation via a simulated secure port.
    - Atomic balance updates on the `UserService` mock.

### 🔄 State Persistence
- **Zustand Sync**: The balance is persisted in the client store and synced across all dashboard modules.
- **Transactional integrity**: Mock verification step ensures the user confirms before balance commits.

---

## 🚀 Future Roadmap & Scaling

- **NFC Integration**: Emulating the `TicketCard` for device-level Near Field Communication.
- **Transit Telemetry**: Adding "Current Trip" live-tracking to the Dashboard header.
- **Family Sharing**: Modularizing the Ticket Vault to support parent-child asset sharing.
