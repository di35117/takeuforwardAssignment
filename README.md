# 📅 Dynamic React Wall Calendar

A beautiful, highly interactive, and responsive wall calendar built with React. It features a dynamic theme system, native drag-and-drop, multi-date bulk editing, real-time weather forecasting, and persistent local storage.

## ✨ Features

* **Responsive Layout Architecture:** * **Laptops/Desktops (>1024px):** Uses a sophisticated side-by-side split layout.
  * **Tablets & Mobile (<1024px):** Gracefully degrades to a stacked, scrollable layout while maintaining large, touch-friendly touch targets.
* **Dynamic Radial Theming:** Automatically extracts the dominant HEX color from the current month's hero image and applies it to the app's radial background gradient and accent elements.
* **Advanced Bulk Editing:** Click-and-drag across multiple dates (or Ctrl+Click for scattered dates) to apply events, reminders, or notes to multiple days at once.
* **Native Drag-and-Drop Sticky Notes:** Drag a yellow sticky note directly onto any date to instantly attach a thought or task.
* **Smart Weather Bar:** Integrates with the free Open-Meteo API to fetch 7-day forecasts based on geolocation, complete with custom fixed-position hover tooltips.
* **Zero-Library Visuals:** Features custom-built HTML5 Canvas functions for both the celebration Confetti and the image color-extraction, keeping the bundle size incredibly small.

---

## 🧠 Design & Architectural Choices

1. **Inline & Injected CSS:** Instead of relying on heavy CSS frameworks (like Tailwind or Bootstrap) or external stylesheets, this component encapsulates its own styles. It dynamically injects a `<style>` tag for complex animations (`@keyframes`) and media queries. This makes the component highly portable—you can drop it into any React project and it will immediately look perfect.
2. **Elimination of Third-Party Dependencies:** * **Date Logic:** Instead of using `date-fns` or `moment.js`, all date math (finding the first day of the month, calculating grid offsets) is handled via native JavaScript `Date` objects.
   * **Color Extraction:** Instead of using libraries like `colorthief`, we use a hidden HTML5 `<canvas>` to draw the image and calculate the average RGB values.
   * **Confetti:** Built a lightweight 2D physics particle engine using `requestAnimationFrame` on a canvas overlay, rather than importing heavy animation libraries.
3. **Local Storage First:** The app requires no backend. Everything (including the current Light/Dark theme preference, events, notes, and custom image URLs) is safely stringified and stored in the browser's `localStorage` (`wcal4`).

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Setup a new React Project (if you haven't already)
The easiest way to run this is using [Vite](https://vitejs.dev/):
```bash
npm create vite@latest wall-calendar -- --template react
cd wall-calendar