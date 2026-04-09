<h1 align="center">
    <img src="https://readme-typing-svg.herokuapp.com/?font=Righteous&color=b6d7a8&random=falsesize=35&center=true&vCenter=true&width=500&height=70&duration=2000&lines=Hi+There!+👋;+We+Are+Group+I+👥;Welcome+To+The+KitchenSync🧑‍🍳;" />
</h1>

# Group I - KitchenSync

Welcome to the repository for the ENSE 281 Group Project done by Group I.

## Project Introduction & Background 📝

This web application aims to reduce household food waste and aid in decision making by creating a system that provides its users with various recipes and the tools to track food inventory whilst simultaneously allowing them to track food expiration dates.

## Business Opportunity 📍

The project will allow users to keep track of their food inventory and give user access to a variety of recipes based off said inventory and items nearing expiration, hence, assisting the users decision making on what to eat. Users will be able to adequately plan meals and maintain awareness of the quality of food in their inventory whilst also cutting food wastage and cost, eating better and healthier.

## Minimum Viable Product (MVP) 💻

This web application will allow for:
* Users to input any food items into any designated storages
* Users to optionnally input and track expiry dates on their food items
* Users to receive in-app notifications on their items that are expiring soon and items that have expired
* Users to receive recipe suggestions based on food items stored and/or items nearing expiry date
* Users to browse and save recipes

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

MVP complete. Backend integrated with Express, MongoDB, and EJS views. Recipe and ingredient data powered by the MealDB API. Deployed on Render.

---

## Try the App 🚀

### Live Demo (Render)

The app is deployed and publicly accessible at:

**[https://group-i.onrender.com](https://group-i.onrender.com)**

> The free Render tier spins down after inactivity — the first load may take up to 60 seconds. Click **Try Demo** on the login page for instant access.

---

### Run Locally

**Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running

**Steps**

1. Clone the repository:
   ```bash
   git clone https://github.com/Zifran456/Group_I.git
   cd Group_I/app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Make sure MongoDB is running locally:
   ```bash
   # macOS/Linux
   mongod

   # Windows (run in a separate terminal)
   mongod --dbpath "C:\data\db"
   ```

5. Start the app:
   ```bash
   npm start
   ```

6. Open your browser and go to `http://localhost:3000`

> A test account is created automatically on first run — sign in with `test@kitchensync.local` / `test1234`, or register your own account.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Templating | EJS |
| Database | MongoDB Atlas (production) / MongoDB local (development) + Mongoose |
| Auth | express-session + bcryptjs password hashing |
| Recipe & Ingredient Data | MealDB API (free public API) |
| Security | Helmet (HTTP security headers) |
| Frontend CSS | Bootstrap 5.3.3 + custom style.css |
| Frontend JS | Vanilla JavaScript |
| Icons | Bootstrap Icons 1.11.3 |

---

## File Structure

```
app/
├── server.js                 <-- Express entry point; connects to MongoDB, creates demo account
├── package.json
├── .env                      <-- Environment variables (not committed)
├── .env.example              <-- Template for local development setup
│
├── models/
│   ├── User.js               <-- Mongoose User model with bcrypt password hashing
│   ├── Item.js               <-- Item model with status virtual (expired/expiring/good)
│   ├── Storage.js            <-- Custom storage model (name, userId)
│   └── LikedRecipe.js        <-- Liked recipe model (userId + MealDB recipeId string, unique pair)
│
├── routes/
│   ├── auth.js               <-- POST /auth/login, GET /auth/logout, GET /auth/demo, POST /auth/demo/reset
│   ├── items.js              <-- POST /items, GET+PUT /items/:id/edit, DELETE /items/:id
│   ├── storages.js           <-- POST /storages, DELETE /storages/:id
│   ├── pages.js              <-- GET routes for all pages
│   └── recipes.js            <-- POST /recipes/:id/like, DELETE /recipes/:id/like
│
├── utils/
│   └── mealdb.js             <-- MealDB API wrapper: filterByIngredient, lookupMeal, getSuggestedRecipes; 10-min in-memory cache
│
├── middleware/
│   └── requireAuth.js        <-- Session guard — redirects to /login if not authenticated
│
├── views/                    <-- EJS templates
│   ├── index.ejs             <-- Welcome / landing page
│   ├── login.ejs             <-- Login form with "Try Demo" button
│   ├── dashboard.ejs         <-- Stats, filter tabs, notification bell, recipe suggestions, storage grid, demo banner
│   ├── add-item.ejs          <-- Add item form with live ingredient image preview
│   ├── edit-item.ejs         <-- Edit item form with pre-loaded ingredient image preview
│   ├── fridge.ejs
│   ├── freezer.ejs
│   ├── pantry.ejs
│   ├── storage.ejs           <-- Generic page for custom storages
│   ├── recipes.ejs           <-- Recipe suggestions with like button and detail modal
│   └── liked-recipes.ejs     <-- Saved recipes with unlike button
│
└── public/                   <-- Static assets served by Express
    ├── css/style.css
    └── js/app.js
```

---

## Page Flow

```
/ (Welcome)
  └──> /login
         ├──> POST /auth/login ──> /dashboard
         └──> "Try Demo" ──GET /auth/demo──> /dashboard  (Render deployment only)

/dashboard
  ├──> Demo banner (demo accounts only)
  │      └──> POST /auth/demo/reset ──> /dashboard  (wipes + re-seeds demo data)
  │
  ├──> Notification bell (top nav) ──> dropdown panel listing expiring/expired items
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
  │      ├──> Like button ──POST /recipes/:id/like──> (no reload, fetch API)
  │      └──> Recipe detail modal (ingredients + steps)
  │
  └──> /liked-recipes
         ├──> Unlike button ──DELETE /recipes/:id/like──> (no reload)
         └──> Recipe detail modal

GET /auth/logout ──> /
```

---

## Features

### Working
- Login with bcrypt password hashing (stored in MongoDB)
- **Demo mode** — "Try Demo" button on login page for one-click access without registration (Render deployment)
- **Demo data reset** — banner shown to demo users with a reset button that wipes and re-seeds the account back to a clean default state
- Session-based authentication — all routes protected
- Add, edit, and delete food items with name, quantity, storage, and optional expiry date
- **Live ingredient image preview** on Add Item and Edit Item pages — fetches a thumbnail from MealDB as the user types the item name
- Dashboard overview stats (Total Items, Expired, Expiring Soon, Low Stock)
- Filter tabs (All / Expired / Expiring Soon / Low Stock)
- Built-in storage pages (Fridge, Freezer, Pantry) with expiry colour coding
- Custom storages — create and name your own storage locations, delete with all their items
- **Ingredient thumbnail images** on all item cards (Fridge, Freezer, Pantry, custom storages, dashboard) — served from MealDB CDN with graceful fallback icon
- Item status calculated server-side based on expiry date:
  - **Expired** — past expiry date (red left border)
  - **Expiring Soon** — within 7 days (orange left border)
  - **Good** — more than 7 days out, or no expiry date set (green left border)
- Low Stock — items with quantity ≤ 2
- In-app notification bell (top nav) — shows a count badge and dropdown listing:
  - Any items that are expiring soon
  - Any items that have expired
- **Recipe suggestions powered by MealDB API** — queries live meal data based on items currently in storage; scores meals by how many expiring items they use; results cached in memory for 10 minutes to avoid rate limiting
- Top 3 recipe suggestions shown on dashboard
- Full recipe page — browse all suggested recipes with matched ingredient chips
- Recipe detail modal — view full ingredients list and step-by-step instructions
- Like / unlike recipes (live, no page reload)
- Liked recipes page — view and manage all saved recipes
- Back navigation is context-aware — Add Item and Back always return to the page you came from
- Search filtering on all storage and recipe pages
- Responsive layout (mobile, tablet, desktop)
- **Local hosting** — runs with a local MongoDB instance; see `.env.example`
- Sign out

### Considerations for Future MVP

**Functionality:**
- Editing profile / deleting user account
- Push or email notifications for expiring items (currently only visible in-app)
- Barcode scanning to add items quickly
- Manual recipe entry (user-submitted recipes, not just MealDB)
- Meal planning / weekly planner view

**Other:**
- Item image uploads — MealDB thumbnails don't always match the item name
- Sorting and filtering options on storage pages (currently only search)
- Quantity units (e.g. "500g" vs just "2")
