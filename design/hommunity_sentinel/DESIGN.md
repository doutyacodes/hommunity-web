# Design System Strategy: Architectural Authority

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Architectural Ledger."** 

This system is not a generic dashboard; it is a high-security environment designed to convey structural integrity and digital permanence. By leveraging a deep charcoal palette and high-contrast editorial typography, we move away from the "SaaS-template" look toward an experience that feels like a physical architectural console. 

We break the standard grid through **Intentional Asymmetry**. Key metrics and primary actions are given disproportionate breathing room, while secondary data is nested within sophisticated, layered surfaces. The result is a layout that feels curated, secure, and authoritative—perfectly aligned with the high-stakes nature of community security and management.

---

## 2. Colors: Tonal Depth vs. Structural Lines

### The "No-Line" Rule
To achieve a premium, high-tech aesthetic, **1px solid borders are strictly prohibited** for sectioning. Structural boundaries must be defined through background color shifts or tonal transitions.
*   **Contextual separation:** Use `surface-container-low` against a `background` base to define regions.
*   **Nesting:** Place `surface-container-highest` elements within `surface-container` modules to create focus without clutter.

### Color Palette (Material Token Mapping)
*   **Primary (Action):** `primary` (#a4c9ff) – Used for high-contrast primary actions and brand presence.
*   **Secondary (Success/Safety):** `secondary` (#40e56c) – Reserved for "Verified" statuses and secure entry points.
*   **Surface Base:** `surface` (#131313) – The foundation of the "deep charcoal" experience.
*   **Accents:** `primary-container` (#4d93e5) and `secondary-container` (#02c953) for status chips and low-priority indicators.

### The "Glass & Gradient" Rule
Floating elements (modals, dropdowns, hovered cards) must utilize **Glassmorphism**. 
*   **Implementation:** Use a semi-transparent `surface-variant` with a 20px-40px backdrop-blur. 
*   **Signature Gradients:** Main CTAs should use a subtle linear gradient from `primary` to `primary-container` at a 135-degree angle to provide a "lit from within" high-tech glow.

---

## 3. Typography: Editorial Authority
The typography system uses a dual-font approach to balance technical precision with architectural elegance.

*   **Display & Headlines (Manrope):** Chosen for its geometric, modern structure. Use `display-lg` and `headline-md` with tight letter-spacing (-0.02em) to create an authoritative, editorial header style.
*   **Body & Labels (Inter):** The workhorse for high-tech data. Inter’s tall x-height ensures readability at small scales (`label-sm`) in dense security logs.
*   **Visual Hierarchy:** Primary actions must use `title-md` in `on-primary` for maximum contrast, while metadata should use `label-md` in `on-surface-variant` to recede into the background.

---

## 4. Elevation & Depth: Tonal Layering
Depth in this system is achieved through light and color, not heavy shadows or lines.

*   **The Layering Principle:** 
    *   **Level 0:** `surface-container-lowest` (The deepest background).
    *   **Level 1:** `surface-container-low` (General layout sections).
    *   **Level 2:** `surface-container-high` (Individual cards and data modules).
*   **Ambient Shadows:** For floating elements, use a "Wide Glow" shadow: `0px 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should never feel "black"; it should feel like an absence of light beneath a frosted pane.
*   **The "Ghost Border":** If accessibility requires a stroke (e.g., input focus), use `outline-variant` at 20% opacity. Forbid 100% opaque borders.

---

## 5. Components

### Buttons & Chips
*   **Primary Button:** Gradient fill (`primary` to `primary-container`), `round-md` (12px), with a subtle outer glow on hover.
*   **Status Chips:** Use `secondary-container` with a high-contrast `on-secondary` dot to indicate "Live" or "Verified" states.

### Input Fields
*   **Styling:** `surface-container-highest` background, no border, `round-sm` (8px). 
*   **States:** On focus, the background shifts slightly lighter, and a 1px "Ghost Border" of `primary` appears at 40% opacity.

### Cards & Data Lists
*   **Strict Rule:** No divider lines. Separate list items using 12px-16px of vertical whitespace or alternating `surface-container` tints.
*   **Architecture:** Cards should feel like "Architectural Plats." Use `title-sm` for headers and `body-sm` for descriptions. High-priority data (e.g., Unit Numbers) should be bold and high-contrast.

### New Component: The "Security Pulse"
*   A custom status indicator for the dashboard that uses a `secondary` green dot with a radial pulse animation, signifying real-time system uptime and active encryption.

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme whitespace to separate functional groups.
*   **Do** use "surface-nesting" to show hierarchy (Highest surface = Highest priority).
*   **Do** apply `backdrop-blur` to any element that sits "above" the main layout.
*   **Do** use `on-surface-variant` for non-essential metadata to maintain a clean visual path for the user's eye.

### Don't
*   **Don't** use 1px solid lines for any reason other than "Ghost Borders" at low opacity.
*   **Don't** use pure white (#FFFFFF) for text; use `on-surface` (#e5e2e1) to reduce eye strain in dark mode.
*   **Don't** use standard "drop shadows" with 0 blur. Shadows must be ambient and diffused.
*   **Don't** use sharp 0px corners. Every element must adhere to the 8px-12px `roundness-scale` to feel modern and intentional.