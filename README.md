# Little Lemon — Restaurant Web App

A responsive React web application for **Little Lemon**, a family-owned Mediterranean restaurant in Chicago. Built as the capstone project for the Meta Front-End Developer Professional Certificate.

---

## Features

- **Home page** — Hero section, weekly specials with dish cards, testimonials carousel, about section
- **Online Menu** — Filterable menu with categories, dish detail modal, add-to-cart
- **Shopping Cart** — Slide-in drawer, quantity controls, live subtotal
- **Checkout** — Delivery / Pickup toggle, address form, mock payment with live card preview, autofill for logged-in users
- **Table Reservations** — Multi-step booking form with real-time API availability, summary step, confirmation page
- **Mock Authentication** — Login modal, AuthContext, user avatar dropdown (desktop), slide-in drawer profile card (mobile)
- **User Profile Dashboard** — Editable profile form, saved address, payment method card, reservation history, order history
- **Fully responsive** — Mobile (≤767px), Tablet (768–1023px), Desktop (≥1024px)
- **Accessible** — ARIA labels, roles, live regions, keyboard navigation (Escape closes modals/drawer)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Library | React 18 (Create React App) |
| Styling | Standard CSS with custom properties |
| State Management | React Context API + useReducer / useState |
| Testing | Jest + React Testing Library |
| Fonts | Markazi Text, Karla (Google Fonts) |
| Icons | Inline SVG |

---

## Getting Started

### Prerequisites

- Node.js ≥ 16
- npm ≥ 8

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/munory/little-lemon.git
cd little-lemon

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

---

## Running Tests

```bash
npm test
```

Runs all 53 unit tests in watch mode. To run once without watching:

```bash
npm test -- --watchAll=false
```

### Test coverage includes

- `BookingForm` — rendering, HTML5 validation attributes, guests counter, Continue button logic
- `BookingSummary` — displays correct reservation data
- `BookingConfirmed` — renders confirmation details
- `CartDrawer` — renders items, quantity controls, empty state
- `CheckoutPage` — form validation, order total calculations
- `CartContext` — add, remove, update quantity, clear cart
- `bookingUtils` — `submitReservation` returns true on valid data
- `App` — renders home page heading

---

## Project Structure

```
src/
├── assets/          # Images and logo
├── components/      # React components
│   ├── Header.js         # Fixed header, slide-in mobile drawer, desktop nav
│   ├── Main.js           # Home page (hero, specials, testimonials, about)
│   ├── MenuPage.js       # Full menu with filters and dish modals
│   ├── CartDrawer.js     # Shopping cart slide-in drawer
│   ├── ReservationFlow.js # Multi-step booking flow
│   ├── BookingForm.js    # Step 1 — date/time/guests picker
│   ├── BookingSummary.js # Step 2 — review and confirm
│   ├── BookingConfirmed.js # Confirmation page
│   ├── CheckoutPage.js   # Full checkout with payment
│   ├── CheckoutSuccess.js # Order success screen
│   ├── ProfilePage.js    # User account dashboard
│   ├── LoginModal.js     # Mock authentication modal
│   └── ...
├── context/
│   ├── AuthContext.js    # Authentication state (login / logout / user)
│   └── CartContext.js    # Cart state (items / subtotal / drawer)
├── data/
│   └── menuData.js       # Menu items with categories, prices, images
└── utils/
    └── bookingUtils.js   # submitReservation API helper
```

---

## Booking Form — Validation Rules

| Field | Rule |
|---|---|
| Date | Required; minimum = today |
| Time | Required; options fetched from `fetchAPI(date)` |
| Guests | Integer 1–20 |
| Seating | Indoors / Outdoors (radio) |
| Occasion | Optional dropdown |
| Special Requests | Optional, max 500 characters |

The **Continue** button is disabled until date and time are both selected.

---

## Authentication (Mock)

Login accepts any email + password — no real backend. On login, the app uses a hardcoded Mario Rossi profile with mock address and payment data. Logged-in users get:

- Avatar initials button in the desktop header with a dropdown menu
- Profile card in the mobile drawer
- Autofill prompt on the Checkout page (applies name, email, phone, address, card details with one click)

---

## Git History

```
2309a70  Add auth, user profile, mobile drawer, and checkout UX improvements
853137d  Add menu page, shopping cart, and checkout flow
9ba82e6  Improve accessibility and form validation
ba6c7c3  Add API integration and unit tests
bf4c043  Initial architecture and styling
c1705f9  Add semantic structure and metadata
8d34438  Initialize project using Create React App
```
