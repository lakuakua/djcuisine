# Product Requirements Document (PRD)

## Project Title
DJCUISINE Ecommerce Ordering Platform

## Prepared By
Senior Developer (for Junior Developer implementation)

## Objective
Build a simple, scalable ecommerce web application for **DJCUISINE** that allows customers to browse catering-style food items, select portions (tray sizes / plates), add beverages, and place orders. The system must be structured for future expansion (online payments, shipping, admin dashboard).

This PRD will be used directly in **Cursor** to guide implementation.

---

## Target Users
- End customers ordering food (mobile-first)
- DJCUISINE admin (menu & price updates)

---

## Core Features (MVP)

### 1. Product Catalog
- Categorized menu display
- Each product supports **variants** (Big Tray, Half Tray, Plate, etc.)
- Clear pricing per variant
- Out-of-stock toggle (future-ready)

### 2. Cart
- Add/remove items
- Quantity selector
- Variant-based pricing
- Cart subtotal

### 3. Checkout (Phase 1 – Manual)
- Customer details form:
  - Name
  - Phone
  - Email (optional)
  - Pickup/Delivery notes
- Order summary
- Submit order (no payment gateway in MVP)

### 4. Admin (Basic – JSON/Config driven)
- Menu data stored in structured JSON or database table
- Easy price updates without code rewrite

---

## Menu Structure & Data Model

### Category 1: Chicken

**Chicken Leg & Thighs**
- Big Tray – $160
- Half Tray – $80
- Plate – $25

**Chicken Wings**
- Big Tray – $185
- Half Tray – $93
- Plate – $25

---

### Category 2: Turkey

**Turkey Wings**
- Big Tray – $250
- Half Tray – $125

**Turkey Legs**
- Big Tray – $220
- Half Tray – $110

---

### Category 3: Beef

**Beef Ribs**
- Big Tray – $250
- Half Tray – $125
- Plate – $25

**Beef Steak Tips**
- Big Tray – $300
- Half Tray – $150
- Plate – $25

**Beef Kabob / Brochettes**
- Big Tray – $300
- Half Tray – $150

---

### Category 4: Lamb

**Lamb**
- Big Tray – $350
- Half Tray – $175
- Plate – $30

---

### Category 5: Seafood

**Shrimp**
- Big Tray – $300
- Half Tray – $150
- 5 Sticks – $20

---

### Category 6: Whole Poultry 

- Whole Smoked Rooster – $35
- Whole Smoked Guinea Fowl – $45
- Whole Smoked Hen – $35
- Whole Smoked Rabbit – $70
- Whole Grilled Rooster – $35
- Grilled Guinea Fowl – $45

---

### Category 7: Sausage

- Deer Meat Sausage (Grilled, 5 pieces) – $20

---

### Category 8: Juices (DJCUISINE JUICES)

#### Zobo
- Gallon – $35
- Half Gallon – $18
- 16 Ounce – $6

#### Pineapple Ginger
- Gallon – $35
- Half Gallon – $18
- 16 Ounce – $6

---

### Category 9: Fresh Juice (Gallon Only)

- Watermelon, Ginger & Pineapple – $40
- Mango – $45
- Orange – $40
- Watermelon – $40
- Mango Mandarin & Pineapple – $40
- Ginger, Lemon, Orange & Pineapple – $40
- Carrot, Apple, Orange & Ginger – $40

---

## Data Model (Recommended)

```json
{
  "id": "beef-ribs",
  "name": "Beef Ribs",
  "category": "Beef",
  "variants": [
    { "label": "Big Tray", "price": 250 },
    { "label": "Half Tray", "price": 125 },
    { "label": "Plate", "price": 25 }
  ]
}
```

---

## UI / UX Requirements
- Mobile-first design
- Clear category separation
- Variant selector as dropdown or radio buttons
- Sticky cart icon (mobile)
- WhatsApp-style order confirmation (future enhancement)

---

## Non-Functional Requirements
- Clean, readable code
- Component-based architecture
- Config-driven menu
- Easy migration to Stripe / PayPal later

---

## Tech Stack (Suggested)
- Frontend: Next.js / React
- Styling: Tailwind CSS
- State: Context / Zustand
- Backend (Phase 2): Node.js API
- Storage: JSON → DB later

---

## Out of Scope (For MVP)
- Online payment processing
- User accounts
- Shipping rate calculation
- Inventory automation

---

## Success Criteria
- Customer can place an order in under 2 minutes
- Menu updates require no UI code changes
- Junior dev can extend categories easily

---

## Notes to Junior Developer
- Treat **tray sizes as variants**, not separate products
- Avoid hardcoding prices in UI
- Expect future EasyShip / Stripe integration
- Keep menu extensible

---

End of PRD

