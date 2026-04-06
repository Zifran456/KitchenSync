<h1 align="center">
    <img src="https://readme-typing-svg.herokuapp.com/?font=Righteous&color=b6d7a8&random=falsesize=35&center=true&vCenter=true&width=500&height=70&duration=2000&lines=Hi+There!+👋;+We+Are+Group+I+👥;Welcome+To+The+KitchenSync🧑‍🍳;" />
</h1>

# Group I - KitchenSync

This repository contains all documents and source code for the ENSE 281 Group Project by Group I.

## Project Introduction & Background 📝

This web application aims to reduce household food waste and aid in decision making by creating a system that provides its users with various recipes and the tools to track food inventory whilst alerting them to food expiration dates and periods.

## Business Opportunity 📍

The project will allow users to keep track of their food inventory and give user access to a variety of recipes based off said inventory, hence, assisting the users decision making on what to eat. Users will be able to adequately plan meals and maintain awareness of the quality of food in their inventory whilst also cutting food wastage and cost, eating better and healthier.

## Minimum Viable Product (MVP) 💻

This web application will allow for:
* Users to input grocery items
* Users to browse, filter and save recipes
* Notifications to users on when their items will expire

## Intended Impact 🕖

The current reality of food waste and disorganization becomes a new reality where food usage is intentional, efficient, and cost-effective.

We envision a simple system where:
  - Food is clearly tracked by storage location
  - Expiry dates are visible and actionable
  - Waste is minimized
  - Meal planning is partially automated based on what is already available
  - Unnecessary grocery spending is reduced

## Target Customers 🎯

Our main audience includes:
  - Home cooks and budget-conscious individuals
  - Families managing large or shared food inventories
  - Students or roommates sharing fridge and pantry space

## Team 🤝

- Zifran Chowdhury
- Deran Cross
- Ikechukwu Ogowuihe
- Emmanuel Dairo

## Project Status 🟢

MVP complete. Backend integrated with Express, MongoDB, and EJS views.

---

## How to Run

> **Requires:** Node.js and a MongoDB instance (local or Atlas).

```bash
# Move into the app folder first
cd app

# Install dependencies (first time only)
npm install

# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Open `http://localhost:3000` in your browser.

### Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/kitchensync
SESSION_SECRET=kitchensync-super-secret-key-change-in-production
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Templating | EJS |
| Database | MongoDB + Mongoose |
| Auth | express-session |
| Frontend CSS | Bootstrap 5.3.3 + custom style.css |
| Frontend JS | Vanilla JavaScript |
| Icons | Bootstrap Icons 1.11.3 |

---

## File Structure

```
kitchensync/
├── server.js                 <-- Express entry point
├── package.json
├── .env                      <-- Environment variables (not committed)
│
├── models/
│   ├── User.js               <-- Mongoose User model (username, email, hashed password)
│   ├── Item.js               <-- Mongoose Item model (name, qty, storage, expiryDate, userId)
│   └── Storage.js            <-- Mongoose Storage model (name, userId) — custom storages only
│
├── routes/
│   ├── auth.js               <-- POST /auth/login, POST /auth/register, GET /auth/logout
│   ├── items.js              <-- POST /items, GET /items/:id/edit, PUT /items/:id, DELETE /items/:id
│   ├── storages.js           <-- POST /storages, DELETE /storages/:id
│   └── pages.js              <-- GET routes for all pages (dashboard, storage pages, add/edit forms)
│
├── middleware/
│   └── requireAuth.js        <-- Session guard — redirects to /login if unauthenticated
│
├── views/                    <-- EJS templates (one per page)
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   ├── add-item.ejs
│   ├── edit-item.ejs         <-- Pre-filled edit form for existing items
│   ├── storage.ejs           <-- Generic page for custom (user-created) storages
│   ├── fridge.ejs
│   ├── freezer.ejs
│   ├── pantry.ejs
│   ├── recipes.ejs
│   └── liked-recipes.ejs
│
├── public/                   <-- Static assets served by Express
│   ├── css/style.css
│   └── js/app.js
│
└── css/ & js/                <-- Legacy static HTML assets (kept for reference)
```

---

## Page Flow

```
/ (Welcome)
  └──> /login
         ├──> /register ──> /login
         └──> /dashboard
                │
                ├──> /add-item?storage=X&back=Y ──POST /items──> Y (or /dashboard)
                │
                ├──> /fridge
                │      ├──> /add-item?storage=Fridge&back=/fridge ──> /fridge
                │      └──> /items/:id/edit ──PUT /items/:id──> /fridge
                │
                ├──> /freezer  (same pattern as /fridge)
                ├──> /pantry   (same pattern as /fridge)
                │
                ├──> /storage/:id  (custom storage — same pattern as built-in pages)
                │      └──> DELETE /storages/:id ──> /dashboard
                │
                ├──> /recipes
                └──> /liked-recipes
```

---

## Features

### Working
- User registration and login
- Session-based authentication — all routes protected
- Add, edit, and delete food items with name, quantity, storage, and expiry date
- Dashboard overview stats (Total Items, Expired, Expiring Soon, Low Stock)
- Filter tabs (All / Expired / Expiring Soon / Low Stock)
- Built-in storage pages (Fridge, Freezer, Pantry) with expiry colour coding
- Custom storages — create and name your own storage locations
- Item status calculated server-side based on expiry date:
  - **Expired** — past expiry date (red left border)
  - **Expiring Soon** — within 7 days (orange left border)
  - **Good** — more than 7 days out (green left border)
- Low Stock — items with quantity ≤ 2
- Back navigation is context-aware
- Search filtering on all storage pages
- Responsive layout (mobile, tablet, desktop)

### UI Only (not yet wired to backend)
- Recipe pages — static content, no database connection
- Liked recipes — no save/unsave functionality
