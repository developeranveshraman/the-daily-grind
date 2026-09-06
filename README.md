# The Daily Grind

A client-side café ordering prototype built around the Counter Journal design system: warm paper, espresso typography, caramel accents, and clear service-ticket interactions.

The Daily Grind demonstrates how a small café can give customers a polished digital ordering experience without requiring a backend during the prototype stage. It combines a public café site, personalized ordering, locally saved regulars, a prototype checkout, an offline FAQ assistant, and a browser-local sales dashboard.

This README explains both what each option does and how the option works behind the interface.

## 1. Product purpose

The product has two connected purposes. First, it helps a customer discover the café, choose a menu item, personalize it, and prepare an order. Second, it demonstrates how the café team could review order activity through a simple service dashboard.

The current implementation is intentionally frontend-only. The browser is the source of truth for cart state, saved favorites, and prototype live-order events. This makes the project easy to run and deploy as a static Vite application, but it also means that data is not shared between browsers or devices.

> **Important boundary:** This is a working prototype, not a production payment or fulfillment system. It does not process real payments, authenticate staff, or synchronize orders across customers and devices.

## 2. Navigation and page purposes

The top navigation keeps the main customer and staff entry points visible on every route.

| Option | Purpose | What happens when it is used |
|---|---|---|
| Home | Introduces the café and directs attention toward ordering. | Shows the brand story, café atmosphere, hours, address, phone number, and the primary menu call to action. |
| Menu | Lets customers browse all products. | Displays categorized menu items with prices, descriptions, dietary notes, imagery, favorite controls, and the option to personalize eligible drinks. |
| About | Explains the café's story and hospitality point of view. | Provides context about the neighborhood cup, small-batch approach, and the Counter Journal voice. |
| Contact | Makes the café easy to reach. | Shows location, opening hours, phone contact, and practical visit information. |
| Dashboard | Shows service and sales insight. | Combines sample sales, imported CSV rows, and the current browser's completed prototype orders into charts, metrics, and raw-data views. |
| Cart button | Opens the current order. | Opens the cart drawer so the customer can inspect, edit, remove, or send the order to checkout. |
| Ask a question | Opens the offline assistant. | Opens the floating chatbot without leaving the current page. |

## 3. Menu options and ordering behavior

### 3.1 Menu categories

The shared menu data is stored in one source so the menu page, home page highlights, chatbot, cart, and analytics can use the same product names and prices. The expanded catalog includes coffee, tea, pastries, breakfast items, and sandwiches.

Each item has a category, display name, description, base price, image reference, and optional metadata such as dietary or allergen information. A product card is responsible for presenting the item; the shared data model remains responsible for what the item is.

### 3.2 Add to order

Selecting **Add to order** starts the item flow. For non-customizable items, the item can enter the cart directly. For customizable drinks, the action opens the drink personalization dialog first. This prevents a customer from accidentally adding an incomplete drink ticket.

### 3.3 Milk type

The Milk selector controls the dairy or plant-based base used for a coffee or tea drink. The configured choices are:

| Choice | Purpose |
|---|---|
| Whole | Standard dairy option with a fuller body. |
| Oat | Plant-based option with a naturally creamy texture. |
| Almond | Plant-based option with a lighter nutty profile. |
| Soy | Plant-based option with a balanced, familiar café texture. |
| Coconut | Plant-based option with a distinct coconut character. |

The selected value is stored on the cart line, displayed in the cart drawer, and included in the final confirmation ticket. If a menu item does not support personalization, the milk selector is not shown.

### 3.4 Sugar level

The Sugar level selector communicates sweetness preference to the preparation step. The configured levels are:

| Choice | Purpose |
|---|---|
| None | No added sugar. |
| Light | Reduced sweetness. |
| Regular | The café's standard sweetness level. |
| Extra | Increased sweetness. |

Sugar level changes the order description but does not add a price surcharge. It is kept with the item so the customer can verify the choice before confirmation.

### 3.5 Extra espresso shots

The Extra espresso shots selector adds intensity and volume to eligible coffee items. The customer can choose 0, 1, 2, or 3 extra shots. Every extra shot has a configured surcharge, which is added to the line price before the cart total is calculated.

The cart does not treat a customized drink as a separate product. Instead, it stores the base menu item plus a customization object. This makes the price calculation and display predictable:

```
line price = base item price + (extra shot count × extra shot price)
```

### 3.6 Save as regular

The Save as regular control stores the current drink configuration as a favorite. A favorite includes the menu item identity and the selected milk, sugar, and extra-shot values, so reordering restores the same preparation instructions.

Favorites use browser `localStorage`. They are intentionally local and account-free. Clearing browser storage, changing browsers, or using another device will not carry the favorites across.

## 4. Cart drawer options

The cart drawer is the customer's order ticket before checkout.

| Option | Purpose | Behavior |
|---|---|---|
| Quantity plus | Adds another copy of the same configured line. | Increases the quantity while preserving the item's selected customization. |
| Quantity minus | Reduces the line quantity. | Decreases the quantity and removes the line when it reaches zero. |
| Remove | Deletes one configured line. | Removes the line from the client-side cart immediately. |
| Customization summary | Makes preparation details visible. | Shows milk, sugar, and extra shots beneath the item name when present. |
| Favorite reorder | Quickly adds a saved regular. | Creates a new cart line from the stored favorite configuration. |
| Proceed to checkout | Starts fulfillment and confirmation. | Moves the current cart into the checkout route; an empty cart stays in its empty state. |

Cart state is managed by `CartContext`. This keeps menu cards, the drawer, checkout, and favorite reorder actions aligned without passing the entire order through unrelated page components.

## 5. Checkout options

Checkout is a prototype handoff sequence. It calculates totals and displays what would be sent to an ordering backend, but it intentionally does not charge a card.

### 5.1 Pickup or delivery

The fulfillment selector gives the customer two choices:

| Option | Purpose |
|---|---|
| Pickup | Represents collecting the order at the café. The interface communicates a short preparation window. |
| Delivery | Represents sending the order to the customer. The form requests delivery contact details and address information. |

The selected fulfillment type is included in the final review modal and in the prototype order record.

### 5.2 Contact and delivery fields

The checkout form collects the information needed to describe the handoff: customer name, email, phone, and — when delivery is selected — an address. Required fields are validated before the final review can open. The prototype does not send these values to a server.

### 5.3 Tip selection

The Tip selector offers four explicit choices:

| Choice | Calculation | Purpose |
|---|---|---|
| No tip | 0% | Lets the customer opt out. |
| 10% | Subtotal × 0.10 | Small thank-you amount. |
| 15% | Subtotal × 0.15 | Middle option shown as the default visual emphasis. |
| 20% | Subtotal × 0.20 | Larger thank-you amount. |

The tip is calculated from the order subtotal. It is displayed separately from tax and fulfillment fees so the customer can understand the total.

```
subtotal = sum of configured line prices × quantities
pre-tip total = subtotal + tax + applicable fulfillment fee
tip = subtotal × selected tip rate
total = pre-tip total + tip
```

### 5.4 Final confirmation modal

Selecting **Review order** (or the equivalent checkout action) opens the final order summary modal instead of immediately placing the prototype order. The modal exists to create a final consent checkpoint.

It shows the configured item names, quantities, customization details, subtotal, tax, fulfillment fee, selected tip, and total. **Confirm and place prototype order** then performs three client-side actions:

1. Creates a completed local order event for the dashboard.
2. Shows the confirmation state with the prototype disclaimer.
3. Clears the cart so the next order starts cleanly.

No payment provider is called. No real order is sent to a café.

## 6. Favorites and returning customers

Favorites are designed for repeat behavior rather than account management. The customer saves a configured drink once, then uses the Favorites area in the cart drawer to add that regular back to the current order.

The storage flow is:

```
DrinkCustomizer → favorite record → localStorage → CartDrawer → CartContext
```

The favorite record contains a stable menu item identifier and the selected order options. If the menu item is no longer available, the interface should eventually flag the favorite instead of silently adding an invalid product; this is a recommended production enhancement.

## 7. Offline chatbot options

The floating chatbot is a deterministic FAQ engine. It does not call an LLM, external API, or network endpoint. It classifies the user's text using practical keyword and fuzzy-item matching, then returns a prepared response.

| Question area | What the assistant explains |
|---|---|
| Menu | Item names, categories, descriptions, and prices from shared café data. |
| Customization | Milk choices, sugar levels, extra shots, and when the drink ticket appears. |
| Favorites | How to save a regular and reorder it from the cart drawer. |
| Checkout | Pickup, delivery, the confirmation step, and prototype limitations. |
| Tips | The available 0%, 10%, 15%, and 20% choices and how they affect the total. |
| Hours and location | The café's configured schedule, address, and phone information. |
| Allergens | Available metadata and a cautious reminder that the prototype cannot guarantee an allergen-free preparation environment. |
| Unknown or unsafe questions | A fallback that avoids inventing answers for severe allergy, discount, address-specific, or unsupported requests. |

Fuse.js-style fuzzy matching helps with common spelling variations, such as a misspelled coffee name. The TestConsole page makes the assistant's answers reviewable through repeatable example prompts and exported transcript behavior.

## 8. Dashboard options

The dashboard is a review tool for the café team, not a shared point-of-sale system.

### 8.1 Data sources

The dashboard can combine three sources:

| Source | Purpose | Persistence |
|---|---|---|
| Sample sales data | Provides deterministic rows for demonstration and chart layout. | Bundled with the frontend. |
| CSV import | Lets a user inspect a compatible external export. | Parsed in the browser; not uploaded. |
| Completed local orders | Shows prototype orders confirmed in the current browser. | Stored in browser-local storage and broadcast with a browser event. |

### 8.2 Live update behavior

When checkout confirms an order, `liveOrders` writes a normalized event to local storage and dispatches a browser event. The dashboard listens for that event, reloads the local rows, recomputes its metrics, and redraws the charts without a page refresh.

This is real-time only within the same browser profile. A second browser, phone, or staff laptop will not receive the event because there is no shared transport or database.

### 8.3 Filters and views

The dashboard is designed to narrow and explain the sales rows rather than hide them.

| Control or view | Purpose |
|---|---|
| Date filter | Limits metrics and charts to the selected time period. |
| Category filter | Focuses the analysis on coffee, tea, pastries, breakfast, or sandwiches. |
| CSV import | Parses a local comma-separated sales file for review without sending it to a server. |
| Metric cards | Summarize revenue, order-line volume, average order value, and product performance. |
| Revenue leader chart | Compares the strongest menu items by revenue. |
| Hourly cadence chart | Shows when sales activity is concentrated during the day. |
| Weekday/weekend insight | Helps compare routine weekday demand with weekend behavior. |
| Raw-data table | Lets the user spot-check the rows behind the visual summaries. |
| Live status indicator | Communicates whether the browser-local order stream is active. |

The dashboard should be treated as a demonstration of the analytics workflow. For operational use, sales rows need server-side validation, immutable order IDs, authenticated staff access, and a shared database.

## 9. Data flow

The application's main data path is intentionally simple:

```
Shared menu data
  ↓
MenuCard / DrinkCustomizer
  ↓
CartContext
  ↓
Checkout totals + confirmation modal
  ↓
Browser-local live order event
  ↓
Dashboard filters, metrics, charts, and raw rows
```

A second path supports customer assistance:

```
User question
  ↓
ChatWidget
  ↓
Rule-based intent matching + shared café data
  ↓
Prepared FAQ response
```

No path requires an external API in the current prototype.

## 10. Technical architecture

| Layer | Implementation | Why it exists |
|---|---|---|
| React | Page and component composition. | Makes customer, checkout, dashboard, and chatbot surfaces reusable. |
| TypeScript | Shared types for menu items, cart lines, options, and analytics rows. | Catches mismatched data shapes during development. |
| Vite | Development server and production bundler. | Produces a fast static frontend build. |
| Wouter | Client-side route switching. | Keeps `/menu`, `/checkout`, `/dashboard`, and other routes lightweight. |
| CartContext | Central cart state. | Prevents separate pages from maintaining conflicting order totals. |
| localStorage | Favorites and local live-order persistence. | Keeps the prototype useful across reloads in the same browser. |
| Browser events | Immediate same-browser dashboard refresh. | Avoids polling or an API for the prototype live feed. |
| Fuse.js | Fuzzy item lookup. | Makes the FAQ assistant tolerant of common spelling mistakes. |
| Papa Parse | Client-side CSV parsing. | Lets the dashboard review local data without uploading the file. |
| Recharts | Dashboard charts. | Turns filtered rows into readable revenue and cadence visuals. |
| Vitest | Lightweight automated tests. | Verifies chatbot behavior and deterministic café sample flows. |

## 11. Important source files

```
client/src/data/cafeData.ts               Shared menu, café, and image records
client/src/data/analytics.ts              Deterministic sample sales data
client/src/lib/orderOptions.ts            Milk, sugar, shot, and price rules
client/src/lib/liveOrders.ts              Browser-local completed-order stream
client/src/contexts/CartContext.tsx       Cart state, totals, and favorites
client/src/components/MenuCard.tsx        Menu item presentation and entry point
client/src/components/DrinkCustomizer.tsx Personalization dialog
client/src/components/CartDrawer.tsx      Cart editing and favorite reorder UI
client/src/pages/Checkout.tsx             Fulfillment, tip, confirmation, and handoff
```

> Note: source documentation was truncated beyond this point (file listing incomplete). Add any remaining source files here if you have the fuller listing.
